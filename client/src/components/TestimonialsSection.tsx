/**
 * DPM Marigot – Avis
 * Direction « Le Nuancier » : fond ocre, cartes à bordure franche et ombre dure.
 *
 * Historique, à garder en tête. La version d'avant le 2026-08-28 affichait
 * trois avis nominatifs (« Marie L. », « Sébastien R. », « Aline D. ») à cinq
 * étoiles, présentés comme réels : ils étaient INVENTÉS. Ils ont été supprimés,
 * et pas remplacés par d'autres avis d'exemple. La section s'est contentée
 * ensuite d'un lien Facebook et de trois repères factuels.
 *
 * 2026-09-21 : la section porte enfin de vrais avis. Ils viennent de la fiche
 * Google Business du client, dont Silva a fourni le lien le même jour
 * (https://maps.app.goo.gl/b5EBvHaQshuvhbu69 → place id
 * ChIJBxoa4jmD5kcRBMq__a75-Hc). Reprise demandée par DPM en rendez-vous, ce qui
 * est ce qui la rend admise.
 *
 * Règles tenues sur ces avis, sans exception :
 *   - texte verbatim, orthographe et ponctuation d'origine comprises ;
 *   - auteur tel qu'il s'affiche sur la fiche, jamais complété ni abrégé ;
 *   - Google tronque lui-même les avis longs : la coupure est signalée par une
 *     ellipse, et le texte n'est JAMAIS complété de mémoire ou au jugé ;
 *   - la note globale affichée est la vraie (4,4 sur 15 avis au 21/09) — elle
 *     inclut donc les deux avis à une étoile que la sélection ne montre pas.
 *     C'est ce qui rend la sélection honnête, et le lien « voir plus d'avis »
 *     mène à la fiche complète.
 *
 * 2026-09-21, plus tard : les deux avis sont désormais en texte intégral,
 * relevés sur la fiche avec chaque « Plus » déplié (Playwright + Chrome ; un
 * navigateur headless reçoit un affichage limité de Maps). Les retours à la
 * ligne de l'auteur sont conservés (`whitespace-pre-line`).
 *
 * Les trois repères de confiance (« Showroom au Mesnil-Saint-Denis », « Remise
 * en état après sinistre », « Un seul interlocuteur ») ont été retirés le
 * 21/09 à la demande de Silva : les trois faits qu'ils portaient sont déjà dits
 * ailleurs — bannière, showroom, métiers — et de vrais avis valent mieux que
 * des promesses de notre main.
 *
 * Cette section sert aussi d'ancrage à la carte « Point relais » incrustée :
 * c'est elle qui porte `relative`. Voir PointRelaisCard.tsx.
 */
import { ArrowRight, Facebook, Instagram, Star } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import PointRelaisCard from "@/components/PointRelaisCard";
import { RESEAUX } from "@/reseaux";

/**
 * La fiche Google du client — lien court fourni par Silva. « Voir plus d'avis »
 * y mène : c'est là que les quinze avis sont lisibles, avec la note.
 */
const GOOGLE_FICHE = "https://maps.app.goo.gl/b5EBvHaQshuvhbu69";
/** Le formulaire d'avis Google, qui ouvre directement l'écriture. */
const GOOGLE_ECRIRE =
  "https://search.google.com/local/writereview?placeid=ChIJBxoa4jmD5kcRBMq__a75-Hc";

/** Relevé sur la fiche le 2026-09-21. À remettre à jour en même temps que les avis. */
const NOTE = { valeur: 4.4, total: 15 };

type Avis = {
  auteur: string;
  note: number;
  /** ancienneté telle que Google l'affiche, pas une date reconstruite */
  quand: string;
  texte: string;
  /** vrai quand Google a coupé le texte : l'ellipse est alors de son fait */
  tronque: boolean;
};

const AVIS: Avis[] = [
  {
    auteur: "Christine Verguet",
    note: 5,
    quand: "il y a un an",
    texte:
      "J'ai contacté DPM Marigot par hasard car je l'avais choisie pour un colis en relais pick up et je recherchais par ailleurs une entreprise sérieuse pour rénover une chambre suite à un dégât des eaux. J'ai donc demandé un devis et signé pour les travaux.\nJe suis très satisfaite de la prestation, tant sur le plan du relationnel que de la compétence technique : la responsable est conciliante et de bon conseil, les délais sont respectés et le technicien s'est montré aimable et efficace, le travail est soigné et le chantier laissé propre, rien à dire.\nJe recommande donc cette entreprise et n'hésiterai pas à faire de nouveau appel à eux en cas de besoin.",
    tronque: false,
  },
  {
    auteur: "JB SP",
    note: 5,
    quand: "il y a un mois",
    texte:
      "Entreprise mandatée par mon assurance suite à un dégât des eaux, les intervenants de Marigot se signalent d'abord par la qualité de leur contact humain, que ce soit les ouvriers ou le service client. Le travail a été réalisé correctement dans les délais malgré un contexte difficile (canicule), et les intervenants ont pris en compte mes contraintes personnelles.",
    tronque: false,
  },
];

function Etoiles({ note, taille = 15 }: { note: number; taille?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={taille}
          className={
            n <= Math.round(note) ? "fill-encre text-encre" : "text-encre/25"
          }
        />
      ))}
    </span>
  );
}

export default function TestimonialsSection() {
  const { ref, visible } = useScrollReveal();

  const handleCTA = () => {
    const el = document.querySelector("#contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="avis"
      className="relative bg-ocre border-y-[3px] border-encre py-20 lg:py-24"
    >
      <PointRelaisCard />

      <div className="container" ref={ref}>
        <div
          className="mb-12"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <p className="section-num mb-2">Ils nous ont fait confiance</p>
          <h2 className="text-4xl lg:text-[2.9rem] leading-[1.06] text-encre">
            Nos avis, tels quels.
          </h2>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-6">
            <Etoiles note={NOTE.valeur} taille={20} />
            <p className="text-encre font-bold text-lg leading-none tabular-nums">
              {NOTE.valeur.toLocaleString("fr-FR", {
                minimumFractionDigits: 1,
              })}
              <span className="text-encre/60 font-normal text-sm">
                {" "}
                · {NOTE.total} avis Google
              </span>
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-7 mb-10">
          {AVIS.map((avis, i) => (
            <figure
              key={avis.auteur}
              className="card-hard card-hard-prusse p-7 flex flex-col"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.6s ease ${0.1 + i * 0.12}s, transform 0.6s ease ${
                  0.1 + i * 0.12
                }s`,
              }}
            >
              <Etoiles note={avis.note} />
              <blockquote className="text-encre/80 text-sm leading-relaxed mt-4 grow whitespace-pre-line">
                «&nbsp;{avis.texte}
                {avis.tronque ? "…" : ""}&nbsp;»
              </blockquote>
              <figcaption className="mt-5 pt-4 border-t-2 border-encre/15">
                <span className="block font-bold text-encre text-sm">
                  {avis.auteur}
                </span>
                <span className="block text-encre/55 text-xs mt-0.5">
                  {avis.quand} · sur Google
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* 2026-09-21 : la bannière bleue et « Voir plus d'avis » passent sur
            la même ligne pour gagner de la hauteur, demandé par Silva. Le texte
            tient en une ligne, et les trois boutons se rangent à droite du texte
            quand la largeur le permet (xl), dessous sinon — c'est flex-wrap qui
            décide, sans point de rupture codé en dur. */}
        <div
          className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease 0.35s, transform 0.6s ease 0.35s",
          }}
        >
          <div className="flex-1 min-w-0 bg-prusse text-creme border-[3px] border-encre shadow-[6px_6px_0_var(--color-encre)] p-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
            <div>
              <h3 className="text-2xl text-creme mb-1.5">
                Vous avez fait appel à nous ?
              </h3>
              <p className="text-creme/80 text-sm leading-relaxed">
                Laissez-nous un avis si vous avez aimé notre travail.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={GOOGLE_ECRIRE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-creme text-encre font-bold text-sm px-5 py-3 border-[3px] border-encre hover:bg-ocre transition-colors"
              >
                <Star size={16} />
                Sur Google
              </a>
              <a
                href={RESEAUX.facebook.url ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-transparent text-creme font-bold text-sm px-5 py-3 border-[3px] border-creme hover:bg-creme hover:text-encre transition-colors"
              >
                <Facebook size={16} />
                Sur Facebook
              </a>
              <a
                href={RESEAUX.instagram.url ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-transparent text-creme font-bold text-sm px-5 py-3 border-[3px] border-creme hover:bg-creme hover:text-encre transition-colors"
              >
                <Instagram size={16} />
                Sur Instagram
              </a>
            </div>
          </div>

          <a
            href={GOOGLE_FICHE}
            target="_blank"
            rel="noopener noreferrer"
            className="self-center shrink-0 inline-flex items-center gap-2 font-bold text-sm text-encre border-b-[3px] border-encre pb-1 hover:text-prusse hover:border-prusse transition-colors whitespace-nowrap"
          >
            Voir plus d'avis
            <ArrowRight size={16} />
          </a>
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
