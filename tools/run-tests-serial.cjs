// Each test suite runs in a separate Node process to isolate game state.
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const suites = fs.readdirSync(path.join(root, 'tests')).filter(filename => filename.endsWith('.test.mjs')).sort();
let passed = 0;
for (const filename of suites) {
  const result = spawnSync(process.execPath, ['--test', path.join(root, 'tests', filename)], {
    cwd: root, encoding: 'utf8', timeout: 300000, maxBuffer: 8 * 1024 * 1024,
    env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' }
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error || result.status !== 0) {
    console.error('TEST GATE FAILED:', filename, result.error?.message || `exit=${result.status}, signal=${result.signal}`);
    process.exit(1);
  }
  const summary = result.stdout.match(/^(?:#|ℹ)\s*pass\s+(\d+)\s*$/m);
  const failures = result.stdout.match(/^(?:#|ℹ)\s*fail\s+(\d+)\s*$/m);
  if (!summary || !failures || Number(failures[1]) !== 0 || Number(summary[1]) < 1) {
    console.error('TEST GATE FAILED: malformed or incomplete test summary:', filename);
    process.exit(1);
  }
  passed += Number(summary[1]);
}
console.log(`TEST GATE PASS: ${suites.length} suites, ${passed} cases`);
