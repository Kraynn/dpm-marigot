/**
 * DPM Marigot – La vidéo d'un chantier, dans une fenêtre (15/10/2026)
 *
 * Ouverte par « Voir la vidéo » sur une carte de « Nos dernières
 * réalisations ». Même primitive que la visionneuse (@radix-ui/react-dialog) :
 * piège à focus, Échap, croix, focus rendu au bouton de la carte.
 *
 * La vidéo part dès l'ouverture : muette (donc autorisée à démarrer seule),
 * avec les contrôles natifs, en ligne sur iPhone (playsinline), et rien n'est
 * téléchargé avant le clic (preload="none"). WebM d'abord, MP4 en repli.
 * « Rejouer » la reprend du début. Elle joue pour tout le monde : aucune
 * condition sur prefers-reduced-motion.
 *
 * 16/10/2026, demande de Silva (« que le pop-up de la vidéo soit moins marqué,
 * plus en fondu avec le fond ») : la fenêtre vidéo quitte le cadre du Nuancier
 * (bordure franche, ombre dure, entête blanc). Voile plus léger avec flou
 * d'arrière-plan, pas de boîte autour : la vidéo flotte, entête et « Rejouer »
 * discrets en clair sur le voile, apparition en fondu (opacité + léger scale).
 * La visionneuse des photos garde son cadre : seules les classes fenetre-video-*
 * changent. Un clic à côté de la vidéo ferme la fenêtre (la boîte laisse passer
 * le pointeur jusqu'au voile).
 *
 * Même jour : version PAYSAGE 1920×1080 pour le desktop. Sur un écran d'au
 * moins 768 px et couché (REQUETE_PAYSAGE), la fenêtre joue la paysage quand
 * elle est livrée ; sinon, et toujours sur mobile, la portrait 1080×1440. Dans
 * les deux cas la vidéo tient entière dans la fenêtre (90 vw × 90 vh au
 * desktop), sans être rognée.
 */
import * as Dialog from "@radix-ui/react-dialog";
import { RotateCcw, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type AnimationChantier, type Chantier, REQUETE_PAYSAGE, ecranVeut72, formatAJouer } from "@/chantiers";

export type OuvertureVideo = { chantier: Chantier; animation: AnimationChantier };

type Props = {
  ouverture: OuvertureVideo | null;
  onFermer: () => void;
};

export default function FenetreVideo({ ouverture, onFermer }: Props) {
  // la mesure part dès l'arrivée sur la page : elle est prête avant le clic
  useEffect(() => {
    mesurerCadence();
  }, []);
  return (
    <Dialog.Root open={ouverture !== null} onOpenChange={(o) => !o && onFermer()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fenetre-video-voile" />
        {ouverture && <Contenu key={ouverture.chantier.id} {...ouverture} />}
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** Vrai sur un écran large et couché ; suit les rotations et redimensionnements. */
function useEcranPaysage(): boolean {
  const [paysage, setPaysage] = useState(() =>
    typeof window !== "undefined" && window.matchMedia ? window.matchMedia(REQUETE_PAYSAGE).matches : false,
  );
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia(REQUETE_PAYSAGE);
    const suivre = () => setPaysage(mq.matches);
    suivre();
    mq.addEventListener("change", suivre);
    return () => mq.removeEventListener("change", suivre);
  }, []);
  return paysage;
}

/**
 * Cadence de l'écran (Hz), mesurée une fois par page : médiane de 60 intervalles
 * requestAnimationFrame (un rafraîchissement manqué au chargement ne fausse
 * rien). 17/10/2026 : sur un écran à 144 Hz, la vidéo à 60 i/s avance par
 * à-coups (chaque image reste 2 puis 3 rafraîchissements) ; la version à 72 i/s
 * y est régulière. Tant que la mesure n'est pas faite, on reste en 60 i/s.
 */
let cadenceMesuree: number | null = null;
let mesureEnCours: Promise<number> | null = null;
function mesurerCadence(): Promise<number> {
  if (!mesureEnCours) {
    mesureEnCours = new Promise((ok) => {
      const t: number[] = [];
      const pas = (x: number) => {
        t.push(x);
        if (t.length < 61) {
          requestAnimationFrame(pas);
          return;
        }
        const d = t
          .slice(1)
          .map((v, i) => v - t[i])
          .sort((a, b) => a - b);
        cadenceMesuree = 1000 / d[Math.floor(d.length / 2)];
        ok(cadenceMesuree);
      };
      requestAnimationFrame(pas);
    });
  }
  return mesureEnCours;
}

function useCadenceEcran(): number | null {
  const [hz, setHz] = useState(cadenceMesuree);
  useEffect(() => {
    if (hz === null) mesurerCadence().then(setHz);
  }, [hz]);
  return hz;
}

function Contenu({ chantier, animation }: OuvertureVideo) {
  const video = useRef<HTMLVideoElement>(null);
  const [finie, setFinie] = useState(false);
  const [declencheur] = useState(() => document.activeElement as HTMLElement | null);
  const { format, sources, ratio } = formatAJouer(animation, useEcranPaysage(), ecranVeut72(useCadenceEcran()));

  const lancer = () => {
    const v = video.current;
    if (!v) return;
    v.currentTime = 0;
    setFinie(false);
    // play() peut être refusée (économie d'énergie, onglet en arrière-plan) :
    // les contrôles natifs restent là pour la lancer à la main.
    v.play().catch(() => {});
  };

  // Au premier affichage, et quand le format change (rotation d'une tablette) :
  // la balise vidéo est recréée (key), on relance.
  useEffect(lancer, [format]);

  return (
    <Dialog.Content
      className="fenetre-video"
      data-format={format}
      aria-describedby="fenetre-video-travaux"
      onCloseAutoFocus={(e) => {
        if (declencheur?.isConnected) {
          e.preventDefault();
          declencheur.focus();
        }
      }}
    >
      <header className="fenetre-video-entete">
        <div className="min-w-0">
          <Dialog.Title className="fenetre-video-titre">{chantier.lieu}</Dialog.Title>
          <Dialog.Description id="fenetre-video-travaux" className="fenetre-video-sous-titre">
            {chantier.travaux}
          </Dialog.Description>
        </div>
        <Dialog.Close className="fenetre-video-fermer" aria-label="Fermer la vidéo">
          <X size={20} strokeWidth={2} aria-hidden />
        </Dialog.Close>
      </header>

      <div className="fenetre-video-scene">
        <video
          key={format}
          ref={video}
          className="fenetre-video-clip"
          style={{ "--ratio": ratio } as React.CSSProperties}
          poster={sources.apercu}
          muted
          controls
          playsInline
          preload="none"
          onEnded={() => setFinie(true)}
          onPlay={() => setFinie(false)}
        >
          {sources.webm && <source src={sources.webm} type="video/webm" />}
          {sources.mp4 && <source src={sources.mp4} type="video/mp4" />}
        </video>
      </div>

      <div className="fenetre-video-pied">
        <button type="button" className={`fenetre-video-rejouer ${finie ? "attente" : ""}`} onClick={lancer}>
          <RotateCcw size={16} aria-hidden />
          Rejouer
        </button>
      </div>
    </Dialog.Content>
  );
}
