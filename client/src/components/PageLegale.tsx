/**
 * DPM Marigot — gabarit des pages légales (mentions légales, confidentialité).
 *
 * Direction « Le Nuancier », en version sobre : pas de bandeau, pas de carte,
 * pas d'animation au défilement. Une page légale se lit, elle ne se vend pas.
 * Navbar et Footer sont ceux du site pour que le visiteur ne se croie pas
 * ailleurs, et le titre remonte en haut de page à l'arrivée (une route wouter
 * conserve sinon la position de défilement).
 *
 * Créé le 25/09/2026.
 */
import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NuancierBar from "@/components/NuancierBar";
import { VERSION_LEGALE } from "@/identite-legale";

type Props = {
  titre: string;
  intro: string;
  children: React.ReactNode;
};

export default function PageLegale({ titre, intro, children }: Props) {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${titre} — DPM Marigot`;
  }, [titre]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <header className="bg-creme border-b-[3px] border-encre pt-28 pb-12 lg:pt-32 lg:pb-14">
        <div className="container max-w-3xl">
          <p className="section-num mb-2">Informations légales</p>
          <h1 className="font-display text-4xl lg:text-[2.9rem] leading-[1.06] text-encre">
            {titre}
          </h1>
          <p className="text-encre/70 text-sm mt-4 leading-relaxed">{intro}</p>
          <p className="text-taupe text-xs mt-4">
            Version du {VERSION_LEGALE} · site dpm-marigot.vercel.app
          </p>
        </div>
      </header>

      <NuancierBar />

      <main className="container max-w-3xl py-14 lg:py-16 flex-1 page-legale">
        {children}

        <p className="mt-14 pt-8 border-t-2 border-encre/15">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-encre font-bold text-sm hover:text-terre transition-colors"
          >
            <ArrowLeft size={16} />
            Retour à l'accueil
          </Link>
        </p>
      </main>

      <Footer />
    </div>
  );
}

/**
 * Rend une information légale, ou dit clairement qu'elle manque.
 * Aucune valeur plausible n'est affichée à la place d'une valeur absente.
 */
export function Champ({ valeur }: { valeur: string | null }) {
  if (valeur) return <>{valeur}</>;
  return (
    <span className="text-terre font-bold" title="Information en cours de transmission par l'entreprise">
      information à compléter
    </span>
  );
}
