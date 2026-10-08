/**
 * DPM Marigot – Curseur avant / après
 * Partagé par la galerie Réalisations et, depuis le 08/10/2026, par les deux
 * polaroïds de la bannière d'accueil. L'input range invisible superposé est
 * conservé tel quel : il fonctionne au doigt, à la souris et au clavier.
 */
import { useState } from "react";

export type Photo = { src: string; alt: string };

type Props = {
  avant: Photo;
  apres: Photo;
  /** Cadre du curseur : proportions et bordure, propres à chaque emplacement. */
  className?: string;
  /** La bannière est au-dessus de la ligne de flottaison : pas de chargement différé. */
  differe?: boolean;
  libelle?: string;
};

export default function AvantApres({
  avant,
  apres,
  className = "aspect-[4/3] border-b-[3px] border-encre",
  differe = true,
  libelle = "Curseur avant / après",
}: Props) {
  const [pos, setPos] = useState(50);
  const chargement = differe ? "lazy" : "eager";

  return (
    <div className={`group relative overflow-hidden bg-creme-2 select-none ${className}`}>
      {/* Après — image de base */}
      <img
        src={apres.src}
        alt={apres.alt}
        draggable={false}
        loading={chargement}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Avant — rogné côté droit via clip-path */}
      <img
        src={avant.src}
        alt={avant.alt}
        draggable={false}
        loading={chargement}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />

      {/* Ligne de séparation + poignée */}
      <div
        className="absolute top-0 bottom-0 z-10 pointer-events-none"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute inset-0 w-[3px] bg-creme" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-creme border-[3px] border-encre flex items-center justify-center text-encre">
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden>
            <path
              d="M6 7H1M1 7L4 4M1 7L4 10"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 7H17M17 7L14 4M17 7L14 10"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Badges AVANT / APRÈS */}
      <span className="absolute top-3 left-3 z-10 pointer-events-none bg-encre text-creme text-[10px] font-bold uppercase tracking-[0.18em] px-2.5 py-1">
        Avant
      </span>
      <span className="absolute top-3 right-3 z-10 pointer-events-none bg-olive text-white text-[10px] font-bold uppercase tracking-[0.18em] px-2.5 py-1">
        Après
      </span>

      {/* Indice de glissement (disparaît au survol) */}
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none whitespace-nowrap bg-creme border-2 border-encre text-encre text-[11px] font-bold px-3 py-1 transition-opacity duration-300 group-hover:opacity-0">
        Faites glisser ←→
      </span>

      {/* Input range invisible — couvre toute la surface */}
      <input
        type="range"
        min={0}
        max={100}
        step={0.3}
        value={pos}
        onChange={(e) => setPos(+e.target.value)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-col-resize z-20"
        style={{ margin: 0, padding: 0 }}
        aria-label={libelle}
      />
    </div>
  );
}
