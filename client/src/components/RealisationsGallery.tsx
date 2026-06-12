import { useState } from "react";

type Projet = {
  titre: string;
  description: string;
  avant: { src: string; alt: string };
  apres: { src: string; alt: string };
};

const PROJETS: Projet[] = [
  {
    titre: "Plafond fissuré — séjour",
    description:
      "Reprise d'un plafond fissuré : ouverture, rebouchage, ratissage et mise en peinture du plafond et des murs.",
    avant: {
      src: "/images/realisations/plafond-avant.jpg",
      alt: "Plafond de séjour fissuré avant travaux",
    },
    apres: {
      src: "/images/realisations/plafond-apres.jpg",
      alt: "Plafond de séjour rénové, lisse et repeint",
    },
  },
  {
    titre: "Salle à manger — rénovation complète",
    description:
      "Rénovation complète d'une salle à manger : préparation des supports, murs en teinte taupe et plafond repeints.",
    avant: {
      src: "/images/realisations/salle-a-manger-avant.jpg",
      alt: "Salle à manger avant rénovation",
    },
    apres: {
      src: "/images/realisations/salle-a-manger-apres.jpg",
      alt: "Salle à manger rénovée, murs taupe et plafond blanc",
    },
  },
  {
    titre: "Cuisine — après sinistre DDE",
    description:
      "Rénovation d'un plafond de cuisine et d'un mur, après un sinistre DDE (dégât des eaux).",
    avant: {
      src: "/images/realisations/cuisine-sinistre-avant.jpg",
      alt: "Mur et plafond de cuisine endommagés par un dégât des eaux",
    },
    apres: {
      src: "/images/realisations/cuisine-sinistre-apres.jpg",
      alt: "Mur et plafond de cuisine rénovés après sinistre",
    },
  },
];

function BeforeAfterSlider({
  avant,
  apres,
}: Pick<Projet, "avant" | "apres">) {
  const [pos, setPos] = useState(50);

  return (
    <div className="group relative overflow-hidden aspect-[4/3] bg-slate-100 select-none shadow-[6px_6px_0_0_rgba(15,23,42,0.12)]">
      {/* Après — image de base */}
      <img
        src={apres.src}
        alt={apres.alt}
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Avant — rogné côté droit via clip-path */}
      <img
        src={avant.src}
        alt={avant.alt}
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />

      {/* Ligne de séparation + poignée */}
      <div
        className="absolute top-0 bottom-0 z-10 pointer-events-none"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute inset-0 w-px bg-white shadow-[0_0_6px_rgba(0,0,0,0.5)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-800">
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden>
            <path
              d="M6 7H1M1 7L4 4M1 7L4 10"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 7H17M17 7L14 4M17 7L14 10"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Badges AVANT / APRÈS */}
      <span className="absolute top-3 left-3 z-10 pointer-events-none bg-slate-900/80 text-white text-[10px] font-bold uppercase tracking-[0.18em] px-2.5 py-1 backdrop-blur-sm">
        Avant
      </span>
      <span className="absolute top-3 right-3 z-10 pointer-events-none bg-blue-700 text-white text-[10px] font-bold uppercase tracking-[0.18em] px-2.5 py-1">
        Après
      </span>

      {/* Indice de glissement (disparaît au hover) */}
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none whitespace-nowrap bg-white/90 text-slate-700 text-[11px] font-medium px-3 py-1 transition-opacity duration-300 group-hover:opacity-0">
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
        aria-label="Curseur avant / après"
      />
    </div>
  );
}

export default function RealisationsGallery() {
  return (
    <section id="realisations" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
          Avant / Après
        </p>
        <h2 className="mt-3 font-['Sora',sans-serif] text-3xl font-extrabold text-slate-900 md:text-4xl">
          Nos réalisations
        </h2>
        <p className="mt-4 max-w-2xl text-slate-600 text-sm">
          Glissez le curseur pour voir la transformation sur chaque chantier.
        </p>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {PROJETS.map((projet) => (
            <article key={projet.titre} className="flex flex-col">
              <BeforeAfterSlider avant={projet.avant} apres={projet.apres} />
              <div className="mt-4">
                <h3 className="font-['Sora',sans-serif] text-base font-bold text-slate-900">
                  {projet.titre}
                </h3>
                <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                  {projet.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
