#!/usr/bin/env bash
# Créer un QR code vectoriel + un PNG de contrôle, puis VÉRIFIER le contenu encodé.
# Usage : ./tools/mint-qr.sh "https://fabrice-sagot.github.io/" [nom-de-sortie]
# Dépendances : sudo apt install qrencode zbar-tools
set -euo pipefail

URL="${1:?Usage : mint-qr.sh <url> [nom-de-sortie]}"
NAME="${2:-qr-cv}"

qrencode -t SVG -l H -m 4 -o "${NAME}.svg" "$URL"
qrencode -t PNG -l H -m 4 -s 8 -o "${NAME}.png" "$URL"

DECODED="$(zbarimg --raw --quiet "${NAME}.png")"
if [ "$DECODED" = "$URL" ]; then
  echo "✓ QR validé : il encode bien $URL"
  echo "  ${NAME}.svg -> pour l'impression   |   ${NAME}.png -> contrôle, écran, web"
else
  echo "✗ ERREUR : le QR décode '$DECODED' au lieu de '$URL' — ne pas imprimer." >&2
  exit 1
fi
