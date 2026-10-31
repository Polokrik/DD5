// Atelier de sprites : dessine des personnages du jeu sur un fond neutre et les juge en trois lectures :
// couleur, valeurs (niveaux de gris) et silhouette. Outil de travail uniquement : le jeu n'en dépend pas.
//
//   node tools/sprite-lab.cjs <sortie.png> [--mode color|value|shape] [--scale N] <nom> [<nom> ...]
//
// Pour un protagoniste (bjolnir, drekthar, ellyjobell, darrin, sislay, kairon, malar) : une ligne de sept images —
// repos (souffle bas, souffle haut), garde, puis les quatre images du coup (anticipation, frappe, impact, récupération).
// Pour les autres modèles (langdedrosa, lennithon, berserker) : une image.
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const args = process.argv.slice(2), out = args.shift();
let mode = 'color', zoom = 2; const names = [];
while (args.length) { const a = args.shift(); if (a === '--mode') mode = args.shift(); else if (a === '--scale') zoom = Number(args.shift()); else names.push(a); }
if (!out || !names.length) { console.error('Usage: node tools/sprite-lab.cjs <sortie.png> [--mode color|value|shape] [--scale N] <nom>...'); process.exit(1); }
(async () => {
  const browser = await chromium.launch(), page = await browser.newPage();
  await page.goto('file://' + path.resolve(__dirname, '../index.html'));
  const url = await page.evaluate(([names, mode, S]) => {
    const W = 100, H = 104, GAP = 3, COLS = 7;
    const single = { langdedrosa: g => drawLangdedrosa(g, 50, 100, 12, 0, .78), lennithon: g => drawLennithon(g, 4, 60, false), berserker: g => drawBerserker(g, 50, 98, 12, false, 1) };
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const sheet = document.createElement('canvas'); sheet.width = (W * COLS + GAP * (COLS - 1)) * S; sheet.height = (H * names.length + GAP * (names.length - 1)) * S;
    const o = sheet.getContext('2d'); o.imageSmoothingEnabled = false; o.fillStyle = '#141216'; o.fillRect(0, 0, sheet.width, sheet.height);
    const tFor = (id, wantB) => { for (let t = 0; t < 400; t++) if (spritePose(id, t).b === wantB && spritePose(id, t).r === 0) return t; return 0; };
    names.forEach((name, row) => {
      const cells = SPRITE_MODELS[name] ? [
        g => drawProtagonist(g, name, 50, 98, { t: tFor(name, 0), scale: .9 }), g => drawProtagonist(g, name, 50, 98, { t: tFor(name, 2), scale: .9 }),
        g => drawProtagonist(g, name, 50, 98, { t: tFor(name, 0), guard: true, scale: .9 }),
        ...ATTACK_FRAMES.map(frame => g => drawProtagonist(g, name, 50, 98, { t: tFor(name, 0), frame, scale: .9 }))
      ] : [single[name]];
      cells.forEach((draw, col) => {
        const g = c.getContext('2d', { willReadFrequently: true }); g.imageSmoothingEnabled = false; g.fillStyle = '#3f3a45'; g.fillRect(0, 0, W, H);
        draw(g);
        const data = g.getImageData(0, 0, W, H);
        for (let p = 0; p < data.data.length; p += 4) {
          const r = data.data[p], gr = data.data[p + 1], b = data.data[p + 2], isBg = Math.abs(r - 63) + Math.abs(gr - 58) + Math.abs(b - 69) < 6;
          if (mode === 'value') data.data[p] = data.data[p + 1] = data.data[p + 2] = Math.round(.3 * r + .59 * gr + .11 * b);
          if (mode === 'shape') data.data[p] = data.data[p + 1] = data.data[p + 2] = isBg ? 63 : 12;
        }
        g.putImageData(data, 0, 0);
        o.drawImage(c, 0, 0, W, H, col * (W + GAP) * S, row * (H + GAP) * S, W * S, H * S);
      });
    });
    return sheet.toDataURL('image/png');
  }, [names, mode, zoom]);
  fs.writeFileSync(out, Buffer.from(url.split(',')[1], 'base64'));
  await browser.close();
})();
