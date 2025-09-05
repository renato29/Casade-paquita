// frontend/src/pages/Home.jsx
import { useTranslation } from "react-i18next";

// ATENÇÃO: troque para o número oficial do WhatsApp (somente dígitos).
// Ex.: Peru: 51 + número | Brasil: 55 + número | Israel: 972 + número
const WA_PHONE = "972587362850"; // << TROQUE AQUI

function waLink(message) {
  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(message)}`;
}

export default function Home() {
  const { t } = useTranslation();

  const defaultMsg = t("home.waMessage", {
    // texto fallback se a chave não existir
    defaultValue:
      "Olá! Quero reservar na Casa de Paquita. Datas: __/__/__ a __/__/__. Hóspedes: 2 pessoas."
  });

  return (
    <>
      {/* HERO */}
      <section
        className="py-5"
        style={{
          backgroundImage:
            "url('https://picsum.photos/id/1011/1600/800')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.55) 100%)",
          }}
        />
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center">
            <div className="col-lg-7">
              <h1 className="display-5 fw-bold">
                {t("home.title", { defaultValue: "Bem-vindo(a) à Casa de Paquita" })}
              </h1>
              <p className="lead mt-3">
                {t("home.subtitle", {
                  defaultValue:
                    "Hostel familiar pé-na-areia em Punta Sal, Norte do Peru — conforto, mar calmo e pôr-do-sol inesquecível."
                })}
              </p>

              <div className="d-flex gap-2 mt-4">
                <a
                  className="btn btn-success btn-lg"
                  href={waLink(defaultMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  💬 {t("home.ctaBookWhatsApp", { defaultValue: "Reservar pelo WhatsApp" })}
                </a>
                <a className="btn btn-outline-light btn-lg" href="/quartos">
                  {t("home.ctaViewRooms", { defaultValue: "Ver quartos" })}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

{/* BUSCA RÁPIDA */}
<form
  className="row g-2 mt-4"
  onSubmit={(e) => {
    e.preventDefault();
    const ci = e.currentTarget.check_in.value;
    const co = e.currentTarget.check_out.value;
    const gs = e.currentTarget.guests.value;
    if (!ci || !co || !gs) return;
    // Leva para /quartos com os filtros na URL
    window.location.href = `/quartos?check_in=${ci}&check_out=${co}&guests=${gs}`;
  }}
>
  <div className="col-md-3">
    <label className="form-label">Check-in</label>
    <input name="check_in" type="date" className="form-control" required />
  </div>
  <div className="col-md-3">
    <label className="form-label">Check-out</label>
    <input name="check_out" type="date" className="form-control" required />
  </div>
  <div className="col-md-2">
    <label className="form-label">Hóspedes</label>
    <input name="guests" type="number" min="1" step="1" defaultValue="2" className="form-control" required />
  </div>
  <div className="col-md-4 d-flex align-items-end">
    <button className="btn btn-primary w-100" type="submit">Ver disponíveis</button>
  </div>
</form>

      {/* BENEFÍCIOS */}
      <section className="py-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4">
              <h5 className="fw-bold">🏖️ {t("home.b1", { defaultValue: "A 50m da praia" })}</h5>
              <p className="text-muted">{t("home.b1d", { defaultValue: "Mar calmo e areia clara para relaxar." })}</p>
            </div>
            <div className="col-md-4">
              <h5 className="fw-bold">🛏️ {t("home.b2", { defaultValue: "Quartos aconchegantes" })}</h5>
              <p className="text-muted">{t("home.b2d", { defaultValue: "Opções para casais e famílias." })}</p>
            </div>
            <div className="col-md-4">
              <h5 className="fw-bold">🌅 {t("home.b3", { defaultValue: "Pôr-do-sol incrível" })}</h5>
              <p className="text-muted">{t("home.b3d", { defaultValue: "Cenário perfeito para fotos e descanso." })}</p>
            </div>
          </div>
        </div>
      </section>


      {/* COMO RESERVAR PELO WHATSAPP */}
<section className="py-5 bg-light">
  <div className="container">
    <h3 className="mb-4">
      {t("home.howToTitle", { defaultValue: "Como reservar pelo WhatsApp (3 passos)" })}
    </h3>

    <div className="row g-4">
      <div className="col-md-4">
        <div className="card h-100 shadow-sm">
          <div className="card-body">
            <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle me-2" style={{width:36,height:36}}>
              1
            </div>
            <h5 className="d-inline align-middle ms-2">
              {t("home.how1Title", { defaultValue: "Escolha as datas" })}
            </h5>
            <p className="text-muted mt-2">
              {t("home.how1Text", { defaultValue: "Defina check-in, check-out e o número de hóspedes." })}
            </p>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card h-100 shadow-sm">
          <div className="card-body">
            <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle me-2" style={{width:36,height:36}}>
              2
            </div>
            <h5 className="d-inline align-middle ms-2">
              {t("home.how2Title", { defaultValue: "Envie a mensagem" })}
            </h5>
            <p className="text-muted mt-2">
              {t("home.how2Text", { defaultValue: "Clique no botão do WhatsApp e nos envie as datas." })}
            </p>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card h-100 shadow-sm">
          <div className="card-body">
            <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle me-2" style={{width:36,height:36}}>
              3
            </div>
            <h5 className="d-inline align-middle ms-2">
              {t("home.how3Title", { defaultValue: "Confirme e pronto!" })}
            </h5>
            <p className="text-muted mt-2">
              {t("home.how3Text", { defaultValue: "Responderemos com disponibilidade e valor total para confirmar." })}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="text-center mt-4">
      <a
        className="btn btn-success btn-lg"
        href={waLink(defaultMsg)}
        target="_blank"
        rel="noopener noreferrer"
      >
        💬 {t("home.ctaBookWhatsApp", { defaultValue: "Quero reservar agora" })}
      </a>
    </div>
  </div>
</section>


      {/* GALERIA SIMPLES */}
      <section className="pb-5">
        <div className="container">
          <h3 className="mb-3">{t("home.gallery", { defaultValue: "Galeria" })}</h3>
          <div className="row g-3">
            {["1002","1016","1018","1025","1035","1069"].map((id) => (
              <div className="col-6 col-md-4" key={id}>
                <img
                  src={`https://picsum.photos/id/${id}/800/600`}
                  alt="Casa de Paquita"
                  className="img-fluid rounded"
                  style={{ objectFit: "cover", width: "100%", height: 240 }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTÃO FLOTANTE WHATSAPP */}
      <a
        href={waLink(defaultMsg)}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-wa btn btn-success btn-lg rounded-circle"
        aria-label="Reservar pelo WhatsApp"
        title="Reservar pelo WhatsApp"
      >
        💬
      </a>
    </>
  );
}
