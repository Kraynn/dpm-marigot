/**
 * DPM Marigot – Le showroom / pourquoi nous
 * Direction « Le Nuancier ».
 *
 * Réécrit le 2026-08-28. L'ancienne version affichait quatre chiffres dont deux
 * inventés : « +10 ans d'expérience » et « 100 % clients satisfaits ». Ils sont
 * remplacés par le seul atout réellement vérifiable et le plus sous-exploité du
 * site : le showroom ouvert au public au Mesnil-Saint-Denis.
 * Copie passée au stop-slop : plus de « nous mettons un point d'honneur »,
 * « service irréprochable », « zéro stress », « entre de bonnes mains ».
 *
 * 2026-09-21 : les horaires entrent ici, à côté de l'adresse. Source =
 * l'affiche du client (assets/partenaires et services.png), qui porte
 * « Ouverture : du mardi au vendredi de 9h00 à 18h30 (*sauf RDV les mercredi
 * et vendredi) ». Seule la plage est publiée : la parenthèse est ambiguë
 * (jours fermés ? sur rendez-vous seulement ?) et part en clarification dans
 * le mail du 22/09. Lundi et samedi ne sont pas mentionnés par l'affiche, donc
 * ils ne sont pas annoncés — ni ouverts, ni fermés.
 * La phrase « Venez nous rendre visite, sans rendez-vous » est retirée : elle
 * contredisait cette parenthèse. Elle est remplacée par le point relais colis,
 * l'autre moitié de l'affiche.
 *
 * 2026-09-21, second passage : la section et la bannière échangent leur
 * contenu, à la demande de Silva. **L'adresse et les horaires remontent en
 * bannière** — c'est ce qu'un visiteur de commerce cherche en premier — et
 * cette section reçoit en échange le texte de présentation des métiers et les
 * badges de réassurance. Elle gagne aussi l'id `#showroom` : le lien
 * « Showroom » de l'en-tête et le bouton « Visiter le showroom » de la bannière
 * pointaient jusqu'ici sur la carte, en bas de page ; ils arrivent maintenant
 * ici, où le showroom est réellement décrit et montré.
 *
 * 2026-09-21, troisième passage : le bandeau des partenaires devient le pied
 * de cette section (voir PartenairesBand.tsx). Plus de padding bas ici.
 */
import { ArrowRight, Phone } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import PartenairesBand from "@/components/PartenairesBand";

// Le 2026-09-19 : la vraie devanture remplace une photo d'intérieur générique.
// La section parle du showroom au 92 avenue Habert de Montmort, elle montre donc
// la vitrine et son enseigne, pas un exemple de décoration.
const PHOTO_SHOWROOM = "/images/showroom-devanture.webp";

// Les badges de réassurance, descendus de la bannière le 2026-09-21.
// Rangés en deux lignes imposées (demande de Silva, même jour) : le lieu
// d'abord, puis le devis suivi des spécialités. Chaque ligne peut encore
// passer à la ligne sur un écran étroit.
const faits = [
  [
    { label: "Showroom ouvert au public", fort: true },
    { label: "Point relais colis", fort: false },
  ],
  [
    { label: "Devis gratuit", fort: false },
    { label: "Spécialiste dégât des eaux", fort: false },
    { label: "Sols & murs", fort: false },
  ],
];

const engagements = [
  {
    title: "Showroom ouvert au public",
    desc: "Les collections de revêtements de sols et de murs se regardent et se comparent sur place.",
  },
  {
    title: "Un seul interlocuteur",
    desc: "Du devis à la dernière finition, c'est la même équipe qui suit le chantier.",
  },
  {
    title: "Préparation des supports",
    desc: "Dépose, rebouchage, ratissage : le rendu se joue avant la dernière couche.",
  },
  {
    title: "Délais écrits sur le devis",
    desc: "Les dates figurent au devis, pas seulement dans une conversation téléphonique.",
  },
  {
    title: "Chantier protégé et nettoyé",
    desc: "Meubles et sols bâchés, chantier rendu propre à la fin des travaux.",
  },
  {
    title: "Devis gratuit et détaillé",
    desc: "Chaque poste est chiffré ligne par ligne, sans frais découvert en cours de route.",
  },
];

export default function WhyUsSection() {
  const { ref, visible } = useScrollReveal();

  const handleCTA = () => {
    const el = document.querySelector("#contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="showroom"
      className="bg-creme-2 pt-20 lg:pt-24 border-b-[3px] border-encre"
    >
      <div className="container pb-10" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-10 lg:mb-12">
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <p className="section-num mb-2">Le showroom</p>
            <h2 className="text-4xl lg:text-[2.9rem] leading-[1.06] text-encre mb-5 max-w-[15ch] lg:max-w-[22ch]">
              Une teinte ne se choisit pas sur un écran.
            </h2>
            <p className="text-encre/75 leading-relaxed max-w-lg">
              Peinture, décoration, menuiserie et revêtements de sols et murs.
              Notre showroom est ouvert au public : venez voir, toucher et
              comparer les collections avant de décider — et récupérer vos
              colis, c'est aussi un point relais.
            </p>

            <div className="flex flex-col gap-2.5 mt-7">
              {faits.map((ligne, i) => (
                <div key={i} className="flex flex-wrap gap-2.5">
                  {ligne.map((f) => (
                    <span
                      key={f.label}
                      className={
                        f.fort ? "trust-badge trust-badge-ocre" : "trust-badge"
                      }
                    >
                      {f.label}
                    </span>
                  ))}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-7">
              <button onClick={handleCTA} className="cta-btn text-base">
                Demander un devis
                <ArrowRight size={18} className="cta-arrow" />
              </button>
              <a href="tel:+33185830355" className="cta-btn-ghost text-base">
                <Phone size={17} />
                01 85 83 03 55
              </a>
            </div>
          </div>

          <figure
            className="bg-white border-[3px] border-encre p-3 shadow-[9px_9px_0_var(--color-ocre)] rotate-[1.2deg]"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible
                ? "rotate(1.2deg)"
                : "rotate(1.2deg) translateY(24px)",
              transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
            }}
          >
            <img
              src={PHOTO_SHOWROOM}
              alt="La devanture du showroom DPM Marigot, enseigne « Travaux de rénovation intérieure », nuanciers et collections en vitrine"
              loading="lazy"
              decoding="async"
              className="w-full h-[300px] lg:h-[320px] object-cover"
            />
            <figcaption className="text-[11px] uppercase tracking-[0.12em] font-bold pt-3 pb-1 text-encre">
              Le showroom · 92 avenue Habert de Montmort
            </figcaption>
          </figure>
        </div>

        <div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 pt-8 lg:pt-9 border-t-[3px] border-encre"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.6s ease 0.35s",
          }}
        >
          {engagements.map((f, i) => (
            <div key={f.title} className="flex gap-4">
              <span className="font-display text-terre text-lg leading-none pt-1 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="font-bold text-encre text-sm">{f.title}</p>
                <p className="text-encre/65 text-xs mt-1 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Les partenaires ferment la section (21/09) : le padding bas est porté
          par le conteneur, pas par la section, pour que la barre touche le bord. */}
      <PartenairesBand />
    </section>
  );
}
