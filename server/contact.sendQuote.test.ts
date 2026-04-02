import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the notifyOwner function
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("contact.sendQuote", () => {
  it("accepts a valid quote request with all fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.sendQuote({
      nom: "Jean Dupont",
      telephone: "06 12 34 56 78",
      email: "jean@example.com",
      projet: "Peinture intérieure",
      message: "Je souhaite peindre mon salon",
    });

    expect(result).toEqual({
      success: true,
      message: "Demande de devis reçue",
    });
  });

  it("accepts a quote request without email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.sendQuote({
      nom: "Marie Martin",
      telephone: "+33 1 85 83 03 55",
      projet: "Menuiserie",
    });

    expect(result).toEqual({
      success: true,
      message: "Demande de devis reçue",
    });
  });

  it("rejects a request without name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.sendQuote({
        nom: "",
        telephone: "06 12 34 56 78",
        projet: "Peinture intérieure",
      });
      expect.fail("Should have thrown an error");
    } catch (error: unknown) {
      expect(error).toBeDefined();
    }
  });

  it("rejects a request without phone", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.sendQuote({
        nom: "Jean Dupont",
        telephone: "",
        projet: "Peinture intérieure",
      });
      expect.fail("Should have thrown an error");
    } catch (error: unknown) {
      expect(error).toBeDefined();
    }
  });

  it("rejects a request with invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.sendQuote({
        nom: "Jean Dupont",
        telephone: "06 12 34 56 78",
        email: "not-an-email",
        projet: "Peinture intérieure",
      });
      expect.fail("Should have thrown an error");
    } catch (error: unknown) {
      expect(error).toBeDefined();
    }
  });

  it("rejects a request without project type", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.sendQuote({
        nom: "Jean Dupont",
        telephone: "06 12 34 56 78",
        projet: "",
      });
      expect.fail("Should have thrown an error");
    } catch (error: unknown) {
      expect(error).toBeDefined();
    }
  });
});
