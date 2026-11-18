#!/bin/sh
# Double-cliquez après avoir modifié un fichier de src/ (macOS) : assemble index.html. Rien à installer.
cd "$(dirname "$0")" || exit 1
sh tools/build.sh
printf '\nAppuyez sur Entrée pour fermer.'; read -r _
