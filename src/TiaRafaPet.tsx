import { useState, useRef } from "react";
import {
  PawPrint,
  Calendar,
  MapPin,
  Scissors,
  Heart,
  Star,
  Droplets,
  Sparkles,
  ShowerHead,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────── */

interface FormState {
  tutorName: string;
  petName: string;
  breed: string;
  service: string;
  date: string;
  shift: string;
}

interface ServiceItem {
  icon: React.ReactNode;
  name: string;
  description: string;
  price: string;
  highlight?: boolean;
}

interface Bubble {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

/* ─── Constants ──────────────────────────────────────────── */

const SERVICES: ServiceItem[] = [
  {
    icon: <Droplets size={24} />,
    name: "Banho",
    description: "Shampoo premium, condicionador, secagem e perfume. Seu pet cheiroso!",
    price: "A partir de R$ 39,90",
    highlight: true,
  },
  {
    icon: <Scissors size={24} />,
    name: "Tosa Higiênica",
    description: "Limpeza das regiões íntimas, patinhas e higiene da face.",
    price: "A partir de R$ 35,00",
  },
  {
    icon: <Sparkles size={24} />,
    name: "Tosa Completa",
    description: "Corte no padrão da raça com acabamento impecável e carinhoso.",
    price: "A partir de R$ 65,00",
  },
  {
    icon: <Heart size={24} />,
    name: "Banho + Tosa",
    description: "O combo completo para o pet mais elegante do bairro!",
    price: "A partir de R$ 95,00",
  },
];

const GALLERY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80", alt: "Labrador após banho", tag: "Resultado ✨" },
  { src: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80", alt: "Cães felizes e limpos", tag: "Pets felizes 🐾" },
  { src: "https://images.unsplash.com/photo-1518288774672-b94e808873ff?w=600&q=80", alt: "Poodle após tosa", tag: "Tosa ✂️" },
  { src: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&q=80", alt: "Golden Retriever cuidado", tag: "Com carinho 💛" },
];

const SERVICES_OPTIONS = ["Banho", "Tosa Higiênica", "Tosa Completa", "Banho + Tosa"];
const SHIFT_OPTIONS = ["Manhã (8h–12h)", "Tarde (13h–17h)"];
const WHATSAPP_NUMBER = "5582996092372";

/* ─── Helpers ────────────────────────────────────────────── */

const buildWhatsAppUrl = (form: FormState): string => {
  const shift = form.shift.replace(/\s*\(.*\)/, "");
  const msg =
    `Olá Tia Rafa! 🐾 Me chamo *${form.tutorName}* e gostaria de agendar ` +
    `um *${form.service}* para o meu pet *${form.petName}* (${form.breed}) ` +
    `na data *${form.date}* no turno da *${shift}*. Podemos confirmar?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
};

/* ─── Sub-components ─────────────────────────────────────── */

const BubbleField = ({ count = 12 }: { count?: number }) => {
  const bubbles: Bubble[] = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (i / count) * 100 + (Math.sin(i * 2.5) * 8),
    size: 10 + ((i * 7) % 28),
    duration: 7 + ((i * 3) % 7),
    delay: (i * 0.4) % 5,
    opacity: 0.15 + ((i * 0.05) % 0.2),
  }));

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {bubbles.map((b) => (
        <div
          key={b.id}
          style={{
            position: "absolute",
            left: `${b.x}%`,
            bottom: "-50px",
            width: b.size,
            height: b.size,
            borderRadius: "50%",
            opacity: b.opacity,
            background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.7) 0%, rgba(168,218,220,0.3) 60%, transparent 100%)",
            border: "1.5px solid rgba(255,255,255,0.5)",
            boxShadow: "inset 1px 1px 3px rgba(255,255,255,0.6)",
            animation: `bubbleRise ${b.duration}s ${b.delay}s infinite ease-in`,
          }}
        />
      ))}
    </div>
  );
};

const WaveBottom = ({ fill }: { fill: string }) => (
  <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none">
    <svg viewBox="0 0 1440 72" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 72 }}>
      <path d="M0,36 C240,72 480,4 720,36 C960,68 1200,8 1440,36 L1440,72 L0,72 Z" fill={fill} />
    </svg>
  </div>
);

const WaveTop = ({ fill }: { fill: string }) => (
  <div className="absolute top-0 left-0 w-full overflow-hidden leading-none pointer-events-none">
    <svg viewBox="0 0 1440 72" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 72 }}>
      <path d="M0,28 C360,68 720,0 1080,34 C1260,52 1380,18 1440,28 L1440,0 L0,0 Z" fill={fill} />
    </svg>
  </div>
);

/* ─── Main ───────────────────────────────────────────────── */

export default function TiaRafaPet() {
  const formRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<FormState>({
    tutorName: "", petName: "", breed: "", service: "", date: "", shift: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const scrollToForm = () =>
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name as keyof FormState]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = (): boolean => {
    const e: Partial<FormState> = {};
    if (!form.tutorName.trim()) e.tutorName = "Informe seu nome";
    if (!form.petName.trim()) e.petName = "Informe o nome do pet";
    if (!form.breed.trim()) e.breed = "Informe a raça";
    if (!form.service) e.service = "Escolha um serviço";
    if (!form.date) e.date = "Escolha uma data";
    if (!form.shift) e.shift = "Escolha um turno";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    window.open(buildWhatsAppUrl(form), "_blank");
  };

  const today = new Date().toISOString().split("T")[0];

  const inputCls = (f: keyof FormState) =>
    `w-full rounded-2xl border-2 px-4 py-3 text-sm outline-none transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder:text-slate-300 text-[#555555] font-nunito ${errors[f]
      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
      : "border-[#A8DADC] focus:border-[#4EA8B8] focus:ring-2 focus:ring-[#A8DADC]/40"
    }`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Baloo+2:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #f0f9fa; }

        .font-baloo  { font-family: 'Baloo 2', cursive; }
        .font-nunito { font-family: 'Nunito', sans-serif; }

        @keyframes bubbleRise {
          0%   { transform: translateY(0)      scale(1);   opacity: 0.25; }
          40%  { transform: translateY(-38vh)  scale(1.08) translateX(6px); opacity: 0.25; }
          100% { transform: translateY(-95vh)  scale(0.75) translateX(-4px); opacity: 0; }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(26px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes drip {
          0%   { height: 0;    opacity: 1; }
          80%  { height: 20px; opacity: 1; }
          100% { height: 24px; opacity: 0; }
        }
        @keyframes ripplePulse {
          0%   { box-shadow: 0 0 0 0   rgba(78,168,184,0.45); }
          70%  { box-shadow: 0 0 0 16px rgba(78,168,184,0);    }
          100% { box-shadow: 0 0 0 0   rgba(78,168,184,0);    }
        }

        .fade-up  { animation: fadeUp 0.7s ease both; }
        .d1 { animation-delay: 0.15s; }
        .d2 { animation-delay: 0.30s; }
        .d3 { animation-delay: 0.45s; }
        .d4 { animation-delay: 0.60s; }

        .floating { animation: floatY 4s ease-in-out infinite; }

        .glass {
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1.5px solid rgba(255,255,255,0.72);
          box-shadow: 0 8px 32px rgba(78,168,184,0.12);
        }
        .glass-strong {
          background: rgba(255,255,255,0.78);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1.5px solid rgba(255,255,255,0.85);
          box-shadow: 0 12px 48px rgba(78,168,184,0.18);
        }

        .cta-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          background: linear-gradient(135deg, #F4C542 0%, #FFD84D 100%);
          color: #6B4A00;
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
          font-size: 0.9rem;
          border: none;
          border-radius: 9999px;
          cursor: pointer;
          box-shadow: 0 6px 24px rgba(244,197,66,0.45);
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
          text-decoration: none;
        }
        .cta-btn::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.28) 50%, transparent 100%);
          background-size: 200%;
          animation: shimmer 2.6s infinite;
        }
        .cta-btn:hover {
          background: linear-gradient(135deg, #D4A62F 0%, #F4C542 100%);
          transform: translateY(-2px) scale(1.025);
          box-shadow: 0 10px 32px rgba(244,197,66,0.55);
        }
        .cta-btn:active { transform: scale(0.97); }

        .wa-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          background: linear-gradient(135deg, #25D366, #128C7E);
          color: white;
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
          font-size: 0.9rem;
          border: none;
          border-radius: 9999px;
          cursor: pointer;
          box-shadow: 0 6px 24px rgba(37,211,102,0.35);
          transition: all 0.2s ease;
          text-decoration: none;
        }
        .wa-btn:hover {
          transform: translateY(-2px) scale(1.025);
          box-shadow: 0 10px 36px rgba(37,211,102,0.5);
        }
        .wa-btn:active { transform: scale(0.97); }

        .svc-card {
          border-radius: 24px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .svc-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 48px rgba(78,168,184,0.22) !important;
        }

        .gallery-wrap { overflow: hidden; border-radius: 20px; }
        .gallery-wrap img { transition: transform 0.5s ease; display: block; width: 100%; height: 100%; object-fit: cover; }
        .gallery-wrap:hover img { transform: scale(1.07); }
        .gallery-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(78,168,184,0.72) 0%, transparent 55%);
          opacity: 0; transition: opacity 0.3s;
          border-radius: 20px;
          display: flex; align-items: flex-end; padding: 12px;
        }
        .gallery-wrap:hover .gallery-overlay { opacity: 1; }

        .drop-el {
          width: 5px; height: 0; border-radius: 0 0 4px 4px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.7), transparent);
          animation: drip 2.6s ease-in infinite;
        }

        .ripple { animation: ripplePulse 2s infinite; }

        .tag-pill {
          display: inline-flex; align-items: center; gap: 6px;
          border-radius: 9999px; padding: 6px 14px;
          font-size: 0.75rem; font-weight: 700;
          background: rgba(168,218,220,0.28);
          color: #1e6e7a;
          border: 1px solid rgba(78,168,184,0.28);
          font-family: 'Nunito', sans-serif;
        }

        .nav-pill {
          font-family: 'Nunito', sans-serif;
          font-size: 0.85rem; font-weight: 700;
          color: rgba(255,255,255,0.82);
          text-decoration: none;
          transition: color 0.2s;
        }
        .nav-pill:hover { color: #FFD84D; }

        input, select {
        background-color: rgba(255,255,255,0.85) !important;
        color: #555555 !important;
        border: 2px solid #A8DADC !important;
        padding: 12px 16px !important;
        font-size: 0.88rem !important;
        font-family: 'Nunito', sans-serif !important;
        width: 100% !important;
        outline: none !important;
        border-radius: 16px !important;
        transition: border 0.2s !important;
        }
        input:focus, select:focus {
          border-color: #4EA8B8 !important;
          box-shadow: 0 0 0 3px rgba(168,218,220,0.35) !important;
        }
        input::placeholder {
          color: #aac8cc !important;
        }
        select option {
          background: white !important;
          c       olor: #555555 !important;
        }

        .section-badge {
          display: inline-flex; align-items: center; gap: 6px;
          border-radius: 9999px; padding: 6px 16px;
          font-size: 0.72rem; font-weight: 700;
          font-family: 'Nunito', sans-serif;
          text-transform: uppercase; letter-spacing: 0.06em;
        }

        .footer-social {
          width: 40px; height: 40px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(168,218,220,0.1);
          color: rgba(168,218,220,0.65);
          transition: all 0.2s;
          text-decoration: none;
        }
        .footer-social:hover { color: white; }
      `}</style>

      <div className="font-nunito">

        {/* ════════════════════════════
            HERO
        ════════════════════════════ */}
        <section
          style={{
            background: "linear-gradient(150deg, #3d9aab 0%, #4EA8B8 30%, #74C0C9 65%, #b4e2e5 100%)",
            position: "relative",
            overflow: "hidden",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <BubbleField count={20} />

          {/* drip decorations */}
          {[
            { top: 80, left: "12%", delay: "0s" },
            { top: 60, left: "72%", delay: "1.1s" },
            { top: 110, left: "52%", delay: "0.55s" },
          ].map((d, i) => (
            <div key={i} style={{ position: "absolute", top: d.top, left: d.left, opacity: 0.45 }}>
              <div className="drop-el" style={{ animationDelay: d.delay }} />
            </div>
          ))}

          {/* NAV */}
          <nav style={{ position: "relative", zIndex: 20, padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 960, margin: "0 auto", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#F4C542", boxShadow: "0 4px 14px rgba(244,197,66,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PawPrint size={21} color="white" fill="white" />
              </div>
              <div>
                <div className="font-baloo" style={{ color: "white", fontSize: "1.15rem", fontWeight: 800, lineHeight: 1 }}>
                  Tia Rafa<span style={{ color: "#FFD84D" }}> Pet</span>
                </div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.65rem" }}>Estética Animal</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <a href="#servicos" className="nav-pill" style={{ display: "none" }}>Serviços</a>
              <a href="#galeria" className="nav-pill" style={{ display: "none" }}>Galeria</a>
              <button onClick={scrollToForm} className="cta-btn" style={{ padding: "10px 22px", fontSize: "0.78rem" }}>
                📅 Agendar
              </button>
            </div>
          </nav>

          {/* HERO CONTENT */}
          <div style={{ position: "relative", zIndex: 10, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "20px 20px 120px", maxWidth: 680, margin: "0 auto", width: "100%" }}>

            <div className="floating fade-up" style={{
              width: 96, height: 96, borderRadius: "50%", marginBottom: 24,
              background: "rgba(255,255,255,0.22)",
              border: "2px solid rgba(255,255,255,0.5)",
              backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 46,
            }}>🐶</div>

            <div className="fade-up d1 section-badge" style={{ background: "rgba(255,255,255,0.28)", color: "white", backdropFilter: "blur(6px)", marginBottom: 20, border: "1px solid rgba(255,255,255,0.4)" }}>
              <MapPin size={12} /> Conjunto Pôr do Sol · Maceió – AL
            </div>

            <h1 className="fade-up d2 font-baloo" style={{
              color: "white",
              fontSize: "clamp(2rem, 8vw, 3.8rem)",
              lineHeight: 1.18,
              marginBottom: 18,
              textShadow: "0 4px 20px rgba(0,0,0,0.14)",
            }}>
              Seu pet limpo,{" "}
              <span style={{ color: "#FFD84D" }}>cheiroso</span>
              {" "}e feliz! 🐾
            </h1>

            <p className="fade-up d3 font-nunito" style={{ color: "rgba(255,255,255,0.88)", fontSize: "1.05rem", lineHeight: 1.68, maxWidth: 440, marginBottom: 32 }}>
              Banho e tosa com amor, carinho e produtos de qualidade. Atendimento acolhedor pertinho da sua casa!
            </p>

            <div className="fade-up d4" style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 440 }}>
              <button onClick={scrollToForm} className="cta-btn" style={{ padding: "16px 32px", fontSize: "0.95rem", width: "100%" }}>
                <Calendar size={19} />
                Agendar Horário Agora
              </button>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="wa-btn" style={{ padding: "14px 28px", fontSize: "0.9rem", width: "100%" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                Falar no WhatsApp
              </a>
            </div>

            <p className="font-nunito" style={{ marginTop: 20, color: "rgba(255,255,255,0.55)", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: 6 }}>
              <Star size={11} color="#FFD84D" fill="#FFD84D" />
              Banho a partir de <strong style={{ color: "white" }}>R$ 39,90</strong>
            </p>
          </div>

          <WaveBottom fill="#f0f9fa" />
        </section>

        {/* ════════════════════════════
            SOBRE
        ════════════════════════════ */}
        <section style={{ background: "#f0f9fa", padding: "80px 20px", position: "relative" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div className="glass-strong" style={{ borderRadius: 28, padding: "40px 36px", display: "flex", flexDirection: "column", gap: 24, alignItems: "center" }}>
              {/* avatar */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div className="ripple" style={{ width: 110, height: 110, borderRadius: "50%", background: "linear-gradient(135deg, #74C0C9, #4EA8B8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, boxShadow: "0 8px 28px rgba(78,168,184,0.35)" }}>
                  🛁
                </div>
                {[0, 1, 2, 3].map((i) => {
                  const positions = [{ top: "8%", left: "90%" }, { top: "60%", left: "94%" }, { top: "78%", left: "-18%" }, { top: "16%", left: "-22%" }];
                  const sizes = [10, 14, 10, 8];
                  return (
                    <div key={i} style={{ position: "absolute", top: positions[i].top, left: positions[i].left, width: sizes[i], height: sizes[i], borderRadius: "50%", background: "rgba(168,218,220,0.4)", border: "1px solid rgba(78,168,184,0.4)", animation: `floatY ${3 + i}s ease-in-out infinite`, animationDelay: `${i * 0.5}s` }} />
                  );
                })}
              </div>

              <div style={{ textAlign: "center" }}>
                <div className="section-badge" style={{ background: "#A8DADC", color: "#1a6b78", marginBottom: 12 }}>
                  ✦ Sobre a Tia Rafa
                </div>
                <h2 className="font-baloo" style={{ color: "#2d7a85", fontSize: "1.9rem", marginBottom: 12 }}>
                  Cuidado com amor e frescor ✨
                </h2>
                <p className="font-nunito" style={{ color: "#555555", lineHeight: 1.78, fontSize: "0.95rem", maxWidth: 540, margin: "0 auto 20px" }}>
                  Aqui no <strong style={{ color: "#4EA8B8" }}>Banho e Tosa Tia Rafa</strong>, cada petinho é recebido com todo o carinho do mundo. Com anos de experiência em estética animal, a Rafa usa produtos de qualidade premium, ambiente limpo e acolhedor — porque a gente sabe que você confia o que tem de mais precioso às nossas mãos.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                  {[{ e: "💧", t: "Produtos premium" }, { e: "❤️", t: "Ambiente tranquilo" }, { e: "⏰", t: "Pontualidade" }, { e: "🌸", t: "Perfume especial" }].map((tag) => (
                    <span key={tag.t} className="tag-pill">{tag.e} {tag.t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════
            SERVIÇOS
        ════════════════════════════ */}
        <section
          id="servicos"
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "0",
            background: "linear-gradient(180deg, #4EA8B8 0%, #74C0C9 50%, #A8DADC 100%)",
          }}
        >
          <WaveTop fill="#f0f9fa" />
          <BubbleField count={12} />

          <div style={{ position: "relative", zIndex: 10, maxWidth: 900, margin: "0 auto", padding: "100px 20px 80px" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div className="section-badge" style={{ background: "rgba(255,255,255,0.32)", color: "white", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.45)", marginBottom: 14 }}>
                <ShowerHead size={13} /> Nossos Serviços
              </div>
              <h2 className="font-baloo" style={{ color: "white", fontSize: "2.2rem", textShadow: "0 2px 12px rgba(0,0,0,0.1)" }}>
                O que oferecemos
              </h2>
              <p className="font-nunito" style={{ color: "rgba(255,255,255,0.72)", marginTop: 8, fontSize: "0.85rem" }}>
                Preços variam conforme porte e raça. Consulte!
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
              {SERVICES.map((svc) => (
                <div
                  key={svc.name}
                  className={`svc-card ${svc.highlight ? "" : "glass"}`}
                  style={svc.highlight ? {
                    background: "linear-gradient(135deg, #F4C542 0%, #FFD84D 100%)",
                    border: "2px solid rgba(255,255,255,0.65)",
                    boxShadow: "0 12px 40px rgba(244,197,66,0.42)",
                    padding: 24,
                    position: "relative",
                  } : { padding: 24, position: "relative" }}
                >
                  {svc.highlight && (
                    <div className="font-nunito" style={{ position: "absolute", top: -14, right: 18, background: "#4EA8B8", color: "white", borderRadius: 9999, padding: "4px 12px", fontSize: "0.7rem", fontWeight: 800, display: "flex", alignItems: "center", gap: 4, boxShadow: "0 4px 12px rgba(78,168,184,0.4)" }}>
                      <Star size={11} fill="white" color="white" /> Mais pedido
                    </div>
                  )}
                  <div style={{ width: 48, height: 48, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, background: svc.highlight ? "rgba(255,255,255,0.35)" : "rgba(78,168,184,0.15)", color: svc.highlight ? "#6B4A00" : "#4EA8B8" }}>
                    {svc.icon}
                  </div>
                  <h3 className="font-baloo" style={{ color: svc.highlight ? "#6B4A00" : "#2d7a85", fontSize: "1.25rem", marginBottom: 8 }}>
                    {svc.name}
                  </h3>
                  <p className="font-nunito" style={{ color: svc.highlight ? "#7A5400" : "#555555", fontSize: "0.88rem", lineHeight: 1.65, marginBottom: 16 }}>
                    {svc.description}
                  </p>
                  <div className="font-nunito" style={{ display: "inline-block", borderRadius: 9999, padding: "6px 16px", fontWeight: 800, fontSize: "0.9rem", background: svc.highlight ? "rgba(255,255,255,0.4)" : "rgba(78,168,184,0.15)", color: svc.highlight ? "#6B4A00" : "#4EA8B8" }}>
                    {svc.price}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <WaveBottom fill="#f0f9fa" />
        </section>

        {/* ════════════════════════════
            GALERIA
        ════════════════════════════ */}
        <section id="galeria" style={{ background: "#f0f9fa", padding: "80px 20px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div className="section-badge" style={{ background: "#A8DADC", color: "#1a6b78", marginBottom: 14 }}>
                📸 Nossos Trabalhos
              </div>
              <h2 className="font-baloo" style={{ color: "#2d7a85", fontSize: "2.2rem" }}>
                Galeria de Pets
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
              {GALLERY_IMAGES.map((img) => (
                <div key={img.alt} className="gallery-wrap" style={{ position: "relative", aspectRatio: "1", border: "2px solid rgba(168,218,220,0.5)" }}>
                  <img src={img.src} alt={img.alt} loading="lazy" />
                  <div className="gallery-overlay">
                    <span className="font-nunito" style={{ color: "white", fontSize: "0.78rem", fontWeight: 700 }}>{img.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════
            FORMULÁRIO
        ════════════════════════════ */}
        <section
          ref={formRef}
          id="agendamento"
          style={{
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(150deg, #3d9aab 0%, #4EA8B8 35%, #74C0C9 70%, #A8DADC 100%)",
          }}
        >
          <WaveTop fill="#f0f9fa" />
          <BubbleField count={16} />

          <div style={{ position: "relative", zIndex: 10, maxWidth: 520, margin: "0 auto", padding: "100px 20px 80px" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div className="section-badge" style={{ background: "rgba(255,255,255,0.32)", color: "white", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.45)", marginBottom: 16 }}>
                <Calendar size={13} /> Agendamento pelo WhatsApp
              </div>
              <h2 className="font-baloo" style={{ color: "white", fontSize: "2.2rem", textShadow: "0 2px 12px rgba(0,0,0,0.1)" }}>
                Agende agora mesmo! 🐾
              </h2>
              <p className="font-nunito" style={{ color: "rgba(255,255,255,0.75)", marginTop: 8, fontSize: "0.88rem" }}>
                Preencha e confirme direto com a Tia Rafa no WhatsApp.
              </p>
            </div>

            <div className="glass-strong" style={{ borderRadius: 28, padding: "32px 28px", display: "flex", flexDirection: "column", gap: 18 }}>

              {/* Tutor */}
              <div>
                <label className="font-nunito" style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#4EA8B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                  👤 Seu nome (Tutor)
                </label>
                <input type="text" name="tutorName" value={form.tutorName} onChange={handleChange} placeholder="Ex: Maria Fernanda" className={inputCls("tutorName")} />
                {errors.tutorName && <p className="font-nunito" style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: 4 }}>{errors.tutorName}</p>}
              </div>

              {/* Pet + Raça */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="font-nunito" style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#4EA8B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                    🐶 Nome do Pet
                  </label>
                  <input type="text" name="petName" value={form.petName} onChange={handleChange} placeholder="Ex: Bolinha" className={inputCls("petName")} />
                  {errors.petName && <p className="font-nunito" style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: 4 }}>{errors.petName}</p>}
                </div>
                <div>
                  <label className="font-nunito" style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#4EA8B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                    🦴 Raça
                  </label>
                  <input type="text" name="breed" value={form.breed} onChange={handleChange} placeholder="Ex: Shih-tzu" className={inputCls("breed")} />
                  {errors.breed && <p className="font-nunito" style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: 4 }}>{errors.breed}</p>}
                </div>
              </div>

              {/* Serviço */}
              <div>
                <label className="font-nunito" style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#4EA8B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                  ✂️ Serviço desejado
                </label>
                <select name="service" value={form.service} onChange={handleChange} className={inputCls("service")}>
                  <option value="">Selecione um serviço…</option>
                  {SERVICES_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.service && <p className="font-nunito" style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: 4 }}>{errors.service}</p>}
              </div>

              {/* Data + Turno */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="font-nunito" style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#4EA8B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                    📅 Data
                  </label>
                  <input type="date" name="date" value={form.date} min={today} onChange={handleChange} className={inputCls("date")} />
                  {errors.date && <p className="font-nunito" style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: 4 }}>{errors.date}</p>}
                </div>
                <div>
                  <label className="font-nunito" style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#4EA8B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                    🕐 Turno
                  </label>
                  <select name="shift" value={form.shift} onChange={handleChange} className={inputCls("shift")}>
                    <option value="">Selecione…</option>
                    {SHIFT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.shift && <p className="font-nunito" style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: 4 }}>{errors.shift}</p>}
                </div>
              </div>

              {/* Submit */}
              <button type="button" onClick={handleSubmit} className="wa-btn" style={{ width: "100%", padding: "16px 24px", fontSize: "0.95rem", marginTop: 6 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                Confirmar Agendamento pelo WhatsApp
              </button>

              <p className="font-nunito" style={{ textAlign: "center", color: "#4EA8B8", fontSize: "0.75rem" }}>
                Você será redirecionado para o WhatsApp com a mensagem já preenchida 💧
              </p>
            </div>
          </div>

          <WaveBottom fill="#1e3a3f" />
        </section>

        {/* ════════════════════════════
            FOOTER
        ════════════════════════════ */}
        <footer style={{ background: "#1e3a3f", padding: "56px 20px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 40, justifyContent: "space-between" }}>

            {/* Brand */}
            <div style={{ minWidth: 220 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#F4C542", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <PawPrint size={20} color="white" fill="white" />
                </div>
                <div>
                  <div className="font-baloo" style={{ color: "white", fontSize: "1.1rem", fontWeight: 800, lineHeight: 1 }}>
                    Tia Rafa<span style={{ color: "#FFD84D" }}> Pet</span>
                  </div>
                  <div style={{ color: "rgba(168,218,220,0.45)", fontSize: "0.62rem" }}>Estética Animal</div>
                </div>
              </div>
              <p className="font-nunito" style={{ color: "rgba(168,218,220,0.65)", fontSize: "0.85rem", lineHeight: 1.72, maxWidth: 240, marginBottom: 16 }}>
                Banho e tosa com muito amor e cuidado, pertinho da sua casa.
              </p>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <MapPin size={15} color="#74C0C9" style={{ marginTop: 2, flexShrink: 0 }} />
                <span className="font-nunito" style={{ color: "rgba(168,218,220,0.65)", fontSize: "0.82rem", lineHeight: 1.65 }}>
                  Rua das Palmeiras, 42 · Conj. Pôr do Sol<br />Maceió – AL
                </span>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-nunito" style={{ color: "white", fontSize: "0.88rem", fontWeight: 800, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>Serviços</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {SERVICES_OPTIONS.map((s) => (
                  <button key={s} onClick={scrollToForm} className="font-nunito" style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", color: "rgba(168,218,220,0.65)", fontSize: "0.85rem", padding: 0, transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#74C0C9")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(168,218,220,0.65)")}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-nunito" style={{ color: "white", fontSize: "0.88rem", fontWeight: 800, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>Redes Sociais</h4>
              <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                // Instagram
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>

// Facebook
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="footer-social" onMouseEnter={(e) => (e.currentTarget.style.background = "#25D366")} onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(168,218,220,0.1)")}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                </a>
              </div>
              <p className="font-nunito" style={{ color: "rgba(168,218,220,0.38)", fontSize: "0.75rem", lineHeight: 1.6 }}>
                © {new Date().getFullYear()} Tia Rafa Pet<br />Todos os direitos reservados.
              </p>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
