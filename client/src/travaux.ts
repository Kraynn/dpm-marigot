/**
 * Les travaux de rénovation annoncés par DPM sur l'adhésif vitrine du showroom
 * (assets/mail_recu/1-Adhésif Vitrine DPM Marigot.pdf, reçu le 05/10/2026).
 * Ordre et libellés de l'adhésif ; seul « Électricité » reprend son accent.
 *
 * Source unique : la section Services les affiche, le Devis les propose dans
 * son menu, et index.html les reprend à la main dans le JSON-LD (`knowsAbout`).
 * Toute modification ici doit être reportée dans index.html.
 */
export const TRAVAUX_RENOVATION = [
  "Rénovation de salle de bain",
  "Peinture, papier peint",
  "Carrelage, faïence",
  "Revêtement de sol (dur et souple)",
  "Rénovation parquet",
  "Isolation, cloisons",
  "Menuiserie",
  "Serrurerie",
  "Plomberie",
  "Électricité",
] as const;
