import { useEffect, useRef, useState } from "react";

/**
 * Révèle un bloc quand il entre dans le champ.
 *
 * 2026-10-16 — Règle de Silva « animations pour tout le monde » (01/09, 07/10) :
 * l'apparition au défilement joue pour tous les visiteurs, avec ou sans le
 * réglage « réduire les animations » du système. Le passage du 2026-09-21, qui
 * livrait la page déjà révélée en mouvement réduit, est retiré. Aucune
 * condition sur prefers-reduced-motion ne doit revenir ici.
 */
export function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
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
