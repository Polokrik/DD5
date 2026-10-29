const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync(require('node:path').join(__dirname, '../index.html'), 'utf8');
const source = html.match(/<script>([\s\S]*?)<\/script>/)[1];

function boot(saved = null) {
  const storage = new Map(saved ? [['clanDestain.save.v1', saved]] : []);
  function element() {
    return { children: [], dataset: {}, value: '', classList: { toggle() {} },
      appendChild(child) { this.children.push(child); }, append(...children) { this.children.push(...children); },
      replaceChildren(...children) { this.children = children; }, addEventListener() {}, setAttribute() {},
      getContext: () => ({ fillRect() {}, fillText() {}, drawImage() {} }), toDataURL: () => 'data:image/png;base64,',
      showModal() { this.open = true; }, close() { this.open = false; }
    };
  }
  const elements = Object.fromEntries([...html.matchAll(/id="([^"]+)"/g)].map(([, id]) => [id, element()]));
  const lines = [];
  elements.eventLog.appendChild = line => lines.push(line.textContent);
  const sandbox = vm.createContext({
    URLSearchParams, structuredClone, console,
    window: { location: { search: '' } }, navigator: {},
    document: { getElementById: id => elements[id], createElement: element, querySelectorAll: () => [], addEventListener() {} },
    localStorage: { getItem: k => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, v), removeItem: k => storage.delete(k) },
    requestAnimationFrame() {}
  });
  new vm.Script(source, { filename: 'index.html' }).runInContext(sandbox);
  return {
    run: code => vm.runInContext(code, sandbox),
    json: code => JSON.parse(vm.runInContext(`JSON.stringify(${code})`, sandbox)),
    lines, storage
  };
}

test('syntaxe du script et démarrage réel du moteur', () => {
  const game = boot();
  assert.equal(game.run('gameState.roomId'), 'title_screen');
  game.run('chooseOption("1")');
  assert.equal(game.run('gameState.roomId'), 'hill_overlook');
});

test('toutes les salles et références des options sont valides', () => {
  const g = boot();
  const rooms = g.json('rooms');
  for (const [id, room] of Object.entries(rooms)) {
    assert.equal(room.id, id);
    assert.ok(Array.isArray(room.options), id);
    for (const target of Object.values(room.exits)) assert.ok(rooms[target], `${id} -> ${target}`);
    for (const option of room.options) {
      if (option.characterId) assert.ok(g.run(`Boolean(characters[${JSON.stringify(option.characterId)}])`), option.id);
      for (const branch of ['onSuccess', 'onFailure', 'onFailurePost']) {
        if (option[branch]?.gotoRoom) assert.ok(rooms[option[branch].gotoRoom], `${option.id} -> ${option[branch].gotoRoom}`);
      }
    }
  }
});

test('chaque option et chaque salle peuvent être exécutées (succès et échec)', () => {
  const base = boot();
  for (const [id, room] of Object.entries(base.json('rooms'))) {
    for (const success of [true, false]) {
      for (let i = 0; i < room.options.length; i++) {
        const g = boot();
        assert.doesNotThrow(() => g.run(`
          resetCampaignState(); gameState.roomId = ${JSON.stringify(id)};
          variables.moraleGroupe = ${success ? 5 : -5}; variables.chaos = ${success ? -5 : 6};
          prepareCurrentRoom(); describeCurrentRoom(); createCheckpoint('test');
          applyOptionEffects(rooms[gameState.roomId].options[${i}]); describeCurrentRoom(); render();
        `), `${id}/${room.options[i].id}/${success ? 'succès' : 'échec'}`);
      }
    }
  }
});

test('rollback intégral des états, inventaire, actes et événements du groupe', () => {
  const g = boot();
  g.run('resetCampaignState(); createCheckpoint("avant décision")');
  const before = g.json('({characters, flags, variables, acts, roomId: gameState.roomId, inventory: gameState.inventory, timeline: gameState.timelineApplied})');
  g.run(`characters.malar.state = 'dead'; flags.eggsDestroyed = true; variables.factionTrust.harpers = 8;
    acts.current = 'ACT_V'; gameState.inventory.push('œuf'); gameState.timelineApplied.push('test');
    triggerGameOver('silly', 'test')`);
  assert.deepEqual(g.json('({characters, flags, variables, acts, roomId: gameState.roomId, inventory: gameState.inventory, timeline: gameState.timelineApplied})'), before);
});

test('sauvegarde et reprise dans une nouvelle instance', () => {
  const g = boot();
  g.run('resetCampaignState(); chooseOption("1"); saveGame()');
  const loaded = boot(g.storage.get('clanDestain.save.v1'));
  for (const value of ['characters', 'flags', 'variables', 'acts', 'gameState.inventory', 'gameState.roomId', 'gameState.checkpoints']) {
    assert.deepEqual(loaded.json(value), g.json(value), value);
  }
});

test('personnages indisponibles exclus et morts permanentes', () => {
  const g = boot();
  for (const state of ['dead', 'captured', 'absent', 'down']) {
    g.run(`characters.bjolnir.state = '${state}'`);
    assert.equal(g.run('getAvailableOptions("hill_overlook").some(o => o.characterId === "bjolnir")'), false);
  }
  g.run('characters.kairon.state = "dead"; fireRosterTimelineTrigger("LODGE_REUNION")');
  assert.equal(g.run('characters.kairon.state'), 'dead');
});

test('une sauvegarde inconnue ou corrompue ne détruit pas la partie', () => {
  const g = boot();
  assert.equal(g.run('importSaveFromString("{bad}")'), false);
  g.run('saveGame()');
  const previous = g.storage.get('clanDestain.save.v1');
  const invalid = JSON.parse(previous);
  invalid.gameState.roomId = 'missing';
  assert.equal(g.run(`importSaveFromString(${JSON.stringify(JSON.stringify(invalid))})`), false);
  assert.equal(g.storage.get('clanDestain.save.v1'), previous);
});

test('rendu déterministe, aucune dépendance externe, saisie séparée', () => {
  assert.doesNotMatch(source, /Math\.random\s*\(/);
  assert.doesNotMatch(html, /<script[^>]+src=|<link[^>]+href=/);
  assert.match(source, /imageSmoothingEnabled = false/);
  assert.ok(html.indexOf('id="gameCanvas"') < html.indexOf('id="context"'));
  assert.ok(html.indexOf('id="context"') < html.indexOf('id="commandInput"'));
});

function choose(g, id) {
  const index = g.run(`getAvailableOptions(gameState.roomId).findIndex(o => o.id === ${JSON.stringify(id)})`);
  assert.ok(index >= 0, `${id} absent dans ${g.run('gameState.roomId')}`);
  g.run(`chooseOption('${index + 1}')`);
}

function journeyToFinale() {
  const g = boot();
  for (const id of ['title-new', 'charge-civils', 'swift-diplomatie', 'mission-sanctuaire', 'sanctuaire-assaut',
    'mission-moulin', 'moulin-assaut', 'vers-duel', 'duel-campagne', 'fin-acte', 'depart-camp']) choose(g, id);
  assert.equal(g.run('acts.current'), 'ACT_II');
  assert.equal(g.run('characters.malar.state'), 'absent');
  assert.equal(g.run('characters.kairon.state'), 'absent');
  g.run('handleCommand("n"); handleCommand("n"); handleCommand("n"); handleCommand("n"); handleCommand("e")');
  assert.equal(g.run('gameState.roomId'), 'egg_chamber');
  choose(g, 'voler-oeufs');
  g.run('handleCommand("n"); handleCommand("e")');
  choose(g, 'revanche-drekthar');
  choose(g, 'act2-end');
  assert.equal(g.run('acts.current'), 'ACT_III');
  assert.equal(g.run('flags.dragonetsHatched'), true);
  assert.equal(g.run('flags.cyanwrathDead'), true);
  assert.equal(g.run('flags.WHAT_IF_CYANWRATH_DEAD'), false);
  for (const id of ['caravane-marchands', 'caravane-arrivee', 'naerytar-entree', 'naerytar-portal', 'portal-traverse',
    'lodge-reunion', 'skyreach-reunion', 'skyreach-return', 'act3-end', 'act5-muster']) choose(g, id);
  assert.equal(g.run('acts.current'), 'ACT_IV');
  assert.equal(g.run('characters.kairon.state'), 'active');
  assert.equal(g.run('characters.malar.state'), 'active');
  assert.equal(g.run('characters.drekthar.state'), 'absent');
  for (const id of ['council-open-session', 'defense-honnete', 'strategy-metallic']) choose(g, id);
  if (g.run('gameState.roomId') === 'metallic_dragon_audience') choose(g, 'dragons-offer-alliance');
  choose(g, 'resolve-council-session');
  assert.equal(g.run('gameState.roomId'), 'campaign_frontier');
  assert.equal(g.run('acts.unlocked.includes("ACT_V")'), false);
  choose(g, 'simulate-finale');
  assert.equal(g.run('acts.current'), 'ACT_V');
  assert.equal(g.run('flags.actIVCompleted'), true);
  choose(g, 'finale-plan-room');
  return g;
}

test('parcours des cinq actes sans triche, œufs, recrutement et fins des trois plans', () => {
  for (const [plan, route] of [
    ['plan-sabotage', ['sabotage-identify', 'sabotage-stealth', 'sabotage-arcana']],
    ['plan-decapitation', ['decapitation-approach', 'decapitation-strike']],
    ['plan-evacuation', ['evacuation-bjolnir', 'evacuation-save-more']]
  ]) {
    const g = journeyToFinale();
    choose(g, plan);
    for (const id of route) choose(g, id);
    assert.equal(g.run('gameState.roomId'), 'ritual_chamber');
    choose(g, 'ritual-resolve');
    assert.equal(g.run('flags.campaignComplete'), false);
    assert.equal(g.run('gameState.roomId'), 'ritual_chamber');
    for (let i = 0; i < 3; i++) choose(g, 'ritual-rally');
    choose(g, 'ritual-resolve');
    assert.equal(g.run('gameState.roomId'), 'campaign_end');
    assert.equal(g.run('flags.actVCompleted && flags.campaignComplete'), true);
  }
});

test('menu: continuer, effacer et consulter les crédits préservent le stockage attendu', () => {
  const g = boot(); choose(g, 'title-new'); choose(g, 'charge-civils');
  const saved = g.storage.get('clanDestain.save.v1');
  const menu = boot(saved);
  menu.run('gameState.roomId = "title_screen"; configureTitleOptions()');
  choose(menu, 'title-credits');
  assert.equal(menu.storage.get('clanDestain.save.v1'), saved);
  choose(menu, 'credits-back'); choose(menu, 'title-continue');
  assert.equal(menu.run('gameState.roomId'), 'swift_street');
  menu.run('gameState.roomId = "title_screen"; configureTitleOptions()');
  choose(menu, 'title-clear');
  assert.equal(menu.storage.has('clanDestain.save.v1'), false);
});

test('look reste sans effet sur les variables, les actes et les checkpoints', () => {
  const g = journeyToFinale();
  const before = g.json('({flags, variables, acts, checkpoints: gameState.checkpoints})');
  g.run('handleCommand("look"); handleCommand("look")');
  assert.deepEqual(g.json('({flags, variables, acts, checkpoints: gameState.checkpoints})'), before);
});

test('undo revient avant une décision, y compris ses effets différés', () => {
  const g = boot(); choose(g, 'title-new');
  const before = g.json('({flags, variables, room: gameState.roomId, characters})');
  choose(g, 'charge-civils'); g.run('handleCommand("undo")');
  assert.deepEqual(g.json('({flags, variables, room: gameState.roomId, characters})'), before);
});

test('les quatre issues finales et leurs seuils sont distincts et explicitement simulés', () => {
  for (const [progress, strength, special, expected] of [
    [4, 5, false, 'simulated_victory'], [8, 0, false, 'partial_victory'],
    [9, 9, false, 'failure'], [5, 5, true, 'what_if']
  ]) {
    const g = boot();
    g.run(`variables.finalBattle.ritualProgress = ${progress}; variables.finalBattle.alliedStrength = ${strength};
      flags.sabotageSuccess = flags.strongAlliance = flags.metallicAlliance = ${special}; resolveFinalEnding()`);
    assert.equal(g.run('flags.finalBattleEnding'), expected);
  }
});

test('imports: états et checkpoints invalides, objets tronqués ou clés dangereuses refusés sans mutation', () => {
  const g = boot(); choose(g, 'title-new');
  const saved = g.storage.get('clanDestain.save.v1');
  for (const mutate of [
    p => { p.characters.kairon.state = 'zombie'; },
    p => { p.variables.finalBattle = null; },
    p => { p.gameState.checkpoints[0].gameState.roomId = 'missing'; },
    p => { p.gameState.inventory = {}; },
    p => { p.acts.unlocked = ['ACT_X']; },
    p => { delete p.characters.malar; },
    p => { Object.defineProperty(p.flags, '__proto__', { value: {}, enumerable: true }); }
  ]) {
    const invalid = JSON.parse(saved); mutate(invalid);
    assert.equal(g.run(`importSaveFromString(${JSON.stringify(JSON.stringify(invalid))})`), false);
    assert.equal(g.storage.get('clanDestain.save.v1'), saved);
  }
});

test('recrutement idempotent, départs sans mort, rollback et remplacement tardif', () => {
  const g = boot(); choose(g, 'title-new');
  g.run('createCheckpoint("avant recrutement"); fireRosterTimelineTrigger("LODGE_REUNION")');
  assert.equal(g.run('characters.kairon.state'), 'active');
  assert.equal(g.run('characters.drekthar.state'), 'absent');
  const timeline = g.json('gameState.timelineApplied');
  g.run('characters.kairon.state = "injured"; fireRosterTimelineTrigger("LODGE_REUNION")');
  assert.equal(g.run('characters.kairon.state'), 'injured');
  assert.deepEqual(g.json('gameState.timelineApplied'), timeline);
  g.run('rollbackToLastCheckpoint()');
  assert.equal(g.run('characters.kairon.state'), 'absent');
  assert.equal(g.run('characters.drekthar.state'), 'active');
  assert.deepEqual(g.json('gameState.timelineApplied'), []);
});

test('échec définitif et absence de capacités restaurent le dernier checkpoint', () => {
  const g = boot(); choose(g, 'title-new');
  g.run('gameState.roomId = "burning_streets_finale"; createCheckpoint("avant pont")');
  choose(g, 'evacuation-reckless');
  assert.equal(g.run('gameState.roomId'), 'burning_streets_finale');
  assert.ok(g.lines.some(l => l.includes('GAME OVER (definitive)')));
  g.run('gameState.roomId = "hill_overlook"; createCheckpoint("groupe actif"); Object.values(characters).forEach(c => c.state = "captured")');
  choose(g, 'recover-checkpoint');
  assert.equal(g.run('characters.bjolnir.state'), 'active');
});

test('déplacement et décision des œufs: undo et exclusivité', () => {
  const g = boot(); choose(g, 'title-new');
  g.run('gameState.roomId = "cult_trail"; acts.current = "ACT_II"');
  const before = g.json('({variables, room: gameState.roomId})');
  g.run('handleCommand("n"); handleCommand("undo")');
  assert.deepEqual(g.json('({variables, room: gameState.roomId})'), before);
  g.run('gameState.roomId = "egg_chamber"'); choose(g, 'voler-oeufs');
  assert.equal(g.run('getAvailableOptions("egg_chamber").some(o => ["voler-oeufs", "detruire-oeufs", "laisser-oeufs"].includes(o.id))'), false);
});

test('un risque mortel répété peut tuer sans résurrection implicite', () => {
  const g = boot(); choose(g, 'title-new');
  g.run(`variables.moraleGroupe = -5; variables.chaos = 6;
    const lethal = { characterId: 'bjolnir', resolution: { difficulty: 9, risk: 'death', deathType: 'replaceable' } };
    applyOutcome(resolveOutcome(lethal, -9)); applyOutcome(resolveOutcome(lethal, -9));`);
  assert.equal(g.run('characters.bjolnir.state'), 'dead');
  assert.equal(g.run('isSkillAvailable("bjolnir", "leadership")'), false);
  g.run('fireRosterTimelineTrigger("LODGE_REUNION")');
  assert.equal(g.run('characters.bjolnir.state'), 'dead');
  assert.equal(g.run('characters.kairon.state'), 'active');
});

test('référentiel sourcé et documents primaires conservés intégralement', () => {
  const path = require('node:path');
  const crypto = require('node:crypto');
  const root = path.join(__dirname, '..');
  const reference = JSON.parse(fs.readFileSync(path.join(root, 'docs/campaign-reference.json')));
  const inventory = JSON.parse(fs.readFileSync(path.join(root, 'docs/source-inventory.json')));
  assert.equal(reference.characters.length, 7);
  assert.equal(new Set(reference.events.map(e => e.id)).size, reference.events.length);
  for (const e of reference.events) {
    if (e.fact !== null) assert.ok(e.sources.length > 0, e.id);
  }
  assert.equal(reference.events.find(e => e.id === 'tiamat-finale').fact, null);
  for (const file of inventory) {
    assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file.file))).digest('hex'), file.sha256, file.file);
  }
});

test('une action réussie ne permet pas de fabriquer du soutien à l’infini et undo la réactive', () => {
  const g = boot(); choose(g, 'title-new');
  g.run('gameState.roomId = "northern_road"');
  choose(g, 'caravane-marchands');
  assert.equal(g.run('getAvailableOptions("northern_road").some(o => o.id === "caravane-marchands")'), false);
  g.run('undoToCheckpoint()');
  assert.equal(g.run('getAvailableOptions("northern_road").some(o => o.id === "caravane-marchands")'), true);
});

test('les numéros affichés et les commandes choose déclenchent le même choix', () => {
  const g = boot();
  g.run('handleCommand("2")');
  assert.equal(g.run('gameState.roomId'), 'title_screen');
  assert.equal(g.storage.has('clanDestain.save.v1'), false);
  g.run('handleCommand("choose 3")');
  assert.equal(g.run('gameState.roomId'), 'title_screen');
  assert.equal(g.run('uiState.chapter'), 0);
  g.run('handleCommand("1"); handleCommand("choose 1")');
  assert.equal(g.run('gameState.roomId'), 'swift_street');
});

test('la chronique embarquée reste fidèle aux 18 chapitres du document', () => {
  const md = fs.readFileSync(require('node:path').join(__dirname, '../docs/CHRONIQUE_CAMPAGNE.md'), 'utf8');
  const expected = md.split(/^## Chapitre /m).slice(1).map(part => {
    const block = part.split('\n## Notes de rédaction')[0].trim(), line = block.indexOf('\n');
    return { title: block.slice(0, line).trim(), paragraphs: block.slice(line).trim().split(/\n\s*\n/).map(s => s.replace(/\n/g, ' ').replace(/^\*|\*$/g, '')) };
  });
  assert.equal(expected.length, 18);
  assert.deepEqual(boot().json('CHRONICLE_CHAPTERS'), expected);
});
