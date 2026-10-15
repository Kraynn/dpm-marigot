/**
 * DPM Marigot – CTA flottant
 * Mobile : barre basse « Appeler » (le téléphone reste l'action la plus rentable
 * sur mobile).
 * Direction « Le Nuancier » : angles vifs, bordures franches.
 *
 * 14/10/2026 (notes du RDV DPM) : le bouton WhatsApp est retiré, sur desktop
 * comme sur mobile, et le bouton « Devis gratuit » quitte la barre basse — les
 * appels au devis épars laissent la place à l'onglet « Contact » de l'en-tête.
 * « Appeler » reste seul et prend toute la largeur.
 */
import { useState, useEffect } from "react";
import { Phone } from "lucide-react";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // 06/10/2026 — en mode édition, la barre de l'éditeur occupe le bas de l'écran.
  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-creme border-t-[3px] border-encre p-3 flex">
      <a
        href="tel:+33185830355"
        className="flex-1 inline-flex items-center justify-center gap-2 bg-encre text-creme font-bold text-sm py-3.5 border-2 border-encre"
      >
        <Phone size={16} />
        Appeler
      </a>
    </div>
  );
}
