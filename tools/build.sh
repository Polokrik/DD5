#!/bin/sh
# Assemble le jeu sans Node.js (macOS, Linux) : même résultat octet pour octet que tools/build.cjs.
#   sh tools/build.sh
set -e
cd "$(dirname "$0")/.."
out=index.html.tmp
: > "$out"
while IFS= read -r line || [ -n "$line" ]; do
  case "$line" in
    '/*@@STYLES@@*/') cat src/styles.css >> "$out" ;;
    '/*@@SCRIPTS@@*/') for f in src/scripts/[0-9][0-9]-*.js; do cat "$f" >> "$out"; done ;;
    *) printf '%s\n' "$line" >> "$out" ;;
  esac
done < src/index.template.html
mv "$out" index.html
echo "index.html assemblé depuis $(ls src/scripts/[0-9][0-9]-*.js | wc -l | tr -d ' ') fichiers de src/scripts."
