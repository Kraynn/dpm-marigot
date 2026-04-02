/**
 * DPM Marigot – Hero Section
 * Design: Left-aligned split layout. Left: headline + CTA + trust badges. Right: before/after image.
 * Background: white. Bold Sora headline. Blue CTA button.
 */
import { useEffect, useRef, useState } from "react";
import { Star, CheckCircle2, ArrowRight, Phone } from "lucide-react";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663496267502/g5fSpueUDo8xsbtP8Baecz/hero-renovation-EQVCsSf3c94z2gDt9hFLyg.webp";

export default function HeroSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleCTA = () => {
    const el = document.querySelector("#contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative bg-white pt-16 overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 39px, oklch(0.12 0.01 260) 39px, oklch(0.12 0.01 260) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, oklch(0.12 0.01 260) 39px, oklch(0.12 0.01 260) 40px)`,
        }}
      />

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-4rem)] py-12 lg:py-20">
          {/* Left column – text */}
          <div
            ref={ref}
            className="flex flex-col gap-6"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(28px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            {/* Section label */}
            <div className="section-label flex items-center gap-2">
              <span className="w-6 h-0.5 bg-blue-700 inline-block" />
              Artisan local – Île-de-France
            </div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold text-slate-900 leading-[1.1] tracking-tight"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Un intérieur{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-blue-700">impeccable</span>
                <span
                  className="absolute bottom-1 left-0 right-0 h-3 -z-0 opacity-20"
                  style={{ background: "oklch(0.45 0.18 264)" }}
                />
              </span>
              ,<br />
              sans stress ni<br />
              mauvaises surprises.
            </h1>

            {/* Subheadline */}
            <p
              className="text-lg text-slate-600 leading-relaxed max-w-lg"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Travaux de peinture, décoration et menuiserie réalisés par des professionnels expérimentés — devis rapide et accompagnement personnalisé.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2">
              {[
                "Finitions haut de gamme",
                "Intervention rapide",
                "Conseils personnalisés",
                "Spécialiste dégâts des eaux",
              ].map((badge) => (
                <span key={badge} className="trust-badge">
                  <CheckCircle2 size={13} />
                  {badge}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
              <button onClick={handleCTA} className="cta-btn text-base">
                Obtenir mon devis gratuit
                <ArrowRight size={18} className="cta-arrow" />
              </button>
              <a
                href="tel:+33185830355"
                className="flex items-center gap-2 text-slate-700 hover:text-red-700 transition-colors font-medium text-sm"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <span className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                  <Phone size={18} />
                </span>
                <span>Appel direct</span>
              </a>
            </div>

            {/* Social proof strip */}
            <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
              <div className="flex -space-x-2">
                {["#3B82F6", "#1D4ED8", "#60A5FA"].map((c, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: c }}
                  >
                    {["M", "S", "A"][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-sm font-bold text-slate-900 ml-1" style={{ fontFamily: "Sora, sans-serif" }}>4,5/5</span>
                </div>
                <p className="text-xs text-slate-500" style={{ fontFamily: "Inter, sans-serif" }}>+10 clients satisfaits</p>
              </div>
            </div>
          </div>

          {/* Right column – before/after image */}
          <div
            className="relative"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(28px)",
              transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
            }}
          >
            {/* Image frame */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={HERO_IMAGE}
                alt="Avant / Après rénovation DPM Marigot"
                className="w-full h-auto object-cover"
                style={{ maxHeight: "520px", objectPosition: "center" }}
              />
              {/* Before/After labels */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between pointer-events-none">
                <span className="bg-black/60 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm" style={{ fontFamily: "Sora, sans-serif" }}>
                  Avant
                </span>
                <span className="bg-blue-700/90 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm" style={{ fontFamily: "Sora, sans-serif" }}>
                  Après ✓
                </span>
              </div>
            </div>

            {/* Floating stat card */}
            <div className="absolute -bottom-5 -left-4 bg-white rounded-xl shadow-xl p-4 flex items-center gap-3 border border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700 text-lg">
                🏆
              </div>
              <div>
                <p className="text-lg font-extrabold text-slate-900 leading-none" style={{ fontFamily: "Sora, sans-serif" }}>+10 ans</p>
                <p className="text-xs text-slate-500 mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>d'expérience terrain</p>
              </div>
            </div>

            {/* Floating response badge */}
            <div className="absolute -top-3 -right-3 bg-amber-400 text-amber-900 rounded-xl shadow-lg p-3 text-center">
              <p className="text-xs font-bold leading-none" style={{ fontFamily: "Sora, sans-serif" }}>Réponse</p>
              <p className="text-lg font-extrabold leading-none" style={{ fontFamily: "Sora, sans-serif" }}>24h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom diagonal */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-slate-50" style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }} />
    </section>
  );
}
