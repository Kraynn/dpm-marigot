import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn(),
}));

vi.mock("./_core/email", () => ({
  sendQuoteEmail: vi.fn(),
}));

// Imports récupérés après le mock pour accéder aux fonctions mockées
import { sendQuoteEmail } from "./_core/email";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} },
    res: { clearCookie: vi.fn() },
  };
}

const validInput = {
  nom: "Jean Dupont",
  telephone: "06 12 34 56 78",
  email: "jean@example.com",
  projet: "Peinture intérieure",
  message: "Je souhaite peindre mon salon",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(sendQuoteEmail).mockResolvedValue(undefined);
  process.env.QUOTE_RECIPIENT_EMAIL = "owner@example.com";
});

describe("contact.sendQuote", () => {
  // 1. Soumission valide — email construit avec les bons champs
  it("envoie l'email avec les bons champs et le bon reply-to", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.contact.sendQuote(validInput);

    expect(result.success).toBe(true);
    expect(result.emailSent).toBe(true);
    expect(sendQuoteEmail).toHaveBeenCalledOnce();

    const emailArg = vi.mocked(sendQuoteEmail).mock.calls[0][0];
    expect(emailArg.nom).toBe("Jean Dupont");
    expect(emailArg.telephone).toBe("06 12 34 56 78");
    expect(emailArg.email).toBe("jean@example.com");
    expect(emailArg.projet).toBe("Peinture intérieure");
    expect(emailArg.message).toBe("Je souhaite peindre mon salon");
    // honeypot ne doit pas être transmis à sendQuoteEmail
    expect((emailArg as Record<string, unknown>).website).toBeUndefined();
  });

  it("accepte une demande sans email (reply-to absent)", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.contact.sendQuote({
      nom: "Marie Martin",
      telephone: "+33 1 85 83 03 55",
      projet: "Menuiserie",
    });

    expect(result.success).toBe(true);
    expect(result.emailSent).toBe(true);
    const emailArg = vi.mocked(sendQuoteEmail).mock.calls[0][0];
    expect(emailArg.email).toBeUndefined();
  });

  // 2. Validation — champs requis et email invalide
  it("rejette si le nom est vide", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.contact.sendQuote({ ...validInput, nom: "" })
    ).rejects.toThrow();
    expect(sendQuoteEmail).not.toHaveBeenCalled();
  });

  it("rejette si le téléphone est vide", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.contact.sendQuote({ ...validInput, telephone: "" })
    ).rejects.toThrow();
    expect(sendQuoteEmail).not.toHaveBeenCalled();
  });

  it("rejette si l'email est invalide", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.contact.sendQuote({ ...validInput, email: "pas-un-email" })
    ).rejects.toThrow();
    expect(sendQuoteEmail).not.toHaveBeenCalled();
  });

  it("rejette si le type de projet est vide", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.contact.sendQuote({ ...validInput, projet: "" })
    ).rejects.toThrow();
    expect(sendQuoteEmail).not.toHaveBeenCalled();
  });

  // 3. Échec Resend — la route ne crash pas et renvoie emailSent: false
  it("ne crash pas si Resend échoue et renvoie emailSent: false", async () => {
    vi.mocked(sendQuoteEmail).mockRejectedValueOnce(new Error("Resend down"));
    const caller = appRouter.createCaller(createPublicContext());

    const result = await caller.contact.sendQuote(validInput);

    expect(result.success).toBe(true);
    expect(result.emailSent).toBe(false);
  });

  // 4. Honeypot rempli — soumission ignorée silencieusement
  it("ignore silencieusement une soumission avec honeypot rempli", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.contact.sendQuote({
      ...validInput,
      website: "http://spam.bot",
    });

    expect(result.success).toBe(true);
    expect(sendQuoteEmail).not.toHaveBeenCalled();
  });
});
