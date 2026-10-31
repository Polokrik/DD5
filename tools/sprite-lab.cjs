// Atelier de sprites : dessine des personnages du jeu sur un fond neutre, en couleur, en niveaux de gris
// (étude de valeurs) et en silhouette, agrandis 4×. Outil de travail uniquement : le jeu n'en dépend pas.
// Usage : node tools/sprite-lab.cjs <sortie.png> <nom> [<nom> ...]    (ex. langdedrosa drekthar)
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const [out, ...names] = process.argv.slice(2);
if (!out || !names.length) { console.error('Usage: node tools/sprite-lab.cjs <sortie.png> <nom>...'); process.exit(1); }
const DRAW = {
  langdedrosa: 'drawLangdedrosa(g, 76, 100, t, 0, .78)', drekthar: 'drawDrekthar(g, 70, 98, t, 0, 1)',
  lennithon: 'drawLennithon(g, 4, 60, false)', berserker: 'drawBerserker(g, 60, 92, t, false, 1)'
};
(async () => {
  const browser = await chromium.launch(), page = await browser.newPage();
  await page.goto('file://' + path.resolve(__dirname, '../index.html'));
  const url = await page.evaluate(([calls]) => {
    const W = 150, H = 104, S = 4, GAP = 4, c = document.createElement('canvas'); c.width = W; c.height = H;
    const sheet = document.createElement('canvas'); sheet.width = (W * 3 + GAP * 2) * S; sheet.height = (H * calls.length + GAP * (calls.length - 1)) * S;
    const o = sheet.getContext('2d'); o.imageSmoothingEnabled = false; o.fillStyle = '#141216'; o.fillRect(0, 0, sheet.width, sheet.height);
    calls.forEach((call, row) => ['color', 'value', 'shape'].forEach((variant, i) => {
      const g = c.getContext('2d', { willReadFrequently: true }); g.imageSmoothingEnabled = false; g.fillStyle = '#3f3a45'; g.fillRect(0, 0, W, H);
      const t = 12; eval(call);
      const data = g.getImageData(0, 0, W, H);
      for (let p = 0; p < data.data.length; p += 4) {
        const r = data.data[p], gr = data.data[p + 1], b = data.data[p + 2], isBg = Math.abs(r - 63) + Math.abs(gr - 58) + Math.abs(b - 69) < 6;
        if (variant === 'value') data.data[p] = data.data[p + 1] = data.data[p + 2] = Math.round(.3 * r + .59 * gr + .11 * b);
        if (variant === 'shape') data.data[p] = data.data[p + 1] = data.data[p + 2] = isBg ? 63 : 12;
      }
      g.putImageData(data, 0, 0);
      o.drawImage(c, 0, 0, W, H, i * (W + GAP) * S, row * (H + GAP) * S, W * S, H * S);
    }));
    return sheet.toDataURL('image/png');
  }, [names.map(n => DRAW[n] ?? n)]);
  fs.writeFileSync(out, Buffer.from(url.split(',')[1], 'base64'));
  await browser.close();
})();
