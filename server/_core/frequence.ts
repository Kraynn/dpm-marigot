/**
 * Limite de fréquence en mémoire (06/10/2026), pour la route de l'éditeur de page :
 * elle est publique et envoie un mail avec pièce jointe.
 *
 * Portée réelle : une instance de fonction Vercel. Deux instances ne partagent pas
 * ce compteur, et une instance froide repart de zéro. C'est un frein contre le
 * clic répété ou un script naïf, pas une protection contre un envoi massif — le
 * destinataire étant fixé côté serveur, le pire cas reste du bruit dans une seule boîte.
 */
const passages = new Map<string, number[]>();

/** Vrai si `cle` n'a pas dépassé `max` passages sur les `dureeMs` dernières millisecondes. */
export function autoriser(cle: string, max: number, dureeMs: number, maintenant = Date.now()): boolean {
  const recents = (passages.get(cle) ?? []).filter((t) => maintenant - t < dureeMs);
  if (recents.length >= max) {
    passages.set(cle, recents);
    return false;
  }
  recents.push(maintenant);
  passages.set(cle, recents);
  return true;
}

/** Remet les compteurs à zéro (tests). */
export function oublierLesPassages() {
  passages.clear();
}
