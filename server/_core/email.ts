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
    // camelCase obligatoire : le SDK Resend v6 lit `replyTo` et le convertit
    // lui-même en `reply_to` pour l'API. En snake_case le champ est ignoré
    // sans erreur — le Reply-To n'a donc jamais été posé jusqu'au 19/09.
    ...(data.email ? { replyTo: data.email } : {}),
    text: buildEmailText(data),
  });

  if (error) {
    throw new Error(`Resend: ${error.message}`);
  }
}

/* ── Éditeur de page (06/10/2026) ──────────────────────────────────────────
   Le client retouche la page dans son navigateur (textes réécrits, blocs
   retirés) et envoie la liste. Ce mail est la seule trace : rien n'est écrit
   sur le site. Il part d'ASap Web vers ASap Web, pas vers la boîte des devis. */

export type ModificationDemandee = {
  type: "texte" | "retrait";
  section: string;
  element: string;
  avant: string;
  apres: string;
};

export type EditionEmailInput = {
  page: string;
  adresse?: string;
  palette?: string;
  largeur?: number;
  nom?: string;
  mot?: string;
  modifications: ModificationDemandee[];
  /** JPEG de la page modifiée, en base64 sans préfixe. */
  capture?: string;
};

const SITE = "DPM Marigot";

const echapper = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const accorder = (n: number) => `${n} modification${n > 1 ? "s" : ""} demandée${n > 1 ? "s" : ""}`;

/**
 * Ramène une valeur sur une seule ligne. Tout ce qui finit dans l'objet du mail
 * ou dans une ligne d'en-tête du corps vient du navigateur : un retour à la ligne
 * dans `page` est le motif classique d'injection d'en-tête.
 */
const uneLigne = (s: string) => s.replace(/[\x00-\x1f\x7f\s]+/g, " ").trim();

export function buildEditionEmail(brut: EditionEmailInput, date: Date = new Date()) {
  const data: EditionEmailInput = {
    ...brut,
    page: uneLigne(brut.page),
    adresse: brut.adresse && uneLigne(brut.adresse),
    palette: brut.palette && uneLigne(brut.palette),
    nom: brut.nom && uneLigne(brut.nom),
    modifications: brut.modifications.map(m => ({
      ...m,
      section: uneLigne(m.section),
      element: uneLigne(m.element),
    })),
  };
  const n = data.modifications.length;
  const subject = n
    ? `${SITE} — ${accorder(n)} (${data.page})`
    : `${SITE} — un mot du client (${data.page})`;

  const recu = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  }).format(date);

  const entete: [string, string][] = [
    ["Page", data.adresse ? `${data.page} (${data.adresse})` : data.page],
    ["Reçu le", recu],
  ];
  if (data.largeur) entete.push(["Écran", `${data.largeur} px de large`]);
  if (data.palette) entete.push(["Nuancier", data.palette]);
  if (data.nom) entete.push(["De", data.nom]);

  const pieces = data.capture
    ? "Pièces jointes : page-modifiee.jpg (la page telle que le client l'a laissée ; la FAQ y est dépliée et la carte Google remplacée par un cadre, c'est l'état du mode édition) et modifications.json (la même liste, structurée)."
    : "La capture de la page n'a pas pu être jointe. Pièce jointe : modifications.json (la même liste, structurée).";
  // Pas de promesse « mot pour mot » : un paragraphe coupé dans les sources par du
  // gras ou une variable (pages légales) ne se retrouve pas d'un seul tenant, et un
  // même libellé peut exister dans plusieurs composants.
  const mode =
    "Pour appliquer : « avant » est le texte affiché sur la page d'origine. Le chercher dans client/src ; la section indiquée départage quand il existe à plusieurs endroits.";

  const text = [
    `Modifications demandées sur le site ${SITE}`,
    "",
    ...entete.map(([k, v]) => `${k.padEnd(9)}: ${v}`),
    ...(data.mot ? ["", "Mot du client :", data.mot] : []),
    "",
    n ? accorder(n) : "Aucune retouche sur la page : seulement le mot ci-dessus.",
    ...data.modifications.flatMap((m, i) =>
      m.type === "texte"
        ? [
            "",
            `${i + 1}. TEXTE — ${m.section} › ${m.element}`,
            `   avant : « ${m.avant} »`,
            `   après : « ${m.apres} »`,
          ]
        : ["", `${i + 1}. BLOC RETIRÉ — ${m.section} › ${m.element}`, `   contenu : « ${m.avant} »`],
    ),
    "",
    "---",
    pieces,
    mode,
  ].join("\n");

  const ligne = (m: ModificationDemandee) =>
    m.type === "texte"
      ? `<li style="margin:0 0 18px"><strong>Texte</strong> — ${echapper(m.section)} › ${echapper(m.element)}<br>
<span style="color:#6f6458">avant :</span> <span style="text-decoration:line-through;color:#6f6458">${echapper(m.avant)}</span><br>
<span style="color:#6f6458">après :</span> <strong style="background:#f3ede4">${echapper(m.apres)}</strong></li>`
      : `<li style="margin:0 0 18px"><strong style="color:#a8442f">Bloc retiré</strong> — ${echapper(m.section)} › ${echapper(m.element)}<br>
<span style="color:#6f6458">contenu :</span> ${echapper(m.avant)}</li>`;

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#1a1613;max-width:680px">
<h1 style="font-size:20px;margin:0 0 14px">Modifications demandées sur le site ${SITE}</h1>
<table style="border-collapse:collapse;margin:0 0 18px">${entete
    .map(
      ([k, v]) =>
        `<tr><td style="padding:2px 14px 2px 0;color:#6f6458;vertical-align:top">${echapper(k)}</td><td style="padding:2px 0">${echapper(v)}</td></tr>`,
    )
    .join("")}</table>
${
  data.mot
    ? `<p style="margin:0 0 18px;padding:12px 14px;background:#f3ede4;border-left:4px solid #a8442f;white-space:pre-wrap"><strong>Mot du client</strong><br>${echapper(data.mot)}</p>`
    : ""
}
<h2 style="font-size:16px;margin:0 0 12px">${n ? accorder(n) : "Aucune retouche sur la page : seulement le mot ci-dessus."}</h2>
${n ? `<ol style="padding-left:22px;margin:0 0 18px">${data.modifications.map(ligne).join("")}</ol>` : ""}
<p style="margin:0;padding-top:12px;border-top:1px solid #d9cfc0;color:#6f6458;font-size:13px">${echapper(pieces)}<br>${echapper(mode)}</p>
</div>`;

  const { capture, ...sansCapture } = data;
  const attachments: { filename: string; content: string | Buffer }[] = [
    {
      filename: "modifications.json",
      content: Buffer.from(
        JSON.stringify({ site: SITE, recu: date.toISOString(), ...sansCapture }, null, 2),
        "utf8",
      ),
    },
  ];
  if (capture) attachments.unshift({ filename: "page-modifiee.jpg", content: capture });

  return { subject, text, html, attachments };
}

export async function sendEditionEmail(data: EditionEmailInput): Promise<void> {
  const { subject, text, html, attachments } = buildEditionEmail(data);
  const { error } = await getResend().emails.send({
    from: ENV.editionEmailFrom,
    to: [ENV.editionEmailTo],
    subject,
    text,
    html,
    attachments,
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
