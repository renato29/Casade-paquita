const Database = require('better-sqlite3');
const db = new Database('db.sqlite');

// Tabelas básicas
db.exec(`
CREATE TABLE IF NOT EXISTS rooms (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_per_night REAL NOT NULL,
  max_guests INTEGER NOT NULL,
  cover_url TEXT
);

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY,
  room_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  check_in TEXT NOT NULL,
  check_out TEXT NOT NULL,
  guests INTEGER NOT NULL,
  total_price REAL NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY(room_id) REFERENCES rooms(id)
);
`);

// Seed simples (só se tabela vazia)
const count = db.prepare('SELECT COUNT(*) as c FROM rooms').get().c;
if (count === 0) {
  const stmt = db.prepare(`INSERT INTO rooms (name, description, price_per_night, max_guests, cover_url)
    VALUES (?, ?, ?, ?, ?)`);
  stmt.run('Suíte Vista Mar', 'Quarto com vista para o Pacífico', 350, 3, null);
  stmt.run('Quarto Família', 'Amplo e confortável', 420, 5, null);
  stmt.run('Studio Jardim', 'Aconchegante, perto do jardim', 280, 2, null);
}

module.exports = db;
