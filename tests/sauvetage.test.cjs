const { test } = require('node:test');
const assert = require('node:assert/strict');
const { boot, choose, continueReport, settle } = require('./support.cjs');

function at(room, setup = '') {
  const g = boot();
  g.run(`resetCampaignState(); gameState.roomId = ${JSON.stringify(room)}; ${setup}; prepareCurrentRoom(); refreshInterface();`);
  return g;
}
const ids = g => g.json('getAvailableOptions(gameState.roomId).map(o => o.id)');
const state = (g, id) => g.run(`characters.${id}.state`);

test('Sislay capturée sur la piste : le Clan peut partir à sa rescousse depuis la scène', () => {
  const g = at('cult_trail');
  assert.ok(!ids(g).some(id => id.startsWith('rescue-start-')), 'aucune mission sans captif');
  g.setRolls(1); choose(g, 'suivre-discretement'); settle(g); continueReport(g);
  assert.equal(state(g, 'sislay'), 'captured');
  assert.ok(ids(g).includes('rescue-start-sislay'));
  g.run(`handleCommand('go nord')`);
  assert.ok(ids(g).includes('rescue-start-sislay'), 'la proposition suit le groupe dans la scène suivante');
});

test('la mission propose trois approches et un report, avec un texte au nom du captif', () => {
  const g = at('cult_trail', `characters.sislay.state = 'captured'`);
  choose(g, 'rescue-start-sislay');
  assert.equal(g.run('gameState.roomId'), 'rescue_mission');
  assert.deepEqual(ids(g).filter(id => id.startsWith('rescue-')), ['rescue-stealth', 'rescue-force', 'rescue-parley', 'rescue-later']);
  assert.equal(g.run('rooms.rescue_mission.title'), 'Au secours de Sislay');
  assert.match(g.run('rooms.rescue_mission.paragraphs[0]'), /Sislay a été prise .* la retiennent/);
  assert.equal(g.run('rooms.rescue_mission.chapter'), g.run('rooms.cult_trail.chapter'));
  assert.equal(g.run('PRESENTATION.scenes.rescue_mission.art'), g.run('PRESENTATION.scenes.cult_trail.art'));
});

test('une approche réussie libère le compagnon, blessé, et ramène le Clan à la scène quittée', () => {
  const g = at('cult_trail', `characters.sislay.state = 'captured'`);
  choose(g, 'rescue-start-sislay');
  g.setRolls(20); choose(g, 'rescue-stealth'); settle(g);
  assert.equal(state(g, 'sislay'), 'injured');
  assert.match(g.run('gameState.lastReport.paragraphs.join(" ")'), /Sislay est délivrée/);
  continueReport(g);
  assert.equal(g.run('gameState.roomId'), 'cult_trail');
  assert.equal(g.run('gameState.rescue'), null);
  assert.ok(!ids(g).some(id => id.startsWith('rescue-start-')));
  assert.deepEqual(g.json('gameState.decisions.map(d => [d.id, d.won])'), [['rescue-start-sislay', null], ['rescue-stealth', true]]);
});

test('un échec blesse celui qui s’y risque, épuise l’approche et laisse les autres ouvertes', () => {
  const g = at('cult_trail', `characters.sislay.state = 'captured'`);
  choose(g, 'rescue-start-sislay');
  const actor = g.run(`getAvailableOptions('rescue_mission').find(o => o.id === 'rescue-force').characterId`);
  g.setRolls(1); choose(g, 'rescue-force'); settle(g);
  assert.equal(state(g, 'sislay'), 'captured');
  assert.equal(state(g, actor), 'injured');
  continueReport(g);
  assert.equal(g.run('gameState.roomId'), 'rescue_mission');
  assert.deepEqual(ids(g).filter(id => id.startsWith('rescue-')), ['rescue-stealth', 'rescue-parley', 'rescue-later']);
  // parlementer échoue sans blessure
  const before = g.json('Object.values(characters).map(c => c.state)');
  g.setRolls(1); choose(g, 'rescue-parley'); settle(g); continueReport(g);
  assert.deepEqual(g.json('Object.values(characters).map(c => c.state)'), before);
});

test('remettre à plus tard ramène à la scène; une nouvelle tentative rouvre toutes les approches', () => {
  const g = at('cult_camp_exterior', `characters.bjolnir.state = 'captured'`);
  choose(g, 'rescue-start-bjolnir');
  assert.match(g.run('rooms.rescue_mission.paragraphs[0]'), /Bjolnir a été pris .* le retiennent/);
  g.setRolls(1); choose(g, 'rescue-stealth'); settle(g); continueReport(g);
  choose(g, 'rescue-later');
  assert.equal(g.run('gameState.roomId'), 'cult_camp_exterior');
  assert.equal(state(g, 'bjolnir'), 'captured');
  choose(g, 'rescue-start-bjolnir');
  assert.ok(ids(g).includes('rescue-stealth'));
});

test('la mission suit la sauvegarde et un état incohérent est refusé', () => {
  const g = at('cult_trail', `characters.sislay.state = 'captured'`);
  choose(g, 'rescue-start-sislay'); g.run('saveGame()');
  const payload = JSON.parse(g.storage.get('clanDestain.save.v1'));
  assert.deepEqual(payload.gameState.rescue, { id: 'sislay', from: 'cult_trail' });
  assert.equal(g.run(`isValidSavePayload(${JSON.stringify(payload)})`), true);
  payload.gameState.rescue = null;
  assert.equal(g.run(`isValidSavePayload(${JSON.stringify(payload)})`), false);
  payload.gameState.rescue = { id: 'inconnu', from: 'cult_trail' };
  assert.equal(g.run(`isValidSavePayload(${JSON.stringify(payload)})`), false);
});

test('pas de mission proposée si personne ne peut agir, ni à l’accueil', () => {
  const g = at('cult_trail', `Object.values(characters).forEach(c => { if (c.state === 'active') c.state = 'down'; }); characters.sislay.state = 'captured'`);
  assert.ok(!ids(g).some(id => id.startsWith('rescue-start-')));
  const h = at('title_screen', `characters.sislay.state = 'captured'`);
  assert.ok(!ids(h).some(id => id.startsWith('rescue-start-')));
});
