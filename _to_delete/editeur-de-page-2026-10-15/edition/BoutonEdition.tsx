/**
 * DPM Marigot – Éditeur de page : le déclencheur (06/10/2026).
 *
 * Même forme que BoutonNuancier, à côté duquel il se place : un crayon discret
 * dans la barre sur desktop, une ligne « Modifier la page » dans le menu burger
 * sur mobile. Ce fichier reste léger ; l'éditeur lui-même (ModeEdition) n'est
 * téléchargé qu'à l'ouverture du mode.
 */
import { Pencil } from "lucide-react";
import { ouvrirEdition } from "./journal";

export default function BoutonEdition({
  variante = "barre",
  onOuvrir,
}: {
  variante?: "barre" | "menu";
  /** Appelé avant l'ouverture (le menu burger s'en sert pour se refermer). */
  onOuvrir?: () => void;
}) {
  const ouvrir = () => {
    onOuvrir?.();
    ouvrirEdition();
  };
  if (variante === "menu") {
    return (
      <button
        type="button"
        onClick={ouvrir}
        data-edition-libre
        className="inline-flex items-center gap-2.5 px-3 py-2.5 border-2 border-encre/30 text-encre/80 text-sm"
      >
        <Pencil size={14} aria-hidden />
        Modifier la page
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={ouvrir}
      data-edition-libre
      aria-label="Modifier la page"
      title="Modifier la page"
      className="inline-flex items-center justify-center w-6 h-7 xl:w-7 text-encre opacity-60 hover:opacity-100 focus-visible:opacity-100 transition-opacity"
    >
      <Pencil size={14} aria-hidden />
    </button>
  );
}
