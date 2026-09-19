# brand-spec — DPM Marigot

Source : `BUSINESS_INFO.md`, `client/src/index.css`, `client/src/components/*`,
photos réelles dans `client/public/images/`. Aucune valeur inventée.

## Identité

- **Nom** : DPM Marigot
- **Métiers** : décoration, peinture, menuiserie, revêtements de sols et murs,
  remise en état après dégât des eaux (DDE)
- **Différenciateur factuel n°1** : **showroom ouvert au public** au Mesnil-Saint-Denis
  (collections de revêtements sols & murs visibles sur place). Aucun concurrent local
  de la base ne l'a. C'est l'atout le plus sous-exploité du site actuel.
- **Différenciateur factuel n°2** : spécialiste sinistre / dégât des eaux (DDE).

## Coordonnées (vérifiées)

- Téléphone : **+33 1 85 83 03 55** → affiché `01 85 83 03 55`
- Mail : dpmmarigot@gmail.com
- Adresse : 92, Avenue Habert de Montmort — Le Mesnil-Saint-Denis (78)
  *(code postal non confirmé dans les sources → non affiché)*
- Facebook : https://www.facebook.com/dpmmarigot (87 abonnés)

## Assets

| Asset | État |
|---|---|
| Logo officiel | ❌ **absent**. Le site actuel utilise un carré bleu « DPM » typographique, pas un logo client. → à demander au client (ou récupérer sur la page Facebook). Les 3 directions proposent chacune un wordmark typographique **provisoire**. |
| Photos de chantier réelles | ✅ 6 photos avant/après (plafond fissuré, cuisine sinistre, salle à manger) + 1 composite hero + 4 photos services. Utilisées telles quelles dans les 3 directions. |
| Charte couleur client | ❌ absente. Les palettes des 3 directions sont **échantillonnées sur les photos réelles** (voir chaque direction). |
| Avis clients | ⚠️ 1 seul avis Facebook, **pas encore noté**. |

## ⚠️ Deux affirmations non vérifiées dans le site actuel

À corriger quelle que soit la direction retenue (règle « ne rien inventer ») :

1. `HeroSection.tsx` affiche **« 4,5/5 · +10 clients satisfaits »** avec 3 avatars fictifs.
   Source réelle : 1 avis Facebook, non noté. → remplacé par un bloc honnête
   « Page Facebook · 87 abonnés » + lien vers les publications de chantier.
2. `HeroSection.tsx` affiche **« +10 ans d'expérience terrain »**. Non sourcé. → supprimé,
   remplacé par un fait vérifiable (showroom / spécialité DDE).

## Palette source (échantillonnée sur les photos réelles)

Relevé visuel sur `salle-a-manger-apres.jpg`, `hero-avant-apres.jpg`, `decoration.jpg` :

| Rôle dans la photo | Valeur approx. |
|---|---|
| Mur taupe / greige rosé (peinture posée) | `#7A6E62` → `#9A8A84` |
| Plafond & boiseries repeints | `#F2EDE5` |
| Menuiseries alu anthracite | `#24262A` |
| Bois chêne (mobilier, sol) | `#B57B4A` |
| Pot terre cuite | `#A8442F` |
| Végétation encadrée par les fenêtres | `#5A6B47` |

Chaque direction pioche dans ce relevé — donc les 3 palettes viennent du travail
réel de l'entreprise, pas d'un catalogue de tendances.
