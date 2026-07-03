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
    ...(data.email ? { reply_to: data.email } : {}),
    text: buildEmailText(data),
  });

  if (error) {
    throw new Error(`Resend: ${error.message}`);
  }
}

function buildEmailText(data: QuoteEmailInput): string {
  return [
    "Nouvelle demande de devis — DPM Marigot",
    "",
    `Nom         : ${data.nom}`,
    `Téléphone   : ${data.telephone}`,
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
