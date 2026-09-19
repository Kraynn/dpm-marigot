/**
 * DPM Marigot – Processus
 * Direction « Le Nuancier » : bande bleu de Prusse, gros numéros en display.
 * Copie passée au stop-slop : « réponse garantie » devient un délai chiffré
 * (une garantie que personne ne peut tenir n'est pas un argument), et
 * « résultat garanti » disparaît.
 * Le délai annoncé est passé de 24h à 72h le 2026-09-19, à la demande de DPM.
 * Il est repris à l'identique dans le formulaire, la FAQ, le pied de page et
 * l'accusé de réception envoyé au client : les quatre doivent rester alignés.
 */
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  {
    number: "01",
    title: "Vous décrivez le chantier",
    description:
      "Par téléphone ou depuis le formulaire de devis. Deux lignes suffisent pour commencer. Nous répondons sous 72h.",
  },
  {
    number: "02",
    title: "Nous venons voir",
    description:
      "Visite sur place pour mesurer, regarder l'état des supports et vous remettre un devis détaillé. Gratuit et sans engagement.",
  },
  {
    number: "03",
    title: "Nous réalisons les travaux",
    description:
      "Intervention dans les délais convenus au devis. Protection de vos biens, nettoyage en fin de chantier.",
  },
];

export default function ProcessSection() {
  const { ref, visible } = useScrollReveal();

  const handleCTA = () => {
    const el = document.querySelector("#contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="processus" className="bg-prusse py-20 lg:py-24 border-b-[3px] border-encre">
      <div className="container" ref={ref}>
        <div
          className="mb-14"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div>
            <p className="section-num text-ocre mb-2">03 — Comment ça se passe</p>
            <h2 className="text-4xl lg:text-[2.9rem] leading-[1.06] text-creme max-w-[14ch]">
              Votre chantier en trois étapes.
            </h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="bg-creme border-[3px] border-encre shadow-[7px_7px_0_var(--color-ocre)] p-7 flex flex-col"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`,
              }}
            >
              <span className="font-display text-5xl leading-none text-terre mb-5">
                {step.number}
              </span>
              <h3 className="text-2xl text-encre leading-tight mb-3">{step.title}</h3>
              <p className="text-encre/70 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-14" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s ease 0.5s" }}>
          <button onClick={handleCTA} className="cta-btn text-base">
            Demander un devis
            <ArrowRight size={18} className="cta-arrow" />
          </button>
        </div>
      </div>
    </section>
  );
}
