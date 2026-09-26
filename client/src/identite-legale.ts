/**
 * DPM Marigot — identité légale publiée dans les mentions légales.
 *
 * Source unique des informations que seule l'entreprise détient. Les champs à
 * `null` sont ceux qu'elle n'a pas encore transmis : la page les rend alors avec
 * une mention explicite « à compléter » plutôt qu'une valeur plausible.
 * RIEN ne doit être deviné ici — un SIRET inventé sur une page de mentions
 * légales est une fausse déclaration publiée.
 *
 * À rapprocher de `asap-devis/app/pricing/dpm-marigot.json` (clé `artisan._todo_legal`),
 * qui bloque déjà l'envoi de devis contractuels pour un manque voisin. Les deux listes
 * ne sont PAS identiques et il ne faut pas les croire interchangeables :
 *   - `_todo_legal` réclame SIRET, APE, assurance décennale, médiateur, logo ;
 *   - ici s'ajoutent la dénomination légale, la TVA et le directeur de la publication,
 *     que la LCEN impose à une page de mentions légales et qu'un devis n'exige pas.
 *
 * Créé le 25/09/2026, complété le même jour (médiateur) après relecture adverse.
 * 26/09/2026 : identité remplie depuis le registre public. Restent à `null` les deux
 * seules informations qu'aucun registre ne publie — assurance décennale et médiateur.
 */

export type ChampLegal = string | null;

export const DPM = {
  /** Nom commercial, tel qu'il s'affiche partout sur le site. */
  nomCommercial: "DPM Marigot",

  /*
   * Les sept champs suivants sont recopiés du registre public le 26/09/2026 —
   * annuaire-entreprises.data.gouv.fr/entreprise/dpm-marigot-895094456 (sources
   * INSEE, INPI, DGFiP), relus aussi par l'API recherche-entreprises.api.gouv.fr.
   * Le registre dit SAS : la « micro-entreprise » que portait la grille de prix
   * était fausse. En cas de doute, c'est le registre qui fait foi, pas ce fichier.
   */

  /** Dénomination sociale, telle qu'immatriculée. */
  denominationLegale: "DPM MARIGOT" as ChampLegal,

  /** Forme juridique. */
  formeJuridique: "Société par actions simplifiée (SAS)" as ChampLegal,

  /** Capital social — obligatoire pour une société inscrite au registre (LCEN art. 6-III). */
  capital: "1 000 €" as ChampLegal,

  /** Numéro d'immatriculation. Le registre ne nomme pas le greffe : on ne l'écrit pas. */
  immatriculation: "RNE n° 895 094 456" as ChampLegal,

  /** SIRET du siège (14 chiffres). */
  siret: "895 094 456 00020" as ChampLegal,

  /** Code APE / NAF. */
  ape: "43.99C" as ChampLegal,

  /** Numéro de TVA intracommunautaire. */
  tva: "FR79 895 094 456" as ChampLegal,

  /**
   * Directeur de la publication (LCEN art. 6-III) : le représentant légal.
   * Le registre porte « PIAVOUX (LOPEZ) Gina, Président de SAS ». Anthony a demandé
   * le 26/09 qu'il n'y ait plus de section dédiée : la mention tient en une ligne
   * dans le bloc « Éditeur », mais elle reste — la LCEN l'exige.
   */
  directeurPublication: "Gina PIAVOUX (LOPEZ), Président de SAS" as ChampLegal,

  /** Assurance décennale : assureur + n° de police + zone couverte. */
  assuranceDecennale: null as ChampLegal,

  /**
   * Médiateur de la consommation : nom et adresse (site ou postale).
   *
   * OBLIGATOIRE ici, et c'est le manque le plus facile à rater : DPM vend à des
   * PARTICULIERS. L'article L.616-1 du code de la consommation impose à tout
   * professionnel de communiquer les coordonnées du médiateur dont il relève, sur son
   * site et sur ses documents contractuels. L'adhésion est payante et annuelle.
   *
   * Ne pas confondre avec le contrat ASap ↔ DPM, qui est B2B : là, aucun médiateur
   * n'est requis, et les conditions de prestation le disent. Les deux coexistent.
   *
   * `artisan.mediateur` de la grille de prix ASap Devis porte le même manque.
   */
  mediateur: null as ChampLegal,

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
export const VERSION_LEGALE = "26 septembre 2026";
