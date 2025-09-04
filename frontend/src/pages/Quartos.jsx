// frontend/src/pages/Quartos.jsx
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../lib/api";
const PEN = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 0 });

export default function Quartos() {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [searchParams] = useSearchParams();

  const ci = searchParams.get("check_in");
  const co = searchParams.get("check_out");
  const gs = searchParams.get("guests");


  useEffect(() => {
  const fetch = async () => {
    try {
      let r;
      if (ci && co && gs) {
        r = await api.get("/rooms/available", { params: { check_in: ci, check_out: co, guests: gs } });
      } else {
        r = await api.get("/rooms");
      }
      const data = Array.isArray(r.data) ? r.data : (r.data?.rooms ?? []);
      setRooms(data);
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      setErr("Erro ao carregar quartos");
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  fetch();
}, [ci, co, gs]);;


  return (
    <div className="container py-4">
    
      <h2 className="mb-3">{t('rooms.title')}</h2>

      {loading && <div>Carregando…</div>}
      {err && !loading && <div className="text-danger">{err}</div>}
      {ci && co && gs && (
        <div className="alert alert-info d-flex align-items-center justify-content-between">
          <div>
            Mostrando <strong>quartos disponíveis</strong> de <strong>{ci}</strong> a <strong>{co}</strong> ·
            <strong> {gs}</strong> hóspede(s)
          </div>
          <Link className="btn btn-sm btn-outline-secondary" to="/quartos">Limpar filtros</Link>
        </div>
      )}

      <div className="row g-3">
        {rooms.map((room) => (
          <div className="col-md-4" key={room.id}>
            <div className="card h-100">
              <img
                src={room.cover_url || "https://picsum.photos/600/400?blur=1"}
                alt={room.name}
                className="card-img-top"
              />
              <div className="card-body">
                <h5 className="card-title">{room.name}</h5>
                <p className="card-text">{room.description}</p>
                <p className="fw-bold">{PEN.format(room.price_per_night)} / noite</p>
                <Link to={`/quartos/${room.id}`} className="btn btn-outline-primary mt-auto">
                Ver detalhes
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && !err && rooms.length === 0 && (
        <p className="text-muted">{t('rooms.none')}</p>
      )}
    </div>
  );
}
