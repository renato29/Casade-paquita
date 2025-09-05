import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";


export default function ReservaConfirmada() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) { setErr("ID da reserva não informado."); return; }

    axios.get(`/api/bookings/${id}`)
      .then(r => setData(r.data))
      .catch(() => setErr("Não foi possível carregar a reserva."));
  }, []);

  if (err) return <div className="container py-4 text-danger">{err}</div>;
  if (!data) return <div className="container py-4">Carregando…</div>;

  return (
    <div className="container py-5">
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h2 className="mb-3">Reserva confirmada 🎉</h2>
          <p className="mb-1"><strong>{t('confirm.code')}:</strong> #{data.id}</p>
          <p className="mb-1"><strong>Quarto:</strong> {data.room_name}</p>
          <p className="mb-1"><strong>Hóspede:</strong> {data.name}</p>
          <p className="mb-1"><strong>Período:</strong> {data.check_in} → {data.check_out}</p>
          <p className="mb-1"><strong>Hóspedes:</strong> {data.guests}</p>
          <p className="mb-0 fs-5"><strong>{t('confirm.total')}:</strong> S/ {data.total_price}</p>

          <hr className="my-4" />
          <a className="btn btn-outline-primary" href="/quartos">Ver outros quartos</a>
        </div>
      </div>
    </div>
  );
}
