/**
 * DPM Marigot – Bannière d'accueil
 * Direction « Le Nuancier » : collage de photos inclinées, logo du client en titre
 * (05/10/2026, à la place de « La couleur, ça se choisit en vrai. »).
 *
 * Contenu retiré le 2026-08-28 parce qu'invérifiable (cf. design-demos/brand-spec.md) :
 *   - la note « 4,5/5 · +10 clients satisfaits » et ses trois avatars fictifs
 *     (source réelle : 1 avis Facebook, pas encore noté) ;
 *   - la mention « +10 ans d'expérience terrain », non sourcée.
 * Remplacés par deux faits vérifiables : le showroom ouvert au public et la
 * spécialité dégât des eaux.
 *
 * 2026-09-21, second passage : la bannière et la section « Le showroom »
 * échangent leur contenu, à la demande de Silva. La bannière prend le texte du
 * showroom et surtout **l'adresse et les horaires**, qui étaient jusqu'ici à
 * mi-page ; les badges de réassurance descendent en section showroom. Pour un
 * commerce dont la moitié des visites cherchent « c'est où, c'est ouvert
 * quand », ces deux lignes gagnent à être au-dessus de la ligne de flottaison.
 * Les deux boutons restent ici — « Demander un devis » est la conversion, et
 * Silva a demandé que « Visiter le showroom » reste aussi. Ce dernier ne pointe
 * plus vers la carte mais vers la section showroom (#showroom).
 *
 * 2026-10-14, notes du RDV DPM :
 *   - « bloc hero enlever 2 photos et mettre le relais colis direct à la place » :
 *     les deux avant / après de droite sont retirés et la carte « Point relais »
 *     (PointRelaisCard, contenu inchangé : Pickup + Chronopost, Colissimo, DPD)
 *     prend leur place. Elle était jusque-là incrustée à cheval sur la section des
 *     avis, qui descend sous le formulaire de devis. Sous 640 px, où la colonne
 *     photos n'était pas affichée, la carte suit le texte, à plat.
 *   - « Demander un devis » part, comme tous les boutons de devis de la page :
 *     l'onglet « Contact » de l'en-tête mène au formulaire. « Visiter le
 *     showroom » reste.
 */
import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import PointRelaisCard from "./PointRelaisCard";

// La bannière n'attend pas d'entrer dans le champ — elle y est déjà. Elle a
// donc son propre déclencheur, et sa propre prise en compte de
// prefers-reduced-motion (2026-09-21, même raison que dans useScrollReveal).
const sansAnimation = () =>
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

export default function HeroSection() {
  const [visible, setVisible] = useState(sansAnimation);

  useEffect(() => {
    if (sansAnimation()) {
      setVisible(true);
      return;
    }
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollTo = (sel: string) => {
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    // Filet bas : la section des avis, qui fermait la bannière par son propre filet,
    // est descendue sous le devis (14/10/2026) ; sans lui, bannière et métiers,
    // tous deux crème, se fondaient.
    <section className="relative bg-creme pt-[74px] lg:pt-[84px] overflow-hidden border-b-[3px] border-encre">
      {/* Rond ocre : masse de couleur qui casse la grille, motif Nuancier */}
      <div className="absolute -top-24 -right-32 w-[460px] h-[460px] rounded-full bg-ocre opacity-25 pointer-events-none" />

      <div className="container relative">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center py-12 lg:py-16">
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

            {/* 05/10/2026, demande de Silva : le titre « La couleur, ça se choisit en
                vrai. » et le paragraphe du showroom laissent la place au logo, rond à
                gauche et script à droite, avec le slogan dessous (retiré du header).
                Le <h1> unique de la page porte un nom explicite pour les moteurs et
                les lecteurs d'écran ; le visuel est masqué à l'arbre d'accessibilité.
                Rond servi en 192 ou 384 px selon l'écran (rendus vectoriels du PDF,
                jamais agrandis) ; script en masque, peint en couleur d'encre : il
                suit le nuancier. */}
            <h1 data-logo-banniere className="m-0">
              <span className="sr-only">
                DPM Marigot, décoration, peinture et menuiserie au Mesnil-Saint-Denis
              </span>{" "}
              <span aria-hidden="true" className="flex items-center gap-4 sm:gap-6">
                <img
                  src="/images/logo/logo-dpm-rond.webp"
                  srcSet="/images/logo/logo-dpm-rond.webp 192w, /images/logo/logo-dpm-rond-384.webp 384w"
                  sizes="(min-width: 1024px) 144px, (min-width: 640px) 120px, 92px"
                  alt=""
                  width={192}
                  height={192}
                  decoding="async"
                  className="w-[92px] h-[92px] sm:w-[120px] sm:h-[120px] lg:w-36 lg:h-36 shrink-0"
                />
                <span className="flex flex-col min-w-0">
                  <span className="logo-script-masque block bg-encre h-[42px] sm:h-[58px] lg:h-[72px] aspect-[2040/380] max-w-full" />
                  <span className="block font-sans text-[10.5px] sm:text-xs lg:text-[13px] font-bold uppercase tracking-[0.14em] text-taupe mt-2 lg:mt-3">
                    Décoration · Peinture · Menuiserie
                  </span>
                </span>
              </span>
            </h1>

            <div className="mt-7 pt-6 border-t-2 border-encre/15 flex flex-wrap gap-x-12 gap-y-5">
              <div>
                <p className="section-label text-taupe mb-2">Adresse</p>
                <p className="font-display text-xl text-encre leading-tight">
                  92, Avenue Habert de Montmort
                </p>
                <p className="text-encre/70 text-sm mt-1">Le Mesnil-Saint-Denis (78)</p>
              </div>
              <div>
                <p className="section-label text-taupe mb-2">Horaires</p>
                <p className="font-display text-xl text-encre leading-tight">9h00 – 18h30</p>
                <p className="text-encre/70 text-sm mt-1">Du mardi au vendredi</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-8">
              <button onClick={() => scrollTo("#showroom")} className="cta-btn-ghost text-base">
                Visiter le showroom
              </button>
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

          {/* 14/10/2026 : le point relais colis à la place des deux photos (notes du
              RDV DPM). La colonne garde sa hauteur desktop d'avant : c'est elle qui
              centre le texte à gauche. */}
          <div
            className="flex items-center justify-center lg:h-[540px]"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.7s ease 0.18s, transform 0.7s ease 0.18s",
            }}
          >
            <PointRelaisCard variante="banniere" />
          </div>
        </div>
      </div>
    </section>
  );
}
