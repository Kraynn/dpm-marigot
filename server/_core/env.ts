import { config } from "dotenv";
config();

export const ENV = {
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  quoteRecipientEmail: process.env.QUOTE_RECIPIENT_EMAIL ?? "",
  emailFrom: process.env.EMAIL_FROM ?? "DPM Marigot <onboarding@resend.dev>",
  // ASap Devis — URL du service central de génération d'estimations.
  // Vide = comportement historique (email simple). Renseignée = forward opt-in.
  asapDevisApiUrl: process.env.ASAP_DEVIS_API_URL ?? "",
  // Éditeur de page (06/10/2026) — les retouches demandées par le client partent
  // vers ASap Web, pas vers la boîte des devis. Le domaine asapworks.fr est vérifié
  // chez Resend ; les valeurs par défaut suffisent, aucune variable à poser sur Vercel.
  editionEmailFrom: process.env.EDITION_EMAIL_FROM ?? "ASap Web <contact@asapworks.fr>",
  editionEmailTo: process.env.EDITION_EMAIL_TO ?? "contact@asapworks.fr",
};
