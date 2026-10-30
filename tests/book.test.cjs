const { test } = require('node:test');
const assert = require('node:assert/strict');
const { boot, choose } = require('./support.cjs');

function atScene(roomId = 'cult_camp') {
  const g = boot();
  g.run(`resetCampaignState(); gameState.roomId = ${JSON.stringify(roomId)}; prepareCurrentRoom(); refreshInterface()`);
  return g;
}

function observationIds(g) {
  return g.json('getSceneObservations().map(observation => observation.id)');
}

function campaignState(g) {
  return g.json('({characters,flags,variables,acts,roomId:gameState.roomId,inventory:gameState.inventory,checkpoints:gameState.checkpoints,resolvedOptions:gameState.resolvedOptions,rollHistory:gameState.rollHistory,level:gameState.adventureLevel})');
}

test('les nouvelles scènes des trois actes offrent des observations sourcées et distinctes', () => {
  const g = boot();
  const rooms = g.json('rooms');
  const expanded = Object.values(rooms).filter(room => room.observations?.length);
  assert.ok(expanded.length >= 20, 'Les observations doivent couvrir plusieurs épisodes, au-delà de Verdure.');
  for (const id of ['cult_camp', 'egg_chamber', 'carnath_roadhouse', 'skyreach_chronicle', 'diderius_chronicle', 'thay_invitation']) {
    assert.ok(rooms[id].observations?.length >= 2, id);
    assert.ok(rooms[id].paragraphs?.length >= 2, `${id}: récit développé`);
  }
  for (const room of expanded) {
    assert.ok(room.observations.length >= 2, room.id);
    assert.equal(new Set(room.observations.map(o => o.id)).size, room.observations.length, room.id);
    for (const observation of room.observations) {
      assert.equal(typeof observation.id, 'string', room.id);
      assert.ok(observation.id.length > 0, room.id);
      assert.ok(observation.title?.trim(), `${room.id}/${observation.id}: titre`);
      assert.ok(observation.paragraphs?.length, `${room.id}/${observation.id}: texte`);
      assert.ok(observation.paragraphs.every(p => typeof p === 'string' && p.trim().length > 20), `${room.id}/${observation.id}: prose`);
      assert.ok(observation.source, `${room.id}/${observation.id}: source`);
    }
  }
});

test('observer éclaire la scène sans tirer de dé ni modifier les ressources ou checkpoints', () => {
  const g = atScene();
  const id = observationIds(g)[0];
  assert.ok(id);
  const before = campaignState(g), entropy = g.dice.calls;
  g.run(`observeScene(${JSON.stringify(id)})`);
  assert.deepEqual(campaignState(g), before);
  assert.equal(g.dice.calls, entropy);
  assert.ok(g.json('gameState.observations').includes(`cult_camp:${id}`));
  for (let i = 0; i < 3; i++) g.run(`observeScene(${JSON.stringify(id)}); refreshInterface(); render()`);
  assert.equal(g.json('gameState.observations').filter(key => key === `cult_camp:${id}`).length, 1);
  assert.deepEqual(campaignState(g), before);
  assert.equal(g.dice.calls, entropy);
});

test('une observation inconnue ou demandée pendant un résultat ne contourne pas la décision', () => {
  const g = atScene();
  const id = observationIds(g)[0], before = g.json('gameState.observations'), state = campaignState(g), entropy = g.dice.calls;
  g.run('observeScene("observation-absente")');
  assert.deepEqual(g.json('gameState.observations'), before);
  g.run(`gameState.lastReport = {roomId:'cult_camp',title:'Un résultat',paragraphs:['Le groupe termine son action.'],changes:[],failed:false}; observeScene(${JSON.stringify(id)})`);
  assert.deepEqual(g.json('gameState.observations'), before);
  assert.deepEqual(campaignState(g), state);
  assert.equal(g.dice.calls, entropy);
  assert.equal(g.run('gameState.lastReport.title'), 'Un résultat');
});

test('les observations survivent au rechargement et un retour restaure leur état antérieur', () => {
  const g = atScene();
  const [first, second] = observationIds(g);
  assert.ok(first && second);
  g.run(`observeScene(${JSON.stringify(first)}); createCheckpoint('Avant la seconde observation'); observeScene(${JSON.stringify(second)}); saveGame()`);
  const observed = g.json('gameState.observations');
  const loaded = boot(g.storage.get('clanDestain.save.v1'));
  assert.deepEqual(loaded.json('gameState.observations'), observed);
  assert.equal(loaded.dice.calls, 0, 'La reprise ne tire aucun dé.');
  assert.equal(loaded.run('rollbackToLastCheckpoint()'), true);
  assert.deepEqual(loaded.json('gameState.observations'), [`cult_camp:${first}`]);
  assert.equal(loaded.run('gameState.roomId'), 'cult_camp');
  loaded.run('resetCampaignState()');
  assert.deepEqual(loaded.json('gameState.observations'), []);
});

test('une sauvegarde antérieure aux observations reste lisible', () => {
  const g = atScene();
  g.run('createCheckpoint("Ancien format"); saveGame()');
  const legacy = JSON.parse(g.storage.get('clanDestain.save.v1'));
  delete legacy.gameState.observations;
  for (const cp of legacy.gameState.checkpoints) delete cp.gameState.observations;
  const loaded = boot(JSON.stringify(legacy));
  assert.equal(loaded.run('gameState.roomId'), 'cult_camp');
  assert.deepEqual(loaded.json('gameState.observations'), []);
  assert.equal(loaded.run('rollbackToLastCheckpoint()'), true);
  assert.deepEqual(loaded.json('gameState.observations'), []);
});

test('une liste d’observations corrompue est refusée sans écraser la partie', () => {
  const g = atScene();
  const id = observationIds(g)[0];
  g.run(`observeScene(${JSON.stringify(id)}); saveGame()`);
  const saved = g.storage.get('clanDestain.save.v1'), before = campaignState(g), observed = g.json('gameState.observations');
  for (const value of [null, 'cult_camp:inconnue', [42], ['salle-inconnue:note'], ['cult_camp:note-inconnue']]) {
    const invalid = JSON.parse(saved);
    invalid.gameState.observations = value;
    assert.equal(g.run(`importSaveFromString(${JSON.stringify(JSON.stringify(invalid))})`), false);
    assert.equal(g.storage.get('clanDestain.save.v1'), saved);
    assert.deepEqual(campaignState(g), before);
    assert.deepEqual(g.json('gameState.observations'), observed);
  }
});

test('les échecs de discours et de négociation coûtent de la confiance sans blesser les orateurs', () => {
  for (const [room, ids] of [
    ['council_defense_floor', ['defense-honnete', 'defense-pragmatique', 'defense-manipulateur', 'defense-arrogant']],
    ['metallic_dragon_audience', ['dragons-persuade', 'dragons-offer-alliance', 'dragons-threaten-cult']]
  ]) {
    for (const id of ids) {
      const g = atScene(room);
      g.run('Object.values(characters).forEach(c => c.state = "active")');
      const before = g.json('characters');
      const option = g.json(`getAvailableOptions(gameState.roomId).find(o => o.id === ${JSON.stringify(id)})`);
      assert.equal(option?.resolution.risk, 'cost', id);
      g.setRolls(1);
      choose(g, id);
      assert.equal(g.run('gameState.lastReport.check.success'), false, id);
      assert.deepEqual(g.json('characters'), before, `${id}: aucun blessé après une objection`);
      assert.ok(g.json('getPresentedChoices().filter(c => c.index !== -1)').length >= 2, id);
      if (room === 'council_defense_floor') {
        assert.equal(g.run('gameState.roomId'), 'council_strategy_floor', `${id}: audience terminée même sur échec`);
        assert.equal(g.run('flags.councilDefenseDone'), true, id);
      } else {
        assert.equal(g.run('gameState.roomId'), 'misty_forest_chronicle', `${id}: la campagne poursuit après le refus`);
        assert.equal(g.run('flags.metallicAudienceDone'), true, id);
        assert.equal(g.run('flags.metallicAlliance'), false, `${id}: le refus ne devient pas une alliance`);
      }
      g.run(`gameState.lastReport = null; gameState.roomId = ${JSON.stringify(room)}; prepareCurrentRoom()`);
      assert.equal(g.run(`getAvailableOptions(gameState.roomId).some(o => o.id === ${JSON.stringify(id)})`), false, `${id}: aucun gain répétable sans retour au checkpoint`);
    }
  }
});

test('les approches non attestées sont annoncées comme variantes avant le clic', () => {
  const g = boot();
  const options = g.json('Object.values(rooms).flatMap(room => room.options)');
  for (const id of ['caravane-espionner', 'naerytar-factions', 'naerytar-saboter', 'naerytar-prisonniers', 'portal-saboter']) {
    const option = options.find(o => o.id === id);
    assert.ok(option, id);
    assert.match(option.label, /What If/i, `${id}: la variante doit être explicite`);
    assert.ok(option.intent?.trim(), `${id}: intention expliquée`);
  }
});
