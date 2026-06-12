/**
 * DPM Marigot – Process Section
 * Design: Dark slate-900 band. 3 steps with large numbers. Clean and reassuring.
 */
import { ArrowRight, FileText, Home, Wrench } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  {
    number: "01",
    icon: <FileText size={24} />,
    title: "Demande de devis",
    description: "Remplissez notre formulaire en ligne ou appelez-nous directement. Réponse garantie sous 24h.",
  },
  {
    number: "02",
    icon: <Home size={24} />,
    title: "Visite et estimation",
    description: "Nous nous déplaçons chez vous pour évaluer le chantier et vous proposer un devis détaillé et transparent.",
  },
  {
    number: "03",
    icon: <Wrench size={24} />,
    title: "Réalisation des travaux",
    description: "Nos artisans interviennent dans les délais convenus. Chantier propre, finitions soignées, résultat garanti.",
  },
];

export default function ProcessSection() {
  const { ref, visible } = useScrollReveal();

  const handleCTA = () => {
    const el = document.querySelector("#contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="processus" className="bg-slate-900 py-20 lg:py-28">
      <div className="container" ref={ref}>
        {/* Header */}
        <div
          className="mb-14 text-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div className="section-label text-blue-400 flex items-center justify-center gap-2 mb-3">
            <span className="w-6 h-0.5 bg-blue-400 inline-block" />
            Simple et transparent
            <span className="w-6 h-0.5 bg-blue-400 inline-block" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white" style={{ fontFamily: "Sora, sans-serif" }}>
            Votre projet en 3 étapes
          </h2>
          <p className="mt-3 text-slate-400 max-w-md mx-auto text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
            Nous avons simplifié le processus pour que vous puissiez vous concentrer sur l'essentiel.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 bg-white/10" />

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-6">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="flex flex-col items-center text-center lg:items-start lg:text-left"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(24px)",
                  transition: `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`,
                }}
              >
                {/* Numéro + icône sur la même ligne */}
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="text-5xl font-extrabold leading-none text-white/[0.07] select-none"
                    style={{ fontFamily: "Sora, sans-serif" }}
                  >
                    {step.number}
                  </span>
                  <div className="w-14 h-14 rounded-2xl bg-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-900/40 shrink-0">
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "Sora, sans-serif" }}>
                  {step.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className="text-center mt-14"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.6s ease 0.5s",
          }}
        >
          <button onClick={handleCTA} className="cta-btn text-base">
            Obtenir mon devis gratuit
            <ArrowRight size={18} className="cta-arrow" />
          </button>
        </div>
      </div>
    </section>
  );
}
