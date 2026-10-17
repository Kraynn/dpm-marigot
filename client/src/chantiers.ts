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
  /**
   * 17/10/2026 : la même version 16:9 à 72 images par seconde, pour les écrans
   * dont la cadence est un multiple de 72 et pas de 60 (144 Hz). Mesuré sur le
   * site : une vidéo à 60 i/s y reste 14 puis 21 ms par image (à-coups, écart-
   * type 3,4 ms) ; à 72 i/s, 14 ms à chaque image (écart-type 0,08 ms).
   */
  paysage72?: SourcesVideo;
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
  /**
   * Index, dans `photos`, de la photo de couverture : celle que l'aperçu de la
   * carte montre par défaut, avant tout survol d'une miniature.
   */
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
    // 17/10/2026 (Silva) : « pour buc je suis pas certain que la premiere image soit vraiment un
    // avant, on est plutot deja dans les travaux donc tu peux pas faire avant apres ». Plus de
    // lecture avant → après : ni étape, ni « avant / après travaux » dans les textes, la carte ne
    // l'annonce plus et la visionneuse s'ouvre sur la couverture. Les photos gardent leur ordre.
    chronologique: false,
    // 16/10 (Silva) : « par défaut pour buc montre l'avant-dernière, pas la dernière ».
    couverture: 6,
    photos: [
      portrait("buc/buc-01", "Buc : ancien parquet foncé abîmé"),
      portrait("buc/buc-02", "Buc : ancien parquet foncé sur le palier, le long du garde-corps"),
      portrait("buc/buc-03", "Buc, dépose : ancien parquet retiré le long du garde-corps"),
      portrait("buc/buc-04", "Buc, dépose : sol de la pièce mis à nu, traces de colle"),
      portrait("buc/buc-05", "Buc, préparation du sol : couche orange appliquée sur la dalle"),
      portrait("buc/buc-06", "Buc, chape : sol de la pièce lissé, gris uniforme"),
      portrait("buc/buc-07", "Buc : parquet neuf clair posé dans la chambre"),
      portrait("buc/buc-08", "Buc : parquet neuf posé sur le palier, le long du garde-corps"),
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
export function cheminsVideo(id: string, format: "portrait" | "paysage" | "paysage-72" = "portrait") {
  const s = format === "portrait" ? "" : `-${format}`;
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
export type VideosDisponibles = Record<string, FichiersPresents & { paysage?: FichiersPresents; paysage72?: FichiersPresents }>;

const VIDEOS: VideosDisponibles =
  typeof __VIDEOS_REALISATIONS__ !== "undefined" ? __VIDEOS_REALISATIONS__ : {};

/** Les sources d'un format : il faut l'affiche et au moins une des deux vidéos. */
function sources(id: string, format: "portrait" | "paysage" | "paysage-72", d?: FichiersPresents): SourcesVideo | undefined {
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
  if (!paysage) return portrait;
  // la 72 i/s reprend l'affiche de la paysage : seules ses vidéos sont relevées
  const p72 = d?.paysage72;
  const paysage72 = p72 && (p72.webm || p72.mp4) ? sources(id, "paysage-72", { ...p72, apercu: true }) : undefined;
  return paysage72 ? { ...portrait, paysage, paysage72: { ...paysage72, apercu: paysage.apercu } } : { ...portrait, paysage };
}

/**
 * Vrai quand l'écran tourne à un multiple de 72 Hz qui n'est pas un multiple de
 * 60 (144 Hz surtout) : la version à 72 i/s y passe chaque image le même temps.
 * 60, 120 Hz et les téléphones gardent la 60 i/s. `hz` : cadence mesurée.
 */
export function ecranVeut72(hz: number | null): boolean {
  if (!hz) return false;
  const juste = (k: number) => Math.abs(hz / k - Math.round(hz / k)) < 0.06;
  return juste(72) && !juste(60);
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
  cadence72 = false,
): { format: "portrait" | "paysage" | "paysage-72"; sources: SourcesVideo; ratio: number } {
  if (ecranPaysage && cadence72 && animation.paysage72) {
    return { format: "paysage-72", sources: animation.paysage72, ratio: RATIO_PAYSAGE };
  }
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

/**
 * Cadre de l'aperçu d'une carte, largeur / hauteur. 16/10/2026 (Silva : « la
 * photo de preview plus grande ») : 4:5 au lieu de 4:3, la photo domine la carte.
 */
export const RATIO_APERCU = 4 / 5;

/**
 * L'attribut `sizes` de l'aperçu pour cette photo. Une photo plus large que le
 * cadre (paysage dans un cadre 4:5) est recadrée par object-fit: cover : elle
 * s'affiche plus large que la carte, d'un facteur qu'on reporte ici pour que le
 * navigateur choisisse un fichier assez large plutôt que d'en étirer un petit.
 */
export function taillesApercu(photo: PhotoChantier): string {
  const facteur = Math.max(1, photo.largeur / photo.hauteur / RATIO_APERCU);
  const f = (n: number) => Math.round(n * facteur);
  return `(min-width: 1024px) ${f(400)}px, (min-width: 640px) ${f(50)}vw, ${f(100)}vw`;
}

/** Repli `src` : une largeur moyenne, jamais au-delà de l'original. */
export function srcParDefaut(photo: PhotoChantier): string {
  const l = largeursDe(photo);
  return srcDe(photo, l.includes(800) ? 800 : l[l.length - 1]);
}
