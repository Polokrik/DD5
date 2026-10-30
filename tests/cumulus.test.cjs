const { test } = require('node:test');
const assert = require('node:assert/strict');
const { boot, choose, continueReport, settle } = require('./support.cjs');

const ROOMS = ['skyreach_command', 'skyreach_cultists', 'skyreach_dragon'];
const usable = g => g.json('getPresentedChoices().filter(c => c.index !== -1).map(c => c.option.id)');
function at(room, setup = '') {
  const g = boot();
  g.run(`resetCampaignState(); gameState.roomId = ${JSON.stringify(room)}; ${setup}; prepareCurrentRoom(); refreshInterface();`);
  return g;
}

test('Cumulus compte trois scènes dans l’acte III, avec décor, niveau et observations', () => {
  const g = boot();
  for (const id of ROOMS) {
    assert.ok(g.run(`DATA.actRooms.ACT_III.includes(${JSON.stringify(id)})`), id);
    assert.ok(g.run(`rooms[${JSON.stringify(id)}].observations.length >= 2`), `${id}: observations`);
    assert.ok(g.run(`ADVENTURE_LEVELS[${JSON.stringify(id)}] === 7`), `${id}: niveau`);
  }
  assert.equal(g.run('rooms.skyreach_chronicle.options[0].onSuccess.gotoRoom'), 'skyreach_command');
});

test('le chemin du journal traverse les trois scènes sans relance de dé', () => {
  const g = boot();
  g.run(`resetCampaignState(); gameState.roomId = 'skyreach_chronicle'; prepareCurrentRoom(); refreshInterface();`);
  for (const [id, room] of [['skyreach-return', 'skyreach_command'], ['skyreach-convaincre', 'skyreach_cultists'],
    ['skyreach-rezmir', 'skyreach_dragon'], ['skyreach-proteger', 'act3_epilogue']]) {
    g.setRolls(20); choose(g, id); settle(g); continueReport(g);
    assert.equal(g.run('gameState.roomId'), room, id);
    assert.ok(usable(g).length >= 2, `${id}: ${usable(g)}`);
  }
  assert.equal(g.run('flags.skyreachDragonProtected'), true);
});

test('un échec avance quand même : Blagothkus se retourne contre le Culte et Glazael reste captif', () => {
  const g = at('skyreach_command');
  g.setRolls(1); choose(g, 'skyreach-convaincre'); settle(g); continueReport(g);
  assert.equal(g.run('gameState.roomId'), 'skyreach_cultists');
  assert.equal(g.run('flags.skyreachGiantAllied'), true);
  g.setRolls(1); choose(g, 'skyreach-rezmir'); settle(g); continueReport(g);
  assert.equal(g.run('gameState.roomId'), 'skyreach_dragon');
  assert.equal(g.run('flags.dragonFreed ?? false'), false);
});

test('« partager le trésor » est une variante distincte et garde Glazael captif', () => {
  const g = at('skyreach_dragon');
  assert.deepEqual(usable(g).filter(id => id.startsWith('skyreach-')).sort(), ['skyreach-partage', 'skyreach-proteger']);
  choose(g, 'skyreach-partage'); settle(g); continueReport(g);
  assert.equal(g.run('flags.dragonTreasureClaimed'), true);
  assert.equal(g.run('gameState.roomId'), 'act3_epilogue');
});

test('chaque scène reste jouable avec Bjolnir blessé, capturé ou mort', () => {
  for (const room of ROOMS) for (const state of ['injured', 'down', 'captured', 'dead']) {
    const g = at(room, `characters.bjolnir.state = ${JSON.stringify(state)}`);
    assert.ok(usable(g).length >= 2, `${room}, Bjolnir ${state}: ${usable(g)}`);
  }
});

test('lire une observation de Cumulus ne tire aucun dé', () => {
  const g = at('skyreach_command');
  const before = g.dice.calls;
  const ids = g.json('getSceneObservations().map(o => o.id)');
  assert.deepEqual(ids, ['cumulus-commandes', 'cumulus-orgueil']);
  ids.forEach(id => g.run(`observeScene(${JSON.stringify(id)})`));
  assert.equal(g.dice.calls, before);
  assert.equal(g.run('gameState.roomId'), 'skyreach_command');
});
