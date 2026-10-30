const { test } = require('node:test');
const assert = require('node:assert/strict');
const { boot, choose, continueReport, settle } = require('./support.cjs');

function at(room, setup = '') {
  const g = boot();
  g.run(`resetCampaignState(); gameState.roomId = ${JSON.stringify(room)}; ${setup}; prepareCurrentRoom(); refreshInterface();`);
  return g;
}
const states = g => g.json('Object.fromEntries(Object.entries(characters).map(([k, c]) => [k, c.state]))');
const ids = g => g.json('getAvailableOptions(gameState.roomId).map(o => o.id)');
function rest(g, ...rolls) { g.setRolls(...rolls); choose(g, `repos-${g.run('gameState.roomId')}`); settle(g); }

test('le repos soigne les blessés, puis un événement calme laisse le groupe intact', () => {
  const g = at('greenest_keep', `characters.bjolnir.state = 'injured'; characters.darrin.state = 'injured'`);
  rest(g, 12);
  assert.equal(states(g).bjolnir, 'active');
  assert.equal(states(g).darrin, 'active');
  assert.match(g.run('gameState.lastReport.paragraphs.join(" ")'), /la nuit est calme/);
  assert.equal(g.dice.calls, 1);
});

test('un seul repos par chapitre, et le tirage n’est pas relancé à la relecture', () => {
  const g = at('greenest_keep');
  rest(g, 12);
  const calls = g.dice.calls;
  g.run('refreshInterface(); renderChoices(); saveGame()');
  assert.equal(g.dice.calls, calls);
  continueReport(g);
  assert.ok(!ids(g).includes('repos-greenest_keep'));
});

test('une embuscade blesse un compagnon debout', () => {
  const g = at('greenest_keep');
  rest(g, 2);
  assert.equal(Object.values(states(g)).filter(s => s === 'injured').length, 1);
  assert.match(g.run('gameState.lastReport.paragraphs.join(" ")'), /cultistes/);
});

test('l’aide de passage soigne un compagnon à terre et renforce le moral', () => {
  const g = at('greenest_keep', `characters.bjolnir.state = 'down'`);
  const morale = g.run('variables.moraleGroupe');
  rest(g, 10, 18);
  assert.equal(states(g).bjolnir, 'injured');
  assert.equal(g.run('variables.moraleGroupe'), morale + 1);
});

test('jets de mort : trois échecs tuent, trois réussites stabilisent, 20 relève, 1 compte double', () => {
  let g = at('greenest_keep', `characters.bjolnir.state = 'down'; characters.bjolnir.deathSaves = {s:0,f:2}`);
  rest(g, 5, 12);
  assert.equal(states(g).bjolnir, 'dead');
  g = at('greenest_keep', `characters.bjolnir.state = 'down'; characters.bjolnir.deathSaves = {s:2,f:0}`);
  rest(g, 15, 12);
  assert.equal(states(g).bjolnir, 'active', 'stabilisé puis soigné');
  g = at('greenest_keep', `characters.bjolnir.state = 'down'`);
  rest(g, 20, 12);
  assert.equal(states(g).bjolnir, 'active');
  g = at('greenest_keep', `characters.bjolnir.state = 'down'; characters.bjolnir.deathSaves = {s:0,f:1}`);
  rest(g, 1, 12);
  assert.equal(states(g).bjolnir, 'dead', '1 naturel = deux échecs');
});

test('game over seulement quand tous les compagnons sont morts', () => {
  const g = at('greenest_keep', `Object.values(characters).forEach(c => { if (c.state === 'active') c.state = 'dead'; });
    characters.bjolnir.state = 'down'; characters.bjolnir.deathSaves = {s:0,f:2}; createCheckpoint('Avant décision: test')`);
  rest(g, 3, 12);
  assert.equal(g.run('gameState.lastReport.title'), 'Cette tentative a échoué');
  // un survivant à terre ne provoque pas de game over
  const h = at('greenest_keep', `Object.values(characters).forEach(c => { if (c.state === 'active') c.state = 'dead'; }); characters.bjolnir.state = 'down'`);
  rest(h, 12, 12);
  assert.notEqual(h.run('gameState.lastReport.title'), 'Cette tentative a échoué');
});

test('un repos reste possible quand personne ne peut agir', () => {
  const g = at('greenest_keep', `Object.values(characters).forEach(c => { if (c.state === 'active') c.state = 'down'; })`);
  assert.ok(ids(g).includes('repos-greenest_keep'));
});

test('la barre de santé suit l’état des compagnons', () => {
  const g = boot();
  assert.deepEqual(g.json('HEALTH_POINTS'), { active: 3, injured: 2, down: 1, dead: 0 });
});

test('le repos est proposé dans les scènes de chronique et reste sauvegardé', () => {
  for (const room of ['skyreach_castle', 'diderius_chronicle', 'elturel_road']) {
    const g = at(room);
    assert.ok(ids(g).includes(`repos-${room}`), room);
    rest(g, 12);
    const saved = JSON.parse(g.storage.get('clanDestain.save.v1'));
    assert.ok(Object.keys(saved.flags).some(k => k.startsWith('rested_')), room);
  }
});
