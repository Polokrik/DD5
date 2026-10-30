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
