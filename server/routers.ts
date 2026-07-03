import { COOKIE_NAME } from "../shared/const.js";
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

        notifyOwner({
          title: "Nouvelle demande de devis",
          content: `${quoteData.nom} — ${quoteData.projet}\nTél: ${quoteData.telephone}\nEmail: ${quoteData.email ?? "Non fourni"}`,
        });

        let emailSent = false;
        try {
          await sendQuoteEmail(quoteData);
          emailSent = true;
        } catch (err) {
          console.error("[sendQuote] Échec envoi email Resend:", err);
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
