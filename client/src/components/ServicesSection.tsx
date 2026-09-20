/**
 * DPM Marigot – Services
 * Direction « Le Nuancier » : quatre cartes à bordure franche et ombre dure,
 * une teinte du nuancier par métier.
 *
 * Images : auto-hébergées dans client/public/images/services/, recadrées depuis les
 * photos de chantier réelles de client/public/images/realisations/. Elles étaient
 * servies par un CDN externe (d2xsxph8kpxj0f.cloudfront.net) qui répond 403 depuis :
 * ne jamais réintroduire de dépendance d'image hors du dépôt.
 */
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const FALLBACK_IMAGE = "/images/services/placeholder.jpg";

const services = [
  {
    tag: "Peinture",
    title: "Peinture intérieure et extérieure",
    description:
      "Préparation des supports, dépose de papier peint, reprise des fissures, finitions mates ou satinées.",
    items: ["Murs, plafonds, façades", "Enduit et ratissage", "Intérieur / extérieur"],
    image: "/images/services/peinture.jpg",
    tagClass: "bg-terre text-white",
    puce: "bg-terre",
  },
  {
    tag: "Décoration",
    title: "Sols & murs",
    description:
      "Revêtements, papiers peints, harmonies de couleurs. Les collections sont consultables au showroom.",
    items: ["Conseils couleurs", "Revêtements muraux", "Revêtements de sols"],
    image: "/images/services/decoration.jpg",
    tagClass: "bg-prusse text-white",
    puce: "bg-prusse",
  },
  {
    tag: "Menuiserie",
    title: "Menuiserie",
    description:
      "Habillages, plinthes, aménagements sur mesure et reprises d'ajustement après travaux.",
    items: ["Pose et rénovation", "Boiseries et habillages", "Finitions sur mesure"],
    image: "/images/services/menuiserie.jpg",
    tagClass: "bg-olive text-white",
    puce: "bg-olive",
  },
  {
    tag: "Sinistre",
    title: "Après un dégât des eaux",
    description:
      "Remise en état complète après sinistre : plafonds et murs touchés, dépose des revêtements, finitions.",
    items: ["Dégâts des eaux", "Reprise des supports", "Suivi du dossier assurance"],
    image: "/images/services/sinistre.jpg",
    tagClass: "bg-ocre text-encre",
    puce: "bg-ocre",
  },
];

export default function ServicesSection() {
  const { ref, visible } = useScrollReveal();

  const handleCTA = () => {
    const el = document.querySelector("#contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="services" className="bg-creme py-20 lg:py-24 border-b-[3px] border-encre">
      <div className="container" ref={ref}>
        <div
          className="mb-12"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div>
            <p className="section-num mb-2">Nos métiers</p>
            <h2 className="text-4xl lg:text-[2.9rem] leading-[1.06] text-encre max-w-[16ch]">
              Quatre savoir-faire, un seul interlocuteur.
            </h2>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service, i) => (
            <article
              key={service.title}
              className="card-hard flex flex-col"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`,
              }}
            >
              <div className="h-40 overflow-hidden border-b-[3px] border-encre">
                <img
                  src={service.image}
                  alt={`${service.title} — chantier réalisé par DPM Marigot`}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (img.dataset.fallback) return;
                    img.dataset.fallback = "1";
                    img.src = FALLBACK_IMAGE;
                  }}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5 flex flex-col gap-3 grow">
                <span
                  className={`self-start text-[11px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 ${service.tagClass}`}
                >
                  {service.tag}
                </span>
                <h3 className="text-[1.35rem] leading-tight text-encre">{service.title}</h3>
                <p className="text-encre/70 text-sm leading-relaxed">{service.description}</p>
                <ul className="mt-auto pt-2 flex flex-col gap-1.5">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-encre/60">
                      <span className={`w-1.5 h-1.5 shrink-0 ${service.puce}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <button onClick={handleCTA} className="cta-btn text-base">
          Demander un devis
          <ArrowRight size={18} className="cta-arrow" />
        </button>
      </div>
    </section>
  );
}
