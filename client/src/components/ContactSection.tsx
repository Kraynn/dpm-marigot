/**
 * DPM Marigot – Contact / Quote Form Section
 * Design: Slate-50 background. Left: form. Right: contact info + reassurance.
 * Fields: Nom, Téléphone, Email, Type de projet, Message.
 */
import { useState } from "react";
import { ArrowRight, Phone, Mail, Clock, CheckCircle2, MapPin } from "lucide-react";
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
        toast.warning("Demande reçue, mais un problème technique a empêché l'envoi automatique. Contactez-nous directement par email ou téléphone.");
      } else {
        toast.success("Demande envoyée ! Nous vous répondrons sous 24h.");
      }
    } catch {
      toast.error("Une erreur est survenue. Veuillez réessayer ou nous contacter directement.");
    }
  };

  return (
    <section id="contact" className="bg-slate-50 py-20 lg:py-28">
      <div className="container" ref={ref}>
        {/* Header */}
        <div
          className="mb-12 text-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div className="section-label flex items-center justify-center gap-2 mb-3">
            <span className="w-6 h-0.5 bg-blue-700 inline-block" />
            Devis gratuit
            <span className="w-6 h-0.5 bg-blue-700 inline-block" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900" style={{ fontFamily: "Sora, sans-serif" }}>
            Parlez-nous de votre projet
          </h2>
          <p className="mt-3 text-slate-600 max-w-md mx-auto text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
            Remplissez le formulaire ci-dessous. Nous vous répondons sous 24h avec un devis personnalisé.
          </p>
        </div>

        <div
          className="grid lg:grid-cols-5 gap-8 lg:gap-12"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s",
          }}
        >
          {/* Form – 3 cols */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2" style={{ fontFamily: "Sora, sans-serif" }}>
                  Demande envoyée !
                </h3>
                <p className="text-slate-600 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                  Merci pour votre message. Nous vous contacterons sous 24h pour discuter de votre projet.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 lg:p-8 flex flex-col gap-5"
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

                {/* Row 1: Nom + Téléphone */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide" style={{ fontFamily: "Inter, sans-serif" }}>
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="nom"
                      required
                      value={form.nom}
                      onChange={handleChange}
                      placeholder="Jean Dupont"
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide" style={{ fontFamily: "Inter, sans-serif" }}>
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      name="telephone"
                      required
                      value={form.telephone}
                      onChange={handleChange}
                      placeholder="06 00 00 00 00"
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide" style={{ fontFamily: "Inter, sans-serif" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="jean@exemple.fr"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  />
                </div>

                {/* Type de projet */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide" style={{ fontFamily: "Inter, sans-serif" }}>
                    Type de projet *
                  </label>
                  <select
                    name="projet"
                    required
                    value={form.projet}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    <option value="" disabled>Sélectionnez votre projet</option>
                    {projectTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide" style={{ fontFamily: "Inter, sans-serif" }}>
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Décrivez votre projet (surface, état actuel, délais souhaités...)"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  />
                </div>

                {/* Reassurance text */}
                <p className="text-xs text-slate-400 flex items-center gap-2" style={{ fontFamily: "Inter, sans-serif" }}>
                  <Clock size={13} />
                  Réponse garantie sous 24h — Devis entièrement gratuit et sans engagement
                </p>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={sendQuoteMutation.isPending}
                  className="cta-btn w-full justify-center text-base disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sendQuoteMutation.isPending ? "Envoi en cours…" : "Obtenir mon devis gratuit"}
                  {!sendQuoteMutation.isPending && <ArrowRight size={18} className="cta-arrow" />}
                </button>
              </form>
            )}
          </div>

          {/* Contact info – 2 cols */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Contact cards */}
            {[
              {
                icon: <Phone size={20} />,
                title: "Appel direct",
                value: "+33 1 85 83 03 55",
                sub: "Lun–Sam, 8h–19h",
                href: "tel:+33185830355",
              },
              {
                icon: <Mail size={20} />,
                title: "Email",
                value: "dpmmarigot@gmail.com",
                sub: "Réponse sous 24h",
                href: "mailto:dpmmarigot@gmail.com",
              },
              {
                icon: <MapPin size={20} />,
                title: "Zone d'intervention",
                value: "Île-de-France",
                sub: "Paris et banlieue",
                href: "#localisation",
              },
            ].map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="bg-white rounded-xl border border-slate-100 p-5 flex items-center gap-4 hover:border-blue-200 hover:shadow-md transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 group-hover:bg-blue-700 group-hover:text-white transition-colors flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5" style={{ fontFamily: "Inter, sans-serif" }}>{item.title}</p>
                  <p className="font-semibold text-slate-900 text-sm" style={{ fontFamily: "Sora, sans-serif" }}>{item.value}</p>
                  <p className="text-xs text-slate-400" style={{ fontFamily: "Inter, sans-serif" }}>{item.sub}</p>
                </div>
              </a>
            ))}

            {/* Trust block */}
            <div className="bg-slate-900 rounded-xl p-5 text-white">
              <p className="font-bold text-base mb-3" style={{ fontFamily: "Sora, sans-serif" }}>Pourquoi nous faire confiance ?</p>
              {[
                "Artisan local et réactif",
                "Devis gratuit et sans engagement",
                "Accompagnement de A à Z",
                "Spécialiste dégâts des eaux",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={14} className="text-blue-400 flex-shrink-0" />
                  <span className="text-slate-300 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
