const { test } = require('node:test');
const assert = require('node:assert/strict');
const { boot } = require('./support.cjs');

const IDS = ['bjolnir', 'drekthar', 'ellyjobell', 'darrin', 'sislay', 'kairon', 'malar'];
// Enregistre les rectangles posés, sans interpolation possible : chaque appel est un fillRect entier.
const record = (g, id, options) => g.json(`(() => {
  const calls = []; const ctx = { fillStyle: '', fillRect(x, y, w, h) { calls.push([x, y, w, h, this.fillStyle]); } };
  drawProtagonist(ctx, ${JSON.stringify(id)}, 120, 150, ${JSON.stringify(options)}); return calls; })()`);

test('les sept protagonistes de la bible ont un modèle 64×96 dans le moteur', () => {
  const g = boot();
  assert.deepEqual(g.json('SPRITE_IDS').sort(), [...IDS].sort());
  IDS.forEach(id => assert.ok(record(g, id, { t: 0, scale: .7 }).length > 20, id));
});

test('chaque sprite est dessiné en pixels entiers, déterministe, et reste dans son cadre', () => {
  const g = boot();
  for (const id of IDS) for (const scale of [.5, .7, .9, 1]) {
    const first = record(g, id, { t: 37, scale }), second = record(g, id, { t: 37, scale });
    assert.deepEqual(first, second, `${id}: déterminisme`);
    first.forEach(([x, y, w, h]) => {
      assert.ok([x, y, w, h].every(Number.isInteger), `${id} ×${scale}: coordonnées entières`);
      assert.ok(w >= 0 && h >= 0, `${id}: dimensions non négatives`);
      assert.ok(x > 120 - 64 && x < 120 + 90 && y > 150 - 100 && y < 152, `${id} ×${scale}: dans le cadre (${x},${y})`);
    });
  }
});

test('le souffle, la garde et le coup sont des images distinctes, le repos reste sobre', () => {
  const g = boot();
  for (const id of IDS) {
    const idle = JSON.stringify(record(g, id, { t: 0, scale: .9 }));
    const guard = JSON.stringify(record(g, id, { t: 0, guard: true, scale: .9 }));
    assert.notEqual(idle, guard, `${id}: la garde change la silhouette`);
    const frames = g.json('ATTACK_FRAMES.map(f => f.name)');
    assert.deepEqual(frames, ['anticipation', 'frappe', 'impact', 'récupération']);
    const shots = g.json('ATTACK_FRAMES').map(frame => JSON.stringify(record(g, id, { t: 0, frame, scale: .9 })));
    assert.ok(new Set(shots).size >= 3, `${id}: anticipation, frappe et récupération se distinguent`);
  }
});

test('un coup suit anticipation, frappe, impact puis récupération, sans trou', () => {
  const g = boot();
  const names = g.json(`Array.from({ length: 40 }, (_, i) => attackFrameAt(i / 40, 0, 1)?.name)`);
  const order = [...new Set(names)];
  assert.deepEqual(order, ['anticipation', 'frappe', 'impact', 'récupération']);
  assert.equal(g.json('attackFrameAt(1.2, 0, 1)'), null);
  assert.equal(g.json('attackFrameAt(-.1, 0, 1)'), null);
});

test('en mouvement réduit, le duel est une image fixe sans coup ni étincelle', () => {
  const g = boot();
  g.run(`resetCampaignState(); uiState.reducedMotion = true; gameState.tick = 77;`);
  const draw = () => g.json(`(() => { const calls = []; const ctx = { fillStyle: '', fillRect(x, y, w, h) { calls.push([x, y, w, h, this.fillStyle]); } };
    drawDuelActors(ctx, { kind: 'duel', actor: 'drekthar' }, 1, false); return calls; })()`);
  const a = draw(); g.run('gameState.tick = 500');
  assert.deepEqual(a, draw());
});
