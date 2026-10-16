/**
 * DPM Marigot – Les dernières réalisations, regroupées par chantier.
 *
 * Un lieu = un chantier = une carte dans l'onglet « Nos dernières
 * réalisations ». La carte ouvre la vidéo du chantier quand elle existe, et
 * toujours la visionneuse des photos (« Voir les N photos », ou une miniature
 * pour ouvrir directement sur cette photo).
 *
 * Ajouter un chantier :
 *   1. produire les WebP dans client/public/images/realisations/<id>/,
 *      nommés <id>-<num>-<largeur>.webp, aux largeurs de LARGEURS qui ne
 *      dépassent pas l'original (jamais d'agrandissement) ;
 *   2. ajouter une entrée en tête de CHANTIERS. Le test chantiers.test.ts
 *      vérifie que chaque fichier annoncé existe bien sur le disque.
 *
 * Règles (inchangées depuis le 21/09) : photos réelles du client, aucune
 * retouche ; textes du client, rien d'inventé (ni date, ni durée, ni surface).
 * « Dégât des eaux » en toutes lettres : c'est le terme du site.
 *
 * 2026-10-15 (2e passage) : « Demany » est en réalité Magny-les-Hameaux
 * (DEMANY = « de Magny » dans les noms de fichiers du client). Les images sont
 * passées de demany/ à magny/ ; l'ancien dossier est rangé dans _to_delete/.
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
 * La vidéo d'un chantier (clip Remotion rendu à part). Chemins fixes :
 *   client/public/videos/realisations/<id>.webm et <id>.mp4
 *   client/public/images/realisations/<id>/<id>-fin.webp (image de fin = vignette)
 * Seules les sources réellement présentes sont proposées au navigateur.
 *
 * 16/10/2026 : chaque clip portrait (1080×1440, pour le mobile) reçoit une
 * version PAYSAGE 1920×1080 pour le desktop, à côté :
 *   client/public/videos/realisations/<id>-paysage.webm et <id>-paysage.mp4
 *   client/public/images/realisations/<id>/<id>-paysage-fin.webp (affiche)
 * Facultative : sans elle, la fenêtre vidéo se replie sur la portrait.
 */
export type SourcesVideo = {
  apercu: string;
  webm?: string;
  mp4?: string;
};

export type AnimationChantier = SourcesVideo & {
  /** Version 16:9 pour le desktop, quand elle est livrée. */
  paysage?: SourcesVideo;
};

/** Rapport largeur / hauteur des deux formats de clip. */
export const RATIO_PORTRAIT = 1080 / 1440;
export const RATIO_PAYSAGE = 1920 / 1080;

export type Chantier = {
  /** Identifiant, nom du dossier d'images et de la vidéo : "magny". */
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
    id: "magny",
    lieu: "Magny-les-Hameaux",
    travaux: "Rénovation complète",
    detail:
      "Mise à nu de toute la maison, casse d'un mur porteur avec pose d'IPN, changement des fenêtres, plomberie, électricité, carrelage, parquet et peinture.",
    chronologique: false,
    couverture: 5,
    photos: [
      portrait("magny/magny-01", "Chambre sous combles à Magny-les-Hameaux : sol aspect bois, murs et plafond blancs"),
      portrait("magny/magny-02", "Chambre à Magny-les-Hameaux : sol aspect bois, murs blancs, fenêtre à deux vantaux"),
      portrait("magny/magny-03", "WC suspendu à Magny-les-Hameaux, mur carrelé derrière la cuvette, sol aspect bois"),
      paysage("magny/magny-04", "Grand séjour à Magny-les-Hameaux : sol aspect bois, baie vitrée, murs et plafond blancs"),
      paysage("magny/magny-05", "Chambre mansardée à Magny-les-Hameaux : sol aspect bois, fenêtre et radiateur"),
      paysage("magny/magny-06", "Pièce mansardée lumineuse à Magny-les-Hameaux : sol aspect bois, porte-fenêtre ouverte"),
      paysage(
        "magny/magny-07",
        "Grande pièce sous combles à Magny-les-Hameaux : sol aspect bois, murs blancs, portes intérieures",
      ),
      portrait(
        "magny/magny-08",
        "Salle d'eau à Magny-les-Hameaux : WC suspendu, meuble vasque, sèche-serviettes, fenêtre de toit",
      ),
      portrait(
        "magny/magny-09",
        "Salle de bains à Magny-les-Hameaux : baignoire, murs carrelés, fenêtre de toit, sèche-serviettes",
      ),
      portrait(
        "magny/magny-10",
        "Salle d'eau à Magny-les-Hameaux : douche à paroi vitrée, meuble vasque, sol carrelé clair",
      ),
      portrait("magny/magny-11", "Verrière intérieure à arches dans un mur blanc, à Magny-les-Hameaux"),
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

/** Chemins publics attendus pour la vidéo d'un chantier, présents ou non. */
export function cheminsVideo(id: string, format: "portrait" | "paysage" = "portrait") {
  const s = format === "paysage" ? "-paysage" : "";
  return {
    apercu: `${BASE}${id}/${id}${s}-fin.webp`,
    webm: `/videos/realisations/${id}${s}.webm`,
    mp4: `/videos/realisations/${id}${s}.mp4`,
  };
}

/**
 * Les fichiers vidéo présents, relevés sur le disque au moment du build par
 * vite.config.ts (constante __VIDEOS_REALISATIONS__). Un fichier manquant est
 * renvoyé en index.html par la réécriture SPA de Vercel : le tester depuis le
 * navigateur ne marcherait pas, d'où le relevé au build. Après l'arrivée des
 * fichiers, un nouveau build (ou un redémarrage du serveur de dev) suffit.
 */
export type FichiersPresents = { webm: boolean; mp4: boolean; apercu: boolean };
export type VideosDisponibles = Record<string, FichiersPresents & { paysage?: FichiersPresents }>;

const VIDEOS: VideosDisponibles =
  typeof __VIDEOS_REALISATIONS__ !== "undefined" ? __VIDEOS_REALISATIONS__ : {};

/** Les sources d'un format : il faut l'affiche et au moins une des deux vidéos. */
function sources(id: string, format: "portrait" | "paysage", d?: FichiersPresents): SourcesVideo | undefined {
  if (!d || !d.apercu || (!d.webm && !d.mp4)) return undefined;
  const c = cheminsVideo(id, format);
  return { apercu: c.apercu, webm: d.webm ? c.webm : undefined, mp4: d.mp4 ? c.mp4 : undefined };
}

/**
 * La vidéo du chantier, ou undefined : il faut la version portrait complète
 * (image de fin et au moins une source). Sans elle, la carte garde sa photo de
 * couverture. La version paysage s'y ajoute quand elle est complète aussi.
 */
export function animationDe(id: string, dispo: VideosDisponibles = VIDEOS): AnimationChantier | undefined {
  const d = dispo[id];
  const portrait = sources(id, "portrait", d);
  if (!portrait) return undefined;
  const paysage = sources(id, "paysage", d?.paysage);
  return paysage ? { ...portrait, paysage } : portrait;
}

/** La requête qui fait choisir la version paysage : un écran large et couché. */
export const REQUETE_PAYSAGE = "(min-width: 768px) and (orientation: landscape)";

/**
 * Les sources à jouer : la paysage sur un écran large et couché quand elle
 * existe, sinon la portrait (repli, et toujours sur mobile).
 */
export function formatAJouer(
  animation: AnimationChantier,
  ecranPaysage: boolean,
): { format: "portrait" | "paysage"; sources: SourcesVideo; ratio: number } {
  if (ecranPaysage && animation.paysage) {
    return { format: "paysage", sources: animation.paysage, ratio: RATIO_PAYSAGE };
  }
  const { apercu, webm, mp4 } = animation;
  return { format: "portrait", sources: { apercu, webm, mp4 }, ratio: RATIO_PORTRAIT };
}

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
