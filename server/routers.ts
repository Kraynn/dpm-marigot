import { COOKIE_NAME } from "../shared/const.js";
import { forwardToAsapDevis } from "./_core/asapDevis.js";
import { getSessionCookieOptions } from "./_core/cookies.js";
import { sendEditionEmail, sendQuoteEmail } from "./_core/email.js";
import { autoriser } from "./_core/frequence.js";
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

  // 06/10/2026 — éditeur de page : le client retouche la page dans son navigateur
  // et envoie la liste de ses demandes. Le destinataire est fixé côté serveur
  // (ENV.editionEmailTo), jamais reçu du navigateur : la route ne peut pas servir
  // de relais vers une autre boîte.
  edition: router({
    soumettre: publicProcedure
      .input(
        z
          .object({
            page: z.string().min(1).max(200),
            adresse: z.string().max(500).optional(),
            palette: z.string().max(60).optional(),
            largeur: z.number().int().min(100).max(20000).optional(),
            nom: z.string().max(100).optional(),
            mot: z.string().max(2000).optional(),
            modifications: z
              .array(
                z.object({
                  type: z.enum(["texte", "retrait"]),
                  section: z.string().max(160),
                  element: z.string().max(80),
                  avant: z.string().max(5000),
                  apres: z.string().max(5000),
                })
              )
              .max(80),
            // JPEG en base64 sans préfixe ; ≈ 2,5 Mo au plus (corps Vercel : 4,5 Mo).
            capture: z
              .string()
              .max(3_400_000)
              .regex(/^[A-Za-z0-9+/]+=*$/, "Capture invalide")
              .optional(),
            website: z.string().optional(), // honeypot — doit rester vide
          })
          .refine(d => d.modifications.length > 0 || !!d.mot?.trim(), {
            message: "Aucune modification à envoyer",
          })
      )
      .mutation(async ({ input, ctx }) => {
        // Honeypot : si rempli, ignorer silencieusement
        if (input.website) {
          return { success: true } as const;
        }

        const transmis = ctx.req.headers["x-forwarded-for"];
        const ip = (Array.isArray(transmis) ? transmis[0] : transmis)?.split(",")[0]?.trim();
        if (!autoriser(`edition:${ip || "inconnue"}`, 6, 10 * 60 * 1000)) {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "Trop d'envois rapprochés. Réessayez dans quelques minutes.",
          });
        }

        const { website: _hp, ...demande } = input;

        // Même minimisation que pour les devis : ni le nom ni les textes dans les
        // journaux de l'hébergeur, seulement de quoi diagnostiquer.
        notifyOwner({
          title: "Retouches demandées depuis l'éditeur de page",
          content: `page: ${demande.page} — modifications: ${demande.modifications.length} — capture: ${demande.capture ? "oui" : "non"}`,
        });

        try {
          await sendEditionEmail(demande);
        } catch (err) {
          // Ici, pas de filet : si le mail ne part pas, les retouches sont perdues.
          // Le navigateur doit le savoir pour garder le brouillon et proposer de réessayer.
          console.error("[edition.soumettre] Échec envoi email Resend:", err);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "L'envoi a échoué. Vos modifications sont conservées, réessayez.",
          });
        }

        return { success: true } as const;
      }),
  }),
});

export type AppRouter = typeof appRouter;
