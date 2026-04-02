/**
 * DPM Marigot – Map / Location Section
 * Design: White background. Google Maps iframe embed. Trust reassurance.
 */
import { MapPin, Shield } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function MapSection() {
  const { ref, visible } = useScrollReveal();

  return (
    <section id="localisation" className="bg-white py-20 lg:py-28">
      <div className="container" ref={ref}>
        <div
          className="mb-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div className="section-label flex items-center gap-2 mb-3">
            <span className="w-6 h-0.5 bg-blue-700 inline-block" />
            Localisation
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900" style={{ fontFamily: "Sora, sans-serif" }}>
            Basée au Mesnil-Saint-Denis,<br />
            <span className="text-blue-700">au cœur de l'Île-de-France</span>
          </h2>
          <p className="mt-3 text-slate-600 max-w-lg text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
            Notre showroom est ouvert au public. Venez découvrir nos collections de revêtements de sols et murs. Nous intervenons dans toute l'Île-de-France.
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
          {/* Map – 2 cols */}
          <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-lg border border-slate-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1167.7!2d1.9499437!3d48.7394663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sDPM+Marigot!5e0!3m2!1sfr!2sfr!4v1"
              width="100%"
              height="380"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="DPM Marigot – Localisation"
            />
          </div>

          {/* Info – 1 col */}
          <div className="flex flex-col gap-4">
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700">
                  <MapPin size={18} />
                </div>
                <p className="font-bold text-slate-900 text-sm" style={{ fontFamily: "Sora, sans-serif" }}>Adresse</p>
              </div>
              <p className="text-slate-900 font-semibold text-sm mb-3" style={{ fontFamily: "Sora, sans-serif" }}>92, Avenue Habert de Montmort</p>
              <p className="text-slate-600 text-sm mb-4" style={{ fontFamily: "Inter, sans-serif" }}>Le Mesnil-Saint-Denis (78)</p>
              <p className="font-bold text-slate-900 text-sm mb-2" style={{ fontFamily: "Sora, sans-serif" }}>Zone d'intervention</p>
              <ul className="space-y-1.5">
                {["Paris (75)", "Hauts-de-Seine (92)", "Val-d'Oise (95)", "Yvelines (78)", "Essonne (91)"].map((zone) => (
                  <li key={zone} className="flex items-center gap-2 text-sm text-slate-600" style={{ fontFamily: "Inter, sans-serif" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-700 flex-shrink-0" />
                    {zone}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-700 rounded-xl p-5 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Shield size={18} className="text-blue-200" />
                <p className="font-bold text-sm" style={{ fontFamily: "Sora, sans-serif" }}>Entreprise de confiance</p>
              </div>
              <p className="text-blue-100 text-xs leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                DPM Marigot est une entreprise locale établie, avec une adresse réelle et des artisans qualifiés. Votre projet est entre de bonnes mains.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
