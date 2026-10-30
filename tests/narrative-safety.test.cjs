const { test } = require('node:test');
const assert = require('node:assert/strict');
const { boot, choose, continueReport } = require('./support.cjs');
const path = require('./campaign-path.cjs');

function assertTwoChoices(g, context) {
  const choices = g.json('getPresentedChoices().filter(c => c.index !== -1 && c.option.disabled !== true && c.option.locked !== true && c.option.available !== false)');
  assert.ok(choices.length >= 2, `${context}: ${choices.map(c => c.option.id).join(', ')}`);
  assert.equal(new Set(choices.map(c => c.option.id)).size, choices.length, `${context}: choix dupliqués`);
}

test('sans checkpoint après un Game Over, le résultat propose aussi de recommencer directement', () => {
  const g = boot();
  g.run(`resetCampaignState(); gameState.checkpoints = []; triggerGameOver('silly','Une tentative sans point de retour.')`);
  assert.equal(g.run('gameState.roomId'), 'title_screen');
  const choices = g.json('getPresentedChoices()');
  assert.equal(choices[0].continuation, true);
  assert.equal(choices[1].restart, true);
  g.run('executePresentedChoice(2)');
  assert.equal(g.run('gameState.roomId'), 'hill_overlook');
  assert.equal(g.run('characters.bjolnir.state'), 'active');
  assert.equal(g.run('gameState.lastReport'), null);
});

test('le parcours des cinq actes et chaque résultat présentent deux choix utilisables', () => {
  const g = boot(null, null, '?whatif=1');
  const route = [...path.opening, ...path.camp, ...path.north, ...path.council,
    'plan-sabotage', 'sabotage-identify', 'sabotage-stealth', 'sabotage-arcana',
    'ritual-rally', 'ritual-rally', 'ritual-rally', 'ritual-resolve'];
  for (const id of route) {
    continueReport(g);
    assertTwoChoices(g, `avant ${id}, ${g.run('gameState.roomId')}`);
    choose(g, id);
    assertTwoChoices(g, `après ${id}, ${g.run('gameState.roomId')}`);
  }
  assert.equal(g.run('gameState.roomId'), 'campaign_end');
  assert.equal(g.run('flags.campaignComplete'), true);
});

test('chaque salle conserve deux issues quand les compagnons sont indisponibles', () => {
  const g = boot();
  const roomIds = g.json('Object.keys(rooms)');
  for (const id of roomIds) {
    for (const state of ['active', 'down', 'dead']) {
      g.run(`resetCampaignState(); gameState.roomId = ${JSON.stringify(id)};
        Object.values(characters).forEach(c => c.state = ${JSON.stringify(state)});
        prepareCurrentRoom(); refreshInterface();`);
      assertTwoChoices(g, `${id}, personnages ${state}`);
    }
  }
});

test('le retour du moulin restaure une vraie décision et élimine les checkpoints descendants', () => {
  const g = boot();
  g.run(`resetCampaignState(); gameState.roomId = 'mill_approach';
    characters.drekthar.state = 'active'; characters.ellyjobell.state = 'active';
    createCheckpoint('Avant décision: moulin-assaut');
    characters.drekthar.state = 'dead'; characters.ellyjobell.state = 'down';
    gameState.roomId = 'greenest_keep'; createCheckpoint('Avant décision: mission-moulin');
    gameState.roomId = 'mill_approach';`);
  assert.equal(g.run('findDecisionCheckpoint().reason'), 'Avant décision: moulin-assaut');
  assert.equal(g.run('restoreDecisionCheckpoint()'), true);
  assert.equal(g.run('gameState.roomId'), 'mill_approach');
  assert.equal(g.run('characters.drekthar.state'), 'active');
  assert.equal(g.run('characters.ellyjobell.state'), 'active');
  assert.equal(g.run('gameState.checkpoints.length'), 0);
  assert.equal(g.run('getAvailableOptions(gameState.roomId).some(o => o.id === "moulin-assaut")'), true);
  assertTwoChoices(g, 'moulin restauré');
});

test('un checkpoint dont tous les acteurs étaient incapables est ignoré', () => {
  const g = boot();
  g.run(`resetCampaignState(); gameState.roomId = 'mill_approach';
    createCheckpoint('Avant décision: moulin-assaut');
    Object.values(characters).forEach(c => c.state = 'down');
    createCheckpoint('Avant décision: moulin-assaut');`);
  assert.equal(g.run('restoreDecisionCheckpoint()'), true);
  assert.equal(g.run('characters.drekthar.state'), 'active');
  assert.equal(g.run('gameState.checkpoints.length'), 0);
});

test('le rituel ne propose sa conclusion qu’après trois actions et cesse de proposer des actions répétables', () => {
  const g = boot();
  g.run('resetCampaignState(); gameState.roomId = "ritual_chamber"; acts.current = "ACT_V"; prepareCurrentRoom()');
  assert.equal(g.run('getAvailableOptions(gameState.roomId).some(o => o.id === "ritual-resolve")'), false);
  for (let i = 0; i < 3; i++) {
    choose(g, 'ritual-rally');
    continueReport(g);
    assert.equal(g.run('variables.finalBattle.decisiveActions'), i + 1);
  }
  const available = g.json('getAvailableOptions(gameState.roomId).map(o => o.id)');
  assert.ok(available.includes('ritual-resolve'));
  for (const id of ['ritual-rally', 'ritual-break-ward', 'ritual-sacrifice-gear']) assert.ok(!available.includes(id), id);
  assertTwoChoices(g, 'rituel prêt à conclure');
  choose(g, 'ritual-resolve');
  assert.equal(g.run('gameState.roomId'), 'campaign_end');
});

test('la variante collective du moulin avance même sur un D20 de 1, au coût annoncé', () => {
  const g = boot();
  g.run('resetCampaignState(); gameState.roomId = "mill_approach"; characters.drekthar.state = "down"; characters.ellyjobell.state = "down"; prepareCurrentRoom()');
  const before = g.json('({morale: variables.moraleGroupe, chaos: variables.chaos, characters})');
  g.setRolls(1);
  choose(g, 'moulin-garde-groupe');
  assert.equal(g.run('gameState.roomId'), 'greenest_keep');
  assert.equal(g.run('flags.moulinDone && flags.millSaved'), true);
  assert.equal(g.run('gameState.lastReport.check.natural'), 1);
  assert.equal(g.run('gameState.lastReport.check.success'), false);
  assert.equal(g.run('variables.chaos'), before.chaos + 2);
  assert.equal(g.run('variables.moraleGroupe'), before.morale - 1);
  assert.deepEqual(g.json('characters'), before.characters, 'Aucune blessure ou mort cachée');
  assertTwoChoices(g, 'résultat coûteux du moulin');
});

test('les six étapes finales disposent d’une traversée coûteuse sans leur personnage spécialiste', () => {
  for (const [room, id, target, ritualCost, alliedCost, chaosCost, civilianCost] of [
    ['supply_lines', 'sabotage-convoi-groupe', 'warded_corridor', 2, -1, 1, 0],
    ['warded_corridor', 'sabotage-couloir-groupe', 'ritual_components', 2, 0, 1, 0],
    ['ritual_components', 'sabotage-relais-groupe', 'ritual_chamber', 2, -1, 0, 0],
    ['commander_tent', 'commandement-percee-groupe', 'champion_confrontation', 2, -1, 1, 0],
    ['champion_confrontation', 'commandement-fixer-groupe', 'ritual_chamber', 2, -1, 1, 0],
    ['refugee_corridor', 'evacuation-entraide-groupe', 'burning_streets_finale', 2, 0, 0, 1]
  ]) {
    const g = boot();
    g.run(`resetCampaignState(); gameState.roomId = ${JSON.stringify(room)}; acts.current = 'ACT_V';
      Object.values(characters).forEach(c => c.state = 'absent'); characters.darrin.state = 'active';
      flags.finalBattleInitialized = true;
      Object.assign(variables.finalBattle, {ritualProgress: 3, alliedStrength: 6, battlefieldChaos: 2, civilianRisk: 2});
      prepareCurrentRoom();`);
    g.setRolls(1);
    choose(g, id);
    assert.equal(g.run('gameState.roomId'), target, id);
    assert.equal(g.run('gameState.lastReport.check.success'), false, id);
    assert.equal(g.run('characters.darrin.state'), 'active', id);
    assert.equal(g.run('variables.finalBattle.ritualProgress'), 3 + ritualCost, id);
    assert.equal(g.run('variables.finalBattle.alliedStrength'), 6 + alliedCost, id);
    assert.equal(g.run('variables.finalBattle.battlefieldChaos'), 2 + chaosCost, id);
    assert.equal(g.run('variables.finalBattle.civilianRisk'), 2 + civilianCost, id);
    assertTwoChoices(g, `résultat ${id}`);
  }
});

test('revenir à l’accueil depuis une impasse préserve la sauvegarde et ne crée pas de checkpoint', () => {
  const g = boot();
  choose(g, 'title-new'); choose(g, 'charge-civils'); continueReport(g);
  const saved = g.storage.get('clanDestain.save.v1');
  const checkpointCount = g.run('gameState.checkpoints.length');
  g.run('Object.values(characters).forEach(c => c.state = "down"); gameState.roomId = "mill_approach"');
  choose(g, 'navigation-home');
  assert.equal(g.run('gameState.roomId'), 'title_screen');
  assert.equal(g.storage.get('clanDestain.save.v1'), saved);
  assert.equal(g.run('gameState.checkpoints.length'), checkpointCount);
});

test('le parser et moveTo ne contournent ni le jet animé ni le compte rendu', () => {
  const g = boot(null, JSON.stringify({ diceAnimation: true }));
  choose(g, 'title-new');
  g.run('gameState.roomId = "cult_trail"; prepareCurrentRoom()');
  choose(g, 'attaquer-arriere-garde');
  assert.equal(g.run('getD20AnimationPending()'), true);
  const state = '({room:gameState.roomId,report:gameState.lastReport,checkpoints:gameState.checkpoints,rolls:gameState.rollHistory,characters,flags,variables})';
  for (const phase of ['animation', 'compte rendu']) {
    const before = g.json(state), calls = g.dice.calls;
    for (const command of ["handleCommand('go nord')", "handleCommand('n')", "handleCommand('go dragon')", "moveTo('nord')"]) {
      g.run(command);
      assert.deepEqual(g.json(state), before, `${phase}, ${command}`);
      assert.equal(g.dice.calls, calls, `${phase}: aucun nouveau tirage`);
    }
    g.run('finishD20Animation()');
  }
});

test('le rituel peut aboutir à une fin sans aucun compagnon encore capable d’agir', () => {
  for (const state of ['down', 'dead']) {
    for (const decisiveActions of [0, 2, 3]) {
      const g = boot();
      g.run(`resetCampaignState(); gameState.roomId = 'ritual_chamber';
        Object.values(characters).forEach(c => c.state = ${JSON.stringify(state)});
        prepareCurrentRoom(); variables.finalBattle.decisiveActions = ${decisiveActions};`);
      assert.equal(g.run('getAvailableOptions(gameState.roomId).some(o => o.id === "ritual-resolve")'), true);
      assertTwoChoices(g, `rituel ${state}, ${decisiveActions} actions`);
      choose(g, 'ritual-resolve');
      assert.equal(g.run('gameState.roomId'), 'campaign_end');
      assert.equal(g.run('flags.actVCompleted && flags.campaignComplete'), true);
      assert.equal(g.dice.calls, 0);
      assertTwoChoices(g, `fin ${state}, ${decisiveActions} actions`);
    }
  }
});
