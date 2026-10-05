/**
 * DPM Marigot – Nuancier en direct (05/10/2026).
 *
 * Repris du kit du rendez-vous (asap-web/_atelier/rdv-dpm-2026-09-29/index.html,
 * `PALETTES` et `cssFor()`) : chaque palette redéfinit les variables de
 * client/src/index.css dans une balise <style id="nuancier-live">. Aucune classe
 * n'est touchée ; les composants suivent les variables.
 *
 * Demande du client (mail d'Anne-Cécile, cité par Silva le 05/10) : « beige chaud,
 * anthracite, blanc cassé, terracotta ». Les quatre propositions combinent ces
 * quatre teintes avec des logiques distinctes ; « Couleurs du logo » est la
 * variante B (branche pieces-dpm-2026-10-05-nuancier), gardée en dernier.
 *
 * Contraste : chaque palette a été passée au contrôle WCAG AA sur les paires
 * texte/fond réellement affichées (accueil + page légale, 1440 et 390 px).
 * Toute nouvelle valeur doit repasser ce contrôle.
 *
 * Choix mémorisé dans localStorage (clé ci-dessous) et partageable par
 * `?nuancier=<id>`. « actuel » = aucune surcharge : le site tel que défini
 * dans index.css.
 */

export type Teintes = {
  creme: string;
  creme2: string;
  encre: string;
  terre: string;
  terreDark: string;
  ocre: string;
  prusse: string;
  olive: string;
  taupe: string;
  trait: string;
};

export type Palette = { id: string; nom: string; sous: string; v: Teintes };

export const PALETTES: Palette[] = [
  {
    id: "actuel",
    nom: "Actuel",
    sous: "Le site aujourd'hui : terracotta sur crème",
    v: { creme: "#f3ede4", creme2: "#eae2d6", encre: "#1a1613", terre: "#a8442f", terreDark: "#8c3524", ocre: "#c99a3b", prusse: "#1f3a52", olive: "#5e6b45", taupe: "#6f6458", trait: "#d9cfc0" },
  },
  {
    id: "terracotta",
    nom: "Terracotta",
    sous: "Fond blanc cassé, accent terracotta, texte et aplats anthracite",
    v: { creme: "#faf6f0", creme2: "#efe5d7", encre: "#2a2826", terre: "#a8462b", terreDark: "#8c3920", ocre: "#e2cdb0", prusse: "#3b3936", olive: "#6e5f52", taupe: "#6a6056", trait: "#ddd1c1" },
  },
  {
    id: "beige-anthracite",
    nom: "Beige & anthracite",
    sous: "Fond beige chaud, accent anthracite, terracotta en second",
    v: { creme: "#ece1d1", creme2: "#e1d3bf", encre: "#252321", terre: "#363431", terreDark: "#1f1e1c", ocre: "#f6efe4", prusse: "#93402a", olive: "#6a5848", taupe: "#625950", trait: "#d3c4ae" },
  },
  {
    id: "terre-profonde",
    nom: "Terre profonde",
    sous: "Terracotta sombre sur blanc cassé, beige chaud en appui",
    v: { creme: "#f7f2ea", creme2: "#ece2d4", encre: "#2b2826", terre: "#86361f", terreDark: "#6c2a17", ocre: "#d9c3a3", prusse: "#4a433d", olive: "#7a4a33", taupe: "#665c52", trait: "#ddcfbd" },
  },
  {
    id: "anthracite",
    nom: "Anthracite",
    sous: "Anthracite pour les boutons et bandeaux, touches terracotta",
    v: { creme: "#f8f5ef", creme2: "#ece6dc", encre: "#232322", terre: "#3d3c3a", terreDark: "#2a2928", ocre: "#efc6b3", prusse: "#8a3a22", olive: "#5c5a56", taupe: "#666159", trait: "#dcd5c9" },
  },
  {
    id: "logo",
    nom: "Couleurs du logo",
    sous: "D'après le logo : bleu pétrole, ocre, rose-beige",
    v: { creme: "#f1e6df", creme2: "#e6d5cb", encre: "#1a1613", terre: "#172f37", terreDark: "#0e1f25", ocre: "#fec868", prusse: "#1f3a52", olive: "#5e6b45", taupe: "#6a5e53", trait: "#d4bcae" },
  },
];

export const NUANCIER_DEFAUT = "actuel";
const CLE = "dpm-nuancier";
const ID_STYLE = "nuancier-live";

export function cssFor(v: Teintes): string {
  return `:root,html:root{
--color-creme:${v.creme};--color-creme-2:${v.creme2};--color-encre:${v.encre};
--color-terre:${v.terre};--color-terre-dark:${v.terreDark};--color-ocre:${v.ocre};
--color-prusse:${v.prusse};--color-olive:${v.olive};--color-taupe:${v.taupe};--color-trait:${v.trait};
--background:${v.creme};--foreground:${v.encre};--card-foreground:${v.encre};--popover-foreground:${v.encre};
--primary:${v.terre};--accent:${v.ocre};--accent-foreground:${v.encre};
--secondary:${v.creme2};--secondary-foreground:${v.encre};--muted:${v.creme2};--muted-foreground:${v.taupe};
--border:${v.trait};--input:${v.trait};--ring:${v.terre};--destructive:${v.terre};
--chart-1:${v.terre};--chart-2:${v.ocre};--chart-3:${v.prusse};--chart-4:${v.olive};--chart-5:${v.taupe};
}`;
}

export const trouverPalette = (id: string | null | undefined) =>
  PALETTES.find((p) => p.id === id) ?? null;

/** Pose (ou retire, pour « actuel ») la surcharge de variables. */
export function appliquerPalette(id: string) {
  const p = trouverPalette(id);
  let st = document.getElementById(ID_STYLE) as HTMLStyleElement | null;
  if (!p || p.id === NUANCIER_DEFAUT) {
    st?.remove();
    return;
  }
  if (!st) {
    st = document.createElement("style");
    st.id = ID_STYLE;
    document.head.appendChild(st);
  }
  st.textContent = cssFor(p.v);
}

export function lireMemorise(): string | null {
  try {
    return window.localStorage.getItem(CLE);
  } catch {
    return null;
  }
}

export function memoriser(id: string) {
  try {
    if (id === NUANCIER_DEFAUT) window.localStorage.removeItem(CLE);
    else window.localStorage.setItem(CLE, id);
  } catch {
    /* navigation privée, stockage bloqué : le choix vaut pour la page seulement */
  }
}

/** Met `?nuancier=<id>` dans l'adresse, sans recharger, pour que le lien se partage. */
export function ecrireDansAdresse(id: string) {
  try {
    const url = new URL(window.location.href);
    if (id === NUANCIER_DEFAUT) url.searchParams.delete("nuancier");
    else url.searchParams.set("nuancier", id);
    window.history.replaceState(window.history.state, "", url);
  } catch {
    /* adresse non modifiable : sans conséquence */
  }
}

/** Au chargement : `?nuancier=` gagne sur le choix mémorisé. Renvoie l'id appliqué. */
export function nuancierInitial(): string {
  let id: string | null = null;
  try {
    id = new URLSearchParams(window.location.search).get("nuancier");
  } catch {
    id = null;
  }
  if (trouverPalette(id)) {
    memoriser(id!);
  } else {
    id = lireMemorise();
  }
  const p = trouverPalette(id) ?? trouverPalette(NUANCIER_DEFAUT)!;
  appliquerPalette(p.id);
  return p.id;
}
