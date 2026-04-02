/**
 * DPM Marigot – Why Choose Us Section
 * Design: White background. Left-aligned. Large feature list with icons. Stats row.
 */
import { ArrowRight, CheckCircle2, Clock, Sparkles, Users, Brush, HardHat } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const features = [
  { icon: <Sparkles size={20} />, title: "Expertise dans le bâtiment", desc: "Des artisans qualifiés avec des années d'expérience terrain." },
  { icon: <Users size={20} />, title: "Accompagnement personnalisé", desc: "Un interlocuteur dédié du devis à la livraison." },
  { icon: <Brush size={20} />, title: "Travail soigné", desc: "Finitions haut de gamme et attention aux détails." },
  { icon: <Clock size={20} />, title: "Respect des délais", desc: "Nous tenons nos engagements, sans mauvaises surprises." },
  { icon: <HardHat size={20} />, title: "Chantier propre", desc: "Protection de vos biens et nettoyage en fin de chantier." },
  { icon: <CheckCircle2 size={20} />, title: "Devis gratuit et transparent", desc: "Pas de frais cachés. Vous savez exactement ce que vous payez." },
];

const stats = [
  { value: "+10", label: "Ans d'expérience" },
  { value: "100%", label: "Clients satisfaits" },
  { value: "24h", label: "Délai de réponse" },
  { value: "0€", label: "Devis gratuit" },
];

export default function WhyUsSection() {
  const { ref, visible } = useScrollReveal();

  const handleCTA = () => {
    const el = document.querySelector("#contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: text */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-24px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <div className="section-label flex items-center gap-2 mb-3">
              <span className="w-6 h-0.5 bg-blue-700 inline-block" />
              Pourquoi nous choisir
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4" style={{ fontFamily: "Sora, sans-serif" }}>
              L'artisan local<br />
              <span className="text-blue-700">fiable et professionnel</span>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-8 max-w-md" style={{ fontFamily: "Inter, sans-serif" }}>
              Chez DPM Marigot, nous mettons un point d'honneur à offrir un service irréprochable, de la première prise de contact jusqu'à la livraison de votre chantier.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className="flex gap-3"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(16px)",
                    transition: `opacity 0.5s ease ${0.1 + i * 0.08}s, transform 0.5s ease ${0.1 + i * 0.08}s`,
                  }}
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700 flex-shrink-0 mt-0.5">
                    {f.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm" style={{ fontFamily: "Sora, sans-serif" }}>{f.title}</p>
                    <p className="text-slate-500 text-xs mt-0.5 leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleCTA} className="cta-btn text-base">
              Obtenir mon devis gratuit
              <ArrowRight size={18} className="cta-arrow" />
            </button>
          </div>

          {/* Right: stats */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(24px)",
              transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="bg-slate-900 rounded-2xl p-6 flex flex-col justify-between"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "scale(1)" : "scale(0.95)",
                    transition: `opacity 0.5s ease ${0.3 + i * 0.1}s, transform 0.5s ease ${0.3 + i * 0.1}s`,
                  }}
                >
                  <p
                    className="text-4xl font-extrabold text-white mb-2"
                    style={{ fontFamily: "Sora, sans-serif" }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-slate-400 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Highlight box */}
            <div className="mt-4 bg-blue-700 rounded-2xl p-6 text-white">
              <p className="text-lg font-bold mb-1" style={{ fontFamily: "Sora, sans-serif" }}>Zéro stress pour vous</p>
              <p className="text-blue-100 text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                Nous gérons tout : de la préparation du chantier à la livraison finale. Vous n'avez qu'à profiter du résultat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
