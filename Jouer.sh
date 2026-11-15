#!/bin/sh
# Ouvre le jeu dans le navigateur (macOS, Linux). Rien a installer.
cd "$(dirname "$0")" || exit 1
if command -v xdg-open >/dev/null 2>&1; then xdg-open index.html; else open index.html; fi
