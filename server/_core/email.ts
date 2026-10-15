import { Resend } from "resend";
import { ENV } from "./env.js";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(ENV.resendApiKey);
  }
  return _resend;
}

export type QuoteEmailInput = {
  nom: string;
  telephone: string;
  /** Code postal du chantier (14/10/2026), cinq chiffres validés par la route. */
  codePostal: string;
  email?: string;
  projet: string;
  message?: string;
};

export async function sendQuoteEmail(data: QuoteEmailInput): Promise<void> {
  const to = ENV.quoteRecipientEmail;
  if (!to) {
    throw new Error("QUOTE_RECIPIENT_EMAIL n'est pas configuré");
  }

  const { error } = await getResend().emails.send({
    from: ENV.emailFrom,
    to: [to],
    subject: `Nouvelle demande de devis — ${data.nom}`,
    // camelCase obligatoire : le SDK Resend v6 lit `replyTo` et le convertit
    // lui-même en `reply_to` pour l'API. En snake_case le champ est ignoré
    // sans erreur — le Reply-To n'a donc jamais été posé jusqu'au 19/09.
    ...(data.email ? { replyTo: data.email } : {}),
    text: buildQuoteEmailText(data),
  });

  if (error) {
    throw new Error(`Resend: ${error.message}`);
  }
}

export function buildQuoteEmailText(data: QuoteEmailInput): string {
  return [
    "Nouvelle demande de devis — DPM Marigot",
    "",
    `Nom         : ${data.nom}`,
    `Téléphone   : ${data.telephone}`,
    `Code postal : ${data.codePostal}`,
    `Email       : ${data.email ?? "Non fourni"}`,
    `Projet      : ${data.projet}`,
    "",
    "Message :",
    data.message ?? "(aucun message)",
    "",
    "---",
    "Répondez directement à cet email pour contacter le client.",
  ].join("\n");
}
