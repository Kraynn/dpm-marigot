/**
 * DPM Marigot – Réalisations
 * Direction « Le Nuancier » : cartes à bordure franche, ombre dure, badges carrés.
 * Le curseur avant/après (input range invisible superposé) est conservé tel quel :
 * il fonctionne au doigt, à la souris et au clavier.
 * Photos : chantiers réels du client, aucune retouche.
 *
 * 2026-09-21 : la section passe à deux onglets.
 *   « Avant / après »            les trois comparatifs à curseur, inchangés
 *   « Nos dernières réalisations » une galerie simple qui s'allonge
 *
 * Pourquoi : les avant/après demandent une photo AVANT, que le client n'a pas
 * pour tous ses chantiers. La galerie accepte une photo seule, donc les
 * nouvelles réas peuvent entrer au fil de l'eau sans attendre la paire. À
 * réception des photos, il n'y a que le tableau DERNIERES ci-dessous à
 * compléter — rien d'autre à toucher.
 *
 * Elle est amorcée avec trois photos déjà dans le dépôt, pour que l'onglet ne
 * soit pas vide au premier regard. Légendes factuelles, reprises des
 * descriptions existantes : aucune réalisation inventée, aucune photo de
 * banque présentée comme un chantier du client.
 *
 * Les onglets s'appuient sur @radix-ui/react-tabs (déjà au package.json) plutôt
 * que sur @/components/ui/tabs : le wrapper shadcn arrive avec rounded-lg,
 * bg-muted et une hauteur fixe de 36 px, qu'il aurait fallu défaire classe par
 * classe. On garde la primitive — c'est elle qui porte l'accessibilité, les
 * flèches du clavier et le roving tabindex — et on l'habille au Nuancier.
 *
 * 2026-10-15 : « Nos dernières réalisations » passe d'une photo par carte à une
 * carte par chantier (un lieu = un chantier) : Magny-les-Hameaux, Buc,
 * La Queue-les-Yvelines.
 * Second passage le même jour : la carte ouvre la vidéo du chantier quand elle
 * est livrée (FenetreVideo.tsx), et une rangée de miniatures ouvre la
 * visionneuse directement sur la photo choisie.
 * Un clic ouvre la visionneuse sur toutes les photos du chantier
 * (VisionneuseChantier.tsx). Les données sont dans client/src/chantiers.ts.
 * Les trois photos d'amorce sont retirées : c'étaient les « après » des trois
 * avant/après de l'autre onglet, donc des doublons.
 */
import * as Tabs from "@radix-ui/react-tabs";
import { Play } from "lucide-react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import AvantApres, { type Photo } from "./AvantApres";
import FenetreVideo, { type OuvertureVideo } from "./FenetreVideo";
import VisionneuseChantier, { type OuvertureVisionneuse } from "./VisionneuseChantier";
import {
  type AnimationChantier,
  CHANTIERS,
  type Chantier,
  animationDe,
  srcDe,
  srcParDefaut,
  srcsetDe,
} from "@/chantiers";

type Projet = {
  titre: string;
  description: string;
  avant: Photo;
  apres: Photo;
};

// Exporté : la bannière d'accueil reprend deux de ces paires (08/10/2026).
export const PROJETS: Projet[] = [
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
      "Rénovation d'un plafond de cuisine et d'un mur, après un sinistre DDE (dégât des eaux). Chantier de juin 2025.",
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

/**
 * Les dernières réalisations, de la plus récente à la plus ancienne : un
 * chantier par carte. Les chantiers se complètent dans client/src/chantiers.ts.
 * Règle : photos réelles du client, textes du client. Pas de photo de banque,
 * pas de légende qui promet ce que la photo ne montre pas.
 */
const DERNIERES: Chantier[] = CHANTIERS;

/**
 * Le visuel de la carte, cliquable.
 * Avec une vidéo (voir animationDe dans chantiers.ts) : l'image de fin du clip
 * et le bouton « Voir la vidéo », qui ouvre FenetreVideo.
 * Sans vidéo (fichiers pas encore livrés) : la photo de couverture, et le clic
 * ouvre la visionneuse des photos, comme avant.
 */
function CouvertureChantier({
  chantier,
  animation,
  onVideo,
  onPhotos,
}: {
  chantier: Chantier;
  animation?: AnimationChantier;
  onVideo: () => void;
  onPhotos: () => void;
}) {
  const photo = chantier.photos[chantier.couverture];
  return (
    <button
      type="button"
      className="couverture-bouton relative block w-full aspect-[4/3] overflow-hidden border-b-[3px] border-encre bg-creme-2"
      onClick={animation ? onVideo : onPhotos}
      aria-haspopup="dialog"
      aria-label={
        animation
          ? `Voir la vidéo du chantier de ${chantier.lieu}`
          : `Voir les ${chantier.photos.length} photos du chantier de ${chantier.lieu}`
      }
    >
      {animation ? (
        <img
          src={animation.apercu}
          alt=""
          loading="lazy"
          decoding="async"
          className="couverture-chantier w-full h-full object-cover"
        />
      ) : (
        <img
          src={srcParDefaut(photo)}
          srcSet={srcsetDe(photo)}
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          width={photo.largeur}
          height={photo.hauteur}
          alt=""
          loading="lazy"
          decoding="async"
          className="couverture-chantier w-full h-full object-cover"
        />
      )}
      <span className="absolute left-3 top-3 flex flex-wrap gap-2">
        <span className="badge-carre">{chantier.photos.length} photos</span>
        {chantier.chronologique && (
          <span className="badge-carre badge-carre-terre">Avant → après</span>
        )}
      </span>
      {animation && (
        <span className="badge-video" aria-hidden>
          <Play size={16} strokeWidth={2.5} fill="currentColor" />
          Voir la vidéo
        </span>
      )}
    </button>
  );
}

/**
 * Toutes les photos du chantier en miniatures : un clic ouvre la visionneuse
 * directement sur celle-là (demande de Silva, 15/10 : « voir juste la photo
 * qu'on veut »).
 * Défileur maison : bords fondus seulement du côté où il reste à voir, jamais
 * de flèche ni de « 1/X ». Au doigt, défilement natif. À la souris, on glisse
 * depuis une miniature (un glisser n'ouvre pas la photo). La molette verticale
 * n'est pas captée : elle fait défiler la page.
 */
function RangeeMiniatures({
  chantier,
  onChoisir,
}: {
  chantier: Chantier;
  onChoisir: (index: number) => void;
}) {
  const rangee = useRef<HTMLUListElement>(null);
  const [bords, setBords] = useState({ debut: true, fin: true });
  const glisse = useRef<{ x: number; gauche: number; bouge: boolean } | null>(null);

  const mesurer = useCallback(() => {
    const el = rangee.current;
    if (!el) return;
    setBords({
      debut: el.scrollLeft <= 1,
      fin: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1,
    });
  }, []);

  useLayoutEffect(() => {
    mesurer();
    window.addEventListener("resize", mesurer);
    return () => window.removeEventListener("resize", mesurer);
  }, [mesurer]);

  const surPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !rangee.current) return;
    glisse.current = { x: e.clientX, gauche: rangee.current.scrollLeft, bouge: false };
  };
  const surPointerMove = (e: React.PointerEvent) => {
    const g = glisse.current;
    if (!g || !rangee.current) return;
    const dx = e.clientX - g.x;
    if (Math.abs(dx) > 5) g.bouge = true;
    if (g.bouge) rangee.current.scrollLeft = g.gauche - dx;
  };
  const surPointerFin = () => {
    // le clic qui suit un glisser est annulé dans onClickCapture
    setTimeout(() => (glisse.current = null), 0);
  };

  return (
    <ul
      ref={rangee}
      onScroll={mesurer}
      onPointerDown={surPointerDown}
      onPointerMove={surPointerMove}
      onPointerUp={surPointerFin}
      onPointerLeave={surPointerFin}
      onClickCapture={(e) => {
        if (glisse.current?.bouge) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      aria-label={`Photos du chantier de ${chantier.lieu}`}
      className={`rangee-miniatures ${bords.debut ? "au-debut" : ""} ${bords.fin ? "a-la-fin" : ""}`}
    >
      {chantier.photos.map((p, i) => (
        <li key={p.fichier}>
          <button
            type="button"
            className="miniature"
            aria-haspopup="dialog"
            aria-label={`Voir la photo ${i + 1}${p.etape ? `, ${p.etape}` : ""} : ${p.alt}`}
            onClick={() => onChoisir(i)}
            style={{ aspectRatio: `${p.largeur} / ${p.hauteur}` }}
          >
            <img src={srcDe(p, 240)} alt="" loading="lazy" decoding="async" draggable={false} />
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function RealisationsGallery() {
  const [photos, setPhotos] = useState<OuvertureVisionneuse | null>(null);
  const [video, setVideo] = useState<OuvertureVideo | null>(null);

  return (
    <section id="realisations" className="bg-white py-20 lg:py-24 border-b-[3px] border-encre">
      <div className="container">
        <div className="mb-12">
          <div>
            <p className="section-num mb-2">Réalisations</p>
            <h2 className="text-4xl lg:text-[2.9rem] leading-[1.06] text-encre max-w-[14ch]">
              Nos chantiers, sans retouche.
            </h2>
          </div>
        </div>

        <Tabs.Root defaultValue="avant-apres">
          <Tabs.List
            aria-label="Deux façons de voir nos chantiers"
            className="flex flex-wrap gap-0 mb-10 border-b-[3px] border-encre"
          >
            <Tabs.Trigger value="avant-apres" className="onglet-rea">
              Avant / après
            </Tabs.Trigger>
            <Tabs.Trigger value="dernieres" className="onglet-rea">
              Nos dernières réalisations
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="avant-apres" className="outline-none">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {PROJETS.map((projet, i) => (
                <article
                  key={projet.titre}
                  className={`card-hard flex flex-col ${
                    i === 1 ? "card-hard-terre lg:mt-6" : i === 2 ? "card-hard-prusse" : ""
                  }`}
                >
                  <AvantApres avant={projet.avant} apres={projet.apres} />
                  <div className="p-5">
                    <h3 className="text-xl text-encre leading-tight">{projet.titre}</h3>
                    <p className="mt-2 text-sm text-encre/70 leading-relaxed">
                      {projet.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </Tabs.Content>

          <Tabs.Content value="dernieres" className="outline-none">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-start">
              {DERNIERES.map((chantier, i) => {
                const animation = animationDe(chantier.id);
                return (
                  <article
                    key={chantier.id}
                    data-chantier={chantier.id}
                    className={`card-hard carte-chantier relative flex flex-col ${
                      i === 1 ? "card-hard-terre lg:mt-6" : i === 2 ? "card-hard-prusse" : ""
                    }`}
                  >
                    <CouvertureChantier
                      chantier={chantier}
                      animation={animation}
                      onVideo={() => animation && setVideo({ chantier, animation })}
                      onPhotos={() => setPhotos({ chantier })}
                    />
                    <div className="p-5 flex flex-col gap-2 min-w-0">
                      <h3 className="text-xl text-encre leading-tight">{chantier.lieu}</h3>
                      <p className="text-sm font-semibold text-terre leading-snug">{chantier.travaux}</p>
                      {chantier.detail && (
                        <p className="text-sm text-encre/70 leading-relaxed">{chantier.detail}</p>
                      )}
                      <RangeeMiniatures
                        chantier={chantier}
                        onChoisir={(index) => setPhotos({ chantier, index })}
                      />
                      <button
                        type="button"
                        className="ouvrir-chantier"
                        aria-haspopup="dialog"
                        onClick={() => setPhotos({ chantier })}
                      >
                        Voir les {chantier.photos.length} photos
                        <span aria-hidden className="cta-arrow">→</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
      <VisionneuseChantier ouverture={photos} onFermer={() => setPhotos(null)} />
      <FenetreVideo ouverture={video} onFermer={() => setVideo(null)} />
    </section>
  );
}
