# direction-approved — DPM Marigot

**Date** : 2026-08-28 (vendredi)

## Ce qui a été présenté

Trois directions, trois logiques, mêmes photos réelles et même contenu :

| Direction | Fichier | Capture | Logique |
|---|---|---|---|
| A — « Le Nuancier » | `A-nuancier.html` | `shots/A-nuancier-hero.png` · `shots/A-nuancier-full.png` | 🎲 Roue des secondes (02 % 20 + 1 = style n°3, Memphis Maximalism), adapté au nuancier de peinture |
| B — « Maison » | `B-maison.html` | `shots/B-maison-hero.png` · `shots/B-maison-full.png` | 🏆 Référence réelle : Farrow & Ball + grammaire éditoriale Cereal |
| C — « Avant / Après » | `C-avant-apres.html` | `shots/C-avant-apres-hero.png` · `shots/C-avant-apres-full.png` | 🧠 Pensée Bierut / Pentagram : une seule idée, exécutée partout |

## Choix de Silva (verbatim)

> « C'est bien, passe un coup de stop slop et utilise le Nuancier A pour le vrai site déployé,
> (sans casser ce qu'il y a dans le site stp (notammetn le back end du devis) »

**Direction retenue : A — « Le Nuancier »**, sans mélange.

## Contraintes posées avec le choix

1. **Passe stop-slop** sur toute la copie du site.
2. **Ne rien casser** dans le projet existant, en particulier le back-end du devis :
   - `server/routers.ts` → `contact.sendQuote` (tRPC)
   - `server/_core/asapDevis.ts`, `email.ts`, `notification.ts`
   - le honeypot `website`, les noms de champs `nom / telephone / email / projet / message`
   - les tests `server/contact.sendQuote.test.ts`
   → **aucun fichier serveur touché**. `ContactSection.tsx` garde sa mutation, son état
   `submitted`, ses toasts et son honeypot ; seule la présentation change.

## Corrections de contenu appliquées avec la direction

Signalées lors de la présentation des trois directions, validées par « c'est bien » :

- `HeroSection` : suppression de **« 4,5/5 · +10 clients satisfaits »** + 3 avatars fictifs.
- `HeroSection` : suppression de **« +10 ans d'expérience terrain »** (non sourcé).
- `TestimonialsSection` : suppression des **trois faux avis nominatifs** (« Marie L. »,
  « Sébastien R. », « Aline D. ») présentés comme réels → remplacés par un bloc factuel
  Facebook (87 abonnés) + lien vers la page.
- `WhyUsSection` : suppression des stats **« +10 ans »** et **« 100 % clients satisfaits »**.
- Retrait des garanties non tenables (« réponse **garantie** », « satisfaction assurée »,
  « résultat garanti »).

Source de vérité : `brand-spec.md`, section « Deux affirmations non vérifiées ».

## Non résolu

- **Logo officiel toujours absent.** Le wordmark reste typographique (cube « D » terre cuite
  + DM Serif Display). À demander au client ou à récupérer sur sa page Facebook.
