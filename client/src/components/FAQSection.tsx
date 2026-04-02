/**
 * DPM Marigot – FAQ Section
 * Design: Slate-50 background. Accordion. Reassuring answers.
 */
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Combien coûte un projet de peinture ou de rénovation ?",
    a: "Le coût dépend de la surface, de l'état des murs et des finitions souhaitées. Nous proposons des devis gratuits et détaillés après une visite sur place. Pas de frais cachés, tout est transparent.",
  },
  {
    q: "Quels sont les délais d'intervention ?",
    a: "Nous répondons à toutes les demandes sous 24h. Les délais de réalisation varient selon l'ampleur du chantier, mais nous nous engageons toujours à respecter les délais convenus lors du devis.",
  },
  {
    q: "Intervenez-vous après un dégât des eaux ?",
    a: "Oui, c'est l'une de nos spécialités. Nous prenons en charge la remise en état complète après sinistre : séchage, traitement, replâtrage, peinture. Nous pouvons également vous accompagner dans vos démarches avec votre assurance.",
  },
  {
    q: "Le devis est-il vraiment gratuit ?",
    a: "Absolument. Le devis est entièrement gratuit, sans engagement et sans frais cachés. Nous nous déplaçons chez vous pour évaluer le chantier et vous remettre une estimation précise.",
  },
  {
    q: "Dans quelles zones intervenez-vous ?",
    a: "Nous intervenons dans toute l'Île-de-France : Paris et sa banlieue, les Hauts-de-Seine, le Val-d'Oise, les Yvelines et l'Essonne. N'hésitez pas à nous contacter pour vérifier votre secteur.",
  },
  {
    q: "Travaillez-vous pour les particuliers et les professionnels ?",
    a: "Oui, nous intervenons pour les particuliers (propriétaires, locataires), les investisseurs immobiliers, les syndics et les agences immobilières.",
  },
];

export default function FAQSection() {
  const { ref, visible } = useScrollReveal();

  const handleCTA = () => {
    const el = document.querySelector("#contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="faq" className="bg-slate-50 py-20 lg:py-28">
      <div className="container" ref={ref}>
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Left: header */}
          <div
            className="lg:col-span-2"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-24px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <div className="section-label flex items-center gap-2 mb-3">
              <span className="w-6 h-0.5 bg-blue-700 inline-block" />
              Questions fréquentes
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4" style={{ fontFamily: "Sora, sans-serif" }}>
              Vous avez<br />des questions ?
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
              Retrouvez les réponses aux questions les plus fréquentes. Si vous ne trouvez pas ce que vous cherchez, contactez-nous directement.
            </p>
            <button onClick={handleCTA} className="cta-btn text-sm">
              Obtenir mon devis gratuit
              <ArrowRight size={16} className="cta-arrow" />
            </button>
          </div>

          {/* Right: accordion */}
          <div
            className="lg:col-span-3"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(24px)",
              transition: "opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s",
            }}
          >
            <Accordion type="single" collapsible className="flex flex-col gap-3">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-white rounded-xl border border-slate-100 px-5 shadow-sm data-[state=open]:border-blue-200 data-[state=open]:shadow-md transition-all"
                >
                  <AccordionTrigger
                    className="text-left text-sm font-semibold text-slate-900 py-4 hover:no-underline hover:text-blue-700 transition-colors"
                    style={{ fontFamily: "Sora, sans-serif" }}
                  >
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent
                    className="text-slate-600 text-sm leading-relaxed pb-4"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
