const { test } = require('node:test');
const assert = require('node:assert/strict');
const { boot, choose, continueReport, settle } = require('./support.cjs');

function at(room, setup = '') {
  const g = boot();
  g.run(`resetCampaignState(); gameState.roomId = ${JSON.stringify(room)}; ${setup}; prepareCurrentRoom(); refreshInterface();`);
  return g;
}
const log = g => g.json('gameState.decisions');

test('chaque choix du Clan est consigné avec son auteur, son issue et sa nature', () => {
  const g = at('cult_camp_exterior');
  g.setRolls(20); choose(g, 'camp-mirage-releve'); settle(g); continueReport(g);
  g.setRolls(1); choose(g, 'camp-bras-de-fer'); settle(g); continueReport(g);
  const entries = log(g);
  assert.equal(entries.length, 2);
  assert.deepEqual(entries.map(e => [e.id, e.actor, e.won, e.kind]), [['camp-mirage-releve', 'darrin', true, 'etsi'], ['camp-bras-de-fer', 'drekthar', false, 'etsi']]);
  assert.ok(entries.every(e => e.title && !/^What If/.test(e.title) && e.chapter > 0));
});

test('un choix chaotique et un repos sont reconnus, la navigation et la lecture ne sont pas consignées', () => {
  const g = at('cult_trail');
  choose(g, 'deguisement-kobold'); settle(g); continueReport(g);
  g.run('flags.rested_3 = false'); g.setRolls(12, 12); choose(g, 'repos-cult_trail'); settle(g); continueReport(g);
  assert.deepEqual(log(g).map(e => e.kind), ['chaos', 'repos']);
  g.run(`handleCommand('go nord')`);
  assert.equal(log(g).length, 2);
});

test('un retour en arrière efface la décision annulée, la sauvegarde la conserve', () => {
  const g = at('cult_camp_exterior', `createCheckpoint('Début')`);
  g.setRolls(20); choose(g, 'camp-mirage-releve'); settle(g);
  assert.equal(log(g).length, 1);
  assert.equal(g.run('restoreDecisionCheckpoint()'), true);
  assert.equal(log(g).length, 0);
  g.setRolls(20); choose(g, 'camp-mirage-releve'); settle(g); continueReport(g);
  const saved = g.storage.get('clanDestain.save.v1');
  const other = boot(saved);
  other.run(`loadGame && loadGame()`);
  assert.equal(JSON.parse(saved).gameState.decisions.length, 1);
});

test('une liste de décisions corrompue est refusée à l’import', () => {
  const g = at('cult_camp_exterior');
  g.setRolls(20); choose(g, 'camp-mirage-releve'); settle(g); continueReport(g);
  const payload = JSON.parse(g.storage.get('clanDestain.save.v1'));
  assert.equal(g.run(`isValidSavePayload(${JSON.stringify(payload)})`), true);
  payload.gameState.decisions[0].won = 'oui';
  assert.equal(g.run(`isValidSavePayload(${JSON.stringify(payload)})`), false);
  payload.gameState.decisions = Array.from({ length: 301 }, () => ({ room: 'a', id: 'b', title: 'c', actor: '', kind: 'normal', chapter: 1, won: null }));
  assert.equal(g.run(`isValidSavePayload(${JSON.stringify(payload)})`), false);
});

test('le bandeau montre les trois derniers choix et le journal les range par chapitre', () => {
  const g = at('cult_camp_exterior');
  for (const id of ['camp-mirage-releve', 'camp-bras-de-fer', 'glisser-entre-rondes', 'couvert-vegetal']) { g.setRolls(20); choose(g, id); settle(g); continueReport(g); }
  g.run('renderChoices()');
  assert.equal(g.run('document.getElementById("decisionStrip").hidden'), false);
  assert.equal(g.run('document.getElementById("decisionStrip").children.length'), 4, 'libellé + trois choix');
  g.run(`openJournal('decisions')`);
  assert.equal(g.run('document.getElementById("decisionsPanel").hidden'), false);
  assert.ok(g.run('document.getElementById("decisionsPanel").children.length') >= 3, 'résumé, titre de chapitre, liste');
});

test('les nouvelles approches sont des variantes annoncées « Et si… » et chiffrées', () => {
  const g = at('castle_naerytar');
  const options = g.json('getAvailableOptions(gameState.roomId).filter(o => ["naerytar-pelerins", "naerytar-betes"].includes(o.id))');
  assert.equal(options.length, 2);
  options.forEach(o => assert.match(o.label, /^What If/));
  const chips = g.json(`effectChips(getAvailableOptions(gameState.roomId).find(o => o.id === 'naerytar-betes'))`);
  assert.deepEqual(chips.success.map(c => [c.label, c.text, c.tone]), [['Moral', '+10 %', 'good'], ['Alerte du château', '+20 %', 'bad']]);
});
