/**
 * DPM Marigot – Footer
 * Design: Dark slate-900. Logo, links, contact info, legal mentions, CTA.
 */
import { ArrowRight, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const handleCTA = () => {
    const el = document.querySelector("#contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-950 text-white">
      {/* CTA band */}
      <div className="bg-blue-700 py-10">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xl font-extrabold text-white" style={{ fontFamily: "Sora, sans-serif" }}>
              Prêt à démarrer votre projet ?
            </p>
            <p className="text-blue-100 text-sm mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
              Devis gratuit · Réponse sous 24h · Sans engagement
            </p>
          </div>
          <button onClick={handleCTA} className="bg-white text-blue-700 font-bold text-sm px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-50 transition-colors flex-shrink-0" style={{ fontFamily: "Sora, sans-serif" }}>
            Obtenir mon devis gratuit
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Main footer */}
      <div className="container py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-md bg-blue-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm" style={{ fontFamily: "Sora, sans-serif" }}>DPM</span>
              </div>
              <div>
                <p className="font-bold text-white leading-tight text-sm" style={{ fontFamily: "Sora, sans-serif" }}>DPM Marigot</p>
                <p className="text-xs text-slate-400" style={{ fontFamily: "Inter, sans-serif" }}>Décoration · Peinture · Menuiserie</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs" style={{ fontFamily: "Inter, sans-serif" }}>
              Artisan local spécialisé en peinture, décoration intérieure, menuiserie et rénovation après sinistre en Île-de-France.
            </p>
            <div className="flex flex-col gap-2 mt-4">
              <a href="tel:+33185830355" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                <Phone size={14} /> +33 1 85 83 03 55
              </a>
              <a href="mailto:dpmmarigot@gmail.com" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                <Mail size={14} /> dpmmarigot@gmail.com
              </a>
              <span className="flex items-center gap-2 text-slate-400 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                <MapPin size={14} /> Île-de-France
              </span>
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="text-white font-semibold text-sm mb-4" style={{ fontFamily: "Sora, sans-serif" }}>Services</p>
            <ul className="flex flex-col gap-2">
              {["Peinture intérieure", "Peinture extérieure", "Décoration", "Menuiserie", "Dégâts des eaux"].map((s) => (
                <li key={s}>
                  <a
                    href="#services"
                    onClick={(e) => { e.preventDefault(); document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" }); }}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Zone */}
          <div>
            <p className="text-white font-semibold text-sm mb-4" style={{ fontFamily: "Sora, sans-serif" }}>Zone d'intervention</p>
            <ul className="flex flex-col gap-2">
              {["Paris (75)", "Hauts-de-Seine (92)", "Val-d'Oise (95)", "Yvelines (78)", "Essonne (91)"].map((z) => (
                <li key={z} className="text-slate-400 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>{z}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
            © {new Date().getFullYear()} DPM Marigot. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
              Mentions légales
            </a>
            <a href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
              Politique de confidentialité
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
