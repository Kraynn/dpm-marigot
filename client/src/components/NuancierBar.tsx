/**
 * DPM Marigot – Bande de nuancier
 * Motif signature de la direction « Le Nuancier ». Les six teintes sont celles
 * échantillonnées sur les photos de chantier réelles (cf. index.css).
 * Purement décoratif : masqué aux lecteurs d'écran.
 */
const TEINTES = ["bg-terre", "bg-ocre", "bg-prusse", "bg-olive", "bg-taupe", "bg-encre"];

export default function NuancierBar({ reverse = false }: { reverse?: boolean }) {
  const teintes = reverse ? [...TEINTES].reverse() : TEINTES;
  return (
    <div className="nuancier-bar" aria-hidden="true">
      {teintes.map((c) => (
        <span key={c} className={c} />
      ))}
    </div>
  );
}
