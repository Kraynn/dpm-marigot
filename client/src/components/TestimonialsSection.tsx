/**
 * DPM Marigot – « Ils nous ont fait confiance »
 * Direction « Le Nuancier » : bande ocre, cartes à ombre dure.
 *
 * Réécrit le 2026-08-28. La version précédente affichait trois avis nominatifs
 * (« Marie L. », « Sébastien R. », « Aline D. ») avec 5 étoiles, présentés comme
 * réels. Ils n'existent pas : la seule source publique est la page Facebook du
 * client, 87 abonnés, 1 avis, pas encore noté. Ils sont donc supprimés, pas
 * remplacés par d'autres avis d'exemple.
 * Les trois repères de confiance ne contiennent plus que des faits vérifiables
 * (l'ancien « Plus de 10 ans de métier » n'était sourcé nulle part).
 */
import { ArrowRight, Facebook, MapPin, Droplets, Users } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const FACEBOOK_URL = "https://www.facebook.com/dpmmarigot";

const reperes = [
  {
    icon: <MapPin size={20} />,
    label: "Showroom au Mesnil-Saint-Denis",
    desc: "Ouvert au public, collections visibles sur place",
  },
  {
    icon: <Droplets size={20} />,
    label: "Remise en état après sinistre",
    desc: "Dégât des eaux, du diagnostic aux finitions",
  },
  {
    icon: <Users size={20} />,
    label: "Un seul interlocuteur",
    desc: "Peinture, décoration et menuiserie par la même équipe",
  },
];

export default function TestimonialsSection() {
  const { ref, visible } = useScrollReveal();

  const handleCTA = () => {
    const el = document.querySelector("#contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="avis" className="bg-ocre border-y-[3px] border-encre py-20 lg:py-24">
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
            <p className="section-num mb-2">Ils nous ont fait confiance</p>
            <h2 className="text-4xl lg:text-[2.9rem] leading-[1.06] text-encre">
              Nos avis, tels quels.
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-7 mb-14">
          <div
            className="card-hard card-hard-prusse p-7"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
            }}
          >
            <h3 className="text-2xl text-encre mb-3">Page Facebook · 87 abonnés</h3>
            <p className="text-encre/75 text-sm leading-relaxed">
              Nous y publions les chantiers au fur et à mesure : photos avant / après et détail des
              interventions. C'est l'endroit pour juger notre travail sur pièces.
            </p>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 font-bold text-sm text-encre border-b-[3px] border-terre pb-1 hover:text-terre transition-colors"
            >
              <Facebook size={16} />
              Voir nos publications
            </a>
          </div>

          <div
            className="bg-prusse text-creme border-[3px] border-encre shadow-[6px_6px_0_var(--color-encre)] p-7"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.6s ease 0.22s, transform 0.6s ease 0.22s",
            }}
          >
            <h3 className="text-2xl text-creme mb-3">Vous avez fait appel à nous ?</h3>
            <p className="text-creme/80 text-sm leading-relaxed">
              Chaque retour compte et aide les prochains clients à se décider. Un mot sur notre page
              Facebook nous rend service.
            </p>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 font-bold text-sm text-creme border-b-[3px] border-ocre pb-1 hover:text-ocre transition-colors"
            >
              <Facebook size={16} />
              Laisser un avis
            </a>
          </div>
        </div>

        <div
          className="grid sm:grid-cols-3 gap-7 pt-10 border-t-[3px] border-encre"
          style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s ease 0.4s" }}
        >
          {reperes.map((item) => (
            <div key={item.label} className="flex gap-4">
              <span className="w-11 h-11 bg-encre text-ocre flex items-center justify-center shrink-0">
                {item.icon}
              </span>
              <div>
                <p className="font-bold text-encre text-sm leading-snug">{item.label}</p>
                <p className="text-encre/65 text-xs mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <button onClick={handleCTA} className="cta-btn text-base">
            Demander un devis
            <ArrowRight size={18} className="cta-arrow" />
          </button>
        </div>
      </div>
    </section>
  );
}
