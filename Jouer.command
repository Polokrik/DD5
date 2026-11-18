#!/bin/sh
# Double-cliquez pour jouer (macOS). Rien à installer.
# Le jeu s'ouvre dans sa propre fenêtre si Chrome, Edge ou Brave est installé, sinon dans le navigateur par défaut.
cd "$(dirname "$0")" || exit 1
jeu="$(pwd)/index.html"
url="file://$(printf '%s' "$jeu" | sed 's/ /%20/g')"
if [ "$(uname)" = Darwin ]; then
  for app in "Google Chrome" "Microsoft Edge" "Brave Browser" "Chromium"; do
    if open -Ra "$app" 2>/dev/null; then open -na "$app" --args --app="$url"; exit 0; fi
  done
  open "$jeu"
else
  for browser in google-chrome chromium chromium-browser microsoft-edge; do
    if command -v "$browser" >/dev/null 2>&1; then "$browser" --app="$url" >/dev/null 2>&1 & exit 0; fi
  done
  xdg-open "$jeu"
fi
