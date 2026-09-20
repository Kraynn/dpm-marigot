/**
 * DPM Marigot – Réalisations
 * Direction « Le Nuancier » : cartes à bordure franche, ombre dure, badges carrés.
 * Le curseur avant/après (input range invisible superposé) est conservé tel quel :
 * il fonctionne au doigt, à la souris et au clavier.
 * Photos : chantiers réels du client, aucune retouche.
 *
 * 2026-09-21 : la section passe à deux onglets.
 *   « Avant / après »            les trois comparatifs à curseur, inchangés
 *   « Nos dernières réalisations » une galerie simple qui s'allonge
 *
 * Pourquoi : les avant/après demandent une photo AVANT, que le client n'a pas
 * pour tous ses chantiers. La galerie accepte une photo seule, donc les
 * nouvelles réas peuvent entrer au fil de l'eau sans attendre la paire. À
 * réception des photos, il n'y a que le tableau DERNIERES ci-dessous à
 * compléter — rien d'autre à toucher.
 *
 * Elle est amorcée avec trois photos déjà dans le dépôt, pour que l'onglet ne
 * soit pas vide au premier regard. Légendes factuelles, reprises des
 * descriptions existantes : aucune réalisation inventée, aucune photo de
 * banque présentée comme un chantier du client.
 *
 * Les onglets s'appuient sur @radix-ui/react-tabs (déjà au package.json) plutôt
 * que sur @/components/ui/tabs : le wrapper shadcn arrive avec rounded-lg,
 * bg-muted et une hauteur fixe de 36 px, qu'il aurait fallu défaire classe par
 * classe. On garde la primitive — c'est elle qui porte l'accessibilité, les
 * flèches du clavier et le roving tabindex — et on l'habille au Nuancier.
 */
import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { ArrowRight } from "lucide-react";

type Projet = {
  titre: string;
  description: string;
  avant: { src: string; alt: string };
  apres: { src: string; alt: string };
};

const PROJETS: Projet[] = [
  {
    titre: "Plafond fissuré — séjour",
    description:
      "Reprise d'un plafond fissuré : ouverture, rebouchage, ratissage et mise en peinture du plafond et des murs.",
    avant: {
      src: "/images/realisations/plafond-avant.jpg",
      alt: "Plafond de séjour fissuré avant travaux",
    },
    apres: {
      src: "/images/realisations/plafond-apres.jpg",
      alt: "Plafond de séjour rénové, lisse et repeint",
    },
  },
  {
    titre: "Salle à manger — rénovation complète",
    description:
      "Rénovation complète d'une salle à manger : préparation des supports, murs en teinte taupe et plafond repeints.",
    avant: {
      src: "/images/realisations/salle-a-manger-avant.jpg",
      alt: "Salle à manger avant rénovation",
    },
    apres: {
      src: "/images/realisations/salle-a-manger-apres.jpg",
      alt: "Salle à manger rénovée, murs taupe et plafond blanc",
    },
  },
  {
    titre: "Cuisine — après sinistre DDE",
    description:
      "Rénovation d'un plafond de cuisine et d'un mur, après un sinistre DDE (dégât des eaux). Chantier de juin 2025.",
    avant: {
      src: "/images/realisations/cuisine-sinistre-avant.jpg",
      alt: "Mur et plafond de cuisine endommagés par un dégât des eaux",
    },
    apres: {
      src: "/images/realisations/cuisine-sinistre-apres.jpg",
      alt: "Mur et plafond de cuisine rénovés après sinistre",
    },
  },
];

type Realisation = {
  titre: string;
  legende: string;
  src: string;
  alt: string;
};

/**
 * Les dernières réalisations, de la plus récente à la plus ancienne.
 * Ajouter une entrée en tête suffit — la grille s'ajuste seule.
 * Règle : une photo réelle du client, une légende qui décrit ce qui a été fait.
 * Pas de photo de banque, pas de légende qui promet ce que la photo ne montre pas.
 */
const DERNIERES: Realisation[] = [
  {
    titre: "Salle à manger",
    legende: "Murs en teinte taupe et plafond repeints, après préparation des supports.",
    src: "/images/realisations/salle-a-manger-apres.jpg",
    alt: "Salle à manger rénovée par DPM Marigot, murs taupe et plafond blanc, charpente apparente",
  },
  {
    titre: "Cuisine — après dégât des eaux",
    legende: "Plafond et mur repris puis remis en peinture après sinistre. Juin 2025.",
    src: "/images/realisations/cuisine-sinistre-apres.jpg",
    alt: "Mur et plafond de cuisine rénovés par DPM Marigot après un dégât des eaux",
  },
  {
    titre: "Plafond de séjour",
    legende: "Fissures ouvertes, rebouchées et ratissées, puis plafond et murs repeints.",
    src: "/images/realisations/plafond-apres.jpg",
    alt: "Plafond de séjour rénové par DPM Marigot, surface lisse et repeinte",
  },
];

function BeforeAfterSlider({ avant, apres }: Pick<Projet, "avant" | "apres">) {
  const [pos, setPos] = useState(50);

  return (
    <div className="group relative overflow-hidden aspect-[4/3] bg-creme-2 select-none border-b-[3px] border-encre">
      {/* Après — image de base */}
      <img
        src={apres.src}
        alt={apres.alt}
        draggable={false}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Avant — rogné côté droit via clip-path */}
      <img
        src={avant.src}
        alt={avant.alt}
        draggable={false}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />

      {/* Ligne de séparation + poignée */}
      <div
        className="absolute top-0 bottom-0 z-10 pointer-events-none"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute inset-0 w-[3px] bg-creme" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-creme border-[3px] border-encre flex items-center justify-center text-encre">
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden>
            <path
              d="M6 7H1M1 7L4 4M1 7L4 10"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 7H17M17 7L14 4M17 7L14 10"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Badges AVANT / APRÈS */}
      <span className="absolute top-3 left-3 z-10 pointer-events-none bg-encre text-creme text-[10px] font-bold uppercase tracking-[0.18em] px-2.5 py-1">
        Avant
      </span>
      <span className="absolute top-3 right-3 z-10 pointer-events-none bg-olive text-white text-[10px] font-bold uppercase tracking-[0.18em] px-2.5 py-1">
        Après
      </span>

      {/* Indice de glissement (disparaît au survol) */}
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none whitespace-nowrap bg-creme border-2 border-encre text-encre text-[11px] font-bold px-3 py-1 transition-opacity duration-300 group-hover:opacity-0">
        Faites glisser ←→
      </span>

      {/* Input range invisible — couvre toute la surface */}
      <input
        type="range"
        min={0}
        max={100}
        step={0.3}
        value={pos}
        onChange={(e) => setPos(+e.target.value)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-col-resize z-20"
        style={{ margin: 0, padding: 0 }}
        aria-label="Curseur avant / après"
      />
    </div>
  );
}

export default function RealisationsGallery() {
  const handleCTA = () => {
    const el = document.querySelector("#contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="realisations" className="bg-white py-20 lg:py-24 border-b-[3px] border-encre">
      <div className="container">
        <div className="mb-12">
          <div>
            <p className="section-num mb-2">02 — Réalisations</p>
            <h2 className="text-4xl lg:text-[2.9rem] leading-[1.06] text-encre max-w-[14ch]">
              Nos chantiers, sans retouche.
            </h2>
          </div>
        </div>

        <Tabs.Root defaultValue="avant-apres">
          <Tabs.List
            aria-label="Deux façons de voir nos chantiers"
            className="flex flex-wrap gap-0 mb-10 border-b-[3px] border-encre"
          >
            <Tabs.Trigger value="avant-apres" className="onglet-rea">
              Avant / après
            </Tabs.Trigger>
            <Tabs.Trigger value="dernieres" className="onglet-rea">
              Nos dernières réalisations
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="avant-apres" className="outline-none">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {PROJETS.map((projet, i) => (
                <article
                  key={projet.titre}
                  className={`card-hard flex flex-col ${
                    i === 1 ? "card-hard-terre lg:mt-6" : i === 2 ? "card-hard-prusse" : ""
                  }`}
                >
                  <BeforeAfterSlider avant={projet.avant} apres={projet.apres} />
                  <div className="p-5">
                    <h3 className="text-xl text-encre leading-tight">{projet.titre}</h3>
                    <p className="mt-2 text-sm text-encre/70 leading-relaxed">
                      {projet.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </Tabs.Content>

          <Tabs.Content value="dernieres" className="outline-none">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {DERNIERES.map((rea, i) => (
                <figure
                  key={rea.src}
                  className={`card-hard flex flex-col ${
                    i === 1 ? "card-hard-terre lg:mt-6" : i === 2 ? "card-hard-prusse" : ""
                  }`}
                >
                  <div className="aspect-[4/3] overflow-hidden border-b-[3px] border-encre bg-creme-2">
                    <img
                      src={rea.src}
                      alt={rea.alt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <figcaption className="p-5">
                    <h3 className="text-xl text-encre leading-tight">{rea.titre}</h3>
                    <p className="mt-2 text-sm text-encre/70 leading-relaxed">{rea.legende}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </Tabs.Content>
        </Tabs.Root>

        <div className="mt-14">
          <button onClick={handleCTA} className="cta-btn text-base">
            Demander un devis
            <ArrowRight size={18} className="cta-arrow" />
          </button>
        </div>
      </div>
    </section>
  );
}
