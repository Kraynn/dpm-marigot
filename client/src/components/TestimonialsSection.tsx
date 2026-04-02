/**
 * DPM Marigot – Testimonials / Social Proof Section
 * Design: Dark slate-900 band. White text. Star ratings. Trust indicators.
 */
import { Star, ArrowRight, Shield, MapPin, Award } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const testimonials = [
  {
    name: "Marie L.",
    role: "Propriétaire",
    text: "Travail impeccable et rapide. Les murs sont parfaitement lisses, je suis ravie du résultat. Équipe sérieuse et ponctuelle.",
    stars: 5,
    initial: "M",
  },
  {
    name: "Sébastien R.",
    role: "Investisseur immobilier",
    text: "Très professionnel et à l'écoute. Ils ont réalisé la rénovation complète d'un appartement en un temps record, sans mauvaises surprises.",
    stars: 5,
    initial: "S",
  },
  {
    name: "Aline D.",
    role: "Particulière après sinistre",
    text: "Résultat au-dessus de mes attentes. Après un dégât des eaux, ils ont tout remis en état rapidement. Je recommande vivement.",
    stars: 5,
    initial: "A",
  },
];

const trustItems = [
  { icon: <MapPin size={20} />, label: "Entreprise locale", desc: "Basée en Île-de-France" },
  { icon: <Award size={20} />, label: "Expérience terrain", desc: "Plus de 10 ans de métier" },
  { icon: <Shield size={20} />, label: "Travail garanti", desc: "Satisfaction assurée" },
];

export default function TestimonialsSection() {
  const { ref, visible } = useScrollReveal();

  const handleCTA = () => {
    const el = document.querySelector("#contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="avis" className="bg-slate-900 py-20 lg:py-28">
      <div className="container" ref={ref}>
        {/* Header */}
        <div
          className="mb-12"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div className="section-label text-blue-400 flex items-center gap-2 mb-3">
            <span className="w-6 h-0.5 bg-blue-400 inline-block" />
            Ce que disent nos clients
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white" style={{ fontFamily: "Sora, sans-serif" }}>
            Ils nous ont fait confiance
          </h2>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-colors"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`,
              }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(t.stars)].map((_, j) => (
                  <Star key={j} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              {/* Quote */}
              <p className="text-slate-300 text-sm leading-relaxed mb-5" style={{ fontFamily: "Inter, sans-serif" }}>
                "{t.text}"
              </p>
              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: "oklch(0.45 0.18 264)" }}
                >
                  {t.initial}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm" style={{ fontFamily: "Sora, sans-serif" }}>{t.name}</p>
                  <p className="text-slate-400 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div
          className="grid sm:grid-cols-3 gap-6 mb-12 pt-10 border-t border-white/10"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.6s ease 0.4s",
          }}
        >
          {trustItems.map((item) => (
            <div key={item.label} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-700/30 flex items-center justify-center text-blue-400">
                {item.icon}
              </div>
              <div>
                <p className="text-white font-semibold text-sm" style={{ fontFamily: "Sora, sans-serif" }}>{item.label}</p>
                <p className="text-slate-400 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button onClick={handleCTA} className="cta-btn text-base">
            Obtenir mon devis gratuit
            <ArrowRight size={18} className="cta-arrow" />
          </button>
        </div>
      </div>
    </section>
  );
}
