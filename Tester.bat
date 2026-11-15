@echo off
rem Assemble le jeu puis lance les tests automatiques.
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js est requis pour les tests : https://nodejs.org
  pause
  exit /b 1
)
node tools\build.cjs && node tools\tests.cjs
pause
