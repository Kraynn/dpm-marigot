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
 *
 * 2026-10-16, demande de Silva (« passe les dernières réalisations à la place
 * de avant après et renomme avant après autres ») : l'ordre s'inverse.
 *   « Nos dernières réalisations »  premier onglet, ouvert par défaut
 *   « Autres réalisations »          les trois comparatifs à curseur (ex « Avant / après »)
 * Aucun lien du site n'ouvrait un onglet précis (#realisations mène à la
 * section) : seul defaultValue fixe l'onglet ouvert. Garde-fou :
 * client/src/realisations-onglets.test.ts.
 */
import * as Tabs from "@radix-ui/react-tabs";
import { Play } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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
  taillesApercu,
} from "@/chantiers";

type Projet = {
  titre: string;
  description: string;
  avant: Photo;
  apres: Photo;
};

// Exporté depuis le 08/10/2026 pour la bannière d'accueil, qui ne les reprend
// plus depuis le 14/10 (carte « Point relais » à leur place, voir HeroSection).
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
 *
 * 16/10/2026 (Silva : « hover sur une photo devrait nous permettre de
 * l'afficher dans la preview ») : l'aperçu montre la photo `apercu`, choisie
 * par la rangée de miniatures (couverture du chantier au départ). Le clic sur
 * le visuel lance toujours la vidéo, quelle que soit la photo montrée.
 * Changement en fondu : la nouvelle photo se pose sur l'ancienne une fois
 * chargée, puis la remplace. Fondu joué pour tout le monde, mouvement réduit
 * compris (aucune condition sur prefers-reduced-motion).
 */
function CouvertureChantier({
  chantier,
  apercu,
  animation,
  onVideo,
  onPhotos,
}: {
  chantier: Chantier;
  apercu: number;
  animation?: AnimationChantier;
  onVideo: () => void;
  onPhotos: () => void;
}) {
  const [affiche, setAffiche] = useState(apercu);
  const [arrivee, setArrivee] = useState<{ index: number; prete: boolean } | null>(null);

  useEffect(() => {
    setArrivee(apercu === affiche ? null : { index: apercu, prete: false });
    // `affiche` est lu à jour : seul un changement d'aperçu doit relancer le fondu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apercu]);

  const couches = arrivee && arrivee.index !== affiche ? [affiche, arrivee.index] : [affiche];
  return (
    <button
      type="button"
      className="couverture-bouton relative block w-full aspect-[4/5] overflow-hidden border-b-[3px] border-encre bg-creme-2"
      onClick={animation ? onVideo : onPhotos}
      aria-haspopup="dialog"
      aria-label={
        animation
          ? `Voir la vidéo du chantier de ${chantier.lieu}`
          : `Voir les ${chantier.photos.length} photos du chantier de ${chantier.lieu}`
      }
    >
      {/* Toujours la photo de couverture (15/10) : l'image de fin du clip est en 3:4 avec une colonne de texte,
          recadrée en 4:3 elle coupait le titre. Elle reste l'affiche (poster) de la fenêtre vidéo. */}
      {couches.map((index, rang) => {
        const photo = chantier.photos[index];
        const dessus = rang === 1;
        return (
          <img
            key={photo.fichier}
            src={srcParDefaut(photo)}
            srcSet={srcsetDe(photo)}
            sizes={taillesApercu(photo)}
            width={photo.largeur}
            height={photo.hauteur}
            alt=""
            loading={dessus ? "eager" : "lazy"}
            decoding="async"
            data-apercu={index}
            className={`couverture-chantier absolute inset-0 w-full h-full object-cover ${
              dessus ? (arrivee?.prete ? "apercu-fondu" : "apercu-attente") : ""
            }`}
            onLoad={
              dessus
                ? () => setArrivee((a) => (a && a.index === index ? { ...a, prete: true } : a))
                : undefined
            }
            onAnimationEnd={
              dessus
                ? (e) => {
                    if (e.animationName !== "apercu-fondu") return;
                    setAffiche(index);
                    setArrivee(null);
                  }
                : undefined
            }
          />
        );
      })}
      {/* 16/10 (Silva : « petite photo avec beaucoup d'indications pas discrètes, ça
          surcharge ») : plus de pastilles « N photos » ni « Avant → après » sur la
          photo (reprises sous les miniatures), et « Voir la vidéo » devient une
          étiquette sobre dans le coin. */}
      {animation && (
        <span className="badge-video" aria-hidden>
          <Play size={11} strokeWidth={2.5} fill="currentColor" />
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
  actif,
  onApercu,
  onChoisir,
}: {
  chantier: Chantier;
  /** Index de la photo montrée dans l'aperçu de la carte. */
  actif: number;
  onApercu: (index: number) => void;
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
            data-apercu={i === actif ? "" : undefined}
            // 16/10 : survol à la souris (ou au stylet) et focus clavier montrent la
            // photo dans l'aperçu de la carte, qui la garde ensuite. Pas pendant un
            // glisser de la rangée. Au doigt, pas de survol : le toucher (le clic)
            // met l'aperçu à jour et ouvre la visionneuse, comme à la souris.
            onPointerEnter={(e) => {
              if (e.pointerType === "touch" || glisse.current?.bouge) return;
              onApercu(i);
            }}
            onFocus={() => onApercu(i)}
            onClick={() => {
              onApercu(i);
              onChoisir(i);
            }}
            style={{ aspectRatio: `${p.largeur} / ${p.hauteur}` }}
          >
            <img src={srcDe(p, 240)} alt="" loading="lazy" decoding="async" draggable={false} />
          </button>
        </li>
      ))}
    </ul>
  );
}

/**
 * Une carte de chantier. Elle garde l'index de la photo d'aperçu : la
 * couverture du chantier au départ (donnée de chantiers.ts), puis la dernière
 * miniature survolée, focalisée ou touchée. Pas de retour à la couverture quand
 * la souris sort : la photo choisie reste, comme sur une fiche produit.
 */
function CarteChantier({
  chantier,
  rang,
  onVideo,
  onPhotos,
}: {
  chantier: Chantier;
  rang: number;
  onVideo: (o: OuvertureVideo) => void;
  onPhotos: (o: OuvertureVisionneuse) => void;
}) {
  const animation = animationDe(chantier.id);
  const [apercu, setApercu] = useState(chantier.couverture);
  return (
    <article
      data-chantier={chantier.id}
      className={`card-hard carte-chantier relative flex flex-col ${
        rang === 1 ? "card-hard-terre lg:mt-6" : rang === 2 ? "card-hard-prusse" : ""
      }`}
    >
      <CouvertureChantier
        chantier={chantier}
        apercu={apercu}
        animation={animation}
        onVideo={() => animation && onVideo({ chantier, animation })}
        onPhotos={() => onPhotos({ chantier })}
      />
      {/* 16/10 : texte allégé (moins de graisse et de couleur) pour laisser la photo dominer. */}
      <div className="px-4 pt-3 pb-4 flex flex-col gap-1.5 min-w-0">
        <h3 className="text-xl text-encre leading-tight">{chantier.lieu}</h3>
        <p className="text-sm text-encre/70 leading-snug">{chantier.travaux}</p>
        {chantier.detail && <p className="text-[0.8rem] text-encre/55 leading-relaxed">{chantier.detail}</p>}
        <RangeeMiniatures
          chantier={chantier}
          actif={apercu}
          onApercu={setApercu}
          onChoisir={(index) => onPhotos({ chantier, index })}
        />
        <button
          type="button"
          className="ouvrir-chantier"
          aria-haspopup="dialog"
          onClick={() => onPhotos({ chantier })}
        >
          Voir les {chantier.photos.length} photos
          {chantier.chronologique && <span className="ouvrir-chantier-note">avant → après</span>}
          <span aria-hidden className="cta-arrow">→</span>
        </button>
      </div>
    </article>
  );
}

export default function RealisationsGallery() {
  const [photos, setPhotos] = useState<OuvertureVisionneuse | null>(null);
  const [video, setVideo] = useState<OuvertureVideo | null>(null);

  return (
    <section id="realisations" className="bg-creme py-20 lg:py-24 border-b-[3px] border-encre">
      {/* 16/10/2026 (Silva) : fond beige, pour alterner beige / clair dans l'ordre actuel de la page. */}
      <div className="container">
        <div className="mb-12">
          <div>
            <p className="section-num mb-2">Réalisations</p>
            <h2 className="text-4xl lg:text-[2.9rem] leading-[1.06] text-encre max-w-[14ch]">
              Nos chantiers, sans retouche.
            </h2>
          </div>
        </div>

        <Tabs.Root defaultValue="dernieres">
          <Tabs.List
            aria-label="Deux façons de voir nos chantiers"
            className="flex flex-wrap gap-0 mb-10 border-b-[3px] border-encre"
          >
            <Tabs.Trigger value="dernieres" className="onglet-rea">
              Nos dernières réalisations
            </Tabs.Trigger>
            <Tabs.Trigger value="autres" className="onglet-rea">
              Autres réalisations
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="dernieres" className="outline-none">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-start">
              {DERNIERES.map((chantier, i) => (
                <CarteChantier
                  key={chantier.id}
                  chantier={chantier}
                  rang={i}
                  onVideo={setVideo}
                  onPhotos={setPhotos}
                />
              ))}
            </div>
          </Tabs.Content>

          <Tabs.Content value="autres" className="outline-none">
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
        </Tabs.Root>
      </div>
      <VisionneuseChantier ouverture={photos} onFermer={() => setPhotos(null)} />
      <FenetreVideo ouverture={video} onFermer={() => setVideo(null)} />
    </section>
  );
}
