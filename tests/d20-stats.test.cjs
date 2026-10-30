const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { boot, choose, continueReport } = require('./support.cjs');

const sheets = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/character-stats.json'), 'utf8'));
const abilityKeys = { str: 'strength', dex: 'dexterity', con: 'constitution', int: 'intelligence', wis: 'wisdom', cha: 'charisma' };

function firstCheckScene(preferences) {
  const g = boot(null, preferences === undefined ? undefined : JSON.stringify(preferences));
  choose(g, 'title-new');
  choose(g, 'charge-civils');
  continueReport(g);
  assert.equal(g.run('gameState.roomId'), 'swift_street');
  return g;
}

test('les sept instantanés PDF sont reproduits sans modifier leurs bonus imprimés', () => {
  const g = boot();
  assert.equal(Object.keys(sheets.characters).length, 7);
  for (const [id, sheet] of Object.entries(sheets.characters)) {
    g.run(`gameState.adventureLevel = ${sheet.sheetLevel}; gameState.roomId = 'hill_overlook'`);
    const actual = g.json(`getAdventureStats(${JSON.stringify(id)})`);
    assert.equal(actual.level, sheet.sheetLevel, id);
    assert.equal(actual.referenceLevel, sheet.sheetLevel, id);
    assert.equal(actual.hitPoints, sheet.maxHitPoints, `${id}: PV imprimés`);
    assert.equal(actual.hitPointsAreEstimate, false, id);
    assert.equal(actual.armorClassReference, sheet.armorClass, `${id}: CA de référence`);
    assert.equal(actual.proficiency, sheet.proficiencyBonus, `${id}: maîtrise`);
    for (const [key, sourceKey] of Object.entries(abilityKeys)) {
      assert.equal(actual.abilities[key], sheet.abilityScores[sourceKey], `${id}: ${key}`);
      assert.equal(actual.modifiers[key], sheet.abilityModifiers[sourceKey], `${id}: mod ${key}`);
      assert.equal(actual.saves[key].bonus, sheet.savingThrowBonuses[sourceKey], `${id}: sauvegarde ${key}`);
    }
    for (const [key, bonus] of Object.entries(sheet.skillBonuses)) {
      assert.equal(actual.skills[key].bonus, bonus, `${id}: compétence ${key}`);
      assert.equal(actual.skills[key].referenceBonus, bonus, `${id}: référence ${key}`);
    }
  }
});

test('la maîtrise suit ses paliers, l’expertise double son bonus et l’aura commence au niveau 6', () => {
  const g = boot();
  for (let level = 1; level <= 20; level++) {
    g.run(`gameState.adventureLevel = ${level}; gameState.roomId = 'hill_overlook'`);
    const proficiency = 2 + Math.floor((level - 1) / 4);
    assert.equal(g.run(`proficiencyBonus(${level})`), proficiency);
    assert.equal(g.run('getAdventureStats("malar").skills.stealth.bonus'), 4 + 2 * proficiency);
    assert.equal(g.run('getAdventureStats("bjolnir").auraBonus'), level < 6 ? 0 : 3);
  }
  g.run('gameState.adventureLevel = 6; characters.bjolnir.state = "down"');
  assert.equal(g.run('getAdventureStats("bjolnir").auraBonus'), 0, 'pas d’aura lorsque Bjolnir est inconscient');
  g.run('characters.bjolnir.state = "active"');
  assert.equal(g.run('getAdventureStats("bjolnir").saves.wis.bonus'), 7);
});

test('la Force 17 reconstituée rejoint les gantelets sans réécrire les fiches sources', () => {
  const g = boot();
  for (const [id, threshold] of [['bjolnir', 10], ['kairon', 9]]) {
    for (const level of [1, threshold - 1, threshold, threshold + 1]) {
      g.run(`gameState.adventureLevel = ${level}; gameState.roomId = 'hill_overlook'`);
      const actual = g.json(`getAdventureStats(${JSON.stringify(id)})`);
      assert.equal(actual.abilities.str, level < threshold ? 17 : 19, `${id} au niveau ${level}`);
      assert.equal(actual.reference.abilities.str, 19);
      assert.equal(sheets.characters[id].strengthReconstruction.dateOfItemAcquisitionKnown, false);
      if (level < threshold) assert.match(actual.cautions.join(' '), /17.*MJ.*date exacte.*inconnue/);
    }
  }
});

test('Carnath ne donne pas de niveau répétable et le rollback restaure le niveau précédent', () => {
  const g = boot();
  choose(g, 'title-new');
  g.run('enterRoom("carnath_roadhouse", "test", {skipCheckpoint:true})');
  assert.equal(g.run('getAdventureLevel()'), 5);
  g.run('for (let i=0;i<20;i++) prepareCurrentRoom(); createCheckpoint("avant le portail")');
  assert.equal(g.run('gameState.adventureLevel'), 5);
  g.run('enterRoom("hunting_lodge", "test", {skipCheckpoint:true})');
  assert.equal(g.run('getAdventureLevel()'), 6);
  g.run('for (let i=0;i<20;i++) prepareCurrentRoom()');
  assert.equal(g.run('gameState.adventureLevel'), 6);
  assert.equal(g.run('rollbackToLastCheckpoint()'), true);
  assert.equal(g.run('gameState.roomId'), 'carnath_roadhouse');
  assert.equal(g.run('gameState.adventureLevel'), 5);
  assert.equal(g.run('getAdventureLevel()'), 5);
  g.run('enterRoom("naerytar_swamp", "test", {skipCheckpoint:true}); prepareCurrentRoom()');
  assert.equal(g.run('getAdventureLevel()'), 5);
});

test('le parcours réel rejoint les jalons et la simulation finale garde le niveau canonique 12', () => {
  const g = boot();
  const route = require('./campaign-path.cjs');
  for (const id of route.opening) choose(g, id);
  assert.equal(g.run('gameState.adventureLevel'), 2);
  for (const id of route.camp) choose(g, id);
  assert.equal(g.run('gameState.adventureLevel'), 4);
  for (const id of route.north) choose(g, id);
  assert.equal(g.run('gameState.adventureLevel'), 8);
  for (const id of route.council) {
    if (id === 'simulate-finale') assert.equal(g.run('gameState.adventureLevel'), 12);
    choose(g, id);
  }
  assert.equal(g.run('acts.current'), 'ACT_V');
  assert.equal(g.run('getAdventureLevel()'), 14);
  assert.equal(g.run('gameState.adventureLevel'), 12, 'le niveau de simulation ne remplace pas la progression du récit');
  g.run('for (let i=0;i<20;i++) prepareCurrentRoom(); saveGame()');
  assert.equal(g.run('gameState.adventureLevel'), 12);
  const restored = boot(g.storage.get('clanDestain.save.v1'));
  assert.equal(restored.run('getAdventureLevel()'), 14);
  assert.equal(restored.run('gameState.adventureLevel'), 12);
});

test('le D20 couvre ses 20 faces et rejette les 16 valeurs créant un biais de modulo', () => {
  const g = boot();
  g.run(`globalThis.crypto = { samples: [], calls: 0, getRandomValues(a) {
    this.calls++; if (!this.samples.length) throw new Error('échantillon manquant');
    a[0] = this.samples.shift(); return a;
  } }`);
  for (const offset of [0, 20, 4294967260]) {
    g.run(`crypto.samples = Array.from({length:20}, (_,i) => ${offset} + i)`);
    assert.deepEqual(g.json('Array.from({length:20}, () => rollD20())'), Array.from({ length: 20 }, (_, i) => i + 1));
  }
  g.run('crypto.samples = [...Array.from({length:16}, (_,i) => 4294967280+i), 0, 4294967279]');
  const previousCalls = g.run('crypto.calls');
  assert.equal(g.run('rollD20()'), 1);
  assert.equal(g.run('crypto.calls') - previousCalls, 17);
  assert.equal(g.run('rollD20()'), 20);
  assert.equal(g.run('crypto.samples.length'), 0);
});

test('aperçus, rendus et consultation des fiches ne consomment aucun dé', () => {
  const g = firstCheckScene();
  const previousCalls = g.dice.calls;
  const before = g.json('({characters,flags,variables,acts,checkpoints:gameState.checkpoints})');
  g.run(`for (let i=0;i<10;i++) {
    const options=getAvailableOptions(gameState.roomId);
    options.filter(o=>o.resolution).forEach(o=>getCheckPreview(o,o.characterId));
    getPresentedChoices(); render(); refreshInterface(); getAdventureStats('bjolnir');
  }`);
  assert.equal(g.dice.calls, previousCalls);
  assert.deepEqual(g.json('({characters,flags,variables,acts,checkpoints:gameState.checkpoints})'), before);
});

test('les 1 et 20 naturels ne forcent un résultat que pour une attaque', () => {
  const g = boot();
  g.setRolls(1, 20, 1, 20);
  const results = g.json(`[
    performD20Check({id:'ability-one',characterId:'bjolnir',check:{kind:'ability',ability:'str',skillKey:null,dc:1}}),
    performD20Check({id:'ability-twenty',characterId:'bjolnir',check:{kind:'ability',ability:'str',skillKey:null,dc:99}}),
    performD20Check({id:'attack-one',characterId:'bjolnir',check:{kind:'attack',ability:'str',dc:1}}),
    performD20Check({id:'attack-twenty',characterId:'bjolnir',check:{kind:'attack',ability:'str',dc:99}})
  ]`);
  assert.deepEqual(results.map(r => [r.natural, r.success, r.critical]), [
    [1, true, null], [20, false, null], [1, false, 'failure'], [20, true, 'success']
  ]);
  assert.equal(g.dice.calls, 4);
});

test('une épreuve peut préciser sa caractéristique et son DD sans inventer de maîtrise', () => {
  const g = boot();
  const previousCalls = g.dice.calls;
  const fog = g.json(`getCheckPreview({characterId:'darrin',skill:'wild_magic',
    check:{kind:'ability',ability:'dex',skillKey:'stealth',label:'Évacuation discrète',dc:12}})`);
  assert.equal(fog.kind, 'ability', 'le brouillard ne devient pas une attaque de sort');
  assert.equal(fog.ability, 'dex');
  assert.equal(fog.skillKey, 'stealth');
  assert.equal(fog.dc, 12);
  assert.equal(fog.abilityModifier, 1);
  assert.equal(fog.proficiencyBonus, 0, 'Darrin n’a pas de maîtrise de Discrétion attestée');
  assert.equal(fog.bonus, 1);
  const alternative = g.json(`getCheckPreview({characterId:'bjolnir',skill:'diplomacy',
    check:{ability:'dex',skillKey:'persuasion',dc:15}})`);
  assert.equal(alternative.abilityModifier, 0);
  assert.equal(alternative.proficiencyBonus, 2);
  assert.equal(alternative.bonus, 2, 'le modificateur choisi remplace celui de la compétence d’origine');
  assert.equal(g.dice.calls, previousCalls);
});

test('une épreuve tire une fois; double clic, animation, passage et relecture gardent le résultat', () => {
  const g = firstCheckScene({ diceAnimation: true });
  const previousCalls = g.dice.calls;
  choose(g, 'swift-diplomatie');
  assert.equal(g.dice.calls - previousCalls, 1);
  assert.equal(g.run('getD20AnimationPending()'), true);
  const check = g.json('gameState.lastReport.check');
  const history = g.json('gameState.rollHistory');
  const checkpoints = g.run('gameState.checkpoints.length');
  g.run('chooseOption("1"); render(); renderD20(); startSceneEffect()');
  assert.equal(g.dice.calls - previousCalls, 1);
  assert.equal(g.run('gameState.checkpoints.length'), checkpoints);
  assert.deepEqual(g.json('gameState.lastReport.check'), check);
  assert.deepEqual(g.json('gameState.rollHistory'), history);
  assert.equal(g.run('getPresentedChoices()[0].option.id'), 'dice-skip');
  g.run('executePresentedChoice(1)');
  assert.equal(g.run('getD20AnimationPending()'), false);
  assert.equal(g.elements.d20Value.textContent, String(check.natural));
  assert.match(g.elements.checkBreakdown.textContent, /D20.*maîtrise.*DD/);
  g.run('finishD20Animation(); startSceneEffect(); gameState.tick+=150; render(); startSceneEffect(); render()');
  assert.equal(g.dice.calls - previousCalls, 1);
  assert.deepEqual(g.json('gameState.lastReport.check'), check);
  assert.deepEqual(g.json('gameState.rollHistory'), history);
});

test('l’animation se termine seule et laisse le résultat lisible sans nouveau jet', () => {
  const g = firstCheckScene({ diceAnimation: true });
  g.setRolls(17);
  choose(g, 'swift-diplomatie');
  const previousCalls = g.dice.calls;
  const check = g.json('gameState.lastReport.check');
  g.run('gameState.tick+=21; render()');
  assert.equal(g.run('getD20AnimationPending()'), true);
  assert.equal(g.elements.checkSummary.textContent, 'Le D20 roule…');
  g.run('gameState.tick+=21; render()');
  assert.equal(g.run('getD20AnimationPending()'), false);
  assert.equal(g.elements.d20Value.textContent, '17');
  assert.equal(g.run('getPresentedChoices()[0].option.id'), 'report-continue');
  assert.equal(g.dice.calls, previousCalls);
  assert.deepEqual(g.json('gameState.lastReport.check'), check);
});

test('recharger pendant le jet affiche son résultat enregistré sans tirer ni rejouer l’animation', () => {
  const g = firstCheckScene({ diceAnimation: true });
  g.setRolls(11);
  choose(g, 'swift-diplomatie');
  assert.equal(g.run('getD20AnimationPending()'), true);
  const saved = g.storage.get('clanDestain.save.v1');
  const check = g.json('gameState.lastReport.check');
  const restored = boot(saved, JSON.stringify({ diceAnimation: true }));
  assert.equal(restored.dice.calls, 0);
  assert.equal(restored.run('getD20AnimationPending()'), false);
  assert.deepEqual(restored.json('gameState.lastReport.check'), check);
  assert.deepEqual(restored.json('gameState.rollHistory'), g.json('gameState.rollHistory'));
  assert.equal(restored.elements.d20Value.textContent, String(check.natural));
  restored.run('startSceneEffect(); render(); saveGame(); loadGame(); refreshInterface()');
  assert.equal(restored.dice.calls, 0);
  assert.deepEqual(restored.json('gameState.lastReport.check'), check);
});

test('animation désactivée et mouvement réduit montrent directement le même jet', () => {
  for (const preferences of [{ diceAnimation: false }, { diceAnimation: true, motion: 'reduced' }]) {
    const g = firstCheckScene(preferences);
    const previousCalls = g.dice.calls;
    g.setRolls(14);
    choose(g, 'swift-diplomatie');
    assert.equal(g.run('getD20AnimationPending()'), false);
    assert.equal(g.run('gameState.lastReport.check.natural'), 14);
    assert.equal(g.elements.d20Value.textContent, '14');
    assert.equal(g.dice.calls - previousCalls, 1);
    const restored = boot(g.storage.get('clanDestain.save.v1'), g.storage.get('clanDestain.preferences.v1'));
    assert.equal(restored.run('uiState.preferences.diceAnimation'), preferences.diceAnimation);
    assert.equal(restored.run('uiState.reducedMotion'), preferences.motion === 'reduced');
  }
  const g = firstCheckScene({ diceAnimation: true });
  g.run('uiState.systemReducedMotion=true; applyAmbiancePreferences()');
  choose(g, 'swift-diplomatie');
  assert.equal(g.run('getD20AnimationPending()'), false, 'la préférence système prime aussi');
});

test('couper l’animation pendant un jet révèle sa valeur sans nouveau tirage', () => {
  const g = firstCheckScene({ diceAnimation: true });
  choose(g, 'swift-diplomatie');
  const check = g.json('gameState.lastReport.check');
  const previousCalls = g.dice.calls;
  assert.equal(g.run('getD20AnimationPending()'), true);
  g.run('uiState.preferences.diceAnimation=false; applyAmbiancePreferences()');
  assert.equal(g.run('getD20AnimationPending()'), false);
  assert.equal(g.dice.calls, previousCalls);
  assert.deepEqual(g.json('gameState.lastReport.check'), check);
  assert.equal(JSON.parse(g.storage.get('clanDestain.preferences.v1')).diceAnimation, false);
});

test('sans générateur disponible l’épreuve ne change ni progression ni checkpoint', () => {
  const g = firstCheckScene();
  const before = g.json('({characters,flags,variables,acts,gameState})');
  g.run('globalThis.crypto=null; window.crypto=null');
  choose(g, 'swift-diplomatie');
  assert.deepEqual(g.json('({characters,flags,variables,acts,gameState})'), before);
  assert.match(g.lines.at(-1), /générateur.*indisponible/);
});
