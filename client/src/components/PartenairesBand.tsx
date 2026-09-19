/**
 * DPM Marigot – Bandeau des partenaires
 * Direction « Le Nuancier » : bordure franche à 3 px, pas de coin arrondi.
 *
 * Créé le 2026-09-19, intercalé entre « 04 — Le showroom » et « 05 — Devis »
 * pour que l'argument assurance tombe juste avant la demande de devis.
 * Le bandeau ne porte pas de numéro de section : la numérotation 04/05/06
 * déjà en place reste inchangée.
 *
 * Refondu le 2026-09-19 (2e passe) au format du ticker d'ASap FC : une
 * étiquette pleine qui ne bouge pas à gauche, la piste qui défile juste à sa
 * droite. La première version empilait le titre au-dessus d'une bande pleine
 * largeur — deux fois plus haute pour la même information.
 *
 * 3e passe le même jour : plus aucun espace autour. La barre va d'un bord à
 * l'autre et fait elle-même la césure entre le showroom et le devis, donc pas
 * de padding de section, pas de conteneur, et une seule bordure — celle du
 * bas. WhyUsSection porte déjà son border-b : en ajouter une en haut ici
 * donnerait un trait de 6 px au lieu de 3.
 *
 * 4e passe le 2026-09-20 : les vrais logos. Les six PNG servis ici ne sont
 * plus des découpes de l'affiche composite (assets/partenaires et
 * services.png, 597 px pour dix logos, illisibles une fois agrandies) mais les
 * sources fournies par DPM, déposées dans assets/ et détourées : remplissage
 * du blanc depuis les bords en connectivité 4, fondu d'alpha sur le liseré,
 * rognage au contenu, export à 4× la hauteur d'affichage. Trois portaient déjà
 * un canal alpha (MAIF, Polyexpert, Dynaren). CET-Cerutti a demandé une
 * fermeture morphologique : la diagonale blanche de son carré rejoint le blanc
 * du pourtour par un goulot d'un pixel, et un détourage simple emportait avec
 * elle l'anneau du cercle.
 *
 * Hauteurs d'affichage : normalisées à l'œil, pas en pixels. Un logo à
 * pictogramme (MAIF, CET) supporte d'être plus haut qu'un logo purement
 * typographique (Symabat), sans quoi le second écrase le premier en largeur.
 * Les largeurs sont calées sur le ratio réel du fichier détouré : les deux
 * dimensions étant imposées en dur, un ratio faux déforme le logo.
 *
 * Une variante « cellules » — chaque partenaire dans sa case bordée sur une
 * barre crème — a été montée le même jour et écartée par Silva : elle portait
 * le bandeau à 81 px, lui faisait perdre son rôle de respiration blanche entre
 * le showroom et le devis, et ne laissait que deux partenaires visibles sur
 * téléphone. Les logos détourés sont assez homogènes pour s'en passer.
 */

type Partenaire = {
  nom: string;
  fichier: string;
  /** hauteur d'affichage en px, équilibrée par la masse optique du logo */
  hauteur: number;
  /** largeur correspondante, déclarée pour éviter le saut de mise en page */
  largeur: number;
};

const PARTENAIRES: Partenaire[] = [
  { nom: "MAIF", fichier: "maif", hauteur: 30, largeur: 38 },
  { nom: "CET Cerutti", fichier: "cet-cerutti", hauteur: 38, largeur: 32 },
  { nom: "Symabat", fichier: "symabat", hauteur: 15, largeur: 113 },
  { nom: "Polyexpert", fichier: "polyexpert", hauteur: 19, largeur: 82 },
  { nom: "Eurexo", fichier: "eurexo", hauteur: 18, largeur: 83 },
  { nom: "Dynaren", fichier: "dynaren", hauteur: 20, largeur: 76 },
];

function Groupe({ copie = false }: { copie?: boolean }) {
  return (
    <ul
      className="groupe-partenaires"
      {...(copie ? { "aria-hidden": true, "data-copie": "" } : {})}
    >
      {PARTENAIRES.map(p => (
        <li key={p.fichier} className="shrink-0">
          <img
            src={`/images/partenaires/${p.fichier}.png`}
            alt={copie ? "" : p.nom}
            width={p.largeur}
            height={p.hauteur}
            loading="lazy"
            decoding="async"
            style={{ height: p.hauteur, width: p.largeur }}
            className="max-w-none object-contain"
          />
        </li>
      ))}
    </ul>
  );
}

export default function PartenairesBand() {
  return (
    <section aria-label="Nos partenaires" className="border-b-[3px] border-encre">
      <div className="barre-partenaires">
        <p className="bp-etiquette">Nos partenaires</p>
        <div className="bandeau-partenaires">
          <div className="piste-partenaires">
            <Groupe />
            <Groupe copie />
          </div>
        </div>
      </div>
    </section>
  );
}
