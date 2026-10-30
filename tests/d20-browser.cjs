// QA navigateur du D20 : vrai tirage instrumenté, affichage, reprise et mobile.
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
    browser = await chromium.launch({ headless: true, ...(process.env.DD5_CHROMIUM_PATH ? { executablePath: process.env.DD5_CHROMIUM_PATH } : {}) });
    const url = `http://127.0.0.1:${server.address().port}`;
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
    const errors = [], external = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:')) external.push(request.url()); });
    await page.addInitScript(() => {
      const random = window.crypto.getRandomValues.bind(window.crypto);
      window.__entropyRequests = 0;
      window.__diceMode = 'fixed20'; // Préparer le passage à la famille, puis utiliser le vrai générateur.
      window.crypto.getRandomValues = array => {
        window.__entropyRequests++;
        if (window.__diceMode === 'fixed20') { array.fill(19); return array; }
        return random(array);
      };
      const requestFrame = window.requestAnimationFrame.bind(window);
      window.__freezeFrames = false;
      window.requestAnimationFrame = callback => requestFrame(time => { if (!window.__freezeFrames) callback(time); });
    });
    await page.goto(url);
    await page.locator('[data-choice="title-new"]').click();
    await page.locator('[data-choice="charge-civils"]').click();
    await page.evaluate(() => finishD20Animation());
    await page.locator('[data-choice="report-continue"]').click();
    await page.evaluate(() => { window.__diceMode = 'native'; window.__freezeFrames = true; });
    const initialEntropy = await page.evaluate(() => window.__entropyRequests);
    await page.locator('[data-choice="swift-diplomatie"]').click();
    assert.equal(await page.evaluate(() => getD20AnimationPending()), true);
    assert.equal(await page.locator('#choiceList button:enabled').count(), 2);
    assert.equal(await page.locator('[data-choice="dice-skip"]').isVisible(), true);
    assert.equal(await page.locator('#reportChanges').isHidden(), true);
    assert.equal(await page.locator('#actionScene').isHidden(), true);
    assert.match(await page.locator('#sceneNarrative').innerText(), /tente cette épreuve/);
    const result = await page.evaluate(() => gameState.lastReport.check);
    assert.ok(Number.isInteger(result.natural) && result.natural >= 1 && result.natural <= 20);
    assert.equal(result.total, result.natural + result.bonus);
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem(SAVE_KEY)).gameState.lastReport.check), result);
    const sampledEntropy = await page.evaluate(() => window.__entropyRequests);
    assert.ok(sampledEntropy > initialEntropy, 'Le clic a utilisé le vrai générateur cryptographique.');
    await page.evaluate(() => { for (let i = 0; i < 30; i++) render(); });
    assert.equal(await page.evaluate(() => window.__entropyRequests), sampledEntropy, 'Les rendus ne retirent aucun dé.');
    await page.screenshot({ path: '/tmp/dd5-v3-d20-rolling.png', fullPage: true });
    await page.locator('[data-choice="dice-skip"]').click();
    assert.equal(await page.evaluate(() => getD20AnimationPending()), false);
    assert.equal(await page.locator('#d20Value').innerText(), String(result.natural));
    assert.match(await page.locator('#checkActor').innerText(), /Bjolnir.*niveau 1/);
    assert.match(await page.locator('#checkBreakdown').innerText(), /D20.*CHA.*maîtrise.*DD/);
    assert.equal(await page.locator('#choiceList button:enabled').count(), 2);
    assert.equal(await page.evaluate(() => window.__entropyRequests), sampledEntropy);
    await page.locator('#replayActionButton').click();
    assert.equal(await page.evaluate(() => window.__entropyRequests), sampledEntropy, 'Revoir ne relance pas le dé.');
    await page.screenshot({ path: '/tmp/dd5-v3-d20-result.png', fullPage: true });

    await page.locator('#companyButton').click();
    const stats = page.locator('#companyDetails .character-stats');
    assert.match(await stats.locator('.stats-summary').innerText(), /Niveau de la scène 1.*Maîtrise \+2/);
    assert.match(await stats.locator('.stats-reference').first().innerText(), /Référence PDF: niveau 10/);
    assert.match(await stats.locator('.stats-table').first().locator('tbody tr').first().innerText(), /FOR\s+17 \(\+3\)\s+19 \(\+4\)/);
    assert.equal(await stats.locator('.stats-table').first().locator('tbody tr').count(), 6);
    await page.screenshot({ path: '/tmp/dd5-v3-statistics.png', fullPage: true });
    const details = stats.locator('details');
    assert.equal(await details.evaluate(element => element.open), false);
    await details.locator('summary').click();
    assert.equal(await details.locator('.stats-table').nth(0).locator('tbody tr').count(), 18);
    assert.equal(await details.locator('.stats-table').nth(1).locator('tbody tr').count(), 6);
    assert.match(await details.locator('.stats-table').nth(0).locator('tbody tr').filter({ hasText: /^Persuasion/ }).innerText(), /Persuasion\s+\+5\s+\+7/);
    assert.match(await details.locator('.stats-table').nth(1).locator('tbody tr').filter({ hasText: /^FOR/ }).innerText(), /FOR\s+\+3\s+\+7/);
    assert.match(await details.innerText(), /Attaques imprimées sur la fiche.*Marteau de frappe précise.*\+9/s);
    await details.locator('caption').first().scrollIntoViewIfNeeded();
    await page.screenshot({ path: '/tmp/dd5-v3-statistics-details.png', fullPage: true });
    await page.locator('[data-close="companyDialog"]').click();

    await page.reload();
    assert.deepEqual(await page.evaluate(() => gameState.lastReport.check), result);
    assert.equal(await page.evaluate(() => window.__entropyRequests), 0, 'La reprise ne tire aucun dé.');
    assert.equal(await page.evaluate(() => getD20AnimationPending()), false);
    assert.equal(await page.locator('#d20Value').innerText(), String(result.natural));
    await page.locator('#ambianceButton').click();
    await page.locator('#diceSetting').uncheck();
    await page.locator('[data-close="ambianceDialog"]').click();
    await page.locator('[data-choice="report-back"]').click();
    await page.locator('[data-choice="swift-diplomatie"]').click();
    assert.equal(await page.evaluate(() => getD20AnimationPending()), false);
    assert.equal(await page.locator('[data-choice="dice-skip"]').count(), 0);
    assert.equal(await page.locator('#d20Value').innerText(), '20');
    const savedEntropy = await page.evaluate(() => window.__entropyRequests);
    assert.equal(savedEntropy, 1);
    await page.reload();
    assert.equal(await page.evaluate(() => uiState.preferences.diceAnimation), false);
    assert.equal(await page.evaluate(() => window.__entropyRequests), 0);

    const mobile = await browser.newPage({ viewport: { width: 320, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    mobile.on('pageerror', error => errors.push(error.message));
    await mobile.goto(url);
    await mobile.locator('[data-choice="title-new"]').click();
    await mobile.locator('[data-choice="charge-civils"]').click();
    assert.equal(await mobile.evaluate(() => uiState.reducedMotion), true);
    assert.equal(await mobile.evaluate(() => getD20AnimationPending()), false);
    assert.equal(await mobile.locator('#checkPanel').isVisible(), true);
    assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await mobile.screenshot({ path: '/tmp/dd5-v3-d20-mobile.png', fullPage: true });
    await mobile.locator('#companyButton').click();
    for (const id of ['bjolnir', 'drekthar', 'ellyjobell', 'darrin', 'kairon', 'malar', 'sislay']) {
      await mobile.locator(`#companyRoster [data-character="${id}"]`).click();
      const profile = mobile.locator('#companyDetails .character-stats');
      assert.equal(await profile.locator('.stats-table').first().locator('tbody tr').count(), 6);
      await profile.locator('details summary').click();
      assert.equal(await profile.locator('details .stats-table').nth(0).locator('tbody tr').count(), 18);
      assert.equal(await profile.locator('details .stats-table').nth(1).locator('tbody tr').count(), 6);
      assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Statistiques de ${id} hors écran.`);
      assert.equal(await profile.locator('.stats-table').evaluateAll(tables => tables.every(table => {
        const box = table.getBoundingClientRect(); return box.left >= 0 && box.right <= innerWidth;
      })), true, `Tableaux de ${id} hors écran.`);
    }
    await mobile.locator('#companyDetails details caption').first().scrollIntoViewIfNeeded();
    await mobile.screenshot({ path: '/tmp/dd5-v3-statistics-mobile.png', fullPage: true });
    assert.deepEqual(errors, []);
    assert.deepEqual(external, []);
    console.log('D20 : vrai tirage, deux choix pendant l’animation, passage immédiat, rendu/replay/reprise sans relance et animation désactivable OK.');
    console.log('Fiches : projection niveau 1 et référence PDF distinctes, sept personnages, 6 caractéristiques, 18 compétences, 6 sauvegardes et références des attaques accessibles à 320 px OK.');
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
