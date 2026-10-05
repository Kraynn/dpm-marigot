/**
 * DPM Marigot – Nuancier en pop-up (05/10/2026).
 *
 * Demande de Silva : « un bouton un peu caché dans le header qui me permette de
 * pop up des nuanciers dans les teintes de couleurs qu'elle me demande par mail ».
 * Le déclencheur est une petite pastille (aria-label « Nuancier »), le pop-up un
 * <dialog> natif ouvert en modal : le reste de la page devient inerte, donc le
 * focus reste dans le pop-up, et Échap le ferme. Un clic sur le voile le ferme
 * aussi. Les palettes et leur application vivent dans src/nuancier.ts.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { X, Check, Link2 } from "lucide-react";
import {
  PALETTES,
  NUANCIER_DEFAUT,
  appliquerPalette,
  ecrireDansAdresse,
  memoriser,
  nuancierInitial,
  type Teintes,
} from "@/nuancier";

const pastilles = (v: Teintes) => [v.creme, v.encre, v.terre, v.ocre, v.prusse];

/** Le petit carré de nuancier qui sert de déclencheur. */
function Pastille({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`grid grid-cols-2 w-3.5 h-3.5 border border-encre/60 ${className}`}>
      <i className="bg-terre" />
      <i className="bg-ocre" />
      <i className="bg-prusse" />
      <i className="bg-creme" />
    </span>
  );
}

export function useNuancier() {
  const [actif, setActif] = useState<string>(NUANCIER_DEFAUT);
  useEffect(() => {
    setActif(nuancierInitial());
  }, []);
  const choisir = (id: string) => {
    appliquerPalette(id);
    memoriser(id);
    ecrireDansAdresse(id);
    setActif(id);
  };
  return { actif, choisir };
}

export function BoutonNuancier({
  onOuvrir,
  variante = "barre",
}: {
  onOuvrir: () => void;
  variante?: "barre" | "menu";
}) {
  if (variante === "menu") {
    return (
      <button
        type="button"
        onClick={onOuvrir}
        aria-label="Nuancier"
        aria-haspopup="dialog"
        className="inline-flex items-center gap-2.5 px-3 py-2.5 border-2 border-encre/30 text-encre/80 text-sm"
      >
        <Pastille />
        Nuancier
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onOuvrir}
      aria-label="Nuancier"
      aria-haspopup="dialog"
      title="Nuancier"
      className="inline-flex items-center justify-center w-6 h-7 xl:w-7 opacity-60 hover:opacity-100 focus-visible:opacity-100 transition-opacity"
    >
      <Pastille />
    </button>
  );
}

export default function NuancierPopup({
  ouvert,
  onFermer,
  actif,
  choisir,
}: {
  ouvert: boolean;
  onFermer: () => void;
  actif: string;
  choisir: (id: string) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [copie, setCopie] = useState(false);
  const defilRef = useRef<HTMLDivElement>(null);
  // Fondu seulement du côté où il reste du contenu : au début, pas de fondu en haut ;
  // à la fin, pas de fondu en bas ; liste entièrement visible, aucun fondu.
  const [bords, setBords] = useState({ debut: true, fin: true });
  const mesurer = useCallback(() => {
    const el = defilRef.current;
    if (!el) return;
    const debut = el.scrollTop <= 1;
    const fin = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
    setBords((b) => (b.debut === debut && b.fin === fin ? b : { debut, fin }));
  }, []);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (ouvert && !d.open) d.showModal();
    if (!ouvert && d.open) d.close();
    if (ouvert) requestAnimationFrame(mesurer);
  }, [ouvert, mesurer]);

  useEffect(() => {
    window.addEventListener("resize", mesurer);
    return () => window.removeEventListener("resize", mesurer);
  }, [mesurer]);

  const copierLien = async () => {
    const url = new URL(window.location.href);
    if (actif === NUANCIER_DEFAUT) url.searchParams.delete("nuancier");
    else url.searchParams.set("nuancier", actif);
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopie(true);
      setTimeout(() => setCopie(false), 1600);
    } catch {
      window.prompt("Lien à copier :", url.toString());
    }
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby="nuancier-titre"
      onClose={onFermer}
      onCancel={onFermer}
      onKeyDown={(e) => {
        // showModal() rend la page inerte, mais Tab peut encore sortir vers la barre
        // du navigateur : on boucle du dernier élément au premier, et inversement.
        if (e.key !== "Tab") return;
        const f = e.currentTarget.querySelectorAll<HTMLElement>("button:not([disabled]), [href]");
        if (!f.length) return;
        const premier = f[0];
        const dernier = f[f.length - 1];
        if (e.shiftKey && document.activeElement === premier) {
          e.preventDefault();
          dernier.focus();
        } else if (!e.shiftKey && document.activeElement === dernier) {
          e.preventDefault();
          premier.focus();
        }
      }}
      onClick={(e) => {
        // Le <dialog> occupe tout l'écran via ::backdrop : un clic dont la cible est
        // le dialog lui-même (et non son contenu) tombe sur le voile.
        if (e.target === e.currentTarget) onFermer();
      }}
      className="nuancier-dialog m-auto p-0 bg-transparent max-w-[min(760px,calc(100vw-24px))] w-full max-h-[calc(100dvh-24px)] backdrop:bg-encre/55"
    >
      {/* Titre et actions fixes ; seule la liste défile (règle de Silva du 03/10/2026 :
          défileur aux bords fondus, sans flèches ni compteur). */}
      <div className="bg-creme text-encre border-[3px] border-encre shadow-[8px_8px_0_var(--color-encre)] p-5 sm:p-7 max-h-[calc(100dvh-36px)] flex flex-col">
        <div className="flex items-start justify-between gap-4 mb-4 shrink-0">
          <div>
            <h2 id="nuancier-titre" className="text-2xl sm:text-3xl leading-tight text-encre">
              Nuancier
            </h2>
            <p className="text-sm text-encre/75 mt-1">
              Le site entier change de teintes en direct. Rien n'est enregistré ailleurs que sur
              cet appareil.
            </p>
          </div>
          <button
            type="button"
            onClick={onFermer}
            aria-label="Fermer le nuancier"
            className="shrink-0 inline-flex items-center justify-center w-10 h-10 border-2 border-encre text-encre hover:bg-encre hover:text-creme transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div
          ref={defilRef}
          onScroll={mesurer}
          className={`defil-nuancier min-h-0 flex-1 ${bords.debut ? "au-debut" : ""} ${bords.fin ? "a-la-fin" : ""}`}
        >
          <ul className="grid sm:grid-cols-2 gap-3">
            {PALETTES.map((p) => {
              const choisi = p.id === actif;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    aria-pressed={choisi}
                    data-palette={p.id}
                    onClick={() => choisir(p.id)}
                    className={`w-full text-left p-3.5 border-[3px] bg-white transition-shadow ${
                      choisi
                        ? "border-encre shadow-[5px_5px_0_var(--color-encre)]"
                        : "border-encre/25 hover:border-encre"
                    }`}
                  >
                    <span className="flex gap-1.5 mb-2.5" aria-hidden>
                      {pastilles(p.v).map((c, i) => (
                        <i
                          key={i}
                          className="block w-8 h-8 border border-black/15"
                          style={{ background: c }}
                        />
                      ))}
                    </span>
                    <span className="flex items-center gap-2 font-bold text-[0.95rem] text-[#1a1613]">
                      {p.nom}
                      {choisi && <Check size={16} aria-label="choisi" />}
                    </span>
                    <span className="block text-[13px] leading-snug text-[#4a443f] mt-0.5">{p.sous}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-4 shrink-0">
          {/* aria-disabled plutôt que disabled : un bouton désactivé perd le focus,
              qui retombait sur <body> juste après le clic. */}
          <button
            type="button"
            onClick={() => {
              if (actif !== NUANCIER_DEFAUT) choisir(NUANCIER_DEFAUT);
            }}
            aria-disabled={actif === NUANCIER_DEFAUT}
            className="cta-btn-ghost aria-disabled:opacity-50 aria-disabled:cursor-default"
          >
            Revenir au site actuel
          </button>
          <button
            type="button"
            onClick={copierLien}
            className="inline-flex items-center gap-2 text-sm font-medium text-encre underline underline-offset-4"
          >
            <Link2 size={15} aria-hidden />
            {copie ? "Lien copié" : "Copier le lien de cette palette"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
