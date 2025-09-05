import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';

const WA_PHONE = '972587362860'; // <<< TROQUE PELO NÚMERO REAL (só dígitos)
function waLink(message) {
  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(message)}`;
}
const PEN = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 0 });

export default function RoomDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let alive = true;
    api.get(`/rooms/${id}`)
      .then(r => { if (alive) setRoom(r.data); })
      .catch(() => { if (alive) setErr('Não foi possível carregar o quarto.'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id]);

  const defaultMsg = useMemo(() =>
    `Olá! Gostaria de verificar a disponibilidade e fazer uma reserva na Casa de Paquita.

          As informações são:

          Nome: [Seu Nome Completo]

          Período da reserva: [Data de check-in]:__/__/2025 a [Data de check-out]: __/__/2025

          Número de hóspedes: [Quantidade de adultos] adultos e [quantidade de crianças, se houver] crianças.

          Tipo de quarto: "${room?.name}"

          Por favor, me informe sobre a disponibilidade para este período e os valores.

          Fico no aguardo e muito obrigada!`,
  [room]);

  if (loading) return <div className="container py-4">Carregando…</div>;
  if (err) return <div className="container py-4 text-danger">{err}</div>;
  if (!room) return <div className="container py-4">Quarto não encontrado.</div>;

  return (
    <div className="container py-4">
      <Link to="/quartos" className="btn btn-link mb-3">← {t('nav.rooms', { defaultValue: 'Quartos' })}</Link>

      <div className="row g-4">
        <div className="col-md-7">
          <img
            src={room.cover_url || 'https://picsum.photos/900/600?blur=1'}
            alt={room.name}
            className="img-fluid rounded"
          />
        </div>

        <div className="col-md-5">
          <h1 className="h3">{room.name}</h1>
          <p className="text-muted">{room.description}</p>
          <p className="fs-5 fw-bold">{PEN.format(room.price_per_night)} / noite</p>

          {/* comodidades exemplo */}
          <div className="d-flex flex-wrap gap-2 my-3">
            <span className="badge text-bg-light">Wi-Fi</span>
            <span className="badge text-bg-light">Ar-condicionado</span>
            <span className="badge text-bg-light">Café da manhã</span>
            <span className="badge text-bg-light">Até {room.max_guests} hóspedes</span>
          </div>

          <div className="d-flex gap-2">
            <a className="btn btn-success"
               href={waLink(defaultMsg)}
               target="_blank"
               rel="noopener noreferrer">
              💬 {t('home.ctaBookWhatsApp', { defaultValue: 'Reservar pelo WhatsApp' })}
            </a>
            <Link to="/reservar" className="btn btn-outline-primary">
              {t('nav.reserve', { defaultValue: 'Reservar' })}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
