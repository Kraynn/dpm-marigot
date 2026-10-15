/**
 * DPM Marigot – Visionneuse d'un chantier (15/10/2026)
 *
 * Ouverte par un clic sur une carte de « Nos dernières réalisations ».
 * Une grande photo, et sous elle la bande des vignettes du chantier.
 *
 * Accessibilité : la primitive @radix-ui/react-dialog porte le piège à focus,
 * Échap et le retour du focus sur la carte (même choix que les onglets : la
 * primitive, habillée au Nuancier, plutôt que le wrapper shadcn arrondi).
 * Navigation : flèches gauche/droite, Début/Fin, clic sur la moitié gauche ou
 * droite de la photo, glisser au doigt, ou clic sur une vignette.
 *
 * Règles de Silva pour les défileurs : pas de boutons fléchés ni de « 1/X »
 * à l'écran. La position se lit sur la bande de vignettes (la vignette active
 * est cerclée de terre), et l'étape (Avant, Travaux, Après) sur un badge.
 * Le numéro n'est donné qu'aux lecteurs d'écran.
 * La bande a des bords fondus quand elle déborde, se glisse depuis une
 * vignette, et ne capte pas la molette verticale.
 *
 * Les animations (ouverture, fondu entre deux photos) jouent pour tout le
 * monde : elles ne sont jamais conditionnées à prefers-reduced-motion.
 */
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { type Chantier, srcDe, srcParDefaut, srcsetDe } from "@/chantiers";

/** Le chantier à montrer, et la photo sur laquelle ouvrir (index dans `photos`). */
export type OuvertureVisionneuse = { chantier: Chantier; index?: number };

type Props = {
  ouverture: OuvertureVisionneuse | null;
  onFermer: () => void;
};

const SEUIL_GLISSE = 50;

export default function VisionneuseChantier({ ouverture, onFermer }: Props) {
  return (
    <Dialog.Root open={ouverture !== null} onOpenChange={(ouvert) => !ouvert && onFermer()}>
      <Dialog.Portal>
        <Dialog.Overlay className="visionneuse-voile" />
        {ouverture && (
          <Contenu
            key={`${ouverture.chantier.id}-${ouverture.index ?? "defaut"}`}
            chantier={ouverture.chantier}
            depart={ouverture.index}
          />
        )}
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Contenu({ chantier, depart: indexDemande }: { chantier: Chantier; depart?: number }) {
  const { photos } = chantier;
  // Ouverte depuis une miniature : sur cette photo. Sinon, un chantier qui se
  // lit dans l'ordre s'ouvre sur l'« avant », les autres sur la couverture.
  const [index, setIndex] = useState(
    indexDemande ?? (chantier.chronologique ? 0 : chantier.couverture),
  );
  const photo = photos[index];
  const dernier = photos.length - 1;

  const aller = useCallback(
    (i: number) => setIndex(Math.max(0, Math.min(dernier, i))),
    [dernier],
  );

  // Précharge les voisines : le passage à la suivante ne montre pas de vide.
  useEffect(() => {
    for (const i of [index - 1, index + 1]) {
      const p = photos[i];
      if (!p) continue;
      const img = new Image();
      img.sizes = taillesPhoto(p.largeur > p.hauteur);
      img.srcset = srcsetDe(p);
    }
  }, [index, photos]);

  const surTouche = (e: React.KeyboardEvent) => {
    const actions: Record<string, () => void> = {
      ArrowLeft: () => aller(index - 1),
      ArrowRight: () => aller(index + 1),
      Home: () => aller(0),
      End: () => aller(dernier),
    };
    const action = actions[e.key];
    if (action) {
      e.preventDefault();
      action();
    }
  };

  // Glisser au doigt (ou à la souris) sur la photo.
  const depart = useRef<{ x: number; y: number } | null>(null);
  const aGlisse = useRef(false);
  const surPointerDown = (e: React.PointerEvent) => {
    depart.current = { x: e.clientX, y: e.clientY };
    aGlisse.current = false;
  };
  const surPointerUp = (e: React.PointerEvent) => {
    const d = depart.current;
    depart.current = null;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.abs(dx) > SEUIL_GLISSE && Math.abs(dx) > Math.abs(dy)) {
      aGlisse.current = true;
      aller(dx < 0 ? index + 1 : index - 1);
    }
  };
  const surClicMoitie = (sens: -1 | 1) => () => {
    if (aGlisse.current) {
      aGlisse.current = false;
      return;
    }
    aller(index + sens);
  };

  const paysage = photo.largeur > photo.hauteur;

  // La visionneuse est ouverte sans Dialog.Trigger (une seule pour trois
  // cartes) : Radix ne sait donc pas où rendre le focus. On le rend au bouton
  // de la carte qui l'a ouverte.
  const [declencheur] = useState(() => document.activeElement as HTMLElement | null);
  const rendreFocus = (e: Event) => {
    if (declencheur?.isConnected) {
      e.preventDefault();
      declencheur.focus();
    }
  };

  return (
    <Dialog.Content
      className="visionneuse"
      onKeyDown={surTouche}
      onCloseAutoFocus={rendreFocus}
      aria-describedby="visionneuse-travaux"
    >
      <header className="visionneuse-entete">
        <div className="min-w-0">
          <Dialog.Title className="text-2xl lg:text-3xl text-encre leading-tight">{chantier.lieu}</Dialog.Title>
          <Dialog.Description id="visionneuse-travaux" className="mt-1 text-sm text-encre/70">
            {chantier.travaux}
          </Dialog.Description>
        </div>
        <Dialog.Close className="visionneuse-fermer" aria-label="Fermer les photos">
          <X size={22} strokeWidth={2.5} aria-hidden />
        </Dialog.Close>
      </header>

      <figure
        className="visionneuse-scene"
        onPointerDown={surPointerDown}
        onPointerUp={surPointerUp}
        onPointerCancel={() => (depart.current = null)}
      >
        {/* Le cadre épouse la photo : le badge d'étape reste posé sur son coin. */}
        <div className="visionneuse-cadre">
          <img
            key={photo.fichier}
            src={srcParDefaut(photo)}
            srcSet={srcsetDe(photo)}
            sizes={taillesPhoto(paysage)}
            width={photo.largeur}
            height={photo.hauteur}
            alt={photo.alt}
            decoding="async"
            draggable={false}
            className="visionneuse-photo"
          />
          {photo.etape && (
            <span className="badge-carre badge-etape" aria-hidden>
              {photo.etape}
            </span>
          )}
        </div>
        <button
          type="button"
          className="visionneuse-moitie visionneuse-moitie-g"
          aria-label="Photo précédente"
          disabled={index === 0}
          onClick={surClicMoitie(-1)}
        />
        <button
          type="button"
          className="visionneuse-moitie visionneuse-moitie-d"
          aria-label="Photo suivante"
          disabled={index === dernier}
          onClick={surClicMoitie(1)}
        />
      </figure>

      <p className="sr-only" aria-live="polite">
        {`Photo ${index + 1} sur ${photos.length}${photo.etape ? `, ${photo.etape}` : ""} : ${photo.alt}`}
      </p>

      <BandeVignettes chantier={chantier} index={index} onChoisir={aller} />
    </Dialog.Content>
  );
}

/** La grande photo est limitée en hauteur : une portrait n'occupe jamais toute la largeur sur écran large. */
function taillesPhoto(paysage: boolean): string {
  return paysage ? "(min-width: 768px) min(92vw, 1100px), 100vw" : "(min-width: 768px) 56vh, 100vw";
}

function BandeVignettes({
  chantier,
  index,
  onChoisir,
}: {
  chantier: Chantier;
  index: number;
  onChoisir: (i: number) => void;
}) {
  const bande = useRef<HTMLOListElement>(null);
  const [bords, setBords] = useState({ debut: true, fin: true });

  const mesurer = useCallback(() => {
    const el = bande.current;
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

  // La vignette active reste en vue, centrée quand c'est possible.
  useEffect(() => {
    const el = bande.current;
    const actif = el?.children[index] as HTMLElement | undefined;
    if (!el || !actif) return;
    el.scrollTo({
      left: actif.offsetLeft - (el.clientWidth - actif.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [index]);

  return (
    <ol
      ref={bande}
      onScroll={mesurer}
      aria-label={`Photos du chantier de ${chantier.lieu}`}
      className={`visionneuse-bande ${bords.debut ? "au-debut" : ""} ${bords.fin ? "a-la-fin" : ""}`}
    >
      {chantier.photos.map((p, i) => (
        <li key={p.fichier}>
          <button
            type="button"
            className="vignette"
            aria-current={i === index ? "true" : undefined}
            aria-label={`Photo ${i + 1}${p.etape ? `, ${p.etape}` : ""}`}
            onClick={() => onChoisir(i)}
            style={{ aspectRatio: `${p.largeur} / ${p.hauteur}` }}
          >
            <img src={srcDe(p, 240)} alt="" loading="lazy" decoding="async" draggable={false} />
          </button>
        </li>
      ))}
    </ol>
  );
}
