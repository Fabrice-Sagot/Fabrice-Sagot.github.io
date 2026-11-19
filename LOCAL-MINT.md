# QR Code sur Linux Mint — créer, modifier, maintenir

Solution complète, 100 % locale (aucune donnée ne sort de votre PC), avec les outils
officiels des dépôts Mint/Ubuntu.

## 1. Installation (une seule fois)

```bash
sudo apt update
sudo apt install -y qrencode zbar-tools imagemagick
```

| Outil | Rôle |
|---|---|
| `qrencode` | Générateur QR (SVG vectoriel + PNG) — le standard en ligne de commande |
| `zbar-tools` | `zbarimg` : lit/valide un QR depuis une image (contrôle qualité avant impression) |
| `imagemagick` | Redimensionner, recadrer, convertir, composer les visuels imprimés |

Optionnel (interface graphique) : `sudo apt install qtqr` — petit outil Qt de création et de décodage de QR.

## 2. Le script fourni (créer + vérifier en une commande)

```bash
tools/mint-qr.sh "https://fabrice-sagot.github.io/" cv
```

Produit `cv.svg` (pour l'impression, net à toute taille) et `cv.png`
(image raster de contrôle), puis **lit le PNG avec zbarimg** et affiche l'URL
décodée : c'est la règle d'or — *un QR jamais re-testé n'est jamais imprimé*.

## 3. Commandes équivalentes à la main (comprendre ce que fait le script)

```bash
# Créer : -l H = correction d'erreur 30 % (impression), -m 4 = quiet zone 4 modules (ISO 18004)
qrencode -t SVG -l H -m 4 -o cv.svg "https://fabrice-sagot.github.io/"
qrencode -t PNG -l H -m 4 -s 8 -o cv.png "https://fabrice-sagot.github.io/"

# Vérifier (doit ressortir exactement l'URL)
zbarimg --raw cv.png

# Imprimer : ouvrir cv.svg dans LibreOffice Draw (ou l'insérer dans un .odt)
# et exporter en PDF pour l'imprimante. Taille conseillée : 60-68 mm.
```

## 4. Maintenance au quotidien

- **Modifier une URL** : relancer la commande avec la nouvelle URL — ne jamais
  « retoucher » un QR : on le régénère toujours depuis la source.
- **Personnaliser la couleur** : `qrencode -t PNG -l H --foreground=00807D --background=FFFFFF`
  (attention : contraste fort obligatoire, fond obligatoirement clair).
- **Composite carte de visite** : ajouter le QR dans un visuel avec ImageMagick :
  `magick composite -gravity southeast -geometry +20+20 cv.png carte.png carte-avec-qr.png`
- **Historique** : garder les QR dans un dépôt git local (comme ce site) :
  chaque version d'URL a sa trace, et `git log` raconte l'historique du visuel.
- **Test final** : après impression, flasher la feuille papier avec 2 téléphones
  (iOS + Android) avant de la distribuer.

## 5. Éditer le CV localement (Mint)

Le site se modifie avec n'importe quel éditeur (`xed`, VS Code, vim) :

```bash
git clone https://github.com/Fabrice-Sagot/Fabrice-Sagot.github.io.git
cd Fabrice-Sagot.github.io
xed index.html          # adapter le contenu
git add -A && git commit -m "mise à jour CV" && git push
```

La page en ligne se met à jour automatiquement en moins d'une minute.
Contrôles recommandés avant chaque publication : impression Ctrl+P du CV (1 page A4),
et flasher le QR du site à l'écran.
