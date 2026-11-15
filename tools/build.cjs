// Assemble le jeu : src/index.template.html + src/styles.css + src/scripts/*.js  →  index.html (un seul fichier autonome).
//
//   node tools/build.cjs           écrit index.html
//   node tools/build.cjs --check   échoue si index.html n'est pas à jour (utilisé par les tests)
//
// On modifie les fichiers de src/, jamais index.html à la main : il est regénéré par ce script.
// Les fichiers de src/scripts/ sont assemblés dans l'ordre alphabétique de leur nom (00-, 10-, 20-…).
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

function build() {
  const scripts = fs.readdirSync(path.join(root, 'src/scripts')).filter(name => name.endsWith('.js')).sort();
  const parts = { '/*@@STYLES@@*/\n': read('src/styles.css'), '/*@@SCRIPTS@@*/\n': scripts.map(name => read(`src/scripts/${name}`)).join('') };
  let html = read('src/index.template.html');
  for (const [marker, content] of Object.entries(parts)) {
    if (html.split(marker).length !== 2) throw new Error(`Le marqueur ${marker.trim()} doit apparaître une seule fois dans src/index.template.html`);
    html = html.replace(marker, () => content);
  }
  return { html, scripts };
}

if (require.main === module) {
  const { html, scripts } = build();
  const target = path.join(root, 'index.html');
  if (process.argv.includes('--check')) {
    const current = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : '';
    if (current !== html) { console.error('index.html n’est pas à jour : lancez « node tools/build.cjs ».'); process.exit(1); }
    console.log('index.html est à jour.');
  } else {
    fs.writeFileSync(target, html);
    console.log(`index.html assemblé (${(Buffer.byteLength(html) / 1024).toFixed(0)} Ko) depuis ${scripts.length} fichiers de src/scripts.`);
  }
}
module.exports = { build };
