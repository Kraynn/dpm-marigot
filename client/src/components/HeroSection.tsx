/**
 * DPM Marigot – Bannière d'accueil
 * Direction « Le Nuancier » : collage de photos inclinées, bande d'échantillons,
 * gros titre en DM Serif Display.
 *
 * Contenu retiré le 2026-08-28 parce qu'invérifiable (cf. design-demos/brand-spec.md) :
 *   - la note « 4,5/5 · +10 clients satisfaits » et ses trois avatars fictifs
 *     (source réelle : 1 avis Facebook, pas encore noté) ;
 *   - la mention « +10 ans d'expérience terrain », non sourcée.
 * Remplacés par deux faits vérifiables : le showroom ouvert au public et la
 * spécialité dégât des eaux.
 */
import { useEffect, useState } from "react";
import { ArrowRight, Phone } from "lucide-react";

// Les deux polaroïds de la bannière montrent du travail fini. Le plafond affichait
// jusqu'au 2026-09-19 la photo « avant » — un plafond fissuré en vitrine d'un peintre
// mettait en avant le dégât, pas la reprise.
const PHOTO_SALLE_A_MANGER = "/images/realisations/salle-a-manger-apres.jpg";
const PHOTO_PLAFOND = "/images/realisations/plafond-apres.jpg";

const faits = [
  { label: "Showroom ouvert au public", fort: true },
  { label: "Spécialiste dégât des eaux", fort: false },
  { label: "Sols & murs", fort: false },
  { label: "Devis gratuit", fort: false },
];

export default function HeroSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollTo = (sel: string) => {
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative bg-creme pt-[74px] lg:pt-[84px] overflow-hidden">
      {/* Rond ocre : masse de couleur qui casse la grille, motif Nuancier */}
      <div className="absolute -top-24 -right-32 w-[460px] h-[460px] rounded-full bg-ocre opacity-25 pointer-events-none" />

      <div className="container relative">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center py-14 lg:py-20">
          {/* Colonne texte */}
          <div
            className="flex flex-col"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <p className="section-label flex items-center gap-2.5 mb-5">
              <span className="w-8 h-[3px] bg-terre inline-block" />
              Le Mesnil-Saint-Denis · Yvelines
            </p>

            <h1 className="text-[2.5rem] sm:text-5xl lg:text-[3.9rem] leading-[1.04] text-encre">
              La couleur,
              <br />
              ça se choisit <em className="italic text-terre">en vrai.</em>
            </h1>

            <p className="text-lg text-encre/80 leading-relaxed max-w-lg mt-6">
              Peinture, décoration, menuiserie et revêtements de sols et murs. Notre showroom est
              ouvert au public : venez voir, toucher et comparer les collections avant de décider.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-8">
              <button onClick={() => scrollTo("#contact")} className="cta-btn text-base">
                Demander un devis
                <ArrowRight size={18} className="cta-arrow" />
              </button>
              <button onClick={() => scrollTo("#localisation")} className="cta-btn-ghost text-base">
                Visiter le showroom
              </button>
            </div>

            <div className="flex flex-wrap gap-2.5 mt-9">
              {faits.map((f) => (
                <span key={f.label} className={f.fort ? "trust-badge trust-badge-ocre" : "trust-badge"}>
                  {f.label}
                </span>
              ))}
            </div>

            <a
              href="tel:+33185830355"
              className="inline-flex items-center gap-3 mt-8 pt-6 border-t-2 border-encre/15 text-encre hover:text-terre transition-colors w-fit"
            >
              <span className="w-10 h-10 bg-prusse text-creme flex items-center justify-center shrink-0">
                <Phone size={18} />
              </span>
              <span>
                <span className="block text-[11px] uppercase tracking-[0.15em] text-taupe font-bold">
                  Appel direct
                </span>
                <span className="block font-display text-2xl leading-tight">01 85 83 03 55</span>
              </span>
            </a>
          </div>

          {/* Collage : deux photos réelles inclinées + bande de nuancier */}
          <div
            className="relative h-[420px] sm:h-[520px] lg:h-[540px] hidden sm:block"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.7s ease 0.18s, transform 0.7s ease 0.18s",
            }}
          >
            <figure className="absolute top-0 right-4 lg:right-9 w-[300px] lg:w-[340px] bg-white border-[3px] border-encre p-2.5 shadow-[8px_8px_0_var(--color-prusse)] rotate-[2.5deg]">
              <img
                src={PHOTO_SALLE_A_MANGER}
                alt="Salle à manger repeinte en teinte taupe par DPM Marigot, charpente apparente"
                width={480}
                height={640}
                decoding="async"
                className="w-full h-[240px] lg:h-[250px] object-cover"
              />
              <figcaption className="text-[11px] uppercase tracking-[0.12em] font-bold pt-2 text-encre">
                Salle à manger · après
              </figcaption>
            </figure>

            <figure className="absolute bottom-0 left-0 w-[215px] lg:w-[245px] bg-white border-[3px] border-encre p-2.5 shadow-[8px_8px_0_var(--color-terre)] -rotate-[4deg]">
              <img
                src={PHOTO_PLAFOND}
                alt="Plafond repris et remis en peinture par DPM Marigot après un dégât des eaux"
                width={1200}
                height={1600}
                decoding="async"
                className="w-full h-[160px] lg:h-[180px] object-cover"
              />
              <figcaption className="text-[11px] uppercase tracking-[0.12em] font-bold pt-2 text-encre">
                Plafond · après
              </figcaption>
            </figure>

            {/* Échantillons : les teintes du site viennent de ces photos */}
            <div
              className="absolute right-0 bottom-8 flex flex-col border-[3px] border-encre shadow-[6px_6px_0_var(--color-encre)]"
              aria-hidden="true"
            >
              {["bg-terre", "bg-ocre", "bg-olive", "bg-prusse", "bg-taupe"].map((c) => (
                <span key={c} className={`${c} w-[54px] h-9 block`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
