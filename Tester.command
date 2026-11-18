#!/bin/sh
# Double-cliquez pour assembler le jeu puis lancer les tests automatiques (macOS). Demande Node.js : https://nodejs.org
cd "$(dirname "$0")" || exit 1
if command -v node >/dev/null 2>&1; then
  node tools/build.cjs && node tools/tests.cjs
else
  echo "Node.js est requis pour les tests : https://nodejs.org"
fi
printf '\nAppuyez sur Entrée pour fermer.'; read -r _
