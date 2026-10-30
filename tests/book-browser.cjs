// Parcours du livre enrichi : observations, mémoire des choix et décors.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const { chromium } = require('playwright');
const journey = require('./campaign-path.cjs');
const html = fs.readFileSync(require('node:path').join(__dirname, '../index.html'));

(async () => {
  const server = http.createServer((req, res) => {
    if (req.url === '/favicon.ico') { res.writeHead(204); return res.end(); }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(html);
  });
  let browser;
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    browser = await chromium.launch({ headless: true, ...(process.env.DD5_CHROMIUM_PATH ? { executablePath: process.env.DD5_CHROMIUM_PATH } : {}) });
    const url = `http://127.0.0.1:${server.address().port}`;
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
    const errors = [], external = [], observedScenes = new Set(), artwork = new Set();
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:')) external.push(request.url()); });
    await page.addInitScript(() => {
      localStorage.setItem('clanDestain.preferences.v1', JSON.stringify({ diceAnimation: false }));
      window.__entropyRequests = 0;
      window.crypto.getRandomValues = array => { window.__entropyRequests++; array.fill(19); return array; };
    });
    await page.goto(url + "/?whatif=1");

    async function continueReport() {
      await page.evaluate(() => finishD20Animation());
      const next = page.locator('[data-choice="report-continue"]');
      if (await next.count()) await next.click();
    }

    async function inspectScene() {
      const roomId = await page.evaluate(() => gameState.roomId);
      const observations = await page.evaluate(() => getSceneObservations());
      if (!observations.length) return;
      observedScenes.add(roomId);
      assert.ok(observations.length >= 2, `${roomId}: deux observations`);
      const panel = page.locator('#observationPanel');
      assert.equal(await panel.isVisible(), true, roomId);
      assert.equal(await panel.locator('details.scene-observation').count(), observations.length, roomId);
      const before = await page.evaluate(() => JSON.stringify({characters, flags, variables, acts, checkpoints:gameState.checkpoints, roomId:gameState.roomId, rolls:gameState.rollHistory}));
      const entropy = await page.evaluate(() => window.__entropyRequests);
      const detail = panel.locator('details.scene-observation').first();
      await detail.locator('summary').click();
      await page.waitForFunction(({ roomId, id }) => gameState.observations.includes(`${roomId}:${id}`), { roomId, id: observations[0].id });
      assert.equal(await detail.getAttribute('data-read'), 'true');
      assert.ok((await detail.locator('p').first().innerText()).length > 20, roomId);
      assert.equal(await page.evaluate(() => window.__entropyRequests), entropy, 'Observer ne lance aucun dé.');
      assert.equal(await page.evaluate(() => JSON.stringify({characters, flags, variables, acts, checkpoints:gameState.checkpoints, roomId:gameState.roomId, rolls:gameState.rollHistory})), before, 'Observer ne consomme aucune ressource.');
      const art = await page.locator('#gameCanvas').getAttribute('data-scene');
      artwork.add(art);
      const canvasChecks = await page.evaluate(() => {
        gameState.tick = 12; render();
        const first = canvas.toDataURL(); render();
        const rgba = ctx.getImageData(0, 0, 320, 200).data, colors = new Set();
        for (let i = 0; i < rgba.length; i += 4) colors.add(`${rgba[i]},${rgba[i+1]},${rgba[i+2]}`);
        return { stable: first === canvas.toDataURL(), count: colors.size, smoothing: ctx.imageSmoothingEnabled };
      });
      assert.equal(canvasChecks.stable, true, `${roomId}: rendu stable`);
      assert.equal(canvasChecks.smoothing, false, `${roomId}: pixel art`);
      assert.ok(canvasChecks.count <= 48, `${roomId}: ${canvasChecks.count} couleurs`);
      if (['cult_camp', 'carnath_roadhouse', 'skyreach_chronicle', 'iceberg_rebellion', 'metallic_dragon_audience'].includes(roomId)) {
        await page.screenshot({ path: `/tmp/dd5-v4-${roomId}.png`, fullPage: true });
      }
    }

    for (const id of [...journey.opening, ...journey.camp, ...journey.north, ...journey.council]) {
      await continueReport();
      await inspectScene();
      const selector = id.startsWith('@') ? `[data-direction="${id.slice(1)}"]` : `[data-choice="${id}"]`;
      assert.equal(await page.locator(selector).count(), 1, `${id} absent dans ${await page.evaluate(() => gameState.roomId)}`);
      await page.locator(selector).click();
      if (await page.evaluate(() => Boolean(gameState.lastReport))) assert.equal(await page.locator('#observationPanel').isHidden(), true, 'Le compte rendu garde la priorité.');
    }
    assert.ok(observedScenes.size >= 20, `${observedScenes.size} scènes observées`);
    assert.ok(artwork.size >= 10, `${artwork.size} ambiances distinctes`);
    const seen = await page.evaluate(() => gameState.observations);
    assert.ok(seen.length >= 20);
    await page.reload();
    assert.deepEqual(await page.evaluate(() => gameState.observations), seen);
    assert.equal(await page.evaluate(() => window.__entropyRequests), 0, 'La reprise ne retire aucun dé.');

    const mobile = await browser.newPage({ viewport: { width: 320, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    mobile.on('pageerror', error => errors.push(error.message));
    await mobile.addInitScript(() => localStorage.setItem('clanDestain.preferences.v1', JSON.stringify({ diceAnimation: false })));
    await mobile.goto(url);
    await mobile.evaluate(() => { resetCampaignState(); gameState.roomId = 'carnath_roadhouse'; prepareCurrentRoom(); refreshInterface(); });
    await mobile.locator('#observationPanel details summary').first().click();
    await mobile.waitForFunction(() => document.querySelector('#observationPanel details')?.dataset.read === 'true');
    assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.equal(await mobile.locator('#observationPanel details').first().getAttribute('data-read'), 'true');
    await mobile.screenshot({ path: '/tmp/dd5-v4-book-mobile.png', fullPage: true });
    assert.deepEqual(errors, []);
    assert.deepEqual(external, []);
    console.log(`Livre : ${observedScenes.size} scènes observées au clic, ${artwork.size} décors distincts, progression et dés inchangés par la lecture, sauvegarde/reprise et mobile 320 px OK.`);
    console.log('Décors : rendu stable à tick fixe, palette ≤48 couleurs, pixel art sans lissage, aucune erreur JS ni requête externe.');
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
