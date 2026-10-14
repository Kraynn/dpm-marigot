/**
 * Contenu du mail de devis (14/10/2026 : ajout du code postal).
 * Test pur : on construit le texte, rien n'est envoyé — Resend n'est jamais appelé.
 */
import { describe, expect, it } from "vitest";
import { buildQuoteEmailText } from "./_core/email";

describe("mail de demande de devis", () => {
  it("porte le code postal du chantier, sous le téléphone", () => {
    const texte = buildQuoteEmailText({
      nom: "Jean Dupont",
      telephone: "06 12 34 56 78",
      codePostal: "78320",
      projet: "Peinture intérieure",
    });
    const lignes = texte.split("\n");
    const iTel = lignes.findIndex(l => l.startsWith("Téléphone"));
    expect(lignes[iTel + 1]).toBe("Code postal : 78320");
    expect(texte).toContain("Email       : Non fourni");
  });
});
