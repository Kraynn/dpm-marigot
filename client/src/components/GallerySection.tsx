/**
 * DPM Marigot – Before/After Gallery Section
 * Design: White background. Interactive before/after slider. Projecting the client.
 */
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowRight } from "lucide-react";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663496267502/g5fSpueUDo8xsbtP8Baecz/hero-renovation-EQVCsSf3c94z2gDt9hFLyg.webp";
const PEINTURE_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663496267502/g5fSpueUDo8xsbtP8Baecz/service-peinture-iAB6bWR9tKdsGDfdWWaSxP.webp";
const SINISTRE_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663496267502/g5fSpueUDo8xsbtP8Baecz/service-sinistre-SXZD9SFrZrdzXURE7U3npt.webp";

const gallery = [
  {
    label: "Rénovation complète",
    image: HERO_IMAGE,
    tag: "Peinture + Menuiserie",
  },
  {
    label: "Remise en état peinture",
    image: PEINTURE_IMAGE,
    tag: "Peinture intérieure",
  },
  {
    label: "Après dégât des eaux",
    image: SINISTRE_IMAGE,
    tag: "Sinistre",
  },
];

export default function GallerySection() {
  const { ref, visible } = useScrollReveal();

  const handleCTA = () => {
    const el = document.querySelector("#contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="realisations" className="bg-white py-20 lg:py-28">
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
          <div className="section-label flex items-center gap-2 mb-3">
            <span className="w-6 h-0.5 bg-blue-700 inline-block" />
            Nos réalisations
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900" style={{ fontFamily: "Sora, sans-serif" }}>
            Avant / Après —<br />
            <span className="text-blue-700">voyez la différence</span>
          </h2>
          <p className="mt-3 text-slate-600 max-w-lg text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
            Chaque chantier est une transformation. Découvrez quelques-unes de nos réalisations récentes.
          </p>
        </div>

        {/* Gallery grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {gallery.map((item, i) => (
            <div
              key={item.label}
              className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`,
              }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
                {/* Tag */}
                <div className="absolute top-3 right-3">
                  <span className="bg-blue-700/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm" style={{ fontFamily: "Sora, sans-serif" }}>
                    {item.tag}
                  </span>
                </div>
                {/* Label */}
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-bold text-base" style={{ fontFamily: "Sora, sans-serif" }}>{item.label}</p>
                </div>
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
