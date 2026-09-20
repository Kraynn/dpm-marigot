/**
 * DPM Marigot – les réseaux sociaux du client, en un seul endroit.
 *
 * Créé le 2026-09-21 : le header gagne ses icônes, le pied de page en avait
 * déjà une, et le JSON-LD de client/index.html porte les mêmes URL dans
 * `sameAs`. Trois endroits pour la même vérité, c'est trois endroits à
 * corriger le jour où une URL change.
 *
 * `null` = URL pas encore connue. Les composants ne rendent PAS le lien dans
 * ce cas : le site est en ligne chez un vrai client, une icône qui pointe dans
 * le vide est pire que pas d'icône. Le composant, lui, est prêt — il n'y a
 * qu'une ligne à remplir ici, et l'URL à ajouter au `sameAs` du JSON-LD.
 *
 * Instagram : fournie par Silva le 2026-09-21, vérifiée au navigateur le même
 * jour — le compte rend « Dpm Marigot (@dpmmarigotrenovinterieure) », 97
 * abonnés, 54 publications. Elle ne figurait nulle part sur leur page Facebook,
 * d'où l'attente jusqu'ici.
 * Facebook : https://www.facebook.com/dpmmarigot — présente dans le dépôt
 * depuis l'origine, jamais contrôlée jusqu'au 2026-09-21. Vérifiée ce jour-là
 * au navigateur (curl reçoit un 400 de Facebook, ce qui ne prouve rien) : la
 * page rend le titre « DPM Marigot - Décoration, Peinture, Menuiserie |
 * Le Mesnil-Saint-Denis ». C'est bien la bonne page.
 *
 * L'ordre du tableau est l'ordre d'affichage : Instagram à gauche de Facebook,
 * demandé par Silva le 2026-09-21.
 */

export type Reseau = {
  nom: string;
  url: string | null;
  /** libellé du lien pour les lecteurs d'écran */
  libelle: string;
};

export const RESEAUX: Record<"facebook" | "instagram", Reseau> = {
  facebook: {
    nom: "Facebook",
    url: "https://www.facebook.com/dpmmarigot",
    libelle: "DPM Marigot sur Facebook (nouvel onglet)",
  },
  instagram: {
    nom: "Instagram",
    url: "https://www.instagram.com/dpmmarigotrenovinterieure/",
    libelle: "DPM Marigot sur Instagram (nouvel onglet)",
  },
};

/** Les réseaux dont l'URL est connue, dans l'ordre d'affichage. */
export const RESEAUX_CONNUS = [RESEAUX.instagram, RESEAUX.facebook].filter(
  (r): r is Reseau & { url: string } => r.url !== null,
);
