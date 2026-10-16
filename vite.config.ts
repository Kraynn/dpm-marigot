import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";

// Configuration nettoyée pour le déploiement (les plugins spécifiques à
// l'environnement Manus ont été retirés : vite-plugin-manus-runtime,
// jsx-loc et le collecteur de logs de debug, inutiles en production).

// 2026-10-15 : relève les vidéos de chantier présentes dans client/public.
// Une vidéo absente ne peut pas se détecter depuis le navigateur (la
// réécriture SPA de Vercel renvoie index.html en 200), donc on la relève ici.
// Chemins : videos/realisations/<id>.{webm,mp4} et images/realisations/<id>/<id>-fin.webp.
// 2026-10-16 : même relevé pour la version paysage (desktop), suffixe -paysage :
// videos/realisations/<id>-paysage.{webm,mp4} et images/realisations/<id>/<id>-paysage-fin.webp.
type Presents = { webm: boolean; mp4: boolean; apercu: boolean };
function videosRealisations() {
  const pub = path.resolve(import.meta.dirname, "client", "public");
  const dossierImages = path.join(pub, "images", "realisations");
  const presents = (n: string, suffixe: string): Presents => ({
    webm: existsSync(path.join(pub, "videos", "realisations", `${n}${suffixe}.webm`)),
    mp4: existsSync(path.join(pub, "videos", "realisations", `${n}${suffixe}.mp4`)),
    apercu: existsSync(path.join(dossierImages, n, `${n}${suffixe}-fin.webp`)),
  });
  const releve: Record<string, Presents & { paysage: Presents }> = {};
  for (const id of readdirSync(dossierImages, { withFileTypes: true })) {
    if (!id.isDirectory()) continue;
    const n = id.name;
    releve[n] = { ...presents(n, ""), paysage: presents(n, "-paysage") };
  }
  return releve;
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __VIDEOS_REALISATIONS__: JSON.stringify(videosRealisations()),
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: true,
    allowedHosts: ["localhost", "127.0.0.1"],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
