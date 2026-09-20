/**
 * DPM Marigot – Le point relais colis, en bloc incrusté
 * Direction « Le Nuancier » : cadre blanc, bordure franche à 3 px, ombre dure,
 * légère rotation — la recette des polaroïds de la bannière et de la devanture.
 *
 * Remplace le bandeau pleine largeur du 2026-09-21, écarté par Silva le même
 * jour (« le bandeau relais colis est nul, moi je le vois plutôt comme un gros
 * bloc incrusté »). Le composant a été renommé plutôt que recréé, pour garder
 * son historique.
 *
 * Placement demandé : à cheval entre la bannière d'accueil et la section des
 * avis, dans la gouttière libre entre le bloc « Appel direct » (colonne texte)
 * et le polaroïd « Plafond · après » (colonne collage).
 *
 * Pourquoi il est rendu depuis TestimonialsSection et pas depuis la bannière :
 * HeroSection porte `overflow-hidden` — nécessaire au grand rond ocre qui
 * déborde en haut à droite. Un bloc ancré dans la bannière et dépassant vers le
 * bas y serait rogné net. Il est donc posé dans la section avis, qui reçoit
 * `relative`, et tiré vers le haut : il déborde sur le crème de la bannière et
 * recouvre le filet de 3 px qui sépare les deux sections.
 *
 * Sous 1024 px il repasse en flux normal, pleine largeur, sans rotation ni
 * débordement : la colonne collage de la bannière disparaît sous 640 px, et au
 * milieu il n'y a plus de gouttière où se loger.
 *
 * Il garde l'ancre `#relais-colis` : le pied de page pointe dessus.
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

// Ratios repris du viewBox de chaque SVG : chronopost 503×109, colissimo
// 142×36, dpd 50×21. Les deux dimensions sont imposées, sinon un ratio faux
// déforme le logo.
const TRANSPORTEURS: Transporteur[] = [
  { nom: "Chronopost", fichier: "chronopost", hauteur: 16, largeur: 74 },
  { nom: "Colissimo", fichier: "colissimo", hauteur: 16, largeur: 63 },
  { nom: "DPD", fichier: "dpd", hauteur: 20, largeur: 48 },
];

export default function PointRelaisCard() {
  return (
    <aside id="relais-colis" aria-label="Point relais colis" className="carte-relais">
      <p className="cr-etiquette">Point relais</p>

      <img
        src="/images/transporteurs/pickup.svg"
        alt="Pickup"
        width={140}
        height={50}
        loading="lazy"
        decoding="async"
        className="cr-pickup"
      />

      <ul className="cr-logos">
        {TRANSPORTEURS.map((t) => (
          <li key={t.fichier}>
            <img
              src={`/images/transporteurs/${t.fichier}.svg`}
              alt={t.nom}
              width={t.largeur}
              height={t.hauteur}
              loading="lazy"
              decoding="async"
              style={
                {
                  "--cr-h": `${t.hauteur}px`,
                  "--cr-w": `${t.largeur}px`,
                } as React.CSSProperties
              }
              className="cr-logo"
            />
          </li>
        ))}
      </ul>
    </aside>
  );
}
