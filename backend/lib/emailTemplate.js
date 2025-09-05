// backend/lib/emailTemplate.js
/**
 * Gera HTML do e-mail de confirmação (tema praia/verão).
 * booking: { id, name, email, check_in, check_out, guests, total_price }
 * room:    { name, cover_url }
 * brand:   string (ex.: "Casa de Paquita")
 * siteBase:string (ex.: "https://www.casadepaquita.com")
 * waPhone: string (apenas dígitos "51999999999")
 * address: string (ex.: "Punta Sal, Peru")
 */
function beachEmailTemplate({
  booking,
  room,
  brand   = "Casa de Paquita",
  siteBase= "https://www.casadepaquita.com",
  waPhone = "972587362860",
  address = "Punta Sal, Peru",
}) {
  const reservaUrl = `${siteBase}/reserva-confirmada?id=${booking.id}`;
  const waMsg  = `Olá! Tenho a reserva #${booking.id} (${booking.check_in} → ${booking.check_out}) para ${booking.guests} hóspedes.`;
  const waLink = `https://wa.me/${waPhone}?text=${encodeURIComponent(waMsg)}`;

  // Paleta praia/verão
  const sun   = "#FFC857"; // não usado no inline, mas pode usar se quiser
  const sand  = "#F4E1B6";
  const ocean = "#2E8BC0";
  const deep  = "#195C82";
  const leaf  = "#2BB673";

  const preheader = `Reserva #${booking.id} confirmada — ${room.name} de ${booking.check_in} a ${booking.check_out}.`;

  return `
  <!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${brand} — Confirmação de reserva #${booking.id}</title>
  <style>
    @media (max-width: 620px) {
      .container { width: 100% !important; }
      .stack { display:block !important; width:100% !important; }
      .px { padding-left:16px !important; padding-right:16px !important; }
      .hero-title { font-size: 24px !important; line-height: 32px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background:${sand};">
  <!-- Preheader oculto -->
  <div style="display:none; visibility:hidden; opacity:0; height:0; overflow:hidden; mso-hide:all;">
    ${preheader}
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${sand};">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="container" style="width:600px; max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 6px 24px rgba(0,0,0,0.08);">
          <!-- HERO -->
          <tr>
            <td style="background:${ocean}; color:#fff; padding:28px;" class="px">
              <div style="font:700 20px/1.2 Arial,Helvetica,sans-serif;">${brand}</div>
              <div class="hero-title" style="font:700 28px/1.2 Arial,Helvetica,sans-serif; margin-top:8px;">
                Reserva confirmada! ☀️🌊
              </div>
              <div style="font:400 14px/1.6 Arial,Helvetica,sans-serif; opacity:0.95; margin-top:8px;">
                Código <strong>#${booking.id}</strong> — ${room.name}
              </div>
            </td>
          </tr>

         
          <!-- “Onda” separadora (PNG hospedado no seu site) -->
                <tr>
                <td aria-hidden="true" style="padding:0; line-height:0;">
                    <img alt="" src="${siteBase}/email/wave.png" width="600" style="display:block; width:100%; height:auto;" />
                </td>
                </tr>


          <!-- Detalhes -->
          <tr>
            <td style="padding:24px;" class="px">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <!-- foto -->
                  <td class="stack" width="50%" valign="top" style="padding-right:12px;">
                    <img src="${room.cover_url || "https://picsum.photos/900/600?blur=1"}" alt="${room.name}" style="width:100%; height:auto; border-radius:8px; display:block;">
                  </td>
                  <!-- infos -->
                  <td class="stack" width="50%" valign="top" style="padding-left:12px; font:400 14px/1.6 Arial,Helvetica,sans-serif; color:#333;">
                    <p style="margin:0 0 8px 0;"><strong>Hóspede:</strong> ${booking.name}</p>
                    <p style="margin:0 0 8px 0;"><strong>Período:</strong> ${booking.check_in} → ${booking.check_out}</p>
                    <p style="margin:0 0 8px 0;"><strong>Hóspedes:</strong> ${booking.guests}</p>
                    <p style="margin:0 0 8px 0;"><strong>Total:</strong> S/ ${booking.total_price}</p>
                    <p style="margin:12px 0 0 0; color:#666;">Endereço: ${address}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTAs -->
          <tr>
            <td align="center" style="padding:0 24px 24px 24px;" class="px">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" bgcolor="${deep}" style="border-radius:8px;">
                    <a href="${reservaUrl}" target="_blank"
                       style="display:inline-block; padding:12px 20px; color:#fff; text-decoration:none; font:bold 14px Arial,Helvetica,sans-serif;">
                      Ver detalhes da reserva
                    </a>
                  </td>
                </tr>
              </table>

              <div style="height:10px"></div>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" bgcolor="${leaf}" style="border-radius:8px;">
                    <a href="${waLink}" target="_blank"
                       style="display:inline-block; padding:12px 20px; color:#fff; text-decoration:none; font:bold 14px Arial,Helvetica,sans-serif;">
                      💬 Falar no WhatsApp
                    </a>
                  </td>
                </tr>
              </table>

              <div style="font:400 12px Arial,Helvetica,sans-serif; color:#666; margin-top:10px;">
                Se os botões não funcionarem, copie e cole: <br>
                <span style="word-break:break-all;">${reservaUrl}</span>
              </div>
            </td>
          </tr>

          <!-- Rodapé -->
          <tr>
            <td style="background:#fff7da; padding:16px 24px; color:#5a4b1b; font:400 12px/1.6 Arial,Helvetica,sans-serif;" class="px">
              <div><strong>${brand}</strong> • ${address}</div>
              <div style="opacity:0.8;">Este e-mail foi enviado automaticamente. Não responda, use o WhatsApp para agilizar.</div>
              <div style="opacity:0.8; margin-top:4px;">© ${new Date().getFullYear()} ${brand}. Todos os direitos reservados.</div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>;
`}
module.exports = beachEmailTemplate;
