// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// IMPORTS DAS PÁGINAS 
import Quartos from "./pages/Quartos";   // ✅
import Reservar from "./pages/Reserva";
import ReservaConfirmada from "./pages/ReservaConfirmada";
import Home from "./pages/Home";
import RoomDetail from "./pages/RoomDetail";
import Admin from "./pages/Admin";
import AdminRooms from "./pages/AdminRooms";

// ...
<Routes>
  {/* ...suas rotas existentes... */}
  <Route path="/admin/rooms" element={<AdminRooms />} />
</Routes>


// Opcional: Home/Contato inline (pode virar arquivos depois)


function Contato() {
  return (
    <div className="container py-4">
      <h2>Contato</h2>
      <p>
        E-mail:{" "}
        <a href="mailto:oficial@casadepaquita.com">oficial@casadepaquita.com</a>
      </p>
    </div>
  );
}

// NAVBAR com i18n e botões de idioma (opcional)
function Navbar() {
  const { t, i18n } = useTranslation();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div className="container position-relative">
        {/* Brand à esquerda */}
        <Link className="navbar-brand fw-bold" to="/">{t("brand")}</Link>

        {/* Toggler (mobile) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Área colapsável ocupa TODO o espaço (flex-grow-1) */}
        <div className="collapse navbar-collapse flex-grow-1" id="mainNav">
          {/* Links centralizados (mx-auto) */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className="nav-link" to="/">{t("nav.home")}</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/quartos">{t("nav.rooms")}</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/reservar">{t("nav.reserve")}</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/contato">{t("nav.contact")}</Link></li>
          </ul>
        </div>

        {/* Botões de idioma fora do fluxo, à direita (não “puxam” o centro) */}
        <div className="d-none d-lg-flex position-absolute end-0 top-50 translate-middle-y">
          <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => i18n.changeLanguage("pt")}>PT</button>
          <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => i18n.changeLanguage("es")}>ES</button>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => i18n.changeLanguage("en")}>EN</button>
        </div>
      </div>
    </nav>
  );
}

// APP (rotas)
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quartos" element={<Quartos />} />
          <Route path="/reservar" element={<Reservar />} />
          <Route path="/reserva-confirmada" element={<ReservaConfirmada />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="*" element={<Home />} />
          <Route path="/quartos/:id" element={<RoomDetail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/rooms" element={<AdminRooms />} />
      </Routes>

    </BrowserRouter>
  );
}
