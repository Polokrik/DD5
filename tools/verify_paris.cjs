// Vérifie les objets Git sans utiliser de sous-processus ni modifier les fichiers.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const manifest = require('../docs/paris-manifest.json');
for (const { path: file, blob } of manifest.files) {
  const data = fs.readFileSync(path.join(root, file));
  const actual = crypto.createHash('sha1').update(`blob ${data.length}\0`).update(data).digest('hex');
  if (actual !== blob) throw new Error(`Contenu différent de ${manifest.sourceCommit}: ${file}`);
}
console.log(`Notre Paris : ${manifest.files.length} fichiers identiques au commit ${manifest.sourceCommit}.`);
