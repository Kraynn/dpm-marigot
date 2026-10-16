import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { CHANTIERS, LARGEURS, animationDe, cheminsVideo, formatAJouer, largeursDe, srcDe, taillesApercu } from "./chantiers";

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

  it("la version paysage s'ajoute quand elle est complète, sinon repli sur la portrait", () => {
    const portrait = { webm: true, mp4: true, apercu: true };
    // paysage absente, ou incomplète : aucune clé paysage
    expect(animationDe("buc", { buc: portrait })?.paysage).toBeUndefined();
    expect(
      animationDe("buc", { buc: { ...portrait, paysage: { webm: true, mp4: true, apercu: false } } })?.paysage,
    ).toBeUndefined();
    // paysage seule, sans portrait : pas de vidéo (la carte et le mobile ont besoin de la portrait)
    expect(
      animationDe("buc", { buc: { webm: false, mp4: false, apercu: false, paysage: portrait } }),
    ).toBeUndefined();
    const anim = animationDe("buc", { buc: { ...portrait, paysage: { webm: false, mp4: true, apercu: true } } });
    expect(anim?.paysage).toEqual({
      apercu: "/images/realisations/buc/buc-paysage-fin.webp",
      webm: undefined,
      mp4: "/videos/realisations/buc-paysage.mp4",
    });
    // écran large et couché : paysage ; sinon portrait
    expect(formatAJouer(anim!, true).format).toBe("paysage");
    expect(formatAJouer(anim!, true).ratio).toBeCloseTo(16 / 9);
    expect(formatAJouer(anim!, false).format).toBe("portrait");
    expect(formatAJouer(anim!, false).sources.mp4).toBe("/videos/realisations/buc.mp4");
    // sans paysage, même sur écran couché : portrait
    const seule = animationDe("buc", { buc: portrait })!;
    expect(formatAJouer(seule, true).format).toBe("portrait");
    expect(formatAJouer(seule, true).ratio).toBeCloseTo(3 / 4);
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
      // La couverture d'un chantier qui se lit dans l'ordre montre le résultat.
      expect(c.photos[c.couverture].etape, c.id).toBe("Après");
    }
  });

  it("sizes de l'aperçu : une photo paysage recadrée en 4:5 demande un fichier plus large", () => {
    const buc = CHANTIERS.find((c) => c.id === "buc")!;
    expect(taillesApercu(buc.photos[0])).toBe("(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw");
    const magny = CHANTIERS.find((c) => c.id === "magny")!;
    expect(taillesApercu(magny.photos[5])).toBe("(min-width: 1024px) 667px, (min-width: 640px) 83vw, 167vw");
  });

  it("aperçu par défaut : l'avant-dernière photo pour Buc, la dernière pour La Queue-les-Yvelines", () => {
    // Demande de Silva du 16/10/2026, portée par la donnée (couverture), pas par le composant.
    const buc = CHANTIERS.find((c) => c.id === "buc")!;
    expect(buc.couverture).toBe(buc.photos.length - 2);
    const lq = CHANTIERS.find((c) => c.id === "la-queue-les-yvelines")!;
    expect(lq.couverture).toBe(lq.photos.length - 1);
    expect(CHANTIERS.find((c) => c.id === "magny")!.couverture).toBe(5);
  });
});
