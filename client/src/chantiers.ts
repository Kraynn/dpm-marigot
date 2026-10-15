/**
 * DPM Marigot – Les dernières réalisations, regroupées par chantier.
 *
 * Un lieu = un chantier = une carte dans l'onglet « Nos dernières
 * réalisations ». Un clic ouvre la visionneuse sur toutes ses photos.
 *
 * Ajouter un chantier :
 *   1. produire les WebP dans client/public/images/realisations/<dossier>/,
 *      nommés <dossier>-<num>-<largeur>.webp, aux largeurs de LARGEURS qui ne
 *      dépassent pas l'original (jamais d'agrandissement) ;
 *   2. ajouter une entrée en tête de CHANTIERS. Le test chantiers.test.ts
 *      vérifie que chaque fichier annoncé existe bien sur le disque.
 *
 * Règles (inchangées depuis le 21/09) : photos réelles du client, aucune
 * retouche ; textes du client, rien d'inventé (ni date, ni durée, ni surface).
 * « Dégât des eaux » en toutes lettres : c'est le terme du site.
 */

/** Largeurs produites pour chaque photo, plafonnées à la largeur d'origine. */
export const LARGEURS = [240, 480, 800, 1200, 1600] as const;

export type PhotoChantier = {
  /** Préfixe du fichier, sans largeur ni extension : "buc/buc-01". */
  fichier: string;
  /** Dimensions de l'original : aucune variante ne les dépasse. */
  largeur: number;
  hauteur: number;
  alt: string;
  /** Étape du chantier, pour ceux qui se lisent dans l'ordre (avant → après). */
  etape?: string;
};

/**
 * Emplacement réservé pour l'animation d'un chantier (Remotion, en cours de
 * validation à part le 15/10/2026). Rien n'est câblé : tant que le champ est
 * absent, la carte montre sa photo de couverture.
 * Prévu : `apercu` remplace la couverture sur la carte (image figée), et le
 * clic lance `video` dans la visionneuse avant les photos. Le point
 * d'entrée côté interface est CouvertureChantier, dans RealisationsGallery.tsx.
 */
export type AnimationChantier = {
  apercu: string;
  video: string;
};

export type Chantier = {
  id: string;
  /** Titre de la carte : le lieu. */
  lieu: string;
  /** Sous-titre : la nature des travaux. */
  travaux: string;
  /** Détail des travaux, quand le client l'a donné. */
  detail?: string;
  /** true : les photos suivent l'ordre du chantier, de l'avant à l'après. */
  chronologique: boolean;
  /** Index, dans `photos`, de la photo de couverture. */
  couverture: number;
  photos: PhotoChantier[];
  animation?: AnimationChantier;
};

const portrait = (fichier: string, alt: string, etape?: string): PhotoChantier => ({
  fichier,
  largeur: 1200,
  hauteur: 1600,
  alt,
  etape,
});
const paysage = (fichier: string, alt: string, etape?: string): PhotoChantier => ({
  fichier,
  largeur: 1600,
  hauteur: 1200,
  alt,
  etape,
});

export const CHANTIERS: Chantier[] = [
  {
    id: "demany",
    lieu: "Demany",
    travaux: "Rénovation complète",
    detail:
      "Mise à nu de toute la maison, casse d'un mur porteur avec pose d'IPN, changement des fenêtres, plomberie, électricité, carrelage, parquet et peinture.",
    chronologique: false,
    couverture: 5,
    photos: [
      portrait("demany/demany-01", "Chambre sous combles à Demany : sol aspect bois, murs et plafond blancs"),
      portrait("demany/demany-02", "Chambre à Demany : sol aspect bois, murs blancs, fenêtre à deux vantaux"),
      portrait("demany/demany-03", "WC suspendu à Demany, mur carrelé derrière la cuvette, sol aspect bois"),
      paysage("demany/demany-04", "Grand séjour à Demany : sol aspect bois, baie vitrée, murs et plafond blancs"),
      paysage("demany/demany-05", "Chambre mansardée à Demany : sol aspect bois, fenêtre et radiateur"),
      paysage("demany/demany-06", "Pièce mansardée lumineuse à Demany : sol aspect bois, porte-fenêtre ouverte"),
      paysage("demany/demany-07", "Grande pièce sous combles à Demany : sol aspect bois, murs blancs, portes intérieures"),
      portrait("demany/demany-08", "Salle d'eau à Demany : WC suspendu, meuble vasque, sèche-serviettes, fenêtre de toit"),
      portrait("demany/demany-09", "Salle de bains à Demany : baignoire, murs carrelés, fenêtre de toit, sèche-serviettes"),
      portrait("demany/demany-10", "Salle d'eau à Demany : douche à paroi vitrée, meuble vasque, sol carrelé clair"),
      portrait("demany/demany-11", "Verrière intérieure à arches dans un mur blanc, à Demany"),
    ],
  },
  {
    id: "buc",
    lieu: "Buc",
    travaux: "Parquet déposé et reposé après un dégât des eaux",
    chronologique: true,
    couverture: 7,
    photos: [
      portrait("buc/buc-01", "Buc, avant travaux : ancien parquet foncé abîmé", "Avant"),
      portrait("buc/buc-02", "Buc, avant travaux : ancien parquet foncé sur le palier, le long du garde-corps", "Avant"),
      portrait("buc/buc-03", "Buc, dépose : ancien parquet retiré le long du garde-corps", "Dépose et chape"),
      portrait("buc/buc-04", "Buc, dépose : sol de la pièce mis à nu, traces de colle", "Dépose et chape"),
      portrait("buc/buc-05", "Buc, préparation du sol : couche orange appliquée sur la dalle", "Dépose et chape"),
      portrait("buc/buc-06", "Buc, chape : sol de la pièce lissé, gris uniforme", "Dépose et chape"),
      portrait("buc/buc-07", "Buc, après travaux : parquet neuf clair posé dans la chambre", "Après"),
      portrait("buc/buc-08", "Buc, après travaux : parquet neuf posé sur le palier, le long du garde-corps", "Après"),
    ],
  },
  {
    id: "la-queue-les-yvelines",
    lieu: "La Queue-les-Yvelines",
    travaux: "Pan de mur et parquet refaits après un dégât des eaux",
    chronologique: true,
    couverture: 3,
    // La photo 03 reçue est un doublon exact de la 02 : elle n'est pas reprise.
    photos: [
      portrait(
        "la-queue-les-yvelines/la-queue-les-yvelines-01",
        "La Queue-les-Yvelines, avant travaux : pièce sous combles, pan de mur abîmé et ancien sol",
        "Avant",
      ),
      portrait(
        "la-queue-les-yvelines/la-queue-les-yvelines-02",
        "La Queue-les-Yvelines, pendant les travaux : ancien sol déposé, pan de mur en reprise",
        "Travaux",
      ),
      portrait(
        "la-queue-les-yvelines/la-queue-les-yvelines-04",
        "La Queue-les-Yvelines, pendant les travaux : pan de mur refait, sol à nu",
        "Travaux",
      ),
      portrait(
        "la-queue-les-yvelines/la-queue-les-yvelines-05",
        "La Queue-les-Yvelines, après travaux : parquet neuf posé, murs blancs",
        "Après",
      ),
    ],
  },
];

const BASE = "/images/realisations/";

/** Les largeurs réellement produites pour cette photo. */
export function largeursDe(photo: PhotoChantier): number[] {
  return LARGEURS.filter((l) => l <= photo.largeur);
}

export function srcDe(photo: PhotoChantier, largeur: number): string {
  return `${BASE}${photo.fichier}-${largeur}.webp`;
}

export function srcsetDe(photo: PhotoChantier): string {
  return largeursDe(photo)
    .map((l) => `${srcDe(photo, l)} ${l}w`)
    .join(", ");
}

/** Repli `src` : une largeur moyenne, jamais au-delà de l'original. */
export function srcParDefaut(photo: PhotoChantier): string {
  const l = largeursDe(photo);
  return srcDe(photo, l.includes(800) ? 800 : l[l.length - 1]);
}
