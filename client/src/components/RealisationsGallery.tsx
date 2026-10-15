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
 *
 * 2026-10-15 : « Nos dernières réalisations » passe d'une photo par carte à une
 * carte par chantier (un lieu = un chantier) : Demany, Buc, La Queue-les-Yvelines.
 * Un clic ouvre la visionneuse sur toutes les photos du chantier
 * (VisionneuseChantier.tsx). Les données sont dans client/src/chantiers.ts.
 * Les trois photos d'amorce sont retirées : c'étaient les « après » des trois
 * avant/après de l'autre onglet, donc des doublons.
 */
import * as Tabs from "@radix-ui/react-tabs";
import { useState } from "react";
import AvantApres, { type Photo } from "./AvantApres";
import VisionneuseChantier from "./VisionneuseChantier";
import { CHANTIERS, type Chantier, srcParDefaut, srcsetDe } from "@/chantiers";

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

/**
 * Les dernières réalisations, de la plus récente à la plus ancienne : un
 * chantier par carte. Les chantiers se complètent dans client/src/chantiers.ts.
 * Règle : photos réelles du client, textes du client. Pas de photo de banque,
 * pas de légende qui promet ce que la photo ne montre pas.
 */
const DERNIERES: Chantier[] = CHANTIERS;

/**
 * Le visuel de la carte. C'est ici que viendra l'animation du chantier
 * (`chantier.animation`, voir AnimationChantier dans chantiers.ts) : un aperçu
 * figé à la place de la couverture, le clic restant celui de la carte. Pas
 * encore câblé : l'animation est en validation à part.
 */
function CouvertureChantier({ chantier }: { chantier: Chantier }) {
  const photo = chantier.photos[chantier.couverture];
  return (
    <div className="relative aspect-[4/3] overflow-hidden border-b-[3px] border-encre bg-creme-2">
      <img
        src={srcParDefaut(photo)}
        srcSet={srcsetDe(photo)}
        sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
        width={photo.largeur}
        height={photo.hauteur}
        alt={photo.alt}
        loading="lazy"
        decoding="async"
        className="couverture-chantier w-full h-full object-cover"
      />
      <div className="absolute left-3 top-3 flex flex-wrap gap-2">
        <span className="badge-carre">{chantier.photos.length} photos</span>
        {chantier.chronologique && (
          <span className="badge-carre badge-carre-terre">Avant → après</span>
        )}
      </div>
    </div>
  );
}

export default function RealisationsGallery() {
  const [ouvert, setOuvert] = useState<Chantier | null>(null);

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
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-start">
              {DERNIERES.map((chantier, i) => (
                <article
                  key={chantier.id}
                  className={`card-hard carte-chantier relative flex flex-col ${
                    i === 1 ? "card-hard-terre lg:mt-6" : i === 2 ? "card-hard-prusse" : ""
                  }`}
                >
                  <CouvertureChantier chantier={chantier} />
                  <div className="p-5 flex flex-col gap-2">
                    <h3 className="text-xl text-encre leading-tight">{chantier.lieu}</h3>
                    <p className="text-sm font-semibold text-terre leading-snug">{chantier.travaux}</p>
                    {chantier.detail && (
                      <p className="text-sm text-encre/70 leading-relaxed">{chantier.detail}</p>
                    )}
                    {/* Le ::after de ce bouton couvre toute la carte : un clic n'importe où l'ouvre. */}
                    <button
                      type="button"
                      className="ouvrir-chantier"
                      aria-haspopup="dialog"
                      onClick={() => setOuvert(chantier)}
                    >
                      Voir les {chantier.photos.length} photos
                      <span aria-hidden className="cta-arrow">→</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
      <VisionneuseChantier chantier={ouvert} onFermer={() => setOuvert(null)} />
    </section>
  );
}
