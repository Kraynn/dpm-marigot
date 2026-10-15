// Relevé, au build, des vidéos de chantier présentes dans client/public
// (voir videosRealisations dans vite.config.ts et animationDe dans chantiers.ts).
declare const __VIDEOS_REALISATIONS__: Record<string, { webm: boolean; mp4: boolean; apercu: boolean }>;
