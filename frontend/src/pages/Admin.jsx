// frontend/src/pages/Admin.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
<th>Ações</th>
const PEN = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 0 });

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem("adminToken") || "");
  const [email, setEmail] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!token) return;
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function fetchData() {
    setLoading(true);
    setErr("");
    try {
      const res = await api.get("/admin/bookings", {
        headers: { "x-admin-token": token },
        params: { email: email || undefined, start: start || undefined, end: end || undefined },
      });
      setRows(res.data || []);
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      setErr("Falha ao carregar reservas. Verifique o token e tente novamente.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  function saveToken() {
    localStorage.setItem("adminToken", token);
    fetchData();
  }

  function clearToken() {
    localStorage.removeItem("adminToken");
    setToken("");
    setRows([]);
  }

  const csvHref = useMemo(() => {
    if (!rows.length) return null;
    const header = [
      "id","created_at","room_id","room_name","name","email","phone",
      "check_in","check_out","guests","total_price"
    ];
    const body = rows.map(r => [
      r.id, r.created_at, r.room_id, r.room_name, r.name, r.email, r.phone ?? "",
      r.check_in, r.check_out, r.guests, r.total_price
    ]);
    const csv = [header, ...body]
      .map(line => line.map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    return URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  }, [rows]);

  if (!token) {
    return (
      <div className="container py-4">
        <h2>Admin • Entrar</h2>
        <div className="row g-3 mt-1">
          <div className="col-md-6">
            <label className="form-label">Admin Token</label>
            <input
              className="form-control"
              type="password"
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="Cole o token de admin"
            />
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
        <h2>Admin • Reservas</h2>
        <button className="btn btn-outline-danger btn-sm" onClick={clearToken}>Sair</button>
      </div>

      <div className="row g-2 mt-1">
        <div className="col-md-4">
          <label className="form-label">Filtrar por e-mail</label>
          <input className="form-control" value={email} onChange={e => setEmail(e.target.value)} placeholder="ex: cliente@dominio.com" />
        </div>
        <div className="col-md-3">
          <label className="form-label">Criadas após (YYYY-MM-DD)</label>
          <input className="form-control" type="date" value={start} onChange={e => setStart(e.target.value)} />
        </div>
        <div className="col-md-3">
          <label className="form-label">Criadas antes (YYYY-MM-DD)</label>
          <input className="form-control" type="date" value={end} onChange={e => setEnd(e.target.value)} />
        </div>
        <div className="col-md-2 d-flex align-items-end">
          <button className="btn btn-primary w-100" onClick={fetchData} disabled={loading}>
            {loading ? "Carregando..." : "Buscar"}
          </button>
        </div>
      </div>

      {err && <div className="alert alert-danger mt-3">{err}</div>}

      <div className="mt-3 d-flex justify-content-between align-items-center">
        <div className="text-muted">
          {rows.length ? `${rows.length} reserva(s)` : "Sem resultados"}
        </div>
        {csvHref && (
          <a className="btn btn-outline-secondary btn-sm" href={csvHref} download="reservas.csv">Exportar CSV</a>
        )}
      </div>

      <div className="table-responsive mt-2">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <th>Ações</th>
            <tr>
              <th>#</th>
              <th>Criada em</th>
              <th>Quarto</th>
              <th>Hóspede</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Período</th>
              <th>Hósp.</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            
            {rows.map(b => (
              <tr key={b.id}>
                
                    <td>{b.id}</td>
                    <td>{b.created_at?.replace('T',' ').slice(0,16)}</td>
                    <td>{b.room_name}</td>
                    <td>{b.name}</td>
                    <td>{b.email}</td>
                    <td>{b.phone || "-"}</td>
                    <td>{b.check_in} → {b.check_out}</td>
                    <td>{b.guests}</td>
                    <td>{PEN.format(b.total_price)}</td>
                    <td>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={async () => {
                        try {
                          await api.post(`/admin/bookings/${b.id}/resend`, {}, { headers: { "x-admin-token": token } });
                          alert("E-mail reenviado!");
                        // eslint-disable-next-line no-unused-vars
                        } catch (e) {
                          alert("Falha ao reenviar. Veja logs do servidor.");
                        }
                      }}
                    >
                      Reenviar e-mail
                    </button>
                    </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
