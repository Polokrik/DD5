const { test } = require('node:test');
const assert = require('node:assert/strict');
const { boot } = require('./support.cjs');

// Simule un écran à `hz` images par seconde pendant `seconds` et renvoie le nombre de crans d'animation écoulés.
function ticksAfter(hz, seconds) {
  const g = boot();
  g.run(`uiState.reducedMotion = false; uiState.lastFrameTime = undefined; uiState.frameDebt = 0; gameState.tick = 0;`);
  g.run(`for (let i = 0; i <= ${Math.round(hz * seconds)}; i++) animationLoop(1000 + i * 1000 / ${hz});`);
  return g.run('gameState.tick');
}

test('l’animation avance de 60 crans par seconde quel que soit l’écran', () => {
  for (const hz of [30, 60, 90, 120, 144, 240]) {
    const ticks = ticksAfter(hz, 2);
    assert.ok(Math.abs(ticks - 120) <= 1, `${hz} Hz : ${ticks} crans en 2 s`);
  }
});

test('un onglet resté en veille ne provoque pas d’accélération au retour', () => {
  const g = boot();
  g.run(`uiState.reducedMotion = false; uiState.lastFrameTime = undefined; uiState.frameDebt = 0; gameState.tick = 0; animationLoop(1000); animationLoop(61000);`);
  assert.ok(g.run('gameState.tick') <= 6, `rattrapage limité : ${g.run('gameState.tick')}`);
});

test('en mouvement réduit, le temps ne fait pas avancer l’animation', () => {
  const g = boot();
  g.run(`uiState.reducedMotion = true; gameState.tick = 5; animationLoop(1000); animationLoop(2000);`);
  assert.equal(g.run('gameState.tick'), 5);
});
