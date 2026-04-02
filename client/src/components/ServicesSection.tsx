/**
 * DPM Marigot – Services Section
 * Design: White background. 2×2 card grid with real images. Left-border hover accent.
 * Each card: icon + image + title + description + sub-items.
 */
import { ArrowRight, Paintbrush2, Palette, Hammer, Droplets } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const services = [
  {
    icon: <Paintbrush2 size={22} />,
    title: "Peinture",
    description: "Finitions haut de gamme pour tous vos espaces intérieurs et extérieurs.",
    items: ["Murs, plafonds, façades", "Intérieur / extérieur", "Préparation et enduit"],
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496267502/g5fSpueUDo8xsbtP8Baecz/service-peinture-iAB6bWR9tKdsGDfdWWaSxP.webp",
    color: "oklch(0.45 0.18 264)",
  },
  {
    icon: <Palette size={22} />,
    title: "Décoration",
    description: "Conseils personnalisés pour créer des intérieurs qui vous ressemblent.",
    items: ["Conseils couleurs", "Revêtements muraux", "Aménagement d'espace"],
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496267502/g5fSpueUDo8xsbtP8Baecz/service-decoration-faYDArSFLByUovzR9uDPX5.webp",
    color: "oklch(0.50 0.16 280)",
  },
  {
    icon: <Hammer size={22} />,
    title: "Menuiserie",
    description: "Pose et rénovation de menuiseries sur mesure avec des finitions soignées.",
    items: ["Pose et rénovation", "Finitions sur mesure", "Boiseries et habillages"],
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496267502/g5fSpueUDo8xsbtP8Baecz/service-menuiserie-ewzikyQBBrJbeNUgrGw8Nx.webp",
    color: "oklch(0.42 0.16 248)",
  },
  {
    icon: <Droplets size={22} />,
    title: "Rénovation après sinistre",
    description: "Remise en état rapide après dégâts des eaux. Intervention d'urgence.",
    items: ["Dégâts des eaux", "Remise en état rapide", "Coordination assurance"],
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496267502/g5fSpueUDo8xsbtP8Baecz/service-sinistre-SXZD9SFrZrdzXURE7U3npt.webp",
    color: "oklch(0.48 0.18 220)",
  },
];

export default function ServicesSection() {
  const { ref, visible } = useScrollReveal();

  const handleCTA = () => {
    const el = document.querySelector("#contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="services" className="bg-slate-50 py-20 lg:py-28">
      <div className="container" ref={ref}>
        {/* Header */}
        <div
          className="mb-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div>
            <div className="section-label flex items-center gap-2 mb-3">
              <span className="w-6 h-0.5 bg-blue-700 inline-block" />
              Nos prestations
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900" style={{ fontFamily: "Sora, sans-serif" }}>
              Des services complets<br />pour votre habitat
            </h2>
          </div>
          <p className="text-slate-600 max-w-sm text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
            De la peinture à la menuiserie, nous prenons en charge tous vos travaux avec le même niveau d'exigence.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          {services.map((service, i) => (
            <div
              key={service.title}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 hover:border-blue-200"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`,
              }}
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Icon badge */}
                <div
                  className="absolute top-3 left-3 w-9 h-9 rounded-lg flex items-center justify-center text-white shadow-md"
                  style={{ background: service.color }}
                >
                  {service.icon}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Left border accent on hover */}
                <div className="flex gap-4">
                  <div
                    className="w-0.5 rounded-full flex-shrink-0 transition-all duration-300 group-hover:opacity-100 opacity-0"
                    style={{ background: service.color, minHeight: "100%" }}
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-1" style={{ fontFamily: "Sora, sans-serif" }}>
                      {service.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
                      {service.description}
                    </p>
                    <ul className="space-y-1">
                      {service.items.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-xs text-slate-500" style={{ fontFamily: "Inter, sans-serif" }}>
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: service.color }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
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
