/**
 * DPM Marigot – Éditeur de page : lecture du DOM (06/10/2026).
 *
 * L'éditeur ne connaît aucun composant : il travaille sur la page rendue. Ces
 * fonctions décident de ce qui est un texte modifiable, de ce qui est un bloc
 * retirable, et de la façon de les nommer dans le mail. Aucune ne modifie la
 * structure de la page : React garde la main sur ses nœuds.
 *
 * Trois attributs servent de bornes :
 *   data-edition-ui     l'interface de l'éditeur elle-même ;
 *   data-edition-libre  une zone du site qui reste utilisable (le nuancier) ;
 *   data-edition-socle  l'en-tête fixe, qu'on ne peut pas retirer d'un bloc.
 */

const HORS_CHAMP = "[data-edition-ui],[data-edition-libre],[data-sonner-toaster]";
const NON_TEXTE = "input,textarea,select,option,script,style,iframe,.sr-only";

const racine = () => document.getElementById("root");

/** Vrai pour l'interface de l'éditeur et les zones du site laissées utilisables. */
export const estHorsChamp = (el: Element) => el.closest(HORS_CHAMP) !== null;

const nettoyer = (s: string) => s.replace(/\s+/g, " ").trim();

function aDuTexteDirect(el: Element): boolean {
  for (const n of Array.from(el.childNodes)) {
    if (n.nodeType === Node.TEXT_NODE && n.textContent && n.textContent.trim()) return true;
  }
  return false;
}

/**
 * Le texte d'un élément tel qu'il est écrit dans les sources. `textContent` et
 * non `innerText` : ce dernier applique `text-transform`, et un intertitre en
 * capitales ne se retrouverait plus par recherche dans le code.
 */
export const lireTexte = (el: Element) => nettoyer(el.textContent ?? "");

/** Vrai si l'élément peut être désigné : dans la page, et pas la page elle-même. */
function designable(el: Element | null): el is HTMLElement {
  const r = racine();
  if (!(el instanceof HTMLElement) || !r || el === r || !r.contains(el)) return false;
  if (el.parentElement === r) return false;
  if (el.hasAttribute("data-edition-socle") || el.querySelector("[data-edition-socle]")) return false;
  return !estHorsChamp(el);
}

/**
 * Le texte visé par un clic : le plus petit élément qui porte du texte en direct,
 * élargi tant que son parent en porte aussi (un mot en gras désigne sa phrase,
 * pas le seul mot). Rend `null` hors d'un texte.
 */
export function cibleTexte(depart: Element): HTMLElement | null {
  if (estHorsChamp(depart) || depart.closest(NON_TEXTE)) return null;
  let el: Element | null = depart.closest("svg")?.parentElement ?? depart;
  // Un clic dans le vide d'un conteneur, ou sur une photo, ne désigne aucun texte.
  if (!el || !aDuTexteDirect(el)) return null;
  while (el.parentElement && aDuTexteDirect(el.parentElement) && designable(el.parentElement)) {
    el = el.parentElement;
  }
  return designable(el) ? el : null;
}

/** Le bloc visé quand le pointeur n'est pas sur un texte : l'élément lui-même. */
export function cibleBloc(depart: Element): HTMLElement | null {
  if (estHorsChamp(depart)) return null;
  let el: Element | null = depart.closest("svg")?.parentElement ?? depart;
  while (el && !designable(el)) {
    if (el === racine()) return null;
    el = el.parentElement;
  }
  return designable(el) ? el : null;
}

const memeCadre = (a: DOMRect, b: DOMRect) =>
  Math.abs(a.top - b.top) < 4 &&
  Math.abs(a.left - b.left) < 4 &&
  Math.abs(a.right - b.right) < 4 &&
  Math.abs(a.bottom - b.bottom) < 4;

/**
 * Le bloc parent, en sautant les enveloppes qui ont le même contour : chaque
 * pression sur « Élargir » doit désigner quelque chose de visiblement plus grand.
 */
export function elargir(el: HTMLElement): HTMLElement | null {
  const cadre = el.getBoundingClientRect();
  let p = el.parentElement;
  while (designable(p) && memeCadre(p.getBoundingClientRect(), cadre)) p = p.parentElement;
  return designable(p) ? p : null;
}

/** Nature de l'élément, dans les mots du mail. */
export function nommerElement(el: Element): string {
  const t = el.tagName.toLowerCase();
  if (/^h[1-6]$/.test(t)) return "titre";
  if (el.matches("[data-slot=accordion-item]")) return "question et sa réponse";
  if (el.matches("[data-slot=accordion-trigger]")) return "question";
  if (el.closest("[data-slot=accordion-content]")) return "réponse";
  if (t === "button" || el.matches(".cta-btn,.cta-btn-ghost")) return "bouton";
  if (t === "a") return "lien";
  if (t === "p") return "paragraphe";
  if (t === "li") return "élément de liste";
  if (t === "ul" || t === "ol") return "liste";
  if (t === "img" || t === "figure") return "photo";
  if (t === "figcaption") return "légende";
  if (t === "article" || el.matches(".card-hard")) return "carte";
  if (t === "section") return "section";
  if (t === "form") return "formulaire";
  if (t === "label") return "libellé";
  if (t === "footer") return "pied de page";
  return aDuTexteDirect(el) ? "texte" : "bloc";
}

/** Intitulé de la section qui contient l'élément. */
export function nommerSection(el: Element): string {
  if (el.closest("[data-edition-socle]")) return "En-tête";
  const s = el.closest("section,footer,header,main");
  if (!s) return "Page";
  if (s.tagName === "FOOTER") return "Pied de page";
  if (s.querySelector("[data-logo-banniere]")) return "Bannière d'accueil";
  // Le dernier intertitre placé avant l'élément ; à défaut, le premier de la section.
  const titres = Array.from(s.querySelectorAll("h2"));
  const avant = titres.filter(
    (h) => h === el || h.contains(el) || h.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING,
  );
  const titre = avant[avant.length - 1] ?? titres[0] ?? s.querySelector("h1");
  // Un titre déjà retouché porte son texte d'origine dans data-edition-modifie.
  const nom = titre ? titre.getAttribute("data-edition-modifie") || lireTexte(titre) : s.id;
  return nom ? nom.slice(0, 80) : "Page";
}

/** Début du contenu d'un bloc, pour le reconnaître dans le mail. */
export function extrait(el: Element, longueur = 200): string {
  // Un bloc réunit plusieurs éléments : `textContent` les collerait bout à bout
  // (« MenuiserieMenuiserieHabillages… »). On sépare chaque fragment d'une espace.
  const fragments: string[] = [];
  const marcheur = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  while (marcheur.nextNode()) {
    const fragment = nettoyer(marcheur.currentNode.textContent ?? "");
    if (fragment) fragments.push(fragment);
  }
  const texte = fragments.join(" ");
  if (texte) return texte.length > longueur ? `${texte.slice(0, longueur)}…` : texte;
  const img = el instanceof HTMLImageElement ? el : el.querySelector("img");
  if (img) return `Photo : ${img.alt || img.getAttribute("src") || "sans description"}`;
  if (el.querySelector("iframe")) return "Carte Google";
  return "";
}

/** Position de l'élément depuis #root : « 1/0/3/2 ». */
export function chemin(el: Element): string {
  const r = racine();
  const pas: number[] = [];
  let n: Element | null = el;
  while (n && n !== r && n.parentElement) {
    pas.unshift(Array.prototype.indexOf.call(n.parentElement.children, n));
    n = n.parentElement;
  }
  return pas.join("/");
}

export function trouver(cheminVoulu: string): HTMLElement | null {
  let n: Element | null = racine();
  if (!cheminVoulu) return null;
  for (const pas of cheminVoulu.split("/")) {
    n = n?.children[Number(pas)] ?? null;
    if (!n) return null;
  }
  return n instanceof HTMLElement ? n : null;
}

/** Place le curseur de saisie sous le pointeur ; en fin de texte si c'est impossible. */
export function placerCurseur(el: HTMLElement, x: number, y: number) {
  const sel = window.getSelection();
  if (!sel) return;
  let plage: Range | null = null;
  const doc = document as Document & {
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
  };
  try {
    if (doc.caretPositionFromPoint) {
      const pos = doc.caretPositionFromPoint(x, y);
      if (pos) {
        plage = document.createRange();
        plage.setStart(pos.offsetNode, pos.offset);
      }
    } else if (doc.caretRangeFromPoint) {
      plage = doc.caretRangeFromPoint(x, y);
    }
  } catch {
    plage = null;
  }
  if (!plage || !el.contains(plage.startContainer)) {
    plage = document.createRange();
    plage.selectNodeContents(el);
    plage.collapse(false);
  }
  plage.collapse(true);
  sel.removeAllRanges();
  sel.addRange(plage);
}

/**
 * Remplace le texte d'un élément sans toucher à ses pictogrammes : le premier
 * nœud de texte reçoit la valeur, les autres sont vidés. Sert aux boutons, où
 * la saisie sur place n'est pas fiable d'un navigateur à l'autre.
 */
export function poserTexte(el: HTMLElement, valeur: string) {
  const textes: Text[] = [];
  const marcheur = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  while (marcheur.nextNode()) {
    const n = marcheur.currentNode as Text;
    if (n.data.trim() && !n.parentElement?.closest("svg")) textes.push(n);
  }
  if (!textes.length) {
    el.insertBefore(document.createTextNode(valeur), el.firstChild);
    return;
  }
  textes[0].data = valeur;
  textes.slice(1).forEach((n) => (n.data = ""));
}
