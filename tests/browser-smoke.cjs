// Outil de validation uniquement : aucune dépendance ajoutée au jeu.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const { chromium } = require('playwright');
const html = fs.readFileSync(require('node:path').join(__dirname, '../index.html'));

(async () => {
  const server = http.createServer((req, res) => {
    if (req.url === '/favicon.ico') { res.writeHead(204); return res.end(); }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(html);
  });
  let browser;
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const executablePath = process.env.DD5_CHROMIUM_PATH;
    browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const external = [];
    page.on('request', r => { if (!r.url().startsWith('http://127.0.0.1:')) external.push(r.url()); });
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    const input = page.locator('#commandInput');
    async function command(value) { await input.fill(value); await input.press('Enter'); }
    async function choose(id) {
      const index = await page.evaluate(id => getAvailableOptions(gameState.roomId).findIndex(o => o.id === id), id);
      assert.ok(index >= 0, `Option indisponible: ${id}`);
      await command(`choose ${index + 1}`);
    }
    await choose('title-new');
    await command('go dragon');
    assert.equal(await page.evaluate(() => gameState.roomId), 'hill_overlook');
    assert.match(await page.locator('#context').innerText(), /GAME OVER/);
    await choose('charge-civils'); await command('undo');
    assert.equal(await page.evaluate(() => gameState.roomId), 'hill_overlook');
    for (const id of ['charge-civils', 'swift-diplomatie', 'mission-sanctuaire', 'sanctuaire-assaut',
      'mission-moulin', 'moulin-assaut', 'vers-duel', 'duel-campagne', 'fin-acte', 'depart-camp']) await choose(id);
    for (const direction of ['n', 'n', 'n', 'n', 'e']) await command(direction);
    await choose('voler-oeufs'); await command('n'); await command('e');
    for (const id of ['revanche-drekthar', 'act2-end', 'caravane-marchands', 'caravane-arrivee',
      'naerytar-entree', 'naerytar-portal', 'portal-traverse', 'lodge-reunion', 'skyreach-reunion',
      'skyreach-return', 'act3-end', 'act5-muster', 'council-open-session', 'defense-honnete', 'strategy-metallic']) await choose(id);
    if (await page.evaluate(() => gameState.roomId === 'metallic_dragon_audience')) await choose('dragons-offer-alliance');
    for (const id of ['resolve-council-session', 'simulate-finale', 'finale-plan-room', 'plan-sabotage', 'sabotage-identify',
      'sabotage-stealth', 'sabotage-arcana', 'ritual-rally', 'ritual-rally', 'ritual-rally', 'ritual-resolve']) await choose(id);
    assert.equal(await page.evaluate(() => flags.campaignComplete && flags.actVCompleted), true);
    await command('save');
    const before = await page.evaluate(() => JSON.stringify({ characters, flags, variables, acts, room: gameState.roomId }));
    await page.reload();
    assert.equal(await page.evaluate(() => JSON.stringify({ characters, flags, variables, acts, room: gameState.roomId })), before);
    await command('help'); await input.press('ArrowUp'); assert.equal(await input.inputValue(), 'help');
    await input.fill('inv'); await input.press('Tab'); assert.match(await input.inputValue(), /^inventory/);
    await input.press('Escape'); assert.equal(await input.inputValue(), '');
    assert.equal(await page.evaluate(() => ctx.imageSmoothingEnabled), false);
    assert.equal(await page.evaluate(() => {
      gameState.tick = 4; render(); const first = canvas.toDataURL(); render(); return first === canvas.toDataURL();
    }), true);
    const positions = await page.evaluate(() => ['gameCanvas', 'context', 'commandInput'].map(id => document.getElementById(id).getBoundingClientRect().top));
    assert.ok(positions[0] < positions[1] && positions[1] < positions[2]);
    assert.deepEqual(errors, []);
    assert.deepEqual(external, []);
    await page.screenshot({ path: '/tmp/dd5-browser-smoke.png', fullPage: true });
    console.log('Chromium : cinq actes, finale, rollback, sauvegarde/rechargement, clavier et rendu OK ; aucune erreur JS ni requête externe.');
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
