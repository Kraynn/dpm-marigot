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
 */
import * as Dialog from "@radix-ui/react-dialog";
import { RotateCcw, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { AnimationChantier, Chantier } from "@/chantiers";

export type OuvertureVideo = { chantier: Chantier; animation: AnimationChantier };

type Props = {
  ouverture: OuvertureVideo | null;
  onFermer: () => void;
};

export default function FenetreVideo({ ouverture, onFermer }: Props) {
  return (
    <Dialog.Root open={ouverture !== null} onOpenChange={(o) => !o && onFermer()}>
      <Dialog.Portal>
        <Dialog.Overlay className="visionneuse-voile" />
        {ouverture && <Contenu key={ouverture.chantier.id} {...ouverture} />}
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Contenu({ chantier, animation }: OuvertureVideo) {
  const video = useRef<HTMLVideoElement>(null);
  const [finie, setFinie] = useState(false);
  const [declencheur] = useState(() => document.activeElement as HTMLElement | null);

  const lancer = () => {
    const v = video.current;
    if (!v) return;
    v.currentTime = 0;
    setFinie(false);
    // play() peut être refusée (économie d'énergie, onglet en arrière-plan) :
    // les contrôles natifs restent là pour la lancer à la main.
    v.play().catch(() => {});
  };

  useEffect(lancer, []);

  return (
    <Dialog.Content
      className="visionneuse fenetre-video"
      aria-describedby="fenetre-video-travaux"
      onCloseAutoFocus={(e) => {
        if (declencheur?.isConnected) {
          e.preventDefault();
          declencheur.focus();
        }
      }}
    >
      <header className="visionneuse-entete">
        <div className="min-w-0">
          <Dialog.Title className="text-2xl lg:text-3xl text-encre leading-tight">{chantier.lieu}</Dialog.Title>
          <Dialog.Description id="fenetre-video-travaux" className="mt-1 text-sm text-encre/70">
            {chantier.travaux} — en vidéo
          </Dialog.Description>
        </div>
        <Dialog.Close className="visionneuse-fermer" aria-label="Fermer la vidéo">
          <X size={22} strokeWidth={2.5} aria-hidden />
        </Dialog.Close>
      </header>

      <div className="visionneuse-scene">
        <video
          ref={video}
          className="visionneuse-photo fenetre-video-clip"
          poster={animation.apercu}
          muted
          controls
          playsInline
          preload="none"
          onEnded={() => setFinie(true)}
          onPlay={() => setFinie(false)}
        >
          {animation.webm && <source src={animation.webm} type="video/webm" />}
          {animation.mp4 && <source src={animation.mp4} type="video/mp4" />}
        </video>
      </div>

      <div className="fenetre-video-pied">
        <button type="button" className={`cta-btn-ghost ${finie ? "rejouer-attente" : ""}`} onClick={lancer}>
          <RotateCcw size={17} aria-hidden />
          Rejouer
        </button>
      </div>
    </Dialog.Content>
  );
}
