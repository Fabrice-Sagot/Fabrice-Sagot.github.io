# GUIDE — Maîtriser « CV en ligne + QR code + mode sombre » de A à Z

Objectif : être autonome sur la chaîne complète — comprendre, vendre, mettre en œuvre,
maintenir, garantir — selon les standards de l'industrie (skill évaluable en interview).

---

## 1. COMPRENDRE (les fondations)

**Site statique** : pages HTML/CSS/JS servies telles quelles, sans serveur applicatif.
Aucune base de données, aucun build obligatoire → sécurité maximale, coût nul.

**GitHub Pages** : hébergement gratuit de sites statiques, servi depuis `https://<user>.github.io/<repo>/`
(ou `https://<user>.github.io/` si le dépôt s'appelle `<user>.github.io`). HTTPS automatique.

**Page utilisateur vs page projet** :
- `<user>.github.io` (dépôt spécial) → URL propre à la racine, idéale pour un CV personnel.
- tout autre dépôt → URL sous-chemin (`<user>.github.io/<repo>/`). C'est le choix ici.

**Mode sombre — les 3 standards de l'industrie** :
1. Détecter la préférence système via `prefers-color-scheme` (respecter l'utilisateur par défaut).
2. Permettre un forçage manuel persistant (`localStorage`), prioritaire sur le système.
3. Appliquer le thème **avant le premier rendu** (script inline dans `<head>`), sinon flash blanc.
   Bonus : propriété CSS `color-scheme` pour les contrôles natifs du navigateur.

**QR code — les 5 règles d'or à citer en interview** :
1. **URL courte et definitive** (elle est figée dans l'imprimé).
2. Correction d'erreur **H (30 %)** pour l'impression.
3. **Quiet zone 4 modules** (marge blanche, norme ISO/IEC 18004).
4. Taille minimale imprimée : **≥ 20 mm** pour un scanner près de la feuille
   (règle empirique : distance de scan / 10) ; 60-68 mm pour une feuille A4 posée.
5. **Contraste noir-sur-blanc** (ou très sombre sur clair) ; jamais inversé.

---

## 2. PRÉPARER (le bon dépôt)

1. Créer le dépôt **public** `cv` (GitHub → New, sans README ni licence : push propre).
2. Cloner, copier les fichiers du site, committer sur `main`.
3. `Settings → Pages → Deploy from a branch → main / (root)` → l'URL apparaît en 1-2 min.

Astuce SEO rétrospective : mettre à jour `canonical`, `og:url` et le JSON-LD avec l'URL finale,
puis régénérer le QR avec `python3 tools/generate_qr.py <url-finale>`.

---

## 3. VENDRE (ce que tu peux dire d'eux, et pourquoi c'est sérieux)

Pitch de 30 secondes devant un recruteur :

> « Mon CV est consultable en un flash de QR code. Le site est 100 % statique :
> zéro dépendance, zéro tracker, HTTPS automatique, mode sombre conforme aux
> standards (préférence système + forçage manuel persistant, sans flash au
> chargement), accessible (WCAG AA, skip-link, aria), optimisé pour
> l'impression A4, et testable par anyone avec Lighthouse. »

Arguments différenciants :
- **Disponibilité** : GitHub Pages ~99,9 % SLA infrastructure ; un simpler static site ne tombe pas.
- **Cohérence de marque** : le QR est imprimable, la version PDF téléchargeable sur la page.
- **Sobriété** : aucune web font, aucune lib externe → page qui charge en < 1 s sur 3G.

---

## 4. METTRE EN ŒUVRE (gestes techniques maîtrisables)

Déploiement :
```bash
git clone https://github.com/Fabrice-Sagot/cv.git && cd cv
# ... y copier les fichiers du site ...
git add -A && git commit -m "CV en ligne : mode sombre + QR code"
git push origin main
```
Puis Settings → Pages → branch `main`, folder `/ (root)`.

Tests d'acceptation (à connaître par cœur) :
- [ ] URL accessible en HTTPS (certificat valide).
- [ ] Mode sombre : système en sombre → sombre sans flash ; toggle manuel → persiste après rechargement.
- [ ] Impression (Ctrl+P) → A4, une page, boutons absents, fond clair forcé.
- [ ] QR : flashé depuis 2 téléphones (iOS + Android) → la page s'ouvre.
- [ ] Lighthouse ≥ 95 partout (Performance / Accessibility / Best Practices / SEO).
- [ ] Responsive : lisible en 360 px de large (mobile) comme sur écran 27".

---

## 5. MAINTENIR

- Une branche `main` protégée ? Non nécessaire pour un usage solo, mais **commit atomique**
  par mise à jour (`git log` = historique de versions du CV).
- `robots.txt` autorise l'indexation de `index.html`, bloque `qrcode.html` (`noindex`).
- Mise à jour du contenu = éditer `index.html` + PDF + date de footer → push.
- Changement d'URL (custom domain, etc.) :
  1. régénérer le QR (`tools/generate_qr.py`),
  2. mettre à jour l'URL affichée,
  3. **re-tester le QR à blanc** avant de réimprimer (règle : l'URL d'un imprimé est figée).

## 6. GARANTIR

| Risque | Garde-fou |
|---|---|
| URL morte (compte renommé, dépôt renommé) | Activer l'email de notification GitHub ; check HTTP 200 (uptime monitor gratuit type UptimeRobot) |
| Page cassée après un push | GitHub Action `deploy-pages` visible dans l'onglet Actions ; re-test Lighthouse après chaque gros changement |
| QR imprimé illisible (imprimante, papier foncé) | Impression test + flasher AVANT distribution ; correction H déjà intégrée |
| Contenu obsolète (recruteur voit une vieille version) | Date de mise à jour affichée en pied de page + version PDF synchronisée |
| Confidentialité | Le site ne contient que ce que tu chooses d'y afficher ; les trackers sont absents (aucun script tiers) |

---

## Vérification finale (ton routine QA, à refaire à chaque mise à jour)

```bash
# 1. Le site répond
curl -sI https://fabrice-sagot.github.io/ | head -1        # HTTP/2 200

# 2. Le QR encode la bonne URL
python3 -c "import qrcode,sys; ..."   # ou : comparer le hash de assets/qr-code.svg

# 3. Le HTML est bien formé
python3 -c "from html.parser import HTMLParser; HTMLParser().feed(open('index.html').read())"
```

Puis tests manuels : flasher, imprimer, recharger, suivre 4 liens de contact.
