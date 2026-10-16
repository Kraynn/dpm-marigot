// Relevé, au build, des vidéos de chantier présentes dans client/public
// (voir videosRealisations dans vite.config.ts et animationDe dans chantiers.ts).
// paysage (16/10/2026) : la version 16:9 pour le desktop, relevée de la même façon.
declare const __VIDEOS_REALISATIONS__: Record<
  string,
  {
    webm: boolean;
    mp4: boolean;
    apercu: boolean;
    paysage?: { webm: boolean; mp4: boolean; apercu: boolean };
  }
>;
