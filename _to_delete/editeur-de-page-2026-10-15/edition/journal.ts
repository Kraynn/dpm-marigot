/**
 * DPM Marigot – Éditeur de page : le journal des retouches (06/10/2026).
 *
 * Demande de Silva : « un éditeur de pages à côté du nuancier pour qu'ils puissent
 * en amont modifier les textes qu'ils veulent ou supprimer les blocs qu'ils veulent ;
 * l'edit ne modifie pas la page et on peut faire plusieurs modifs avant de soumettre ».
 *
 * Rien n'est écrit ailleurs que dans le navigateur du visiteur : les retouches
 * vivent dans ce journal, gardé en brouillon dans localStorage (une clé par page)
 * pour survivre à un rechargement. L'envoi (edition.soumettre) part par mail ; le
 * site lui-même n'est jamais modifié.
 *
 * L'état est tenu hors de React et lu par useSyncExternalStore : le mode édition
 * est consulté par des composants éloignés (useScrollReveal, FAQSection,
 * FloatingCTA) sans qu'il faille un contexte autour de l'application.
 * Même prudence que src/nuancier.ts autour du stockage et de l'adresse.
 */
import { useSyncExternalStore } from "react";

export type Modification = {
  id: string;
  type: "texte" | "retrait";
  /** Position de l'élément depuis #root, pour rejouer le brouillon. */
  chemin: string;
  /** Intitulé lisible de la section (« Nos métiers », « Pied de page »…). */
  section: string;
  /** Nature de l'élément (« titre », « carte », « bouton »…). */
  element: string;
  /** Texte d'origine, tel qu'écrit dans les sources. */
  avant: string;
  /** Nouveau texte ; vide pour un retrait. */
  apres: string;
  /** Contenu modifié de l'élément : sert au brouillon, jamais envoyé. */
  apresHtml?: string;
};

type Etat = { actif: boolean; modifs: Modification[] };

const CLE = "dpm-edition-brouillon";
const PARAM = "edition";

let etat: Etat = { actif: false, modifs: [] };
const abonnes = new Set<() => void>();

function publier(suivant: Etat) {
  etat = suivant;
  abonnes.forEach((f) => f());
}

function abonner(f: () => void) {
  abonnes.add(f);
  return () => {
    abonnes.delete(f);
  };
}

const cleDeLaPage = () => `${CLE}:${window.location.pathname}`;

function enregistrerBrouillon(modifs: Modification[]) {
  try {
    if (modifs.length) window.localStorage.setItem(cleDeLaPage(), JSON.stringify(modifs));
    else window.localStorage.removeItem(cleDeLaPage());
  } catch {
    /* navigation privée, stockage bloqué : les retouches valent pour la page seulement */
  }
}

/** Le brouillon de la page courante, ou une liste vide s'il est absent ou illisible. */
export function lireBrouillon(): Modification[] {
  try {
    const brut = window.localStorage.getItem(cleDeLaPage());
    const lu: unknown = brut ? JSON.parse(brut) : [];
    if (!Array.isArray(lu)) return [];
    return lu.filter(
      (m): m is Modification =>
        !!m &&
        typeof m === "object" &&
        (m.type === "texte" || m.type === "retrait") &&
        typeof m.chemin === "string" &&
        typeof m.avant === "string" &&
        typeof m.apres === "string",
    );
  } catch {
    return [];
  }
}

function ecrireDansAdresse(actif: boolean) {
  try {
    const url = new URL(window.location.href);
    if (actif) url.searchParams.set(PARAM, "1");
    else url.searchParams.delete(PARAM);
    window.history.replaceState(window.history.state, "", url);
  } catch {
    /* adresse non modifiable : sans conséquence */
  }
}

function marquerLaPage(actif: boolean) {
  document.documentElement.toggleAttribute("data-edition", actif);
}

/** Au chargement : `?edition=1` ouvre le mode édition avant le premier rendu. */
export function editionInitiale() {
  let demande = false;
  try {
    demande = new URLSearchParams(window.location.search).get(PARAM) === "1";
  } catch {
    demande = false;
  }
  if (demande) {
    marquerLaPage(true);
    etat = { ...etat, actif: true };
  }
}

export function ouvrirEdition() {
  if (etat.actif) return;
  marquerLaPage(true);
  ecrireDansAdresse(true);
  publier({ ...etat, actif: true });
}

/**
 * Remet `?edition=1` dans l'adresse. Après un retour arrière du navigateur, le
 * mode reste ouvert mais l'adresse revient à celle d'avant : un rechargement
 * sortait alors du mode édition sans prévenir.
 */
export function rappelerDansAdresse() {
  if (etat.actif) ecrireDansAdresse(true);
}

/** Sort du mode édition. Le brouillon reste sur l'appareil. */
export function fermerEdition() {
  marquerLaPage(false);
  ecrireDansAdresse(false);
  publier({ actif: false, modifs: [] });
}

/** Adresse de la page sans `?edition=1` : celle du rechargement et celle du mail. */
export function adresseSansEdition(): string {
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete(PARAM);
    return url.toString();
  } catch {
    return window.location.href;
  }
}

let compteur = 0;
export const nouvelId = () => `m${Date.now().toString(36)}${(compteur++).toString(36)}`;

/** Ajoute une retouche, ou remplace celle qui porte le même id. */
export function poser(modif: Modification, { brouillon = true } = {}) {
  const existe = etat.modifs.some((m) => m.id === modif.id);
  const modifs = existe
    ? etat.modifs.map((m) => (m.id === modif.id ? modif : m))
    : [...etat.modifs, modif];
  if (brouillon) enregistrerBrouillon(modifs);
  publier({ ...etat, modifs });
}

export function oter(id: string) {
  const modifs = etat.modifs.filter((m) => m.id !== id);
  enregistrerBrouillon(modifs);
  publier({ ...etat, modifs });
}

/** Efface le brouillon de la page (après un envoi, ou sur « Tout annuler »). */
export function viderBrouillon() {
  enregistrerBrouillon([]);
}

/** Vide le journal sans toucher au brouillon : avant de le rejouer sur une page. */
export function repartirDeZero() {
  publier({ ...etat, modifs: [] });
}

/** Réécrit le brouillon d'après le journal : après un rejeu qui a écarté des retouches. */
export function synchroniserBrouillon() {
  enregistrerBrouillon(etat.modifs);
}

export const lireEtat = () => etat;

export function useEdition(): Etat {
  return useSyncExternalStore(abonner, lireEtat);
}

const lireActif = () => etat.actif;

/** Vrai en mode édition. Ne provoque un rendu que lorsque le mode change. */
export function useEditionActive(): boolean {
  return useSyncExternalStore(abonner, lireActif);
}
