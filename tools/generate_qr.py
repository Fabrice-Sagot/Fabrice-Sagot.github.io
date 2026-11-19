#!/usr/bin/env python3
"""Génère le QR code vectoriel (SVG) de la page qrcode.html.

Best practices intégrées :
  - correction d'erreur H (30 %) : le code reste lisible même si l'impression
    est de moindre qualité, salie ou partiellement masquée par un cadre ;
  - quiet zone de 4 modules (norme ISO/IEC 18004) ;
  - sortie vectorielle SVG : net à toutes les tailles d'impression pour
  imprimer grand (40-60 mm) sans aucune perte.

Usage : python3 tools/generate_qr.py <url-du-cv> [fichier-sortie]
Exemple : python3 tools/generate_qr.py https://fabrice-sagot.github.io/ assets/qr-code.svg
"""
import sys

import qrcode
from qrcode.image.svg import SvgPathImage

DEFAULT_URL = "https://fabrice-sagot.github.io/"


def main() -> None:
    url = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_URL
    out = sys.argv[2] if len(sys.argv) > 2 else "assets/qr-code.svg"
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, border=4)
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(image_factory=SvgPathImage)
    with open(out, "wb") as f:
        img.save(f)
    print(f"QR code ({qr.version} modules, correction H) -> {out}")
    print(f"URL encodée : {url}")


if __name__ == "__main__":
    main()
