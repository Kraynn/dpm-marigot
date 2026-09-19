/**
 * DPM Marigot – Devis
 * Direction « Le Nuancier » : bande encre, formulaire à bordures franches.
 *
 * ⚠️ Seule la présentation a changé le 2026-08-28. La logique d'envoi reste
 * identique et ne doit pas être touchée sans mettre à jour le back-end :
 *   - mutation tRPC `contact.sendQuote` (server/routers.ts) ;
 *   - noms de champs exacts : nom / telephone / email / projet / message ;
 *   - honeypot `website`, invisible pour les humains, doit rester vide ;
 *   - `emailSent === false` déclenche un toast d'avertissement, pas une erreur.
 * Tests associés : server/contact.sendQuote.test.ts
 */
import { useState } from "react";
import { ArrowRight, Phone, Mail, MapPin, Check } from "lucide-react";
import { toast } from "sonner";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { trpc } from "@/lib/trpc";

const projectTypes = [
  "Peinture intérieure",
  "Peinture extérieure",
  "Décoration intérieure",
  "Menuiserie",
  "Rénovation après dégât des eaux",
  "Autre",
];

const contacts = [
  {
    icon: <Phone size={20} />,
    title: "Appel direct",
    value: "01 85 83 03 55",
    sub: "Du lundi au samedi",
    href: "tel:+33185830355",
    couleur: "bg-terre",
  },
  {
    icon: <Mail size={20} />,
    title: "E-mail",
    value: "dpmmarigot@gmail.com",
    sub: "Réponse sous 24h",
    href: "mailto:dpmmarigot@gmail.com",
    couleur: "bg-prusse",
  },
  {
    icon: <MapPin size={20} />,
    title: "Showroom",
    value: "Le Mesnil-Saint-Denis (78)",
    sub: "92, Avenue Habert de Montmort",
    href: "#localisation",
    couleur: "bg-olive",
  },
];

export default function ContactSection() {
  const { ref, visible } = useScrollReveal();
  const [form, setForm] = useState({
    nom: "",
    telephone: "",
    email: "",
    projet: "",
    message: "",
    website: "", // honeypot — ne jamais afficher à l'utilisateur
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendQuoteMutation = trpc.contact.sendQuote.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await sendQuoteMutation.mutateAsync({
        nom: form.nom,
        telephone: form.telephone,
        email: form.email || undefined,
        projet: form.projet,
        message: form.message || undefined,
        website: form.website,
      });

      setSubmitted(true);
      setForm({ nom: "", telephone: "", email: "", projet: "", message: "", website: "" });

      if (result.emailSent === false) {
        toast.warning(
          "Demande reçue, mais un problème technique a empêché l'envoi automatique. Contactez-nous directement par email ou téléphone."
        );
      } else {
        toast.success("Demande envoyée ! Nous vous répondrons sous 24h.");
      }
    } catch {
      toast.error("Une erreur est survenue. Veuillez réessayer ou nous contacter directement.");
    }
  };

  return (
    <section id="contact" className="bg-encre py-20 lg:py-24">
      <div className="container" ref={ref}>
        <div
          className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          {/* Colonne gauche : accroche + contacts directs */}
          <div>
            <p className="section-num text-ocre mb-2">05 — Devis</p>
            <h2 className="text-4xl lg:text-[2.9rem] leading-[1.06] text-creme max-w-[13ch]">
              Parlons de votre chantier.
            </h2>
            <p className="text-creme/70 leading-relaxed max-w-md mt-5">
              Décrivez votre projet en deux lignes. Nous revenons vers vous sous 24h. Le devis est
              gratuit et sans engagement.
            </p>

            <a
              href="tel:+33185830355"
              className="inline-flex items-center gap-4 mt-8 bg-ocre text-encre border-[3px] border-creme px-6 py-5 shadow-[7px_7px_0_var(--color-terre)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[4px_4px_0_var(--color-terre)] transition-all"
            >
              <Phone size={24} />
              <span>
                <span className="block text-[11px] uppercase tracking-[0.15em] font-bold">
                  Appeler directement
                </span>
                <span className="block font-display text-3xl leading-none mt-1">01 85 83 03 55</span>
              </span>
            </a>

            <div className="flex flex-col gap-3 mt-8">
              {contacts.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="flex items-center gap-4 border-2 border-creme/25 hover:border-ocre p-4 transition-colors group"
                >
                  <span
                    className={`w-11 h-11 ${item.couleur} text-white flex items-center justify-center shrink-0`}
                  >
                    {item.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] uppercase tracking-[0.14em] text-creme/50 font-bold">
                      {item.title}
                    </span>
                    <span className="block text-creme font-bold text-sm truncate group-hover:text-ocre transition-colors">
                      {item.value}
                    </span>
                    <span className="block text-creme/50 text-xs truncate">{item.sub}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Colonne droite : le formulaire */}
          <div>
            {submitted ? (
              <div className="bg-creme border-[3px] border-creme shadow-[8px_8px_0_var(--color-ocre)] p-10 text-center">
                <div className="w-16 h-16 bg-olive text-white flex items-center justify-center mx-auto mb-5">
                  <Check size={32} />
                </div>
                <h3 className="text-3xl text-encre mb-3">Demande envoyée</h3>
                <p className="text-encre/70 text-sm leading-relaxed max-w-sm mx-auto">
                  Merci pour votre message. Nous vous contactons sous 24h pour parler de votre
                  chantier. Pour une urgence, appelez le{" "}
                  <a href="tel:+33185830355" className="font-bold text-terre underline">
                    01 85 83 03 55
                  </a>
                  .
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-creme border-[3px] border-creme shadow-[8px_8px_0_var(--color-terre)] p-6 lg:p-8 flex flex-col gap-5"
              >
                {/* Honeypot — invisible pour les humains, piège pour les bots */}
                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ display: "none" }}
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="nom" className="field-label">
                      Nom *
                    </label>
                    <input
                      id="nom"
                      type="text"
                      name="nom"
                      required
                      value={form.nom}
                      onChange={handleChange}
                      placeholder="Jean Dupont"
                      className="field"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="telephone" className="field-label">
                      Téléphone *
                    </label>
                    <input
                      id="telephone"
                      type="tel"
                      name="telephone"
                      required
                      value={form.telephone}
                      onChange={handleChange}
                      placeholder="06 00 00 00 00"
                      className="field"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="field-label">
                    E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="jean@exemple.fr"
                    className="field"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="projet" className="field-label">
                    Type de projet *
                  </label>
                  <select
                    id="projet"
                    name="projet"
                    required
                    value={form.projet}
                    onChange={handleChange}
                    className="field"
                  >
                    <option value="" disabled>
                      Sélectionnez votre projet
                    </option>
                    {projectTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="field-label">
                    Votre chantier
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Pièce, surface approximative, état actuel, délai souhaité…"
                    className="field resize-none"
                  />
                </div>

                <p className="text-xs text-taupe">
                  Réponse sous 24h. Devis gratuit et sans engagement.
                </p>

                <button
                  type="submit"
                  disabled={sendQuoteMutation.isPending}
                  className="cta-btn w-full justify-center text-base disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sendQuoteMutation.isPending ? "Envoi en cours…" : "Envoyer ma demande"}
                  {!sendQuoteMutation.isPending && <ArrowRight size={18} className="cta-arrow" />}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
