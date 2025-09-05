// frontend/src/pages/AdminRooms.jsx
// FRONTEND da pagina para o ADMIN criar um quarto 

import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";

const PEN = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 0 });

export default function AdminRooms() {
  const [token, setToken] = useState(() => localStorage.getItem("adminToken") || "");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
    price_per_night: "",
    max_guests: "",
    cover_url: ""
  });

  useEffect(() => {
    if (!token) return;
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function fetchRooms() {
    setLoading(true); setErr("");
    try {
      const res = await api.get("/admin/rooms", { headers: { "x-admin-token": token } });
      setRows(res.data || []);
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      setErr("Falha ao carregar quartos. Verifique o token.");
    } finally {
      setLoading(false);
    }
  }

  function openNew() {
    setForm({ id: null, name: "", description: "", price_per_night: "", max_guests: "", cover_url: "" });
    setShowModal(true);
  }

  function openEdit(r) {
    setForm({
      id: r.id,
      name: r.name || "",
      description: r.description || "",
      price_per_night: String(r.price_per_night ?? ""),
      max_guests: String(r.max_guests ?? ""),
      cover_url: r.cover_url || ""
    });
    setShowModal(true);
  }

  async function onSave(e) {
    e.preventDefault();
    setSaving(true); setErr("");
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price_per_night: Number(form.price_per_night),
        max_guests: Number(form.max_guests),
        cover_url: form.cover_url.trim() || null
      };
      if (!payload.name || !payload.price_per_night || !payload.max_guests) {
        setErr("Preencha nome, preço e capacidade."); setSaving(false); return;
      }

      if (form.id == null) {
        await api.post("/admin/rooms", payload, { headers: { "x-admin-token": token } });
      } else {
        await api.put(`/admin/rooms/${form.id}`, payload, { headers: { "x-admin-token": token } });
      }

      setShowModal(false);
      await fetchRooms();
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      setErr("Falha ao salvar. Verifique os campos.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(r) {
    if (!confirm(`Excluir o quarto "${r.name}"?`)) return;
    try {
      await api.delete(`/admin/rooms/${r.id}`, { headers: { "x-admin-token": token } });
      await fetchRooms();
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      alert("Não foi possível excluir (talvez haja reservas vinculadas).");
    }
  }

  function saveToken() {
    localStorage.setItem("adminToken", token);
    fetchRooms();
  }

  function clearToken() {
    localStorage.removeItem("adminToken");
    setToken("");
    setRows([]);
  }

  const totalRooms = useMemo(() => rows.length, [rows]);

  if (!token) {
    return (
      <div className="container py-4">
        <h2>Admin • Quartos (login)</h2>
        <div className="row g-3 mt-1">
          <div className="col-md-6">
            <label className="form-label">Admin Token</label>
            <input className="form-control" type="password" value={token} onChange={e => setToken(e.target.value)} />
          </div>
          <div className="col-12">
            <button className="btn btn-primary" onClick={saveToken}>Entrar</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between">
        <h2>Admin • Quartos</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-success" onClick={openNew}>+ Novo quarto</button>
          <button className="btn btn-outline-danger btn-sm" onClick={clearToken}>Sair</button>
        </div>
      </div>

      {err && <div className="alert alert-danger mt-3">{err}</div>}

      <div className="mt-2 text-muted">{totalRooms} quarto(s)</div>

      <div className="row g-3 mt-1">
        {loading && <div className="col-12">Carregando…</div>}

        {!loading && rows.map(r => (
          <div className="col-md-4" key={r.id}>
            <div className="card h-100">
              <img
                src={r.cover_url || "https://picsum.photos/600/400?blur=1"}
                className="card-img-top"
                alt={r.name}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{r.name}</h5>
                <p className="text-muted flex-grow-1">{r.description || "—"}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">{PEN.format(r.price_per_night)}</span>
                  <span className="badge text-bg-light">Até {r.max_guests}</span>
                </div>
                <div className="mt-3 d-flex gap-2">
                  <button className="btn btn-outline-primary btn-sm" onClick={() => openEdit(r)}>Editar</button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(r)}>Excluir</button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {!loading && !rows.length && <div className="col-12 text-muted">Nenhum quarto cadastrado.</div>}
      </div>

      {/* Modal "fake" Bootstrap (controlado por estado) */}
      {showModal && (
        <>
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog">
              <form className="modal-content" onSubmit={onSave}>
                <div className="modal-header">
                  <h5 className="modal-title">{form.id == null ? "Novo quarto" : `Editar: ${form.name}`}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Nome *</label>
                      <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required/>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Descrição</label>
                      <textarea className="form-control" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}/>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Preço por noite (PEN) *</label>
                      <input type="number" min="0" step="1" className="form-control" value={form.price_per_night} onChange={e => setForm(f => ({ ...f, price_per_night: e.target.value }))} required/>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Capacidade (hóspedes) *</label>
                      <input type="number" min="1" step="1" className="form-control" value={form.max_guests} onChange={e => setForm(f => ({ ...f, max_guests: e.target.value }))} required/>
                    </div>
                    <div className="col-12">
                      <label className="form-label">URL da foto de capa</label>
                      <input className="form-control" value={form.cover_url} onChange={e => setForm(f => ({ ...f, cover_url: e.target.value }))} placeholder="https://..."/>
                      {form.cover_url && (
                        <img src={form.cover_url} alt="preview" className="img-fluid rounded mt-2" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Salvando..." : "Salvar"}</button>
                </div>
              </form>
            </div>
          </div>
          <div className="modal-backdrop show"></div>
        </>
      )}
    </div>
  );
}
