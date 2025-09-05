import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Textos base: você pode expandir depois
const resources = {
  pt: {
    translation: {
      brand: "Casa de Paquita",
      nav: { home: "Início", rooms: "Quartos", reserve: "Reservar", contact: "Contato" },
      home: {
              home: {
              title: "Bem-vindos à Casa de Paquita",
              subtitle: "Hostel familiar pé-na-areia em Punta Sal, Norte do Peru — conforto, mar calmo e pôr-do-sol inesquecível.",
              ctaBookWhatsApp: "Reservar pelo WhatsApp",
              ctaViewRooms: "Ver quartos",
              b1: "A 50m da praia",
              b1d: "Mar calmo e areia clara para relaxar.",
              b2: "Quartos aconchegantes",
              b2d: "Opções para casais e famílias.",
              b3: "Pôr-do-sol incrível",
              b3d: "Cenário perfeito para fotos e descanso.",
              gallery: "Galeria",
              waMessage: "Olá! Gostaria de verificar a disponibilidade e fazer uma reserva na Casa de Paquita. As informações são: Período da reserva: [Data de check-in]:__/__/2025 a [Data de check-out]: __/__/2025Número de hóspedes: [Quantidade de adultos] adultos e [quantidade de crianças, se houver] crianças. Tipo de quarto: `${room?.name}` Por favor, me informe sobre a disponibilidade para este período e os valores. Fico no aguardo e muito obrigada!",
              howToTitle: "Como reservar pelo WhatsApp (3 passos)",
              how1Title: "Escolha as datas",
              how1Text: "Defina check-in, check-out e o número de hóspedes.",
              how2Title: "Envie a sua mensagem",
              how2Text: "Clique no botão do WhatsApp e nos envie as datas.",
              how3Title: "Confirme e pronto!",
              how3Text: "Responderemos com disponibilidade e valor total para confirmar."
                        
            
            
            }
}
,
      rooms: { title: "Nossos quartos", none: "Nenhum quarto cadastrado ainda." },
      reserve: { title: "Reservar", sending: "Enviando...", bookNow: "Reservar agora" },
      confirm: { title: "Reserva confirmada 🎉", code: "Código", total: "Total" }
    }
  },
  es: {
    translation: {
      brand: "Casa de Paquita",
      nav: { home: "Inicio", rooms: "Habitaciones", reserve: "Reservar", contact: "Contacto" },
      home:{
            Título: "Bienvenidos a Casa de Paquita",
            Subtítulo: "Hostal familiar frente al mar en Punta Sal, norte de Perú: comodidad, mar tranquilo y atardeceres inolvidables",
            ctaBookWhatsApp: "Reserva por WhatsApp",
            ctaViewRooms: "Ver habitaciones",
            b1: "A 50 m de la playa",
            b1d: "Mar tranquilo y arena blanca para relajarse",
            b2: "Habitaciones acogedoras",
            b2d: "Opciones para parejas y familias",
            b3: "Atardeceres increíbles",
            b3d: "Entorno perfecto para fotos y relajación",
            galería: "Galería",
            waMessage: "¡Hola! Quiero reservar en Casa de Paquita. Fechas: __/__/__ a __/__/__. Huéspedes: 2 personas",
            howToTitle: "Cómo reservar por WhatsApp (3 pasos)",
            how1Title: "Elige tus fechas",
            how1Text: "Establece la hora de entrada, salida y el número de huéspedes",
            how2Title: "Envía su mensaje",
            how2Text: "Haz clic en el botón de WhatsApp y envíanos las fechas",
            how3Title: "¡Confirma y listo!",
            how3Text: "Te responderemos con la disponibilidad y el precio total para confirmar",
          },
      rooms: { title: "Nuestras habitaciones", none: "Aún no hay habitaciones registradas." },
      reserve: { title: "Reservar", sending: "Enviando...", bookNow: "Reservar ahora" },
      confirm: { title: "Reserva confirmada 🎉", code: "Código", total: "Total" }
    }
  },
  en: {
    translation: {
      brand: "Casa de Paquita",
      nav: { home: "Home", rooms: "Rooms", reserve: "Book", contact: "Contact" },
      home: {
        
         title: "Welcome to Casa de Paquita",
              subtitle: "Family-friendly beachfront hostel in Punta Sal, Northern Peru — comfort, calm sea, and unforgettable sunsets.",
              ctaBookWhatsApp: "Book via WhatsApp",
              ctaViewRooms: "View rooms",
              b1: "50m from the beach",
              b1d: "Calm sea and white sand for relaxing.",
              b2: "Cozy rooms",
              b2d: "Options for couples and families.",
              b3: "Incredible sunsets",
              b3d: "Perfect setting for photos and relaxation.",
              gallery: "Gallery",
              waMessage: "Hello! I want to book at Casa de Paquita. Dates: __/__/__ to __/__/__. Guests: 2.",
              howToTitle: "How to book via WhatsApp (3 steps)",
              how1Title: "Choose your dates",
              how1Text: "Set check-in, check-out, and the number of guests.",
              how2Title: "Send your message",
              how2Text: "Click the WhatsApp button and send us the dates.",
              how3Title: "Confirm and that's it!",
              how3Text: "We'll reply with availability and the total price to confirm."
          
            },
      rooms: { title: "Our rooms", none: "No rooms yet." },
      reserve: { title: "Book", sending: "Sending...", bookNow: "Book now" },
      confirm: { title: "Booking confirmed 🎉", code: "Code", total: "Total" }
    }
  }
};

i18n
  .use(LanguageDetector)         // detecta idioma
  .use(initReactI18next)         // integra com React
  .init({
    resources,
    fallbackLng: "pt",
    interpolation: { escapeValue: false },
    detection: {
      // Ordem de detecção: ?lang=pt|es|en → localStorage → idioma do navegador
      order: ["querystring", "localStorage", "navigator"],
      lookupQuerystring: "lang",
      caches: ["localStorage"]
    }
  });

export default i18n;
