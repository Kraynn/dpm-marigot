/**
 * DPM Marigot – Bandeau des partenaires
 * Direction « Le Nuancier » : bande pleine largeur, séparateur à 3 px.
 *
 * Créé le 2026-09-19, intercalé entre « 04 — Le showroom » et « 05 — Devis »
 * pour que l'argument assurance tombe juste avant la demande de devis.
 * Le bandeau ne porte pas de numéro de section : la numérotation 04/05/06
 * déjà en place reste inchangée.
 *
 * ⚠️ Définition des logos. DPM n'a fourni qu'une image composite
 * (assets/partenaires et services.png, 597 px de large pour dix logos). Les six
 * PNG servis ici en sont découpés : chacun pèse 45 à 106 px de large dans la
 * source, agrandi ×3 au découpage pour que le navigateur sous-échantillonne au
 * lieu de sur-échantillonner. Le filet sous « Dynaren » fait 3 px de haut dans
 * la source et reste illisible à l'écran — c'est la source qui le veut, pas le
 * découpage. Les vrais fichiers (vectoriels ou haute définition) sont à demander
 * à DPM ; ils se remplacent ici sans toucher au composant.
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
  { nom: "MAIF", fichier: "maif", hauteur: 34, largeur: 44 },
  { nom: "CET Cerutti", fichier: "cet-cerutti", hauteur: 22, largeur: 82 },
  { nom: "Symabat", fichier: "symabat", hauteur: 18, largeur: 127 },
  { nom: "Polyexpert", fichier: "polyexpert", hauteur: 20, largeur: 85 },
  { nom: "Eurexo", fichier: "eurexo", hauteur: 19, largeur: 94 },
  { nom: "Dynaren", fichier: "dynaren", hauteur: 18, largeur: 104 },
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
      className="bg-creme-2 border-b-[3px] border-encre py-10 lg:py-12"
    >
      <div className="container">
        <p className="section-label mb-6">Nos partenaires</p>
      </div>

      {/* pleine largeur : la piste sort du conteneur pour filer bord à bord */}
      <div className="bandeau-partenaires">
        <div className="piste-partenaires">
          <Groupe />
          <Groupe copie />
        </div>
      </div>
    </section>
  );
}
