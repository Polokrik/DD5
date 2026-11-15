const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { build } = require('../tools/build.cjs');

test('index.html est exactement l’assemblage de src/ (lancer « node tools/build.cjs » après toute modification)', () => {
  const { html } = build();
  const current = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  assert.ok(current === html, 'index.html n’est pas à jour : lancez « node tools/build.cjs ».');
});

test('les sources sont nommées dans l’ordre d’assemblage et chaque fichier est non vide', () => {
  const dir = path.join(__dirname, '../src/scripts');
  const names = fs.readdirSync(dir).filter(name => name.endsWith('.js'));
  assert.deepEqual(names, [...names].sort());
  names.forEach(name => assert.ok(fs.readFileSync(path.join(dir, name), 'utf8').trim().length > 0, name));
  assert.ok(names[0].startsWith('00-') && names.at(-1).startsWith('99-'), 'constantes d’abord, démarrage en dernier');
});

test('le jeu assemblé reste autonome : aucune ressource externe', () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  assert.ok(!/<script[^>]+src=|<link[^>]+href=|@import|https?:\/\/[^"'\s]*\.(js|css|png|jpg|woff2?)/i.test(html));
});
