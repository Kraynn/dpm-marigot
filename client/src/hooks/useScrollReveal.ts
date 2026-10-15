import { useEffect, useRef, useState } from "react";

/**
 * Révèle un bloc quand il entre dans le champ.
 *
 * 2026-09-21 — `prefers-reduced-motion` est maintenant respecté ici aussi.
 * index.css neutralisait déjà les animations de `.reveal` et des boutons, mais
 * pas celles-ci : elles sont posées en style inline par les composants
 * (`opacity: visible ? 1 : 0`), donc hors de portée d'une règle CSS. Un
 * visiteur qui demande moins d'animation voyait quand même chaque section
 * apparaître en fondu et en translation. Il reçoit désormais la page déjà
 * révélée, sans transition.
 *
 * Effet de bord utile : les captures en navigateur sans tête, qui se prennent
 * avec `--force-prefers-reduced-motion`, ne sortent plus à moitié transparentes.
 */
const SANS_ANIMATION = "(prefers-reduced-motion: reduce)";

function reduireLesAnimations() {
  return typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia(SANS_ANIMATION).matches
    : false;
}

export function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  // L'état initial décide du premier rendu : le calculer ici, et pas dans un
  // effet, évite une frame où le bloc est encore invisible.
  const [visible, setVisible] = useState(reduireLesAnimations);

  useEffect(() => {
    if (reduireLesAnimations()) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}
