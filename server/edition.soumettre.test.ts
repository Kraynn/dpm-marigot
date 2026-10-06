import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { oublierLesPassages } from "./_core/frequence";

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn(),
}));

// Seul l'envoi est simulé : la construction du mail reste la vraie, elle est testée plus bas.
vi.mock("./_core/email", async importOriginal => ({
  ...(await importOriginal<typeof import("./_core/email")>()),
  sendQuoteEmail: vi.fn(),
  sendEditionEmail: vi.fn(),
}));

vi.mock("./_core/asapDevis", () => ({
  forwardToAsapDevis: vi.fn(),
}));

import { buildEditionEmail, sendEditionEmail } from "./_core/email";
import { notifyOwner } from "./_core/notification";

function createPublicContext(ip = "203.0.113.7"): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: { "x-forwarded-for": `${ip}, 10.0.0.1` } },
    res: { clearCookie: vi.fn() },
  };
}

const texte = {
  type: "texte" as const,
  section: "Nos métiers",
  element: "titre",
  avant: "Quatre savoir-faire, un seul interlocuteur.",
  apres: "Quatre métiers, une seule équipe.",
};

const retrait = {
  type: "retrait" as const,
  section: "Nos métiers",
  element: "carte",
  avant: "Menuiserie Menuiserie Habillages, plinthes, aménagements sur mesure",
  apres: "",
};

const validInput = {
  page: "/",
  adresse: "https://dpm-marigot.vercel.app/",
  palette: "Terracotta",
  largeur: 1440,
  nom: "Anne-Cécile",
  mot: "La photo du plafond est à changer.",
  modifications: [texte, retrait],
  capture: "AAAA",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(sendEditionEmail).mockResolvedValue(undefined);
  oublierLesPassages();
});

describe("edition.soumettre", () => {
  it("transmet les retouches, la capture et le mot, sans le champ piège", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.edition.soumettre({ ...validInput, website: "" });

    expect(result.success).toBe(true);
    expect(sendEditionEmail).toHaveBeenCalledOnce();
    const arg = vi.mocked(sendEditionEmail).mock.calls[0][0];
    expect(arg.modifications).toEqual([texte, retrait]);
    expect(arg.capture).toBe("AAAA");
    expect(arg.nom).toBe("Anne-Cécile");
    expect(arg.palette).toBe("Terracotta");
    expect((arg as Record<string, unknown>).website).toBeUndefined();
  });

  it("accepte un mot seul, sans aucune retouche", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.edition.soumettre({
      page: "/",
      mot: "Peut-on ajouter une section sur les cuisines ?",
      modifications: [],
    });

    expect(result.success).toBe(true);
    expect(sendEditionEmail).toHaveBeenCalledOnce();
  });

  it("rejette un envoi vide : ni retouche ni mot", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.edition.soumettre({ page: "/", mot: "   ", modifications: [] })
    ).rejects.toThrow();
    expect(sendEditionEmail).not.toHaveBeenCalled();
  });

  it("rejette une capture qui n'est pas du base64", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.edition.soumettre({ ...validInput, capture: "<script>alert(1)</script>" })
    ).rejects.toThrow();
    expect(sendEditionEmail).not.toHaveBeenCalled();
  });

  it("rejette plus de 80 retouches", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.edition.soumettre({ ...validInput, modifications: Array(81).fill(texte) })
    ).rejects.toThrow();
    expect(sendEditionEmail).not.toHaveBeenCalled();
  });

  it("ignore silencieusement une soumission avec honeypot rempli", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.edition.soumettre({ ...validInput, website: "http://spam.bot" });

    expect(result.success).toBe(true);
    expect(sendEditionEmail).not.toHaveBeenCalled();
  });

  // Pas de filet ici, contrairement au Devis : un mail qui ne part pas, ce sont des
  // retouches perdues. Le navigateur doit recevoir une erreur pour garder le brouillon.
  it("remonte une erreur si Resend échoue", async () => {
    vi.mocked(sendEditionEmail).mockRejectedValueOnce(new Error("Resend: domain not verified"));
    const caller = appRouter.createCaller(createPublicContext());

    await expect(caller.edition.soumettre(validInput)).rejects.toThrow(/envoi a échoué/);
  });

  it("freine le septième envoi d'une même adresse, pas celui d'une autre", async () => {
    const caller = appRouter.createCaller(createPublicContext("198.51.100.1"));
    for (let i = 0; i < 6; i++) await caller.edition.soumettre(validInput);

    await expect(caller.edition.soumettre(validInput)).rejects.toThrow(/Trop d'envois/);
    expect(sendEditionEmail).toHaveBeenCalledTimes(6);

    const autre = appRouter.createCaller(createPublicContext("198.51.100.2"));
    await expect(autre.edition.soumettre(validInput)).resolves.toEqual({ success: true });
  });

  it("n'écrit ni le nom ni les textes dans les journaux", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await caller.edition.soumettre(validInput);

    const journal = JSON.stringify(vi.mocked(notifyOwner).mock.calls);
    expect(journal).not.toContain("Anne-Cécile");
    expect(journal).not.toContain("Quatre savoir-faire");
    expect(journal).not.toContain("plafond");
  });
});

describe("buildEditionEmail", () => {
  const date = new Date("2026-10-06T18:31:00Z"); // 20h31 à Paris

  it("compte les retouches dans l'objet et cite avant / après mot pour mot", () => {
    const mail = buildEditionEmail(validInput, date);

    expect(mail.subject).toBe("DPM Marigot — 2 modifications demandées (/)");
    expect(mail.text).toContain("1. TEXTE — Nos métiers › titre");
    expect(mail.text).toContain("avant : « Quatre savoir-faire, un seul interlocuteur. »");
    expect(mail.text).toContain("après : « Quatre métiers, une seule équipe. »");
    expect(mail.text).toContain("2. BLOC RETIRÉ — Nos métiers › carte");
    expect(mail.text).toContain("Terracotta");
    expect(mail.text).toContain("La photo du plafond est à changer.");
    expect(mail.text).toContain("mardi 6 octobre 2026 à 20:31");
  });

  it("joint la capture et la liste structurée", () => {
    const mail = buildEditionEmail(validInput, date);

    expect(mail.attachments.map(a => a.filename)).toEqual([
      "page-modifiee.jpg",
      "modifications.json",
    ]);
    expect(mail.attachments[0].content).toBe("AAAA");
    const json = JSON.parse(mail.attachments[1].content.toString());
    expect(json.modifications).toEqual([texte, retrait]);
    expect(json.capture).toBeUndefined();
  });

  it("dit en clair quand la capture manque", () => {
    const { capture: _c, ...sansCapture } = validInput;
    const mail = buildEditionEmail(sansCapture, date);

    expect(mail.attachments.map(a => a.filename)).toEqual(["modifications.json"]);
    expect(mail.text).toContain("La capture de la page n'a pas pu être jointe.");
  });

  it("échappe tout ce qui vient du navigateur dans la version HTML", () => {
    const mail = buildEditionEmail(
      {
        ...validInput,
        nom: '<img src=x onerror="alert(1)">',
        mot: "<script>alert(2)</script>",
        modifications: [{ ...texte, apres: "<b>gras</b> & co" }],
      },
      date
    );

    expect(mail.html).not.toContain("<img");
    expect(mail.html).not.toContain("<script>");
    expect(mail.html).not.toContain("<b>gras</b>");
    expect(mail.html).toContain("&lt;b&gt;gras&lt;/b&gt; &amp; co");
  });

  it("annonce un mot seul quand il n'y a aucune retouche", () => {
    const mail = buildEditionEmail({ page: "/", mot: "Une question.", modifications: [] }, date);

    expect(mail.subject).toBe("DPM Marigot — un mot du client (/)");
    expect(mail.text).toContain("Aucune retouche sur la page");
  });
});
