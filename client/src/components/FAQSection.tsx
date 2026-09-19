/**
 * DPM Marigot – Questions fréquentes
 * Direction « Le Nuancier » : accordéon à bordures franches.
 * Réponses passées au stop-slop : plus d'« absolument », de « n'hésitez pas »,
 * de « réponse garantie » ni de « tout est transparent ». On répond, c'est tout.
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
    q: "Combien coûte un chantier de peinture ou de rénovation ?",
    a: "Le prix dépend de la surface, de l'état des supports et des finitions choisies. Nous venons voir sur place, puis nous remettons un devis détaillé où chaque poste est chiffré. La visite et le devis sont gratuits.",
  },
  {
    q: "Quels sont les délais d'intervention ?",
    a: "Nous répondons aux demandes sous 24h. La date de démarrage et la durée du chantier sont écrites sur le devis, avant que vous ne signiez quoi que ce soit.",
  },
  {
    q: "Intervenez-vous après un dégât des eaux ?",
    a: "Oui, c'est une de nos spécialités : dépose des revêtements touchés, reprise des plafonds et des murs, remise en peinture. Nous connaissons le déroulé côté assurance et nous vous accompagnons dans les démarches.",
  },
  {
    q: "Peut-on visiter le showroom ?",
    a: "Oui, il est ouvert au public au 92, Avenue Habert de Montmort au Mesnil-Saint-Denis. Vous y verrez notre décoration et les collections de revêtements de sols et de murs. Aucun rendez-vous n'est obligatoire.",
  },
  {
    q: "Le devis est-il vraiment gratuit ?",
    a: "Oui. Le devis est gratuit et sans engagement. Nous nous déplaçons chez vous pour évaluer le chantier et vous remettre une estimation chiffrée.",
  },
  {
    q: "Dans quelles zones intervenez-vous ?",
    a: "Nous partons du Mesnil-Saint-Denis et intervenons en Île-de-France : Yvelines, Paris, Hauts-de-Seine, Val-d'Oise et Essonne. Appelez-nous pour vérifier votre secteur.",
  },
  {
    q: "Travaillez-vous pour les professionnels ?",
    a: "Oui : particuliers propriétaires ou locataires, investisseurs immobiliers, syndics et agences immobilières.",
  },
];

export default function FAQSection() {
  const { ref, visible } = useScrollReveal();

  const handleCTA = () => {
    const el = document.querySelector("#contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="faq" className="bg-creme py-20 lg:py-24">
      <div className="container" ref={ref}>
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          <div
            className="lg:col-span-2"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <p className="section-num mb-2">07 — Questions fréquentes</p>
            <h2 className="text-4xl lg:text-[2.9rem] leading-[1.06] text-encre mb-5 max-w-[12ch]">
              Vous avez des questions ?
            </h2>
            <p className="text-encre/70 text-sm leading-relaxed mb-7 max-w-sm">
              Si votre question n'est pas là, appelez-nous : nous répondons plus vite au téléphone
              qu'en ligne.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={handleCTA} className="cta-btn text-sm">
                Demander un devis
                <ArrowRight size={16} className="cta-arrow" />
              </button>
              <a href="tel:+33185830355" className="cta-btn-ghost text-sm">
                01 85 83 03 55
              </a>
            </div>
          </div>

          <div
            className="lg:col-span-3"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s",
            }}
          >
            <Accordion type="single" collapsible className="flex flex-col gap-3">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-white border-[3px] border-encre px-5 last:border-b-[3px]"
                >
                  <AccordionTrigger className="text-left font-display text-lg text-encre py-4 hover:no-underline hover:text-terre transition-colors">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-encre/75 text-sm leading-relaxed pb-5">
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
