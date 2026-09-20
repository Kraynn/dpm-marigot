/**
 * DPM Marigot – Localisation / zone d'intervention
 * Direction « Le Nuancier » : carte encadrée d'une bordure franche et d'une ombre dure.
 *
 * L'iframe Google Maps et la liste des départements sont reprises telles quelles
 * de la version précédente : la zone d'intervention annoncée est une décision
 * commerciale du client, pas un choix de design.
 * Le pavé « Entreprise de confiance » a été retiré (stop-slop : « artisans
 * qualifiés », « entre de bonnes mains » ne prouvent rien) et remplacé par
 * l'adresse du showroom, qui est un fait.
 *
 * 2026-09-21 : les horaires rejoignent l'adresse ici aussi. C'est la deuxième
 * des deux cartes qui portent l'adresse du showroom (l'autre est en
 * WhyUsSection) ; une adresse sans horaires oblige à téléphoner pour savoir
 * si c'est ouvert. Même valeur qu'en WhyUsSection, même source, même réserve
 * sur la mention « sur RDV » de l'affiche.
 */
import { MapPin, Phone } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const ZONES = ["Yvelines (78)", "Paris (75)", "Hauts-de-Seine (92)", "Val-d'Oise (95)", "Essonne (91)"];

export default function MapSection() {
  const { ref, visible } = useScrollReveal();

  return (
    <section id="localisation" className="bg-white py-20 lg:py-24 border-b-[3px] border-encre">
      <div className="container" ref={ref}>
        <div
          className="mb-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div>
            <p className="section-num mb-2">Zone d'intervention</p>
            <h2 className="text-4xl lg:text-[2.9rem] leading-[1.06] text-encre max-w-[15ch]">
              Basés au Mesnil-Saint-Denis.
            </h2>
          </div>
          <p className="text-encre/70 max-w-sm text-sm leading-relaxed">
            Un doute sur votre commune ? Un appel suffit à le lever.
          </p>
        </div>

        <div
          className="grid lg:grid-cols-3 gap-8 items-start"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s",
          }}
        >
          {/* Carte – 2 colonnes */}
          <div className="lg:col-span-2 border-[3px] border-encre shadow-[9px_9px_0_var(--color-terre)] leading-none">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1167.7!2d1.9499437!3d48.7394663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sDPM+Marigot!5e0!3m2!1sfr!2sfr!4v1"
              width="100%"
              height="400"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="DPM Marigot – Localisation"
            />
          </div>

          {/* Infos – 1 colonne */}
          <div className="flex flex-col gap-6">
            <div className="card-hard card-hard-prusse p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 bg-prusse text-white flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </span>
                <p className="section-label">Le showroom</p>
              </div>
              <p className="font-display text-xl text-encre leading-tight">
                92, Avenue Habert de Montmort
              </p>
              <p className="text-encre/70 text-sm mt-1 mb-5">Le Mesnil-Saint-Denis (78)</p>
              <div className="mb-5 pb-5 border-b-2 border-encre/15">
                <p className="section-label text-taupe mb-1.5">Horaires</p>
                <p className="text-encre text-sm font-bold">Du mardi au vendredi · 9h00 – 18h30</p>
              </div>
              <p className="text-encre/70 text-sm leading-relaxed">
                Ouvert au public. Venez voir les collections de revêtements de sols et de murs avant
                de choisir — et retirez vos colis au passage.
              </p>
              <a
                href="tel:+33185830355"
                className="inline-flex items-center gap-2 mt-5 font-bold text-sm text-encre border-b-[3px] border-terre pb-1 hover:text-terre transition-colors"
              >
                <Phone size={15} />
                01 85 83 03 55
              </a>
            </div>

            <div className="bg-creme-2 border-[3px] border-encre p-6">
              <p className="section-label mb-4">Nous intervenons</p>
              <ul className="flex flex-col gap-2.5">
                {ZONES.map((zone) => (
                  <li key={zone} className="flex items-center gap-2.5 text-sm text-encre">
                    <span className="w-2 h-2 bg-terre shrink-0" />
                    {zone}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
