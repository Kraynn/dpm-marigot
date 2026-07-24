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
};
