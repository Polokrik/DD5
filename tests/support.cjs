const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const source = html.match(/<script>([\s\S]*?)<\/script>/)[1];

// Le hasard n'est fixé que dans ce banc de test. L'application conserve crypto.
function boot(saved = null, preferences = null, search = '') {
  const storage = new Map(saved ? [['clanDestain.save.v1', saved]] : []);
  storage.set('clanDestain.preferences.v1', preferences ?? JSON.stringify({ diceAnimation: false }));
  const dice = { queue: [], fallback: 20, calls: 0 };
  const crypto = { getRandomValues(array) {
    dice.calls++;
    const natural = dice.queue.length ? dice.queue.shift() : dice.fallback;
    assert.ok(Number.isInteger(natural) && natural >= 1 && natural <= 20, 'D20 du scénario de test');
    array[0] = natural - 1;
    return array;
  } };
  function element() {
    const classes = new Set();
    return { children: [], dataset: {}, style: {}, value: '',
      classList: { add: c => classes.add(c), remove: c => classes.delete(c),
        contains: c => classes.has(c), toggle(c, enabled) {
          if (enabled ?? !classes.has(c)) classes.add(c); else classes.delete(c);
        } },
      appendChild(child) { this.children.push(child); }, append(...children) { this.children.push(...children); },
      replaceChildren(...children) { this.children = children; }, addEventListener() {}, setAttribute() {},
      getContext: () => ({ fillRect() {}, fillText() {}, drawImage() {}, clearRect() {} }),
      toDataURL: () => 'data:image/png;base64,', showModal() { this.open = true; }, close() { this.open = false; }
    };
  }
  const elements = Object.fromEntries([...html.matchAll(/id="([^"]+)"/g)].map(([, id]) => [id, element()]));
  const lines = [];
  elements.eventLog.appendChild = line => lines.push(line.textContent);
  const sandbox = vm.createContext({ URLSearchParams, structuredClone, console, crypto,
    window: { crypto, location: { search } }, navigator: {},
    document: { getElementById: id => elements[id], createElement: element, querySelectorAll: () => [], addEventListener() {} },
    localStorage: { getItem: k => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, v), removeItem: k => storage.delete(k) },
    requestAnimationFrame() {}
  });
  new vm.Script(source, { filename: 'index.html' }).runInContext(sandbox);
  return { run: code => vm.runInContext(code, sandbox),
    json: code => JSON.parse(vm.runInContext(`JSON.stringify(${code})`, sandbox)),
    setRolls(...values) { dice.queue.push(...values); }, dice, lines, storage, elements };
}

function settle(g) {
  if (g.run('typeof getD20AnimationPending === "function" && getD20AnimationPending()')) g.run('finishD20Animation()');
}

function continueReport(g) {
  settle(g);
  if (g.run('Boolean(gameState.lastReport)')) {
    const shortcut = g.run('getPresentedChoices().find(c => c.continuation)?.shortcut');
    assert.ok(shortcut, 'Le résultat doit proposer de poursuivre.');
    g.run(`executePresentedChoice(${shortcut})`);
  }
}

function choose(g, id) {
  continueReport(g);
  if (id.startsWith('@')) { g.run(`moveTo(${JSON.stringify(id.slice(1))})`); return; }
  const index = g.run(`getAvailableOptions(gameState.roomId).findIndex(o => o.id === ${JSON.stringify(id)})`);
  assert.ok(index >= 0, `${id} absent dans ${g.run('gameState.roomId')}`);
  g.run(`chooseOption('${index + 1}')`);
}

module.exports = { boot, choose, continueReport, settle, html, source };
