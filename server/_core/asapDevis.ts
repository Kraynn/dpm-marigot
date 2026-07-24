/**
 * ASap Devis — forward server-to-server du lead vers le service central.
 *
 * Opt-in : ne fait RIEN si ASAP_DEVIS_API_URL n'est pas définie (le site
 * garde son comportement historique : email simple via Resend).
 * Best-effort : un échec du forward ne casse jamais la soumission du client.
 *
 * Service cible : https://asap-devis-api.vercel.app (endpoint /api/lead)
 */
import { ENV } from "./env.js";

export type AsapDevisLead = {
  nom: string;
  telephone: string;
  email?: string;
  projet: string; // type de projet choisi au menu
  message?: string; // message libre (sera analysé côté service)
};

export type AsapDevisResult =
  | { forwarded: false }
  | { forwarded: true; estimation: boolean; reference?: string | null };

export async function forwardToAsapDevis(lead: AsapDevisLead): Promise<AsapDevisResult> {
  const base = ENV.asapDevisApiUrl;
  if (!base) return { forwarded: false };

  try {
    const r = await fetch(`${base.replace(/\/$/, "")}/api/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ site: "dpm-marigot", ...lead }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!r.ok) {
      console.error("[asap-devis] forward HTTP", r.status);
      return { forwarded: false };
    }
    const data = (await r.json()) as { estimation?: boolean; reference_interne?: string | null };
    return { forwarded: true, estimation: Boolean(data.estimation), reference: data.reference_interne ?? null };
  } catch (err) {
    console.error("[asap-devis] forward échec:", err);
    return { forwarded: false };
  }
}
