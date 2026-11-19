# CV en ligne — Fabrice SAGOT

Site(static) une page : CV fidèle au PDF, mode clair/sombre, QR code imprimable.
Publié via **GitHub Pages**, sans build, sans dépendance, sans tracker.

## Structure

```
.
├── index.html          # Le CV (point d'entrée)
├── qrcode.html         # Feuille A4 imprimable avec le QR code
├── css/styles.css      # Thèmes clair/sombre + responsive + styles d'impression
├── js/theme.js         # Bascule de thème (localStorage + prefers-color-scheme)
├── assets/
│   ├── qr-code.svg     # QR vectoriel (correction d'erreur H, quiet zone 4 modules)
│   ├── cv-fabrice-sagot.pdf
│   └── photo-fabrice-sagot.jpg
├── tools/generate_qr.py  # Régénère le QR si l'URL change
├── .nojekyll           # Désactive le build Jekyll de GitHub Pages
└── robots.txt
```

## Déploiement (GitHub Pages)

1. Dépôt **public** (obligatoire pour le plan Pages gratuit).
2. `Settings → Pages → Source: Deploy from a branch → main / (root)`.
3. URL obtenue : `https://<user>.github.io/<repo>/`.
4. **HTTPS "Enforce HTTPS" activé** (case cochée par défaut).
5. Si l'URL change : régénérer le QR puis mettre à jour meta `canonical`/`og:url`
   de `index.html` et l'URL affichée sur `qrcode.html` :
   ```bash
   python3 tools/generate_qr.py https://fabrice-sagot.github.io/ assets/qr-code.svg
   ```

## Bonnes pratiques embarquées

| Domaine | Implémentation |
|---|---|
| Mode sombre sans flash blanc | `data-theme` posé avant le premier rendu (script inline `<head>`), puis `localStorage` + `prefers-color-scheme` |
| Accessibilité (WCAG AA) | contraste vérifié sur les 2 thèmes, bouton `aria-pressed`, skip-link, focus visible, HTML sémantique, `lang="fr"` |
| SEO | `title`/`description`, `canonical`, Open Graph, données structurées JSON-LD `Person` |
| Performance | zéro dépendance externe, zéro web font (fonts système), 1 image, HTML+CSS+JS légers |
| Impression | `@media print` : A4, couleurs forcées claires, boutons masqués, `break-inside: avoid` |
| QR code | correction d'erreur **H**, quiet zone normalisée, **SVG vectoriel** (net à 68 mm comme à 600 mm) |
| Maintenance | `.nojekyll` (pas de build), un seul fichier CSS/JS, régénération QR en 1 commande |

## Mettre à jour le CV

1. Éditer `index.html` (contenu) et `assets/cv-fabrice-sagot.pdf` (si besoin).
2. Mettre à jour la date « Dernière mise à jour » dans le pied de page.
3. `git commit -m "mise à jour CV" && git push`.
4. GitHub Pages republie automatiquement en < 1 minute.

## Garantir le bon fonctionnement

- **GitHub Actions (deploy-pages)** : le statut du déploiement est visible dans l'onglet Actions ; ajouter une règle qui bloque le merge si le déploiement échoue.
- **Lighthouse** (DevTools → onglet Lighthouse) : viser 100 en Accessibility / SEO / Best Practices, et Performance ≥ 95.
- **Test QR après chaque publication** : flasher avec 2 téléphones (iOS + Android) avant impression.
- **Surveillance** : https://stats.uptimerobot.com ou un check HTTP 200 sur l'URL toutes les 5 min.
