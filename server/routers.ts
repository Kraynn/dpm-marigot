import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  contact: router({
    sendQuote: publicProcedure
      .input(
        z.object({
          nom: z.string().min(1, "Name is required"),
          telephone: z.string().min(1, "Phone is required"),
          email: z.string().email("Valid email required").optional(),
          projet: z.string().min(1, "Project type is required"),
          message: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        // Notify owner about new quote request
        await notifyOwner({
          title: "Nouvelle demande de devis",
          content: `${input.nom} a soumis une demande de devis pour: ${input.projet}\n\nTéléphone: ${input.telephone}\nEmail: ${input.email || "Non fourni"}`,
        });

        return {
          success: true,
          message: "Demande de devis reçue",
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
