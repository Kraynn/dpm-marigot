/**
 * DPM Marigot – Bandeau point relais colis
 * Direction « Le Nuancier » : bordure franche à 3 px, pas de coin arrondi.
 *
 * Créé le 2026-09-21. L'affiche fournie par le client
 * (assets/partenaires et services.png, celle qui est collée en vitrine sur la
 * photo de devanture) a deux colonnes : « Nos Partenaires » à gauche,
 * « Nos Services » à droite. Le site ne portait que la première, via
 * PartenairesBand. Celui-ci porte la seconde : DPM est un point relais colis
 * Pickup, et c'est un motif de recherche locale à lui seul.
 *
 * Pourquoi un bandeau et pas une cinquième carte dans « 01 — Nos métiers » :
 * un point relais n'est pas un savoir-faire. L'y mettre casserait le titre
 * « Quatre savoir-faire, un seul interlocuteur », la grille à quatre colonnes,
 * et mettrait le retrait de colis au même rang que la menuiserie.
 *
 * Il se place juste avant PartenairesBand : les deux barres étiquetées se
 * suivent — prusse pour le service, ocre pour l'assurance — et reconstituent
 * les deux colonnes de l'affiche dans l'ordre de lecture du site.
 *
 * Contrairement au bandeau partenaires, celui-ci ne défile pas : quatre logos
 * tiennent dans la largeur, et un service se lit, il ne se fait pas défiler.
 *
 * Logos : SVG officiels, servis depuis le dépôt (client/public/images/transporteurs/).
 *   pickup.svg     new_logo_pickup_blue.svg, thème du site pickup.fr
 *   chronopost.svg Wikimedia Commons, « Logo Chronopost.svg »
 *   colissimo.svg  logo-colissimo-horizontal.svg, laposte.fr
 *   dpd.svg        Wikimedia Commons, « DPD logo (2015).svg »
 * Pas de découpe de l'affiche composite : 597 px pour dix logos, la méthode a
 * déjà été écartée le 19/09 pour les partenaires. Les trois fichiers matriciels
 * déposés le 20/09 sont remplacés par ces SVG et conservés dans
 * _to_delete/logos-transporteurs-raster-2026-09-21/ — celui de Colissimo portait
 * un filigrane « cleanpng » en travers du logo.
 *
 * Le fond est clair : les trois marques ont un texte encre, illisible sur un
 * fond sombre (vérifié au rendu avant intégration).
 */

import type * as React from "react";

type Transporteur = {
  nom: string;
  fichier: string;
  /** hauteur d'affichage en px, équilibrée par la masse optique du logo */
  hauteur: number;
  /** largeur correspondante, déclarée pour éviter le saut de mise en page */
  largeur: number;
};

// Ratios repris du viewBox de chaque SVG, pour que la largeur déclarée soit la
// vraie : pickup 117×42, chronopost 503×109, colissimo 142×36, dpd 50×21.
const TRANSPORTEURS: Transporteur[] = [
  { nom: "Pickup", fichier: "pickup", hauteur: 28, largeur: 78 },
  { nom: "Chronopost", fichier: "chronopost", hauteur: 19, largeur: 88 },
  { nom: "Colissimo", fichier: "colissimo", hauteur: 19, largeur: 75 },
  { nom: "DPD", fichier: "dpd", hauteur: 24, largeur: 57 },
];

export default function RelaisColisBand() {
  return (
    <section
      id="relais-colis"
      aria-label="Point relais colis"
      className="border-b-[3px] border-encre"
    >
      <div className="barre-relais">
        <p className="br-etiquette">Point relais colis</p>
        <div className="br-corps">
          <p className="br-texte">
            Retrait et dépôt de vos colis au showroom, aux horaires d'ouverture.
          </p>
          <ul className="br-logos">
            {TRANSPORTEURS.map((t) => (
              <li key={t.fichier} className="shrink-0">
                <img
                  src={`/images/transporteurs/${t.fichier}.svg`}
                  alt={t.nom}
                  width={t.largeur}
                  height={t.hauteur}
                  loading="lazy"
                  decoding="async"
                  // Les dimensions passent par des variables CSS plutôt que par
                  // une hauteur inline : la feuille de style peut alors les
                  // réduire d'un cran sur téléphone (sans quoi le quatrième
                  // logo retombe seul sur une deuxième ligne) sans avoir à
                  // écraser un style inline à coups de !important.
                  style={
                    {
                      "--bl-h": `${t.hauteur}px`,
                      "--bl-w": `${t.largeur}px`,
                    } as React.CSSProperties
                  }
                  className="bl-logo max-w-none object-contain"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
