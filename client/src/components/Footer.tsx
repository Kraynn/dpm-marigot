/**
 * DPM Marigot – Footer
 * Direction « Le Nuancier » : bande de nuancier inversée, bandeau de rappel terre
 * cuite, puis pied encre. Le téléphone est cliquable ici aussi (4e emplacement).
 *
 * 2026-09-21 : les horaires rejoignent le bloc de contact, le point relais colis
 * rejoint la colonne Services (avec sa propre ancre, ce n'est pas un métier), et
 * les réseaux ne sont plus écrits en dur — ils viennent de src/reseaux.ts, comme
 * dans la Navbar.
 */
import { Link } from "wouter";
import { ArrowRight, Phone, Mail, MapPin, Clock, Facebook, Instagram } from "lucide-react";
import NuancierBar from "@/components/NuancierBar";
import { RESEAUX_CONNUS } from "@/reseaux";

const ICONE_RESEAU: Record<string, typeof Facebook> = {
  Facebook,
  Instagram,
};

// Les six premiers pointent vers « 01 — Nos métiers ». Le point relais colis
// n'est pas un métier : il a son propre bandeau, et sa propre ancre.
const services: { label: string; ancre: string }[] = [
  { label: "Peinture intérieure", ancre: "#services" },
  { label: "Peinture extérieure", ancre: "#services" },
  { label: "Décoration", ancre: "#services" },
  { label: "Sols & murs", ancre: "#services" },
  { label: "Menuiserie", ancre: "#services" },
  { label: "Dégâts des eaux", ancre: "#services" },
  // 05/10/2026 : la liste complète de l'adhésif vitrine, sous les cartes métiers
  { label: "Tous nos travaux de rénovation", ancre: "#travaux" },
  { label: "Point relais colis", ancre: "#relais-colis" },
];

const zones = ["Yvelines (78)", "Paris (75)", "Hauts-de-Seine (92)", "Val-d'Oise (95)", "Essonne (91)"];

export default function Footer() {
  const scrollTo = (sel: string) => {
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-encre text-creme">
      <NuancierBar reverse />

      {/* Bandeau de rappel */}
      <div className="bg-terre border-b-[3px] border-encre py-9">
        <div className="container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <p className="font-display text-2xl text-white leading-tight">
              Un chantier en tête ?
            </p>
            <p className="text-white/90 text-sm mt-1">
              Devis gratuit, réponse sous 72h, sans engagement.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => scrollTo("#contact")}
              className="inline-flex items-center gap-2 bg-creme text-encre font-bold text-sm px-6 py-3.5 border-[3px] border-encre shadow-[5px_5px_0_var(--color-encre)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_var(--color-encre)] transition-all"
            >
              Demander un devis
              <ArrowRight size={16} />
            </button>
            <a
              href="tel:+33185830355"
              className="inline-flex items-center gap-2 bg-encre text-creme font-bold text-sm px-6 py-3.5 border-[3px] border-encre shadow-[5px_5px_0_var(--color-ocre)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_var(--color-ocre)] transition-all"
            >
              <Phone size={15} />
              01 85 83 03 55
            </a>
          </div>
        </div>
      </div>

      {/* Marge basse = place des boutons flottants (FloatingCTA) en bas de page :
          sous 1024 px, barre « Appeler / Devis » de 79 px et WhatsApp jusqu'à 144 px
          du bas ; au-delà, WhatsApp jusqu'à 78 px du bas. Sans elle, ils recouvraient
          « Mentions légales » et « Politique de confidentialité » (05/10/2026). */}
      <div className="container pt-14 pb-[168px] lg:pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Marque */}
          <div className="lg:col-span-2">
            {/* 05/10/2026 : le cartouche crème est retiré (Silva : il cassait la couleur
                du fond). Le logo se pose sur l'encre comme dans la bannière, rond à
                gauche, script à droite, slogan dessous. Le rond bleu pétrole y serait
                invisible (1,28:1) : il passe en monochrome clair par un masque
                (logo-dpm-rond-masque.png, tiré du PDF ; le pinceau se lit en réserve),
                peint en crème comme le script. Le slogan reprend l'ocre des titres
                « Services » et « Zone d'intervention ». */}
            <div
              role="img"
              aria-label="DPM Marigot — Décoration, peinture, menuiserie"
              data-logo-pied
              className="flex items-center gap-3.5 mb-5"
            >
              <span aria-hidden className="logo-rond-masque block bg-creme w-14 h-14 shrink-0" />
              <span aria-hidden className="flex flex-col">
                <span className="logo-script-masque block bg-creme h-8 aspect-[2040/380] self-start" />
                <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-ocre leading-tight mt-1.5">
                  Décoration · Peinture · Menuiserie
                </span>
              </span>
            </div>
            <p className="text-creme/75 text-sm leading-relaxed max-w-sm">
              Artisan au Mesnil-Saint-Denis (78). Peinture, décoration, menuiserie, revêtements de
              sols et murs, remise en état après dégât des eaux. Showroom ouvert au public.
            </p>
            <div className="flex flex-col gap-2.5 mt-6">
              <a
                href="tel:+33185830355"
                className="flex items-center gap-2.5 text-creme hover:text-ocre transition-colors text-sm font-bold"
              >
                <Phone size={15} /> 01 85 83 03 55
              </a>
              <a
                href="mailto:contact@dpmmarigot.fr"
                className="flex items-center gap-2.5 text-creme/75 hover:text-ocre transition-colors text-sm"
              >
                <Mail size={15} /> contact@dpmmarigot.fr
              </a>
              <span className="flex items-start gap-2.5 text-creme/75 text-sm">
                <MapPin size={15} className="mt-0.5 shrink-0" />
                92, Avenue Habert de Montmort — Le Mesnil-Saint-Denis (78)
              </span>
              <span className="flex items-start gap-2.5 text-creme/75 text-sm">
                <Clock size={15} className="mt-0.5 shrink-0" />
                Du mardi au vendredi, 9h00 – 18h30
              </span>
              {RESEAUX_CONNUS.map((r) => {
                const Icone = ICONE_RESEAU[r.nom];
                return (
                  <a
                    key={r.nom}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={r.libelle}
                    className="flex items-center gap-2.5 text-creme/75 hover:text-ocre transition-colors text-sm"
                  >
                    <Icone size={15} aria-hidden /> Notre page {r.nom}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="section-label text-ocre mb-4">Services</p>
            <ul className="flex flex-col gap-2.5">
              {services.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.ancre}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(s.ancre);
                    }}
                    className="text-creme/75 hover:text-creme transition-colors text-sm"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Zone */}
          <div>
            <p className="section-label text-ocre mb-4">Zone d'intervention</p>
            <ul className="flex flex-col gap-2.5">
              {zones.map((z) => (
                <li key={z} className="text-creme/75 text-sm">
                  {z}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t-2 border-creme/15 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-creme/75 text-xs">
            © {new Date().getFullYear()} DPM Marigot. Tous droits réservés.
          </p>
          {/* 25/09/2026 : ces deux liens existaient en href="#" depuis l'origine.
              Les pages existent maintenant. */}
          <div className="flex items-center gap-5">
            <Link
              href="/mentions-legales"
              className="text-creme/75 hover:text-creme text-xs transition-colors"
            >
              Mentions légales
            </Link>
            <Link
              href="/confidentialite"
              className="text-creme/75 hover:text-creme text-xs transition-colors"
            >
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
