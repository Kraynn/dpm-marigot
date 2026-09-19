/**
 * DPM Marigot – Navbar
 * Direction « Le Nuancier » : bande de nuancier en tête, cube terre cuite,
 * bouton téléphone à ombre dure. Le numéro reste cliquable en permanence.
 */
import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import NuancierBar from "@/components/NuancierBar";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Réalisations", href: "#realisations" },
  { label: "Showroom", href: "#localisation" },
  { label: "Processus", href: "#processus" },
  { label: "Avis", href: "#avis" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleLink = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-creme border-b-[3px] border-encre">
      <NuancierBar />

      <div className="container">
        <div className="flex items-center justify-between h-16 lg:h-[74px] gap-4">
          {/* Marque – wordmark provisoire, le logo client reste à récupérer */}
          <a
            href="#"
            className="flex items-center gap-3 shrink-0"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <span className="w-10 h-10 bg-terre border-[3px] border-encre shadow-[4px_4px_0_var(--color-encre)] grid place-items-center text-creme font-display text-lg -rotate-[3deg]">
              D
            </span>
            <span className="hidden sm:block">
              <span className="block font-display text-xl leading-tight text-encre">DPM Marigot</span>
              <span className="block text-[11px] uppercase tracking-[0.14em] text-taupe leading-tight">
                Décoration · Peinture · Menuiserie
              </span>
            </span>
          </a>

          {/* Navigation desktop */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLink(link.href);
                }}
                className="text-sm font-medium text-encre border-b-2 border-transparent hover:border-terre pb-0.5 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Téléphone – toujours visible, toujours cliquable */}
          <div className="flex items-center gap-3">
            <a
              href="tel:+33185830355"
              className="hidden md:inline-flex items-center gap-2 bg-encre text-creme font-bold text-sm px-5 py-3 border-[3px] border-encre shadow-[5px_5px_0_var(--color-terre)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_var(--color-terre)] transition-all whitespace-nowrap"
            >
              <Phone size={15} />
              01 85 83 03 55
            </a>
            <a
              href="tel:+33185830355"
              className="md:hidden inline-flex items-center justify-center w-11 h-11 bg-encre text-creme border-[3px] border-encre"
              aria-label="Appeler le 01 85 83 03 55"
            >
              <Phone size={18} />
            </a>

            <button
              className="lg:hidden p-2 text-encre border-2 border-encre"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {open && (
        <div className="lg:hidden bg-creme border-t-[3px] border-encre">
          <div className="container py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLink(link.href);
                }}
                className="py-3 px-3 text-sm font-medium text-encre hover:bg-creme-2 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 mt-2 border-t-2 border-encre">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleLink("#contact");
                }}
                className="cta-btn w-full justify-center"
              >
                Demander un devis
                <span className="cta-arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
