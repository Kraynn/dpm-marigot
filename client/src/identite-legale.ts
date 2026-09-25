/**
 * DPM Marigot — identité légale publiée dans les mentions légales.
 *
 * Source unique des informations que seule l'entreprise détient. Les champs à
 * `null` sont ceux qu'elle n'a pas encore transmis : la page les rend alors avec
 * une mention explicite « à compléter » plutôt qu'une valeur plausible.
 * RIEN ne doit être deviné ici — un SIRET inventé sur une page de mentions
 * légales est une fausse déclaration publiée.
 *
 * Même liste de manques que `asap-devis/app/pricing/dpm-marigot.json`
 * (clé `artisan._todo_legal`), qui bloque déjà l'envoi de devis contractuels.
 *
 * Créé le 25/09/2026.
 */

export type ChampLegal = string | null;

export const DPM = {
  /** Nom commercial, tel qu'il s'affiche partout sur le site. */
  nomCommercial: "DPM Marigot",

  /** Dénomination légale exacte. Pour une entreprise individuelle, c'est le nom du titulaire. */
  denominationLegale: null as ChampLegal,

  /** Forme juridique. La grille de prix indique « Entreprise individuelle (micro-entreprise) » — à confirmer par l'entreprise. */
  formeJuridique: null as ChampLegal,

  /** SIRET du siège (14 chiffres). */
  siret: null as ChampLegal,

  /** Code APE / NAF. */
  ape: null as ChampLegal,

  /** Numéro de TVA intracommunautaire, ou la mention de franchise applicable. */
  tva: null as ChampLegal,

  /** Directeur de la publication (LCEN art. 6-III). */
  directeurPublication: null as ChampLegal,

  /** Assurance décennale : assureur + n° de police + zone couverte. */
  assuranceDecennale: null as ChampLegal,

  /** Vérifiés et publiés sur le site depuis l'origine. */
  adresse: "92, Avenue Habert de Montmort, 78320 Le Mesnil-Saint-Denis",
  telephone: "+33 1 85 83 03 55",
  telephoneAffiche: "01 85 83 03 55",
  email: "dpmmarigot@gmail.com",
} as const;

/** Conception et maintenance du site. */
export const EDITEUR_TECHNIQUE = {
  nomCommercial: "ASap Works",
  formeJuridique: "Entrepreneur individuel (régime de la micro-entreprise)",
  siren: "108 425 612",
  siret: "108 425 612 00018",
  immatriculation: "Registre national des entreprises (RNE) — greffe de Versailles",
  email: "contact@asapworks.fr",
} as const;

/** Hébergeur, au sens de l'article 6-III de la LCEN. */
export const HEBERGEUR = {
  denomination: "Vercel Inc.",
  adresse: "440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis",
  contact: "vercel.com/help",
} as const;

/** Date de version affichée en tête des deux pages légales. */
export const VERSION_LEGALE = "25 septembre 2026";
