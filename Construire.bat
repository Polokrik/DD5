@echo off
rem A lancer apres avoir modifie un fichier de src\ : assemble index.html.
rem Rien a installer : utilise PowerShell, fourni avec Windows.
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "tools\build.ps1"
pause
