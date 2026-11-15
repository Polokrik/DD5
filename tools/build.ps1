# Assemble le jeu sans Node.js : src/index.template.html + src/styles.css + src/scripts/*.js -> index.html
# Equivalent de tools/build.cjs, pour Windows. Les fichiers sont lus et ecrits en UTF-8 sans BOM.
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)
function Read-Source($relative) { [System.IO.File]::ReadAllText((Join-Path $root $relative), $utf8) }

$names = Get-ChildItem (Join-Path $root 'src/scripts') -Filter '*.js' | ForEach-Object { $_.Name }
$names = [string[]]$names
[Array]::Sort($names, [System.StringComparer]::Ordinal)
$scripts = ($names | ForEach-Object { Read-Source "src/scripts/$_" }) -join ''

$html = Read-Source 'src/index.template.html'
$lf = [string][char]10
foreach ($pair in @(@("/*@@STYLES@@*/$lf", (Read-Source 'src/styles.css')), @("/*@@SCRIPTS@@*/$lf", $scripts))) {
  if (($html.Split(@($pair[0]), [System.StringSplitOptions]::None)).Length -ne 2) { throw "Marqueur introuvable ou en double : $($pair[0].Trim())" }
  $html = $html.Replace($pair[0], $pair[1])
}
[System.IO.File]::WriteAllText((Join-Path $root 'index.html'), $html, $utf8)
Write-Host ("index.html assemble ({0} Ko) depuis {1} fichiers de src/scripts." -f [math]::Round($utf8.GetByteCount($html) / 1024), $names.Length)
