const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const html = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8');
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
if (scripts.length !== 2) throw new Error('Expected two compiled scripts');
for (const [index, script] of scripts.entries()) {
  const check = spawnSync(process.execPath, ['--input-type=module', '--check'], {
    input: script[1], encoding: 'utf8'
  });
  if (check.status !== 0) throw new Error(`Script ${index}: ${check.stderr}`);
}
console.log('Compiled scripts: syntax PASS');
