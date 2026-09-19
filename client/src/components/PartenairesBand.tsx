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
 * ⚠️ Définition des logos. Les six PNG servis ici sont découpés de l'image
 * composite fournie par DPM (assets/partenaires et services.png, 597 px de
 * large pour dix logos), détourés et agrandis ×3 pour que le navigateur
 * sous-échantillonne au lieu de sur-échantillonner. Silva doit fournir des
 * découpes propres : elles se déposent dans client/public/images/partenaires/
 * sous les mêmes noms, et seules les hauteurs ci-dessous sont à réajuster.
 *
 * Hauteurs d'affichage : normalisées à l'œil, pas en pixels. Un logo à
 * pictogramme (MAIF) supporte d'être plus haut qu'un logo purement
 * typographique (Symabat), sans quoi le second écrase le premier en largeur.
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
  { nom: "MAIF", fichier: "maif", hauteur: 26, largeur: 33 },
  { nom: "CET Cerutti", fichier: "cet-cerutti", hauteur: 17, largeur: 63 },
  { nom: "Symabat", fichier: "symabat", hauteur: 14, largeur: 99 },
  { nom: "Polyexpert", fichier: "polyexpert", hauteur: 15, largeur: 64 },
  { nom: "Eurexo", fichier: "eurexo", hauteur: 15, largeur: 74 },
  { nom: "Dynaren", fichier: "dynaren", hauteur: 14, largeur: 81 },
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
    <section
      aria-label="Nos partenaires"
      className="bg-creme-2 border-b-[3px] border-encre py-8 lg:py-10"
    >
      <div className="container">
        <div className="barre-partenaires">
          <p className="bp-etiquette">Nos partenaires</p>
          <div className="bandeau-partenaires">
            <div className="piste-partenaires">
              <Groupe />
              <Groupe copie />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
