import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { CHANTIERS, LARGEURS, animationDe, cheminsVideo, largeursDe, srcDe } from "./chantiers";

const PUBLIC = path.resolve(import.meta.dirname, "..", "public");

describe("chantiers des dernières réalisations", () => {
  it("chaque variante annoncée existe sur le disque, et aucune ne dépasse l'original", () => {
    for (const c of CHANTIERS) {
      for (const p of c.photos) {
        const largeurs = largeursDe(p);
        expect(largeurs.length).toBeGreaterThan(0);
        expect(Math.max(...largeurs)).toBeLessThanOrEqual(p.largeur);
        for (const l of largeurs) {
          const f = path.join(PUBLIC, srcDe(p, l));
          expect(existsSync(f), f).toBe(true);
          // en-tête RIFF....WEBP : un vrai WebP, pas un JPEG renommé
          const buf = readFileSync(f);
          expect(buf.toString("ascii", 0, 4)).toBe("RIFF");
          expect(buf.toString("ascii", 8, 12)).toBe("WEBP");
          expect(statSync(f).size).toBeGreaterThan(0);
        }
        // pas de variante produite au-delà de l'original
        for (const l of LARGEURS.filter((x) => x > p.largeur)) {
          expect(existsSync(path.join(PUBLIC, srcDe(p, l)))).toBe(false);
        }
      }
    }
  });

  it("une couverture valide, des photos sans doublon et décrites", () => {
    for (const c of CHANTIERS) {
      expect(c.photos[c.couverture], c.id).toBeDefined();
      const fichiers = c.photos.map((p) => p.fichier);
      expect(new Set(fichiers).size).toBe(fichiers.length);
      for (const p of c.photos) expect(p.alt.length).toBeGreaterThan(20);
      if (c.chronologique) for (const p of c.photos) expect(p.etape, p.fichier).toBeTruthy();
    }
  });

  it("la vitrine retouchée n'est pas une réalisation, la photo 03 de La Queue (doublon) non plus", () => {
    const tout = CHANTIERS.flatMap((c) => c.photos.map((p) => p.fichier.toLowerCase()));
    expect(tout.some((f) => f.includes("vitrine"))).toBe(false);
    expect(tout).not.toContain("la-queue-les-yvelines/la-queue-les-yvelines-03");
  });

  it("Demany s'appelle Magny-les-Hameaux : plus aucune trace de « demany »", () => {
    const texte = JSON.stringify(CHANTIERS).toLowerCase();
    expect(texte).not.toContain("demany");
    const magny = CHANTIERS.find((c) => c.id === "magny");
    expect(magny?.lieu).toBe("Magny-les-Hameaux");
    expect(existsSync(path.join(PUBLIC, "images", "realisations", "demany"))).toBe(false);
  });

  it("une vidéo absente laisse la carte sur sa photo, sans erreur", () => {
    expect(animationDe("buc", {})).toBeUndefined();
    expect(animationDe("buc", { buc: { webm: true, mp4: true, apercu: false } })).toBeUndefined();
    expect(animationDe("buc", { buc: { webm: false, mp4: false, apercu: true } })).toBeUndefined();
    expect(animationDe("buc", { buc: { webm: false, mp4: true, apercu: true } })).toEqual({
      apercu: "/images/realisations/buc/buc-fin.webp",
      webm: undefined,
      mp4: "/videos/realisations/buc.mp4",
    });
    expect(animationDe("magny", { magny: { webm: true, mp4: true, apercu: true } })).toEqual({
      apercu: "/images/realisations/magny/magny-fin.webp",
      webm: "/videos/realisations/magny.webm",
      mp4: "/videos/realisations/magny.mp4",
    });
  });

  it("le dossier d'images de chaque chantier porte son id (chemins vidéo)", () => {
    for (const c of CHANTIERS) {
      for (const p of c.photos) expect(p.fichier.startsWith(`${c.id}/${c.id}-`), p.fichier).toBe(true);
      expect(cheminsVideo(c.id).webm).toBe(`/videos/realisations/${c.id}.webm`);
    }
  });

  it("les chantiers avant → après commencent par l'avant et finissent par l'après", () => {
    for (const c of CHANTIERS.filter((x) => x.chronologique)) {
      expect(c.photos[0].etape).toBe("Avant");
      expect(c.photos[c.photos.length - 1].etape).toBe("Après");
      expect(c.couverture).toBe(c.photos.length - 1);
    }
  });
});
