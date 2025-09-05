// frontend/src/pages/Quartos.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../lib/api";
const PEN = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 0 });

export default function Quartos() {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const r = await api.get("/rooms");
        const data = r?.data;
        const arr = Array.isArray(data) ? data : (data?.rooms ?? []);
        console.log("DEBUG rooms count:", arr.length, "sample:", arr[0]);
        setRooms(arr);
      } catch (e) {
        console.error("DEBUG rooms error:", e);
        setErr("Erro ao carregar quartos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="container py-4">
    
      <h2 className="mb-3">{t('rooms.title')}</h2>

      {loading && <div>Carregando…</div>}
      {err && !loading && <div className="text-danger">{err}</div>}

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
