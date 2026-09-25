import { COOKIE_NAME } from "../shared/const.js";
import { forwardToAsapDevis } from "./_core/asapDevis.js";
import { getSessionCookieOptions } from "./_core/cookies.js";
import { sendQuoteEmail } from "./_core/email.js";
import { notifyOwner } from "./_core/notification.js";
import { systemRouter } from "./_core/systemRouter.js";
import { publicProcedure, router } from "./_core/trpc.js";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  contact: router({
    sendQuote: publicProcedure
      .input(
        z.object({
          nom: z.string().min(1, "Le nom est requis").max(100),
          telephone: z.string().min(5, "Le téléphone est requis").max(20),
          email: z.string().email("Email invalide").max(320).optional(),
          projet: z.string().min(1, "Le type de projet est requis").max(100),
          message: z.string().max(2000).optional(),
          website: z.string().optional(), // honeypot — doit rester vide
        })
      )
      .mutation(async ({ input }) => {
        // Honeypot : si rempli, ignorer silencieusement
        if (input.website) {
          return { success: true, message: "Demande de devis reçue" };
        }

        const { website: _hp, ...quoteData } = input;

        // 25/09/2026 — minimisation : cette notification ne fait qu'un console.log,
        // qui finit dans les journaux d'exécution de l'hébergeur. Y écrire le nom,
        // le téléphone et l'email du demandeur créait une troisième copie de ses
        // données personnelles, dans le seul endroit qu'on ne sait ni purger ni
        // montrer à la personne concernée. Seuls restent le type de projet et le
        // fait qu'un email a été fourni ou non — assez pour diagnostiquer.
        notifyOwner({
          title: "Nouvelle demande de devis",
          content: `projet: ${quoteData.projet} — email fourni: ${quoteData.email ? "oui" : "non"}`,
        });

        // ASap Devis (opt-in) : si le service central est configuré ET qu'il a
        // déjà envoyé un email — estimation chiffrée à Silva, ou fiche de
        // demande à l'artisan en formule « formulaire » — on évite le doublon.
        // Sinon, comportement historique (email simple), qui reste le filet
        // quand le forward échoue.
        const asap = await forwardToAsapDevis(quoteData);

        let emailSent = false;
        if (asap.forwarded && (asap.estimation || asap.notifie)) {
          emailSent = true; // email envoyé par asap-devis-api (avec PDF)
        } else {
          try {
            await sendQuoteEmail(quoteData);
            emailSent = true;
          } catch (err) {
            console.error("[sendQuote] Échec envoi email Resend:", err);
          }
        }

        return {
          success: true,
          emailSent,
          message: "Demande de devis reçue",
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
