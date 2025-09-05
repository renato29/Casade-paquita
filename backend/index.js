//Sumario de funcoes
// GET api de quartos
// GET api de apenas um quarto pelo ID dele
// POST api cria uma reserva definindo o json
// GET api para filtar por emails das reservas
// GET api para receber apenas uma reserva definida pelo ID.

//*******. ADMIN painel .****
// define o token do admin e valida para ter acesso.
// filtra uma reserva pelas informacoes de busca.
// no painel lista todos os quartos pelo admin.
//****LINHA 142 - Inicio do CRUD no panel*****
// LINHA 150 - POST - Create
// LINHA 164 - PUT - Update
// LINHA 204 - DELETE - D

//Email de Confirmacao da Hostiger 
// linha 28

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./lib/db');
const { z } = require('zod');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit')
const beachEmailTemplate = require('./lib/emailTemplate');

// === EMAIL (Hostinger/Titan) — COLE AQUI, LOGO APÓS OS IMPORTS ===
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,                    // smtp.hostinger.com ou smtp.titan.email
  port: Number(process.env.SMTP_PORT || 587),     // 587 STARTTLS (secure:false) ou 465 SSL (secure:true)
  secure: String(process.env.SMTP_SECURE || 'false') === 'true',
  auth: {
    user: process.env.SMTP_USER,                  // e-mail completo
    pass: process.env.SMTP_PASS
  }
});

// Diagnóstico: confirma conexão/login no start (mostra erro exato no console)
transporter.verify()
  .then(() => console.log('SMTP: ready'))
  .catch(err => console.error('SMTP VERIFY ERROR:', err?.message));

// helper que envia os e-mails (mantenha igual ao seu, só confere o "from")
async function sendBookingEmails({ booking, room }) {
  const from  = process.env.MAIL_FROM  || `"Casa de Paquita" <${process.env.SMTP_USER}>`;
  const owner = process.env.MAIL_OWNER || process.env.SMTP_USER;

  const subjectGuest = `Confirmação de reserva #${booking.id} — ${room.name}`;
  const subjectOwner = `Nova reserva #${booking.id} — ${room.name}`;

  const textBody =
`Olá, ${booking.name}!
Sua reserva foi criada.
Quarto: ${room.name}
Período: ${booking.check_in} → ${booking.check_out}
Hóspedes: ${booking.guests}
Total: S/ ${booking.total_price}`;

 const htmlBody = beachEmailTemplate({ booking, room, brand, siteBase, waPhone, address: "Punta Sal, Peru" });

  // Hóspede
await transporter.sendMail({
  from, to: booking.email, replyTo: owner,
  subject: subjectGuest,
  html: htmlBody
});

// Admin
await transporter.sendMail({
  from, to: owner,
  subject: subjectOwner,
  html: htmlBody
});

}
// === FIM BLOCO EMAIL ===



const app = express();
app.use(cors());
app.use(express.json());
const bookingsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});


// GET /api/rooms
app.get('/api/rooms', (req, res) => {
  const rooms = db.prepare('SELECT * FROM rooms ORDER BY price_per_night ASC').all();
  res.json(rooms);
});
// GET /api/rooms/available?check_in=YYYY-MM-DD&check_out=YYYY-MM-DD&guests=2
app.get('/api/rooms/available', (req, res) => {
  const { z } = require('zod');

  const schema = z.object({
    check_in: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    check_out: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    guests: z.coerce.number().int().positive()
  });

  const parsed = schema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { check_in, check_out, guests } = parsed.data;
  if (check_out <= check_in) return res.status(400).json({ error: 'check_out deve ser depois de check_in' });

  // Livres = capacidade suficiente E sem sobreposição de reservas no intervalo
  // Sobreposição: (b.check_in < check_out) AND (b.check_out > check_in)
  const rows = db.prepare(`
    SELECT r.*
      FROM rooms r
     WHERE r.max_guests >= @guests
       AND NOT EXISTS (
           SELECT 1 FROM bookings b
            WHERE b.room_id = r.id
              AND b.check_in < @check_out
              AND b.check_out > @check_in
       )
     ORDER BY r.price_per_night ASC
  `).all({ guests, check_in, check_out });

  res.json(rows);
});



// GET /api/rooms/:id  → retorna 1 quarto
app.get('/api/rooms/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'id inválido' });

  const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(id);
  if (!room) return res.status(404).json({ error: 'Room not found' });

  res.json(room);
});


// POST /api/bookings
const bookingSchema = z.object({
  room_id: z.number().int().positive(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  check_in: z.string(),   // "YYYY-MM-DD"
  check_out: z.string(),  // "YYYY-MM-DD"
  guests: z.number().int().positive()
});

app.post('/api/bookings', (req, res) => {
  const parse = bookingSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

  const { room_id, name, email, phone, check_in, check_out, guests } = parse.data;

  // preço total = diárias * price_per_night
  const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(room_id);
  if (!room) return res.status(404).json({ error: 'Room not found' });

  const nights = Math.max(1, (new Date(check_out) - new Date(check_in)) / (1000*60*60*24));
  const total = Number((nights * room.price_per_night).toFixed(2));

  const stmt = db.prepare(`
    INSERT INTO bookings (room_id, name, email, phone, check_in, check_out, guests, total_price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(room_id, name, email, phone ?? null, check_in, check_out, guests, total);
          // ... depois de salvar a reserva no banco:
      const booking = {
        id: info.lastInsertRowid, room_id, name, email, phone: phone || null,
        check_in, check_out, guests, total_price: total
      };

      // DISPARA OS E-MAILS (não bloqueia a resposta se falhar)
      sendBookingEmails({ booking, room })
        .catch(err => console.error('EMAIL ERROR:', err?.message));



  res.status(201).json({ id: info.lastInsertRowid, total_price: total });
});

// (opcional) GET /api/bookings?email=...
app.get('/api/bookings', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'email query required' });
  const rows = db.prepare('SELECT * FROM bookings WHERE email = ? ORDER BY created_at DESC').all(email);
  res.json(rows);
});

// GET /api/bookings/:id  → detalhes da reserva
app.get('/api/bookings/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'id inválido' });

  const row = db.prepare(`
    SELECT b.*, r.name AS room_name, r.price_per_night
    FROM bookings b
    JOIN rooms r ON r.id = b.room_id
    WHERE b.id = ?
  `).get(id);

  if (!row) return res.status(404).json({ error: 'Reserva não encontrada' });
  res.json(row);
});
// --- Middleware simples de admin (por token) ---
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';
function adminOnly(req, res, next) {
  const token = req.header('x-admin-token') || req.query.token;
  if (!ADMIN_TOKEN) {
    return res.status(501).json({ error: 'ADMIN_TOKEN não configurado no servidor.' });
  }
  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  next();
}

// --- GET /api/admin/bookings?email=&start=YYYY-MM-DD&end=YYYY-MM-DD ---
app.get('/api/admin/bookings', adminOnly, (req, res) => {
  const { email, start, end } = req.query;

  let sql = `
    SELECT b.*, r.name AS room_name, r.price_per_night
    FROM bookings b
    JOIN rooms r ON r.id = b.room_id
    WHERE 1=1
  `;
  const params = {};

  if (email) {
    sql += ` AND b.email LIKE @email`;
    params.email = `%${email}%`;
  }
  if (start) {
    sql += ` AND b.created_at >= @start`;
    params.start = start;
  }
  if (end) {
    sql += ` AND b.created_at <= @end`;
    params.end = end;
  }

  sql += ` ORDER BY b.created_at DESC LIMIT 500`;

  const rows = db.prepare(sql).all(params);
  res.json(rows);
});

// GET /api/admin/rooms  → lista todos os quartos (admin)
app.get('/api/admin/rooms', adminOnly, (req, res) => {
  const rows = db.prepare('SELECT * FROM rooms ORDER BY id DESC').all();
  res.json(rows);
});

const roomSchema = z.object({
  name: z.string().min(2),
  description: z.string().default('').optional(),
  price_per_night: z.coerce.number().positive(),
  max_guests: z.coerce.number().int().positive(),
  cover_url: z.string().url().optional().nullable() // pode ser URL ou vazio
});

// POST /api/admin/rooms  → cria quarto
app.post('/api/admin/rooms', adminOnly, (req, res) => {
  const parsed = roomSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { name, description = '', price_per_night, max_guests, cover_url = null } = parsed.data;

  const stmt = db.prepare(`
    INSERT INTO rooms (name, description, price_per_night, max_guests, cover_url)
    VALUES (@name, @description, @price_per_night, @max_guests, @cover_url)
  `);
  const info = stmt.run({ name, description, price_per_night, max_guests, cover_url });
  const created = db.prepare('SELECT * FROM rooms WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(created);
});

// PUT /api/admin/rooms/:id  → atualiza quarto
app.put('/api/admin/rooms/:id', adminOnly, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'id inválido' });

  const parsed = roomSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { name, description = '', price_per_night, max_guests, cover_url = null } = parsed.data;

  const exists = db.prepare('SELECT id FROM rooms WHERE id = ?').get(id);
  if (!exists) return res.status(404).json({ error: 'Room not found' });

  db.prepare(`
    UPDATE rooms
       SET name=@name,
           description=@description,
           price_per_night=@price_per_night,
           max_guests=@max_guests,
           cover_url=@cover_url
     WHERE id=@id
  `).run({ id, name, description, price_per_night, max_guests, cover_url });

  const updated = db.prepare('SELECT * FROM rooms WHERE id = ?').get(id);
  res.json(updated);
});

// DELETE /api/admin/rooms/:id  → exclui quarto (se não tiver reservas)
app.delete('/api/admin/rooms/:id', adminOnly, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'id inválido' });

  const exists = db.prepare('SELECT id FROM rooms WHERE id = ?').get(id);
  if (!exists) return res.status(404).json({ error: 'Room not found' });

  const used = db.prepare('SELECT COUNT(*) as c FROM bookings WHERE room_id = ?').get(id).c;
  if (used > 0) return res.status(409).json({ error: 'Quarto possui reservas vinculadas' });

  db.prepare('DELETE FROM rooms WHERE id = ?').run(id);
  res.json({ ok: true });
});


// GET /api/health/email-template → manda um e-mail só-HTML com o template
app.get('/api/health/email-template', async (req, res) => {
  try {
    // mock dos dados
    const booking = {
      id: 9999,
      name: 'Teste',
      email: process.env.MAIL_OWNER || process.env.SMTP_USER,
      check_in: '2025-12-10',
      check_out: '2025-12-12',
      guests: 2,
      total_price: 500
    };
    const room = { name: 'Suíte Vista-Mar', cover_url: 'https://picsum.photos/900/600?image=1069' };

    // monte o HTML
    const htmlBody = require('./lib/emailTemplate')({
      booking,
      room,
      brand: 'Casa de Paquita',
      siteBase: process.env.SITE_BASE_URL || 'http://localhost:5173',
      waPhone: process.env.WA_PHONE || '51999999999',
      address: 'Punta Sal, Peru'
    });

    // envie o e-mail **somente com HTML** (sem text)
    await transporter.sendMail({
      from: process.env.MAIL_FROM || `"Casa de Paquita" <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_OWNER || process.env.SMTP_USER,
      subject: 'Teste de template (praia/verão)',
      html: htmlBody
    });

    res.json({ ok: true });
  } catch (e) {
    console.error('EMAIL TEST ERROR:', e?.message);
    res.status(500).json({ ok: false, error: e?.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));

