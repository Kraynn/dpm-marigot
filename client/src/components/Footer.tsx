/**
 * DPM Marigot – Footer
 * Direction « Le Nuancier » : bande de nuancier inversée, pied encre.
 *
 * 2026-10-16 – variante C « La carte de visite » (demande de Silva : « la place est
 * pas gérée astucieusement »). Plus de colonnes : trois rangées pleine largeur.
 * 1) la marque à gauche, les moyens de joindre DPM à droite ;
 * 2) les services sur une ligne qui se replie ;
 * 3) le showroom en une ligne, les mentions au bout.
 * Le bandeau terre cuite part (la FAQ et la section Devis donnent déjà le numéro et
 * le délai). Sur téléphone, la marque et quatre boutons carrés passent en premier,
 * et la liste des services se replie derrière un bouton.
 */
import { useState } from "react";
import { Link } from "wouter";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Plus } from "lucide-react";
import NuancierBar from "@/components/NuancierBar";
import { RESEAUX_CONNUS } from "@/reseaux";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const ICONE_RESEAU: Record<string, typeof Facebook> = { Facebook, Instagram };

// Les six premiers pointent vers « Nos métiers ». Le point relais colis n'est pas
// un métier : il a son propre bandeau, et sa propre ancre.
const services: { label: string; ancre: string }[] = [
  { label: "Peinture intérieure", ancre: "#services" },
  { label: "Peinture extérieure", ancre: "#services" },
  { label: "Décoration", ancre: "#services" },
  { label: "Sols & murs", ancre: "#services" },
  { label: "Menuiserie", ancre: "#services" },
  { label: "Dégâts des eaux", ancre: "#services" },
  { label: "Tous nos travaux de rénovation", ancre: "#travaux" },
  { label: "Point relais colis", ancre: "#relais-colis" },
];

// 14/10/2026 : réduite aux Yvelines à la demande de la cliente (13/10).
const ZONE = "Yvelines (78)";

// Apparition décalée, jouée pour tous (règle « animations pour tout le monde »).
const apparition = (visible: boolean, delai: number) => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : "translateY(18px)",
  transition: `opacity 0.55s ease ${delai}s, transform 0.55s cubic-bezier(0.16,1,0.3,1) ${delai}s`,
});

const tuile =
  "inline-flex items-center justify-center gap-2 h-12 border-2 border-creme/25 text-creme hover:border-ocre hover:text-ocre active:scale-[0.97] transition-[color,border-color,transform] text-sm font-bold";

export default function Footer() {
  const { ref, visible } = useScrollReveal(0.05);
  const [servicesOuverts, setServicesOuverts] = useState(false);
  const scrollTo = (sel: string) => {
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const lienService = (s: { label: string; ancre: string }) => (
    <a
      href={s.ancre}
      onClick={(e) => {
        e.preventDefault();
        scrollTo(s.ancre);
      }}
      className="inline-flex items-center min-h-11 text-creme/80 hover:text-creme transition-colors text-sm"
    >
      {s.label}
    </a>
  );

  return (
    <footer className="bg-encre text-creme" data-pied="C">
      <NuancierBar reverse />

      <div ref={ref} className="container pt-10 lg:pt-12 pb-[112px] lg:pb-8">
        {/* Rangée 1 : la marque, et les moyens de joindre DPM */}
        <div
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-7 pb-8 border-b-2 border-creme/15"
          style={apparition(visible, 0)}
        >
          <div className="flex flex-col gap-4">
            <div
              role="img"
              aria-label="DPM Marigot, décoration, peinture, menuiserie"
              data-logo-pied
              className="flex items-center gap-3.5"
            >
              <span aria-hidden className="logo-rond-masque block bg-creme w-14 h-14 shrink-0" />
              <span aria-hidden className="flex flex-col">
                <span className="logo-script-masque block bg-creme h-8 aspect-[2040/380] self-start" />
                <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-ocre leading-tight mt-1.5">
                  Décoration · Peinture · Menuiserie
                </span>
              </span>
            </div>
            <p className="text-creme/75 text-sm">Devis gratuit, réponse sous 72h, sans engagement.</p>
          </div>

          {/* Téléphone : quatre carrés. Ordinateur : une ligne. */}
          <div className="grid grid-cols-3 sm:grid-cols-6 lg:flex lg:items-center gap-2.5 lg:gap-3">
            <a
              href="tel:+33185830355"
              className="inline-flex items-center justify-center gap-2 h-12 col-span-3 bg-creme text-encre border-2 border-creme hover:bg-ocre hover:border-ocre active:scale-[0.97] transition-[background-color,border-color,transform] text-sm font-bold lg:px-6"
            >
              <Phone size={16} /> 01 85 83 03 55
            </a>
            <a href="mailto:contact@dpmmarigot.fr" className={`${tuile} lg:px-5`} aria-label="Écrire à contact@dpmmarigot.fr">
              <Mail size={16} /> <span className="lg:hidden">Écrire</span>
              <span className="hidden lg:inline font-normal">contact@dpmmarigot.fr</span>
            </a>
            {RESEAUX_CONNUS.map((r) => {
              const Icone = ICONE_RESEAU[r.nom];
              return (
                <a
                  key={r.nom}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={r.libelle}
                  className={`${tuile} lg:w-12 sm:col-span-1`}
                >
                  <Icone size={18} aria-hidden />
                </a>
              );
            })}
          </div>
        </div>

        {/* Rangée 2 : les services. Ordinateur : une ligne qui se replie. Téléphone : un bouton. */}
        <nav aria-label="Services" className="py-5 border-b-2 border-creme/15" style={apparition(visible, 0.12)}>
          <ul className="hidden lg:flex flex-wrap items-center gap-x-7 gap-y-0">
            {services.map((s) => (
              <li key={s.label}>{lienService(s)}</li>
            ))}
          </ul>
          <div className="lg:hidden">
            <button
              type="button"
              aria-expanded={servicesOuverts}
              aria-controls="pied-services"
              onClick={() => setServicesOuverts((o) => !o)}
              className="w-full flex items-center justify-between min-h-12 section-label text-ocre"
            >
              Services
              <Plus
                size={18}
                aria-hidden
                className="transition-transform duration-300"
                style={{ transform: servicesOuverts ? "rotate(45deg)" : "rotate(0deg)" }}
              />
            </button>
            <div
              id="pied-services"
              className="grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ gridTemplateRows: servicesOuverts ? "1fr" : "0fr" }}
            >
              <ul className="overflow-hidden grid grid-cols-2 gap-x-4" inert={!servicesOuverts || undefined}>
                {services.map((s) => (
                  <li key={s.label}>{lienService(s)}</li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        {/* Rangée 3 : le showroom en une ligne, les mentions au bout */}
        <div
          className="pt-5 flex flex-col xl:flex-row xl:items-center justify-between gap-x-8 gap-y-3 text-sm"
          style={apparition(visible, 0.22)}
        >
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-7 gap-y-2.5 text-creme/80 min-w-0">
            <span className="flex items-start gap-2">
              <MapPin size={15} className="mt-0.5 shrink-0" />
              <span>92, Avenue Habert de Montmort,<br className="sm:hidden" /> Le Mesnil-Saint-Denis (78)</span>
            </span>
            <span className="flex items-start gap-2">
              <Clock size={15} className="mt-0.5 shrink-0" />
              Du mardi au vendredi, 9h00 – 18h30
            </span>
            <span className="flex items-start gap-2">
              <span aria-hidden className="w-[15px] shrink-0 lg:hidden" />
              Zone d'intervention : {ZONE}
            </span>
          </div>
          <div className="flex flex-wrap xl:flex-nowrap shrink-0 items-center gap-x-5 text-xs text-creme/75 whitespace-nowrap">
            <span>© {new Date().getFullYear()} DPM Marigot. Tous droits réservés.</span>
            <Link href="/mentions-legales" className="inline-flex items-center min-h-11 hover:text-creme transition-colors">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="inline-flex items-center min-h-11 hover:text-creme transition-colors">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
