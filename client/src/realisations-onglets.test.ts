// Ordre des onglets de la section Réalisations (demande de Silva, 16/10/2026) :
// « Nos dernières réalisations » d'abord et ouvert par défaut, puis
// « Autres réalisations » (l'ancien « Avant / après »). Les tests tournent sans
// DOM : on lit la source du composant.
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(path.join(import.meta.dirname, "components", "RealisationsGallery.tsx"), "utf8");

describe("onglets des réalisations", () => {
  it("s'ouvre sur les dernières réalisations", () => {
    expect(source).toContain('<Tabs.Root defaultValue="dernieres">');
  });

  it("dernières réalisations en premier, puis Autres réalisations ; plus d'onglet « Avant / après »", () => {
    const declencheurs = [...source.matchAll(/<Tabs\.Trigger value="([^"]+)"[^>]*>\s*([^<]+?)\s*</g)].map(
      (m) => [m[1], m[2]],
    );
    expect(declencheurs).toEqual([
      ["dernieres", "Nos dernières réalisations"],
      ["autres", "Autres réalisations"],
    ]);
    expect(source).not.toContain('value="avant-apres"');
  });
});
