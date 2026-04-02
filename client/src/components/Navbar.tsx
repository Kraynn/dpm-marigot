/**
 * DPM Marigot – Navbar
 * Design: "Chantier Propre" – white background, Sora font, blue CTA
 * Sticky top nav with smooth scroll links and mobile hamburger
 */
import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Réalisations", href: "#realisations" },
  { label: "Processus", href: "#processus" },
  { label: "Avis", href: "#avis" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLink = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          >
            <div className="w-9 h-9 rounded-md flex items-center justify-center" style={{ background: "oklch(0.45 0.18 264)" }}>
              <span className="text-white font-bold text-sm" style={{ fontFamily: "Sora, sans-serif" }}>DPM</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-slate-900 leading-tight text-sm" style={{ fontFamily: "Sora, sans-serif" }}>DPM Marigot</p>
              <p className="text-xs text-slate-500 leading-tight" style={{ fontFamily: "Inter, sans-serif" }}>Décoration · Peinture · Menuiserie</p>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleLink(link.href); }}
                className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:+33185830355"
              className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-blue-700 transition-colors"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <Phone size={15} />
              Nous appeler
            </a>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); handleLink("#contact"); }}
              className="cta-btn text-sm py-2.5 px-5"
            >
              Devis gratuit
              <span className="cta-arrow">→</span>
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-slate-700"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="container py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleLink(link.href); }}
                className="py-2.5 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-slate-100 mt-2">
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); handleLink("#contact"); }}
                className="cta-btn w-full justify-center"
              >
                Obtenir mon devis gratuit
                <span className="cta-arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
