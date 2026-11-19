const { test } = require('node:test');
const assert = require('node:assert/strict');
const { boot, choose, continueReport, settle } = require('./support.cjs');
const path = require('./campaign-path.cjs');

function at(room, setup = '') {
  const g = boot();
  g.run(`resetCampaignState(); gameState.roomId = ${JSON.stringify(room)}; ${setup}; prepareCurrentRoom(); refreshInterface();`);
  return g;
}
const presented = g => g.json('getPresentedChoices().map(c => ({ id: c.option.id, story: Boolean(c.story), shortcut: c.shortcut, index: c.index }))');

test('les choix joués dans la campagne sont exactement le parcours du journal', () => {
  const g = boot();
  const story = g.json('[...STORY_CHOICES]');
  const journal = [...path.opening, ...path.camp, ...path.north, ...path.council].filter(id => !id.startsWith('@') && !['title-new', 'simulate-finale', 'finale-plan-room'].includes(id));
  journal.forEach(id => assert.ok(story.includes(id), id));
  const known = g.json('Object.values(rooms).flatMap(r => r.options.map(o => o.id))');
  story.forEach(id => assert.ok(known.includes(id), `${id} n’existe pas`));
});

test('le choix joué est toujours le choix 1, en bleu, avant les variantes', () => {
  for (const [room, first] of [['swift_street', 'swift-diplomatie'], ['mill_approach', 'moulin-assaut'], ['sanctuary_approach', 'temple-evacuation'], ['egg_chamber', 'voler-oeufs'], ['duel_field', 'duel-campagne']]) {
    const choices = presented(at(room));
    assert.equal(choices[0].id, first, room);
    assert.equal(choices[0].story, true, room);
    assert.deepEqual(choices.map(c => c.shortcut), choices.map((_, i) => i + 1), `${room}: numéros dans l’ordre affiché`);
  }
});

test('sans choix joué, la sortie qui fait avancer passe en premier et en bleu; revenir sur ses pas reste neutre', () => {
  const choices = presented(at('cult_trail'));
  assert.equal(choices[0].id, 'exit-nord');
  assert.equal(choices[0].story, true);
  const camp = presented(at('cult_camp_exterior'));
  assert.equal(camp[0].id, 'exit-nord');
  const back = camp.find(c => c.id === 'exit-sud');
  assert.equal(back.story, false);
  assert.equal(back.shortcut, camp.length - camp.filter(c => c.id.startsWith('navigation-')).length);
});

test('la touche affichée déclenche bien le choix affiché, même réordonné', () => {
  const g = at('swift_street');
  const target = presented(g).find(c => c.id === 'swift-force');
  g.setRolls(20); g.run(`executePresentedChoice(${target.shortcut})`); settle(g);
  assert.equal(g.run('gameState.lastReport.optionId'), 'swift-force');
});

test('les choix farfelus ne sont plus signalés comme chaotiques', () => {
  const g = at('cult_trail');
  const silly = g.json(`getAvailableOptions(gameState.roomId).filter(o => String(o.onSelect).startsWith('silly_'))`);
  assert.ok(silly.length >= 1);
  silly.forEach(o => assert.equal(o.riskText, undefined, o.id));
  assert.equal(g.json('CHOICE_BADGES')['Option absurde'], undefined);
  choose(g, 'deguisement-kobold'); settle(g); continueReport(g);
  g.run(`openJournal('decisions')`);
  assert.ok(!g.json('decisionTags(gameState.decisions[0])').includes('Provocation'));
});

test('les noms et lieux sont en gras, une seule fois par paragraphe', () => {
  const g = boot();
  const parts = g.json(`appendRichText(document.createElement('p'), 'Bjolnir et Drek’Thar quittent Verdure; Bjolnir se retourne vers Verdure.').children.map(c => [c.tagName ?? '', c.textContent])`);
  const bold = g.json(`(() => { const p = appendRichText(document.createElement('p'), 'Bjolnir et Drek’Thar quittent Verdure; Bjolnir se retourne vers Verdure.'); return p.children.filter(c => c.textContent && ['Bjolnir','Drek’Thar','Verdure'].includes(c.textContent) && c !== undefined).length; })()`);
  assert.ok(parts.length >= 5);
  assert.equal(bold, 3, 'Bjolnir, Drek’Thar et Verdure en gras une fois chacun');
  const none = g.json(`appendRichText(document.createElement('p'), 'Un talisman de Malaria.').children.length`);
  assert.equal(none, 1, 'pas de gras au milieu d’un mot');
});

test('l’onglet Personnages ne dévoile que les personnages déjà rencontrés', () => {
  const g = at('greenest_keep');
  g.run(`openJournal('cast')`);
  const early = g.json(`document.getElementById('castPanel').children.map(c => c.children?.at?.(-1)?.children?.[0]?.textContent ?? c.textContent)`);
  assert.ok(early.includes('Le gouverneur Nighthill'), early.join(' | '));
  assert.ok(!early.includes('Blagothkus') && !early.includes('Islabus Gloomward'), 'aucun spoiler');
  assert.ok(early.includes('Bjolnir HautMarteau'));
  assert.ok(!early.some(name => /Kairon/.test(name)), 'Kairon n’a pas encore rejoint le Clan');
  const late = at('skyreach_command', `fireRosterTimelineTrigger('LODGE_REUNION'); fireRosterTimelineTrigger('SKYREACH_REUNION')`);
  late.run(`openJournal('cast')`);
  const names = late.json(`document.getElementById('castPanel').children.map(c => c.children?.at?.(-1)?.children?.[0]?.textContent ?? c.textContent)`);
  ['Blagothkus', 'Eskarotha', 'Talis', 'Malar'].forEach(name => assert.ok(names.some(n => n.includes(name)), name));
  assert.ok(names.some(n => /Drek/.test(n)), 'les compagnons partis restent dans la liste');
  assert.ok(!names.includes('Islabus Gloomward'));
  const chapters = late.json('NPC_SHEETS.map(npcChapter)');
  assert.ok(chapters.every(c => c >= 1 && c <= 18), 'chaque fiche se rattache à un chapitre de la chronique');
});
