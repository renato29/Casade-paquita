import { useEffect, useState } from "react";
import api from "../lib/api.js";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


export default function Reservar() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    room_id: "",
    name: "",
    email: "",
    phone: "",
    check_in: "",
    check_out: "",
    guests: 1,
  });
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  // carregar quartos para o select
  useEffect(() => {
    api.get("/rooms").then(r => setRooms(r.data))
      .catch(() => setMsg("Não foi possível carregar os quartos."))
      .finally(() => setLoadingRooms(false));
  }, []);

  function onChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === "guests" ? Number(value) : value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    setSubmitting(true);
    try {
      // validação rápida no cliente
      if (
        !form.room_id || !form.name || !form.email || !form.check_in || !form.check_out) {
        setMsg("Preencha os campos obrigatórios.");
        return;
      }
      const payload = {
        room_id: Number(form.room_id),
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        check_in: form.check_in,
        check_out: form.check_out,
        guests: Number(form.guests) || 1,
       
      };
      const res = await api.post("/bookings", payload);
      const id = res.data.id;
      navigate(`/reserva-confirmada?id=${id}`);
      
      // opcional: limpar formulário
      // setForm({ room_id: "", name: "", email: "", phone: "", check_in: "", check_out: "", guests: 1 });
    } catch (err) {
      const apiMsg = err?.response?.data?.error ? " Verifique os dados." : "";
      setMsg("Erro ao criar reserva." + apiMsg);
    } finally {
      setSubmitting(false);
    }
  }

  const today = new Date().toISOString().slice(0,10);

  return (
    <div className="container py-4">
      <h2 className="mb-3">Reservar</h2>

      {msg && <div className="alert alert-info">{msg}</div>}

      <form className="row g-3" onSubmit={onSubmit}>
        <div className="col-md-6">
          <label className="form-label">Quarto *</label>
          {loadingRooms ? (
            <div className="form-control">Carregando…</div>
          ) : (
            <select
              className="form-select"
              name="room_id"
              value={form.room_id}
              onChange={onChange}
              required
            >
              <option value="">Selecione</option>
              {rooms.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name} — S/ {r.price_per_night}/noite (até {r.max_guests} hóspedes)
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label">Hóspedes *</label>
          <input
            type="number"
            min={1}
            className="form-control"
            name="guests"
            value={form.guests}
            onChange={onChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Check-in *</label>
          <input
            type="date"
            className="form-control"
            name="check_in"
            min={today}
            value={form.check_in}
            onChange={onChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Check-out *</label>
          <input
            type="date"
            className="form-control"
            name="check_out"
            min={form.check_in || today}
            value={form.check_out}
            onChange={onChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Nome completo *</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={form.name}
            onChange={onChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">E-mail *</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={form.email}
            onChange={onChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">WhatsApp</label>
          <input
            type="tel"
            className="form-control"
            name="phone"
            value={form.phone}
            onChange={onChange}
            placeholder="(opcional)"
          />
        </div>

        <div className="col-12">
          <h2 className="mb-3">{t('reserve.title')}</h2>
          <button className="btn btn-primary" disabled={submitting}>
            {submitting ? t('reserve.sending') : t('reserve.bookNow')}
          </button>
        </div>
      </form>
    </div>
  );
}
