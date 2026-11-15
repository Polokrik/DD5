// Lance tous les tests Node, sur Windows comme ailleurs (évite les motifs « * » du shell).
//   node tools/tests.cjs
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const dir = path.resolve(__dirname, '../tests');
const files = fs.readdirSync(dir).filter(name => name.endsWith('.test.cjs')).map(name => path.join(dir, name));
process.exit(spawnSync(process.execPath, ['--test', ...files], { stdio: 'inherit' }).status ?? 1);
