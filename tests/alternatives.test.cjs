const { test } = require('node:test');
const assert = require('node:assert/strict');
const { boot, choose, continueReport, settle } = require('./support.cjs');

const ROOMS = {
  cult_trail: ['piste-betes'],
  cult_camp_exterior: ['glisser-entre-rondes', 'couvert-vegetal'],
  hatchery_entry: ['entree-magie', 'entree-epaule'],
  fungal_chamber: ['fonges-reconnaitre', 'fonges-eclaireur'],
  egg_chamber: ['detruire-oeufs-drekthar', 'laisser-oeufs-ellyjobell'],
  naerytar_swamp: ['naerytar-piste'],
  old_tunnel: ['tunnel-epaule', 'tunnel-crochetage'],
  dragon_assault: ['dragon-brouillard', 'dragon-magie']
};

function enter(g, room) {
  g.run(`resetCampaignState(); gameState.roomId = ${JSON.stringify(room)}; prepareCurrentRoom(); refreshInterface();`);
}
const realChoices = g => g.json('getAvailableOptions(gameState.roomId).filter(o => o.resolution || o.check).map(o => o.id)');

test('les salles de décision proposent des approches confiées à au moins trois compagnons différents', () => {
  const g = boot();
  for (const room of ['cult_camp_exterior', 'hatchery_entry', 'fungal_chamber', 'cult_trail']) {
    enter(g, room);
    const actors = new Set(g.json('getAvailableOptions(gameState.roomId).filter(o => o.resolution).map(o => o.characterId)'));
    assert.ok(actors.size >= 3, `${room}: ${[...actors].join(', ')}`);
  }
});

test('chaque approche ajoutée se joue en réussite comme en échec sans bloquer la scène', () => {
  for (const [room, ids] of Object.entries(ROOMS)) for (const id of ids) for (const roll of [20, 1]) {
    const g = boot();
    enter(g, room);
    g.setRolls(roll);
    choose(g, id); settle(g);
    assert.equal(g.run('gameState.lastReport.check.natural'), roll, `${id}: un seul D20`);
    assert.equal(g.run('gameState.lastReport.check.success'), roll === 20, id);
    assert.equal(g.dice.calls, 1, `${id}: pas de nouveau tirage`);
    continueReport(g);
    const choices = g.json('getPresentedChoices().filter(c => c.index !== -1).map(c => c.option.id)');
    assert.ok(choices.length >= 2, `${id} (${roll}): ${choices.join(', ')}`);
  }
});

test('si Bjolnir est capturé, les abords du camp offrent encore des approches', () => {
  const g = boot();
  enter(g, 'cult_camp_exterior');
  g.run(`characters.bjolnir.state = 'captured'; prepareCurrentRoom(); refreshInterface();`);
  assert.deepEqual(realChoices(g).sort(), ['couvert-vegetal', 'glisser-entre-rondes']);
});

test('détruire ou laisser les œufs par un autre compagnon applique les mêmes drapeaux', () => {
  let g = boot(); enter(g, 'egg_chamber'); g.setRolls(20); choose(g, 'detruire-oeufs-drekthar');
  assert.equal(g.run('flags.eggsDestroyed'), true);
  assert.equal(g.run('flags.eggsStolen'), false);
  g = boot(); enter(g, 'egg_chamber'); g.setRolls(20); choose(g, 'laisser-oeufs-ellyjobell');
  assert.equal(g.run('flags.eggsLeft'), true);
  assert.equal(g.run('flags.eggsDestroyed'), false);
});

test('le tunnel et le dragon offrent trois méthodes, toutes menant à l’issue du journal', () => {
  for (const [room, ids, next] of [['old_tunnel', ['tunnel-temple', 'tunnel-epaule', 'tunnel-crochetage'], 'sanctuary_approach'],
    ['dragon_assault', ['dragon-defendre', 'dragon-brouillard', 'dragon-magie'], 'greenest_keep']]) {
    for (const id of ids) for (const roll of [20, 1]) {
      const g = boot(); enter(g, room); g.setRolls(roll);
      assert.ok(g.json('getAvailableOptions(gameState.roomId).map(o => o.id)').includes(id), `${room}: ${id}`);
      choose(g, id); settle(g); continueReport(g);
      assert.equal(g.run('gameState.roomId'), next, `${id} (${roll})`);
    }
  }
});

test('aucune option ne confie une épreuve à un compagnon absent de l’aventure à ce stade', () => {
  const g = boot();
  const order = g.json(`[...DATA.actRooms.ACT_I, ...Object.keys(ACT_II_ROOMS), ...DATA.actRooms.ACT_III, ...DATA.actRooms.ACT_IV, ...DATA.actRooms.ACT_V]`);
  const index = id => order.indexOf(id);
  const lodge = index('hunting_lodge'), skyreach = index('skyreach_castle');
  for (const room of g.json('Object.values(rooms)')) {
    const i = index(room.id);
    if (i < 0) continue;
    for (const option of room.options) {
      const actors = [option.characterId, ...(option.requiresCharacters ?? [])].filter(Boolean);
      for (const actor of actors) {
        if (i > lodge) assert.ok(!['drekthar', 'sislay'].includes(actor), `${room.id}/${option.id}: ${actor} a quitté le Clan au pavillon`);
        if (i <= lodge) assert.notEqual(actor, 'kairon', `${room.id}/${option.id}: Kairon n’a pas encore rejoint le Clan`);
        if (i < skyreach) assert.notEqual(actor, 'malar', `${room.id}/${option.id}: Malar n’a pas encore rejoint le Clan`);
      }
    }
  }
});

test('les scènes de chronique offrent un second choix réel, sans dé, qui laisse la scène ouverte', () => {
  const rooms = ['leosin_return','mondath_chamber','hatchery_exit','elturel_road','elturel_tournament','carnath_roadhouse','hunting_lodge',
    'skyreach_castle','skyreach_chronicle','diderius_chronicle','ice_sea_chronicle','iceberg_rebellion','second_council',
    'misty_forest_chronicle','neronvein_chronicle','neronvein_battle','thay_invitation'];
  for (const room of rooms) {
    const g = boot(); enter(g, room);
    const ids = g.json('getAvailableOptions(gameState.roomId).map(o => o.id)');
    assert.ok(ids.includes(`point-${room}`), `${room}: ${ids}`);
    assert.ok(ids.filter(id => !id.startsWith('navigation-')).length >= 2, room);
    const calls = g.dice.calls;
    choose(g, `point-${room}`); settle(g);
    assert.equal(g.dice.calls, calls, `${room}: aucun dé`);
    assert.equal(g.run('gameState.roomId'), room, `${room}: la scène reste ouverte`);
    continueReport(g);
    const after = g.json('getAvailableOptions(gameState.roomId).map(o => o.id)');
    assert.ok(!after.includes(`point-${room}`), `${room}: le point n’est proposé qu’une fois`);
    assert.ok(after.filter(id => !id.startsWith('navigation-')).length >= 1, `${room}: la suite reste disponible`);
  }
});
