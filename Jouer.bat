@echo off
rem Lance le jeu dans sa propre fenetre, sans rien installer.
rem Utilise Edge (present sur Windows 10 et 11) ou Chrome en mode application; sinon le navigateur par defaut.
setlocal
set "JEU=%~dp0index.html"
set "URL=file:///%JEU:\=/%"
start "" msedge --app="%URL%" 2>nul && goto :fin
start "" chrome --app="%URL%" 2>nul && goto :fin
start "" "%JEU%"
:fin
endlocal
