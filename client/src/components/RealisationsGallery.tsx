import { useCallback, useEffect, useState } from "react";

/**
 * Galerie "Nos réalisations" — photos réelles de chantiers (avant / après)
 * - Cliquer sur une photo l'ouvre en plein écran (lightbox)
 * - Fermeture : croix, clic sur le fond, ou touche Échap
 * - Navigation : flèches à l'écran ou flèches du clavier
 *
 * Les photos doivent se trouver dans client/public/images/realisations/
 */

type Photo = {
  src: string;
  alt: string;
  label: "Avant" | "Après";
};

type Projet = {
  titre: string;
  description: string;
  avant: Photo;
  apres: Photo;
};

const PROJETS: Projet[] = [
  {
    titre: "Plafond fissuré — séjour",
    description:
      "Reprise d'un plafond fissuré : ouverture, rebouchage, ratissage et mise en peinture du plafond et des murs.",
    avant: {
      src: "/images/realisations/plafond-avant.jpg",
      alt: "Plafond de séjour fissuré avant travaux",
      label: "Avant",
    },
    apres: {
      src: "/images/realisations/plafond-apres.jpg",
      alt: "Plafond de séjour rénové, lisse et repeint",
      label: "Après",
    },
  },
  {
    titre: "Salle à manger — rénovation complète",
    description:
      "Rénovation complète d'une salle à manger : préparation des supports, murs en teinte taupe et plafond repeints.",
    avant: {
      src: "/images/realisations/salle-a-manger-avant.jpg",
      alt: "Salle à manger avant rénovation",
      label: "Avant",
    },
    apres: {
      src: "/images/realisations/salle-a-manger-apres.jpg",
      alt: "Salle à manger rénovée, murs taupe et plafond blanc",
      label: "Après",
    },
  },
  {
    titre: "Cuisine — après sinistre DDE",
    description:
      "Rénovation d'un plafond de cuisine et d'un mur, après un sinistre DDE (dégât des eaux).",
    avant: {
      src: "/images/realisations/cuisine-sinistre-avant.jpg",
      alt: "Mur et plafond de cuisine endommagés par un dégât des eaux",
      label: "Avant",
    },
    apres: {
      src: "/images/realisations/cuisine-sinistre-apres.jpg",
      alt: "Mur et plafond de cuisine rénovés après sinistre",
      label: "Après",
    },
  },
];

// Liste à plat pour la navigation dans la lightbox
const PHOTOS: { photo: Photo; titre: string }[] = PROJETS.flatMap((p) => [
  { photo: p.avant, titre: p.titre },
  { photo: p.apres, titre: p.titre },
]);

export default function RealisationsGallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () =>
      setOpenIndex((i) =>
        i === null ? i : (i - 1 + PHOTOS.length) % PHOTOS.length
      ),
    []
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i + 1) % PHOTOS.length)),
    []
  );

  // Clavier + blocage du scroll de la page quand la lightbox est ouverte
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [openIndex, close, prev, next]);

  return (
    <section id="realisations" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
          Avant / Après
        </p>
        <h2 className="mt-3 font-['Sora',sans-serif] text-3xl font-extrabold text-slate-900 md:text-4xl">
          Nos réalisations
        </h2>
        <p className="mt-4 max-w-2xl text-slate-600">
          Des photos réelles de nos chantiers. Cliquez sur une image pour
          l'agrandir.
        </p>

        <div className="mt-12 space-y-16">
          {PROJETS.map((projet, pi) => (
            <article key={projet.titre}>
              <div className="flex items-baseline gap-4">
                <h3 className="font-['Sora',sans-serif] text-xl font-bold text-slate-900">
                  {projet.titre}
                </h3>
              </div>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                {projet.description}
              </p>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[projet.avant, projet.apres].map((photo, side) => {
                  const flatIndex = pi * 2 + side;
                  return (
                    <button
                      key={photo.src}
                      type="button"
                      onClick={() => setOpenIndex(flatIndex)}
                      className="group relative overflow-hidden bg-slate-100 shadow-[6px_6px_0_0_rgba(15,23,42,0.12)] outline-none transition-transform duration-200 hover:-translate-y-1 focus-visible:ring-4 focus-visible:ring-blue-700/40"
                      aria-label={`Agrandir la photo : ${photo.label} — ${projet.titre}`}
                    >
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        loading="lazy"
                        className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                      <span
                        className={`absolute left-3 top-3 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white ${
                          photo.label === "Avant"
                            ? "bg-slate-900/90"
                            : "bg-blue-700"
                        }`}
                      >
                        {photo.label}
                      </span>
                      <span className="absolute bottom-3 right-3 hidden bg-white/90 px-2 py-1 text-[11px] font-medium text-slate-700 group-hover:block">
                        Cliquer pour agrandir
                      </span>
                    </button>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Lightbox plein écran */}
      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Photo en plein écran"
          onClick={close}
        >
          {/* Fermer */}
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center bg-white/10 text-2xl leading-none text-white transition-colors hover:bg-white/25 focus-visible:ring-4 focus-visible:ring-white/50"
            aria-label="Fermer"
          >
            ✕
          </button>

          {/* Précédent */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 bg-white/10 px-3 py-4 text-2xl text-white transition-colors hover:bg-white/25 focus-visible:ring-4 focus-visible:ring-white/50 md:left-6"
            aria-label="Photo précédente"
          >
            ‹
          </button>

          {/* Suivant */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 bg-white/10 px-3 py-4 text-2xl text-white transition-colors hover:bg-white/25 focus-visible:ring-4 focus-visible:ring-white/50 md:right-6"
            aria-label="Photo suivante"
          >
            ›
          </button>

          <figure
            className="flex max-h-full max-w-5xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={PHOTOS[openIndex].photo.src}
              alt={PHOTOS[openIndex].photo.alt}
              className="max-h-[82vh] w-auto max-w-full object-contain shadow-2xl"
            />
            <figcaption className="mt-4 text-center text-sm text-white/90">
              <span
                className={`mr-2 px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest ${
                  PHOTOS[openIndex].photo.label === "Avant"
                    ? "bg-white/15"
                    : "bg-blue-700"
                }`}
              >
                {PHOTOS[openIndex].photo.label}
              </span>
              {PHOTOS[openIndex].titre}
              <span className="ml-3 text-white/50">
                {openIndex + 1} / {PHOTOS.length}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
