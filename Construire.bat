@echo off
rem A lancer apres avoir modifie un fichier de src\ : assemble index.html.
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js est requis pour assembler le jeu : https://nodejs.org
  pause
  exit /b 1
)
node tools\build.cjs
pause
