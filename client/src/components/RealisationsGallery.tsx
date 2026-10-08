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
import * as Tabs from "@radix-ui/react-tabs";
import { ArrowRight } from "lucide-react";
import AvantApres, { type Photo } from "./AvantApres";

type Projet = {
  titre: string;
  description: string;
  avant: Photo;
  apres: Photo;
};

// Exporté : la bannière d'accueil reprend deux de ces paires (08/10/2026).
export const PROJETS: Projet[] = [
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
            <p className="section-num mb-2">Réalisations</p>
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
                  <AvantApres avant={projet.avant} apres={projet.apres} />
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
