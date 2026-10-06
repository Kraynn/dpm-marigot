/**
 * DPM Marigot – Éditeur de page : l'interface (06/10/2026).
 *
 * Demande de Silva : laisser le client, avant le rendez-vous, réécrire les textes
 * et retirer les blocs qu'il veut, plusieurs à la suite, puis tout envoyer d'un
 * coup. Rien n'est modifié sur le site : les retouches restent dans le navigateur
 * (src/edition/journal.ts) et partent par mail (edition.soumettre).
 *
 * Ce composant est chargé à la demande depuis la Navbar : un visiteur qui n'ouvre
 * pas l'éditeur ne le télécharge pas. Il ne connaît aucun composant du site ; il
 * écoute la page en phase de capture, avant React, ce qui rend inertes les liens
 * et boutons du site tant que le mode est ouvert.
 *
 * Deux façons de saisir un texte :
 *   · sur place (contenteditable en texte brut) pour tout ce qui n'est pas un bouton ;
 *   · dans un petit champ pour les boutons, où la saisie sur place n'est pas fiable
 *     d'un navigateur à l'autre.
 * Un bloc retiré est masqué par attribut, jamais ôté du DOM : React garde ses nœuds.
 * Quitter avec des retouches recharge la page — c'est la seule remise à neuf sûre.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TRPCClientError } from "@trpc/client";
import { Check, Maximize2, Pencil, Send, Trash2, Undo2, X } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { NUANCIER_DEFAUT, lireMemorise, trouverPalette } from "@/nuancier";
import { capturerLaPage, chargerLesImages } from "./capture";
import {
  chemin,
  cibleBloc,
  cibleTexte,
  elargir,
  estHorsChamp,
  extrait,
  lireTexte,
  nommerElement,
  nommerSection,
  placerCurseur,
  poserTexte,
  trouver,
} from "./dom";
import {
  type Modification,
  adresseSansEdition,
  fermerEdition,
  lireBrouillon,
  lireEtat,
  nouvelId,
  oter,
  poser,
  rappelerDansAdresse,
  repartirDeZero,
  synchroniserBrouillon,
  useEdition,
  viderBrouillon,
} from "./journal";

const RETIRE = "data-edition-retire";
const MODIFIE = "data-edition-modifie";
/** Même plafond que la validation du serveur (server/routers.ts). */
const LONGUEUR_MAX = 5000;

type Origine = { avant: string; avantHtml: string };
type Fiche = Origine & { el: HTMLElement };

/** Ce que le journal ne peut pas garder : l'élément réel de chaque retouche. */
const fiches = new Map<string, Fiche>();
const parElement = new WeakMap<HTMLElement, { texte?: string; retrait?: string }>();

const borner = (s: string) => (s.length > LONGUEUR_MAX ? `${s.slice(0, LONGUEUR_MAX - 1)}…` : s);
const compter = (n: number) => `${n} modification${n > 1 ? "s" : ""}`;
const majuscule = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const decrire = (el: HTMLElement) => ({
  chemin: chemin(el),
  section: nommerSection(el),
  element: nommerElement(el),
});

/** L'état d'origine d'un texte : celui d'avant la toute première retouche. */
function origineDe(el: HTMLElement): Origine {
  const id = parElement.get(el)?.texte;
  const fiche = id ? fiches.get(id) : undefined;
  return fiche
    ? { avant: fiche.avant, avantHtml: fiche.avantHtml }
    : { avant: lireTexte(el), avantHtml: el.innerHTML };
}

function retirer(el: HTMLElement) {
  const ids = parElement.get(el) ?? {};
  if (ids.retrait) return;
  const id = nouvelId();
  // Décrit avant de masquer : un élément masqué n'a plus de contour ni de voisinage.
  const modif: Modification = { id, type: "retrait", ...decrire(el), avant: extrait(el), apres: "" };
  fiches.set(id, { el, avant: modif.avant, avantHtml: "" });
  parElement.set(el, { ...ids, retrait: id });
  el.setAttribute(RETIRE, "");
  poser(modif);
}

/** Inscrit au journal le texte tel qu'il est dans la page, ou retire la retouche s'il est revenu à l'origine. */
function enregistrerTexte(el: HTMLElement, origine: Origine) {
  const ids = parElement.get(el) ?? {};
  const apres = lireTexte(el);
  if (apres === origine.avant || apres === "") {
    if (el.innerHTML !== origine.avantHtml) el.innerHTML = origine.avantHtml;
    el.removeAttribute(MODIFIE);
    if (ids.texte) {
      fiches.delete(ids.texte);
      oter(ids.texte);
      parElement.set(el, { ...ids, texte: undefined });
    }
    // Un texte entièrement effacé est un bloc retiré, pas un texte vide.
    if (apres === "") retirer(el);
    return;
  }
  const id = ids.texte ?? nouvelId();
  fiches.set(id, { el, ...origine });
  parElement.set(el, { ...ids, texte: id });
  // L'attribut garde le texte d'origine : un titre modifié continue de nommer sa
  // section par ce qui est écrit dans les sources (cf. nommerSection).
  el.setAttribute(MODIFIE, origine.avant);
  poser({
    id,
    type: "texte",
    ...decrire(el),
    avant: borner(origine.avant),
    apres: borner(apres),
    apresHtml: el.innerHTML,
  });
}

function annuler(modif: Modification) {
  const fiche = fiches.get(modif.id);
  if (fiche) {
    const ids = parElement.get(fiche.el) ?? {};
    if (modif.type === "texte") {
      fiche.el.innerHTML = fiche.avantHtml;
      fiche.el.removeAttribute(MODIFIE);
      parElement.set(fiche.el, { ...ids, texte: undefined });
    } else {
      fiche.el.removeAttribute(RETIRE);
      parElement.set(fiche.el, { ...ids, retrait: undefined });
    }
    fiches.delete(modif.id);
  }
  oter(modif.id);
}

/**
 * Rejoue le brouillon de la page. Une retouche n'est rejouée que si l'élément est
 * retrouvé ET porte encore le texte d'origine : après une mise à jour du site, on
 * préfère en écarter une que l'appliquer au mauvais endroit.
 */
function rejouerBrouillon(): { retablies: number; ecartees: number } {
  let retablies = 0;
  let ecartees = 0;
  for (const m of lireBrouillon()) {
    const el = trouver(m.chemin);
    const ids = el ? (parElement.get(el) ?? {}) : {};
    if (el && m.type === "texte" && m.apresHtml && borner(lireTexte(el)) === m.avant) {
      const avant = lireTexte(el);
      fiches.set(m.id, { el, avant, avantHtml: el.innerHTML });
      parElement.set(el, { ...ids, texte: m.id });
      el.innerHTML = m.apresHtml;
      el.setAttribute(MODIFIE, avant);
    } else if (el && m.type === "retrait" && extrait(el) === m.avant) {
      fiches.set(m.id, { el, avant: m.avant, avantHtml: "" });
      parElement.set(el, { ...ids, retrait: m.id });
      el.setAttribute(RETIRE, "");
    } else {
      ecartees++;
      continue;
    }
    poser(m, { brouillon: false });
    retablies++;
  }
  if (ecartees) synchroniserBrouillon();
  return { retablies, ecartees };
}

/** Les retouches utiles à envoyer : celles qui ne sont pas à l'intérieur d'un bloc retiré. */
function aEnvoyer(modifs: Modification[]): Modification[] {
  return modifs.filter((m) => {
    const el = fiches.get(m.id)?.el;
    if (!el) return false;
    const dansRetire = m.type === "texte" ? el.closest(`[${RETIRE}]`) : el.parentElement?.closest(`[${RETIRE}]`);
    return !dansRetire;
  });
}

/** Bords fondus du côté où il reste du contenu (règle de Silva du 03/10/2026, cf. NuancierPopup). */
function useBords() {
  const ref = useRef<HTMLDivElement>(null);
  const [bords, setBords] = useState({ debut: true, fin: true });
  const mesurer = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const debut = el.scrollTop <= 1;
    const fin = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
    setBords((b) => (b.debut === debut && b.fin === fin ? b : { debut, fin }));
  }, []);
  useEffect(() => {
    requestAnimationFrame(mesurer);
    window.addEventListener("resize", mesurer);
    return () => window.removeEventListener("resize", mesurer);
  });
  const classes = `defil-nuancier min-h-0 flex-1 ${bords.debut ? "au-debut" : ""} ${bords.fin ? "a-la-fin" : ""}`;
  return { ref, mesurer, classes };
}

function Fenetre({
  titre,
  sous,
  onFermer,
  verrou = false,
  children,
}: {
  titre: string;
  sous?: string;
  onFermer: () => void;
  /** Pendant un envoi : ni Échap, ni clic sur le voile, ni bouton ne ferment. */
  verrou?: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);
  const fermer = () => {
    if (!verrou) onFermer();
  };
  return (
    <dialog
      ref={ref}
      aria-labelledby="edition-titre"
      onClose={onFermer}
      onCancel={(e) => {
        if (verrou) e.preventDefault();
      }}
      onKeyDown={(e) => {
        // Même boucle que dans NuancierPopup : showModal() rend la page inerte, mais
        // Tab peut encore sortir vers la barre du navigateur.
        if (e.key !== "Tab") return;
        const f = Array.from(
          e.currentTarget.querySelectorAll<HTMLElement>(
            "button:not([disabled]), input:not([tabindex='-1']), textarea, [href]",
          ),
        );
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
        if (e.target === e.currentTarget) fermer();
      }}
      className="m-auto p-0 bg-transparent max-w-[min(640px,calc(100vw-24px))] w-full max-h-[calc(100dvh-24px)] backdrop:bg-encre/55"
    >
      <div className="bg-creme text-encre border-[3px] border-encre shadow-[8px_8px_0_var(--color-encre)] p-5 sm:p-7 max-h-[calc(100dvh-36px)] flex flex-col">
        <div className="flex items-start justify-between gap-4 mb-4 shrink-0">
          <div>
            <h2 id="edition-titre" className="text-2xl sm:text-3xl leading-tight text-encre">
              {titre}
            </h2>
            {sous && <p className="text-sm text-encre/75 mt-1">{sous}</p>}
          </div>
          <button
            type="button"
            onClick={fermer}
            aria-label="Fermer"
            className="shrink-0 inline-flex items-center justify-center w-10 h-10 border-2 border-encre text-encre hover:bg-encre hover:text-creme transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}

function PanneauListe({
  modifs,
  onFermer,
  onMontrer,
}: {
  modifs: Modification[];
  onFermer: () => void;
  onMontrer: (m: Modification) => void;
}) {
  const defil = useBords();
  const [confirmer, setConfirmer] = useState(false);

  useEffect(() => {
    if (!modifs.length) onFermer();
  }, [modifs.length, onFermer]);

  const toutAnnuler = () => {
    if (!confirmer) {
      setConfirmer(true);
      return;
    }
    viderBrouillon();
    window.location.reload();
  };

  return (
    <Fenetre
      titre={majuscule(compter(modifs.length))}
      sous="Rien n'est encore envoyé. Chaque ligne peut être annulée."
      onFermer={onFermer}
    >
      <div ref={defil.ref} onScroll={defil.mesurer} className={defil.classes}>
        <ul className="flex flex-col gap-2.5">
          {modifs.map((m) => (
            <li key={m.id} className="flex items-start gap-3 bg-white border-2 border-encre/25 p-3">
              <span
                aria-hidden
                className={`mt-0.5 shrink-0 inline-flex items-center justify-center w-7 h-7 text-white ${
                  m.type === "texte" ? "bg-prusse" : "bg-terre"
                }`}
              >
                {m.type === "texte" ? <Pencil size={14} /> : <Trash2 size={14} />}
              </span>
              <button
                type="button"
                onClick={() => onMontrer(m)}
                disabled={m.type === "retrait"}
                className="min-w-0 flex-1 text-left"
              >
                <span className="block text-[13px] font-bold text-[#1a1613]">
                  {m.type === "texte" ? "Texte" : "Bloc retiré"} · {m.section} › {m.element}
                </span>
                {m.type === "texte" ? (
                  <>
                    <span className="block text-[13px] leading-snug text-[#6a6056] line-through line-clamp-2">
                      {m.avant}
                    </span>
                    <span className="block text-[13px] leading-snug text-[#1a1613] line-clamp-3">{m.apres}</span>
                  </>
                ) : (
                  <span className="block text-[13px] leading-snug text-[#6a6056] line-clamp-2">{m.avant}</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => annuler(m)}
                aria-label={`Annuler : ${m.section}, ${m.element}`}
                title="Annuler cette modification"
                className="shrink-0 inline-flex items-center justify-center w-9 h-9 border-2 border-encre text-[#1a1613] bg-white hover:bg-encre hover:text-creme transition-colors"
              >
                <Undo2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 shrink-0">
        <button
          type="button"
          onClick={toutAnnuler}
          className="text-sm font-medium text-encre underline underline-offset-4"
        >
          {confirmer ? "Confirmer : tout annuler" : "Tout annuler"}
        </button>
      </div>
    </Fenetre>
  );
}

type Etape = "saisie" | "capture" | "envoi" | "fait" | "erreur";

function PanneauEnvoi({ modifs, onFermer }: { modifs: Modification[]; onFermer: () => void }) {
  const utiles = aEnvoyer(modifs);
  const [nom, setNom] = useState("");
  const [mot, setMot] = useState("");
  const [piege, setPiege] = useState("");
  const [etape, setEtape] = useState<Etape>("saisie");
  const [erreur, setErreur] = useState("");
  const soumettre = trpc.edition.soumettre.useMutation();
  const rienAEnvoyer = utiles.length === 0 && !mot.trim();
  const occupe = etape === "capture" || etape === "envoi";

  const terminerEtRecharger = () => window.location.replace(adresseSansEdition());

  const envoyer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rienAEnvoyer || occupe) return;
    setErreur("");
    setEtape("capture");
    const capture = (await capturerLaPage()) ?? undefined;
    setEtape("envoi");

    const palette = trouverPalette(lireMemorise()) ?? trouverPalette(NUANCIER_DEFAUT);
    const demande = {
      page: window.location.pathname,
      adresse: adresseSansEdition(),
      palette: palette?.nom,
      largeur: window.innerWidth,
      nom: nom.trim() || undefined,
      mot: mot.trim() || undefined,
      modifications: utiles.map(({ type, section, element, avant, apres }) => ({
        type,
        section,
        element,
        avant,
        apres,
      })),
      website: piege,
    };

    try {
      try {
        await soumettre.mutateAsync({ ...demande, capture });
      } catch (err) {
        // Une réponse qui n'est pas du serveur de l'application (corps trop lourd,
        // coupure) : on retente une fois sans l'image, les retouches priment.
        const duServeur = err instanceof TRPCClientError && err.data;
        if (!capture || duServeur) throw err;
        await soumettre.mutateAsync(demande);
      }
      viderBrouillon();
      setEtape("fait");
    } catch (err) {
      setErreur(
        err instanceof TRPCClientError && err.data
          ? err.message
          : "L'envoi a échoué. Vos modifications sont conservées, réessayez.",
      );
      setEtape("erreur");
    }
  };

  if (etape === "fait") {
    return (
      <Fenetre titre="C'est envoyé, merci" onFermer={terminerEtRecharger}>
        <p className="text-sm text-encre/80 mb-5">
          Nous avons bien reçu vos demandes. Le site en ligne n'a pas changé : nous les reprenons de
          notre côté.
        </p>
        <div>
          <button type="button" onClick={terminerEtRecharger} className="cta-btn">
            Revenir au site
          </button>
        </div>
      </Fenetre>
    );
  }

  const champ =
    "w-full bg-white text-[#1a1613] border-2 border-encre px-3 py-2.5 text-base focus:outline-none focus:border-terre";

  return (
    <Fenetre
      titre="Envoyer vos modifications"
      sous="Elles partent à ASap Web, qui réalise votre site. Le site en ligne ne change pas tant que nous ne les avons pas reprises."
      onFermer={onFermer}
      verrou={occupe}
    >
      <form onSubmit={envoyer} className="flex flex-col gap-4 min-h-0 overflow-y-auto">
        <label className="block">
          <span className="block text-sm font-bold mb-1.5">Votre nom</span>
          <input
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            maxLength={100}
            autoComplete="name"
            className={champ}
          />
        </label>
        <label className="block">
          <span className="block text-sm font-bold mb-1.5">Un mot pour nous</span>
          <textarea
            value={mot}
            onChange={(e) => setMot(e.target.value)}
            maxLength={2000}
            rows={4}
            placeholder="Une photo à changer, un bloc à ajouter, une précision…"
            className={`${champ} resize-y`}
          />
        </label>
        {/* Champ piège, comme sur le Devis : invisible, il doit rester vide. Son nom
            dans la page n'évoque ni site ni adresse : un remplissage automatique du
            navigateur qui l'écrirait ferait passer un vrai envoi pour un robot. */}
        <input
          value={piege}
          onChange={(e) => setPiege(e.target.value)}
          name="edition-controle"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="hidden"
        />
        {etape === "erreur" && (
          <p role="alert" className="text-sm font-bold text-terre">
            {erreur}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" disabled={rienAEnvoyer || occupe} className="cta-btn disabled:opacity-50">
            <Send size={17} aria-hidden />
            {etape === "capture"
              ? "Photo de la page…"
              : etape === "envoi"
                ? "Envoi…"
                : utiles.length
                  ? `Envoyer ${compter(utiles.length)}`
                  : "Envoyer le mot"}
          </button>
          {rienAEnvoyer && (
            <span className="text-sm text-encre/75">Modifiez la page ou écrivez un mot.</span>
          )}
        </div>
      </form>
    </Fenetre>
  );
}

type Saisie = { el: HTMLElement; origine: Origine; htmlAuDebut: string };

export default function ModeEdition() {
  const { modifs } = useEdition();
  const [cible, setCible] = useState<HTMLElement | null>(null);
  const [cadre, setCadre] = useState<DOMRect | null>(null);
  const [champ, setChamp] = useState<(Saisie & { valeur: string }) | null>(null);
  const [panneau, setPanneau] = useState<"liste" | "envoi" | null>(null);

  const cibleRef = useRef<HTMLElement | null>(null);
  const epingle = useRef<HTMLElement | null>(null);
  const saisie = useRef<Saisie | null>(null);
  const champRef = useRef(champ);
  champRef.current = champ;

  const mesurer = useCallback(() => {
    const el = cibleRef.current;
    setCadre(el && el.isConnected && !el.closest(`[${RETIRE}]`) ? el.getBoundingClientRect() : null);
  }, []);

  /** Désigne un élément ; `epingler` le garde désigné tant que le pointeur ne le quitte pas. */
  const designer = useCallback(
    (el: HTMLElement | null, epingler = false) => {
      epingle.current = epingler ? el : null;
      if (cibleRef.current !== el) {
        cibleRef.current = el;
        setCible(el);
      }
      mesurer();
    },
    [mesurer],
  );

  const terminer = useCallback(() => {
    const s = saisie.current;
    if (!s) return;
    saisie.current = null;
    s.el.removeAttribute("contenteditable");
    enregistrerTexte(s.el, s.origine);
    if (s.el.hasAttribute(RETIRE)) designer(null);
    else mesurer();
  }, [designer, mesurer]);

  const validerChamp = useCallback(() => {
    const c = champRef.current;
    if (!c) return;
    champRef.current = null;
    setChamp(null);
    enregistrerTexte(c.el, c.origine);
    if (c.el.hasAttribute(RETIRE)) designer(null);
    else mesurer();
  }, [designer, mesurer]);

  const annulerChamp = () => {
    const c = champRef.current;
    if (!c) return;
    c.el.innerHTML = c.htmlAuDebut;
    validerChamp();
  };

  // Rejeu du brouillon à l'ouverture, une fois la page rendue en mode édition.
  useEffect(() => {
    let vivant = true;
    repartirDeZero();
    fiches.clear();
    rappelerDansAdresse();
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (!vivant) return;
        chargerLesImages();
        const { retablies, ecartees } = rejouerBrouillon();
        if (retablies) toast.success(`Brouillon retrouvé : ${compter(retablies)}.`);
        if (ecartees)
          toast.warning(
            `${compter(ecartees)} du brouillon n'${ecartees > 1 ? "ont" : "a"} pas pu être rétablie${ecartees > 1 ? "s" : ""} : la page a changé depuis.`,
          );
      }),
    );
    return () => {
      vivant = false;
      fiches.clear();
    };
  }, []);

  // Écoute de la page, en phase de capture : l'éditeur passe avant React.
  useEffect(() => {
    let image = 0;

    const commencer = (el: HTMLElement, x: number, y: number) => {
      const s: Saisie = { el, origine: origineDe(el), htmlAuDebut: el.innerHTML };
      if (el.closest("button,summary")) {
        champRef.current = { ...s, valeur: lireTexte(el) };
        setChamp(champRef.current);
        return;
      }
      el.setAttribute("contenteditable", "plaintext-only");
      // Navigateur sans « plaintext-only » : édition riche, bridée par auCollage et avantSaisie.
      if (el.contentEditable !== "plaintext-only") el.setAttribute("contenteditable", "true");
      saisie.current = s;
      el.focus({ preventScroll: true });
      placerCurseur(el, x, y);
    };

    const auClic = (e: MouseEvent) => {
      const t = e.target;
      if (!(t instanceof Element) || estHorsChamp(t)) return;
      e.preventDefault();
      e.stopPropagation();
      const s = saisie.current;
      if (s && s.el.contains(t)) return; // clic dans le texte en cours de saisie
      terminer();
      validerChamp();
      const texte = cibleTexte(t);
      if (texte && !texte.closest(`[${RETIRE}]`)) {
        designer(texte, true);
        commencer(texte, e.clientX, e.clientY);
        return;
      }
      designer(cibleBloc(t), true);
    };

    const auSurvol = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || saisie.current || champRef.current) return;
      const t = e.target;
      if (!(t instanceof Element) || t.closest("[data-edition-ui]")) return;
      if (epingle.current?.contains(t)) return;
      cancelAnimationFrame(image);
      image = requestAnimationFrame(() => designer(cibleTexte(t) ?? cibleBloc(t)));
    };

    const auClavier = (e: KeyboardEvent) => {
      const s = saisie.current;
      if (!s) return;
      if (e.key === "Enter") {
        e.preventDefault();
        terminer();
      } else if (e.key === "Escape") {
        e.preventDefault();
        s.el.innerHTML = s.htmlAuDebut;
        terminer();
      }
    };

    const avantSaisie = (e: InputEvent) => {
      if (!saisie.current) return;
      const type = e.inputType ?? "";
      if (type.startsWith("format") || type === "insertParagraph" || type === "insertLineBreak") {
        e.preventDefault();
      }
    };

    const auCollage = (e: ClipboardEvent) => {
      const s = saisie.current;
      if (!s || s.el.contentEditable !== "true") return;
      e.preventDefault();
      const texte = (e.clipboardData?.getData("text/plain") ?? "").replace(/\s+/g, " ");
      document.execCommand("insertText", false, texte);
    };

    const aLaSortie = (e: FocusEvent) => {
      if (saisie.current && e.target === saisie.current.el) terminer();
    };

    const bloquer = (e: Event) => {
      if (e.target instanceof Element && !estHorsChamp(e.target)) e.preventDefault();
    };

    // Jamais de rendu React déclenché ici en direct : en phase de capture, il
    // passerait avant le traitement de la frappe par React et remettrait un champ
    // contrôlé à son ancienne valeur (la saisie du texte d'un bouton était perdue).
    let mesure = 0;
    const mesurerBientot = () => {
      cancelAnimationFrame(mesure);
      mesure = requestAnimationFrame(mesurer);
    };

    const opts = { capture: true } as const;
    document.addEventListener("click", auClic, opts);
    document.addEventListener("pointermove", auSurvol, opts);
    document.addEventListener("keydown", auClavier, opts);
    document.addEventListener("beforeinput", avantSaisie, opts);
    document.addEventListener("paste", auCollage, opts);
    document.addEventListener("focusout", aLaSortie, opts);
    document.addEventListener("submit", bloquer, opts);
    document.addEventListener("drop", bloquer, opts);
    document.addEventListener("dragstart", bloquer, opts);
    document.addEventListener("input", mesurerBientot, opts);
    document.addEventListener("scroll", mesurerBientot, { capture: true, passive: true });
    window.addEventListener("resize", mesurerBientot);
    return () => {
      cancelAnimationFrame(image);
      cancelAnimationFrame(mesure);
      document.removeEventListener("click", auClic, opts);
      document.removeEventListener("pointermove", auSurvol, opts);
      document.removeEventListener("keydown", auClavier, opts);
      document.removeEventListener("beforeinput", avantSaisie, opts);
      document.removeEventListener("paste", auCollage, opts);
      document.removeEventListener("focusout", aLaSortie, opts);
      document.removeEventListener("submit", bloquer, opts);
      document.removeEventListener("drop", bloquer, opts);
      document.removeEventListener("dragstart", bloquer, opts);
      document.removeEventListener("input", mesurerBientot, opts);
      document.removeEventListener("scroll", mesurerBientot, { capture: true });
      window.removeEventListener("resize", mesurerBientot);
      saisie.current?.el.removeAttribute("contenteditable");
      saisie.current = null;
    };
  }, [designer, mesurer, terminer, validerChamp]);

  // Le contour suit le journal : une annulation peut faire réapparaître ou changer la cible.
  useLayoutEffect(mesurer, [modifs, mesurer]);

  const quitter = () => {
    terminer();
    validerChamp();
    // Avec des retouches, seul un rechargement rend une page propre ; le brouillon reste.
    if (lireEtat().modifs.length) window.location.replace(adresseSansEdition());
    else fermerEdition();
  };

  const ouvrir = (p: "liste" | "envoi") => {
    terminer();
    validerChamp();
    designer(null);
    setPanneau(p);
  };

  const montrer = (m: Modification) => {
    const el = fiches.get(m.id)?.el;
    setPanneau(null);
    if (!el || el.closest(`[${RETIRE}]`)) return;
    el.scrollIntoView({ block: "center" });
    designer(el, true);
  };

  const fermerPanneau = useCallback(() => setPanneau(null), []);

  const plusGrand = cible ? elargir(cible) : null;
  const sousEnTete = document.querySelector("[data-edition-socle]")?.getBoundingClientRect().bottom ?? 0;
  const visible = cadre && cadre.bottom > sousEnTete && cadre.top < window.innerHeight;
  const n = modifs.length;

  return createPortal(
    <div data-edition-ui>
      {cible && cadre && visible && !panneau && (
        <>
          <div
            aria-hidden
            className="fixed z-[64] pointer-events-none border-2 border-dashed border-terre shadow-[0_0_0_1px_#fff]"
            style={{ top: cadre.top - 3, left: cadre.left - 3, width: cadre.width + 6, height: cadre.height + 6 }}
          />
          <div
            role="toolbar"
            aria-label="Bloc désigné"
            // Garde le texte en cours de saisie actif pendant le clic sur la barre.
            onPointerDown={(e) => e.preventDefault()}
            // Liseré clair : sur les sections sombres (Devis, pied de page), la barre
            // de couleur encre se fondait dans le fond.
            className="fixed z-[66] flex items-stretch bg-encre text-creme text-xs font-bold border border-creme/70 shadow-[3px_3px_0_var(--color-terre)]"
            style={{
              top: Math.max(sousEnTete + 4, cadre.top - 31),
              right: Math.max(8, window.innerWidth - cadre.right - 3),
            }}
          >
            <span className="px-2.5 py-2 text-creme/80">{majuscule(nommerElement(cible))}</span>
            <button
              type="button"
              onClick={() => {
                terminer();
                validerChamp();
                retirer(cible);
                designer(null);
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 border-l border-creme/25 hover:bg-terre transition-colors"
            >
              <Trash2 size={13} aria-hidden />
              Retirer
            </button>
            {plusGrand && (
              <button
                type="button"
                onClick={() => {
                  terminer();
                  validerChamp();
                  designer(plusGrand, true);
                }}
                title="Désigner le bloc qui contient celui-ci"
                className="inline-flex items-center gap-1.5 px-2.5 py-2 border-l border-creme/25 hover:bg-prusse transition-colors"
              >
                <Maximize2 size={13} aria-hidden />
                Élargir
              </button>
            )}
          </div>
        </>
      )}

      {champ && cadre && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            validerChamp();
          }}
          className="fixed z-[67] flex gap-2 bg-creme border-[3px] border-encre shadow-[5px_5px_0_var(--color-encre)] p-2"
          style={{
            top: Math.min(cadre.bottom + 10, window.innerHeight - 150),
            left: Math.max(8, Math.min(cadre.left, window.innerWidth - 488)),
            width: Math.min(480, window.innerWidth - 16),
          }}
        >
          <input
            autoFocus
            aria-label="Texte du bouton"
            value={champ.valeur}
            onChange={(e) => {
              poserTexte(champ.el, e.target.value);
              champRef.current = { ...champ, valeur: e.target.value };
              setChamp(champRef.current);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                annulerChamp();
              }
            }}
            onBlur={validerChamp}
            className="min-w-0 flex-1 bg-white text-[#1a1613] border-2 border-encre px-2.5 py-2 text-base focus:outline-none focus:border-terre"
          />
          <button
            type="submit"
            aria-label="Valider"
            onPointerDown={(e) => e.preventDefault()}
            className="shrink-0 inline-flex items-center justify-center w-11 bg-encre text-creme border-2 border-encre"
          >
            <Check size={18} />
          </button>
        </form>
      )}

      <div
        role="region"
        aria-label="Mode édition"
        className="fixed z-[70] bottom-3 left-1/2 -translate-x-1/2 flex items-stretch gap-2 bg-creme text-encre border-[3px] border-encre shadow-[6px_6px_0_var(--color-encre)] p-2 max-w-[calc(100vw-16px)]"
      >
        <span className="hidden sm:inline-flex items-center gap-2 pl-1.5 pr-1 text-sm font-bold whitespace-nowrap">
          <Pencil size={15} aria-hidden />
          Mode édition
        </span>
        {n ? (
          <button
            type="button"
            onClick={() => ouvrir("liste")}
            className="inline-flex items-center px-3 py-2 border-2 border-encre text-sm font-bold whitespace-nowrap hover:bg-encre hover:text-creme transition-colors"
          >
            {majuscule(compter(n))}
          </button>
        ) : (
          <span className="inline-flex items-center px-2 text-sm text-encre/80 leading-tight">
            Cliquez un texte pour le modifier
          </span>
        )}
        <button
          type="button"
          onClick={() => ouvrir("envoi")}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-terre text-white border-2 border-encre text-sm font-bold whitespace-nowrap hover:bg-terre-dark transition-colors"
        >
          <Send size={15} aria-hidden />
          Envoyer
        </button>
        <button
          type="button"
          onClick={quitter}
          aria-label="Quitter le mode édition"
          title="Quitter le mode édition"
          className="inline-flex items-center justify-center w-10 border-2 border-encre hover:bg-encre hover:text-creme transition-colors"
        >
          <X size={17} />
        </button>
      </div>

      {panneau === "liste" && <PanneauListe modifs={modifs} onFermer={fermerPanneau} onMontrer={montrer} />}
      {panneau === "envoi" && <PanneauEnvoi modifs={modifs} onFermer={fermerPanneau} />}
    </div>,
    document.body,
  );
}
