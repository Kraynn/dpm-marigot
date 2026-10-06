/**
 * DPM Marigot – Éditeur de page : capture du rendu modifié (06/10/2026).
 *
 * Jointe au mail pour que Silva voie la page telle que le client l'a laissée.
 * `modern-screenshot` fait dessiner la page par le navigateur lui-même (SVG
 * foreignObject) : les couleurs `oklch` et `color-mix` de Tailwind v4 passent,
 * là où un moteur de rendu réécrit en JavaScript les refuse. La bibliothèque est
 * importée à l'envoi seulement.
 *
 * La capture est un plus, jamais une condition : en cas d'échec, de délai dépassé
 * ou d'image trop lourde, la fonction rend `null` et le mail part sans elle.
 */

/** Longueur maximale en base64 (≈ 2,5 Mo) : le corps d'une requête Vercel plafonne à 4,5 Mo. */
const TAILLE_MAX = 3_300_000;
const DELAI = 15_000;
/** Surface et hauteur au-delà desquelles un canvas sort vide (Safari sur iPhone). */
const SURFACE_MAX = 16_000_000;
const HAUTEUR_MAX = 16_000;

const prochaineImage = () => new Promise<void>((ok) => requestAnimationFrame(() => ok()));

function enJpeg(canvas: HTMLCanvasElement): string | null {
  for (const qualite of [0.8, 0.6, 0.45, 0.3]) {
    const donnees = canvas.toDataURL("image/jpeg", qualite).split(",")[1] ?? "";
    if (donnees && donnees.length <= TAILLE_MAX) return donnees;
  }
  return null;
}

function reduire(canvas: HTMLCanvasElement, facteur: number): HTMLCanvasElement {
  const petit = document.createElement("canvas");
  petit.width = Math.round(canvas.width * facteur);
  petit.height = Math.round(canvas.height * facteur);
  petit.getContext("2d")?.drawImage(canvas, 0, 0, petit.width, petit.height);
  return petit;
}

/**
 * Demande tout de suite les images en chargement différé. La capture attend que
 * chaque image de la page soit chargée ; une image du bas de page jamais défilée
 * ne l'est jamais, et la bibliothèque patientait alors jusqu'à son délai (8 s
 * mesurées sur l'accueil). Appelé à l'ouverture du mode édition : à l'envoi, tout
 * est déjà là.
 */
export function chargerLesImages() {
  document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((img) => {
    img.loading = "eager";
  });
}

/** Capture pleine page en JPEG, encodée en base64 sans préfixe ; `null` si impossible. */
export async function capturerLaPage(): Promise<string | null> {
  const html = document.documentElement;
  html.setAttribute("data-edition-capture", "");
  chargerLesImages();
  try {
    // Deux images : le temps que les styles propres à la capture soient appliqués.
    await prochaineImage();
    await prochaineImage();

    const { domToCanvas } = await import("modern-screenshot");
    const largeur = html.clientWidth;
    const hauteur = html.scrollHeight;
    const echelle = Math.min(1, HAUTEUR_MAX / hauteur, Math.sqrt(SURFACE_MAX / (largeur * hauteur)));

    const rendu = domToCanvas(document.body, {
      width: largeur,
      height: hauteur,
      scale: echelle,
      backgroundColor: getComputedStyle(document.body).backgroundColor || "#ffffff",
      // Le clone de <body> retrouvait la marge par défaut du navigateur (8 px).
      style: { margin: "0" },
      timeout: 8_000,
      filter: (n) =>
        !(n instanceof Element) ||
        !n.matches("[data-edition-ui],[data-edition-retire],[data-sonner-toaster]"),
    });
    const delai = new Promise<null>((ok) => setTimeout(() => ok(null), DELAI));
    const canvas = await Promise.race([rendu, delai]);
    if (!canvas) return null;

    return enJpeg(canvas) ?? enJpeg(reduire(canvas, 0.6));
  } catch (err) {
    console.error("[edition] capture impossible :", err);
    return null;
  } finally {
    html.removeAttribute("data-edition-capture");
  }
}
