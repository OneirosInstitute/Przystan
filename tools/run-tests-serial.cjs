// Separate Node processes isolate game state; stream progress during long runs.
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const suites = fs.readdirSync(path.join(root, 'tests')).filter(filename => filename.endsWith('.test.mjs')).sort();
const options = process.argv.slice(2);
if (options.length && (options.length !== 1 || options[0] !== '--install')) throw new Error('Unknown test mode');
const installMode = options[0] === '--install';

function runSuite(filename, timeout) {
  return new Promise(resolve => {
    let stdout = '', error;
    const arguments_ = ['--test'];
    if (installMode && filename === 'e4-population.test.mjs') arguments_.push('--test-name-pattern=legacy twins');
    arguments_.push(path.join(root, 'tests', filename));
    const child = spawn(process.execPath, arguments_, {
      cwd: root, stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' }
    });
    const timer = setTimeout(() => { error = `timeout after ${timeout / 1000}s`; child.kill(); }, timeout);
    child.stdout.on('data', chunk => {
      process.stdout.write(chunk);
      stdout += chunk;
      if (Buffer.byteLength(stdout) > 8 * 1024 * 1024 && !error) { error = 'output exceeds 8 MiB'; child.kill(); }
    });
    child.stderr.on('data', chunk => process.stderr.write(chunk));
    child.on('error', failure => { error = failure.message; });
    child.on('close', (status, signal) => { clearTimeout(timer); resolve({ stdout, error, status, signal }); });
  });
}

async function main() {
  let passed = 0;
  for (const filename of suites) {
    const timeout = filename === 'e4-population.test.mjs' ? 1800000 : filename === 'ai-specialties.test.mjs' ? 1200000 : 300000;
    console.log(`TEST SUITE: ${filename}`);
    const result = await runSuite(filename, timeout);
    if (result.error || result.status !== 0) {
      throw new Error(`${filename}: ${result.error || `exit=${result.status}, signal=${result.signal}`}`);
    }
    const summary = result.stdout.match(/^(?:#|ℹ)\s*pass\s+(\d+)\s*$/m);
    const failures = result.stdout.match(/^(?:#|ℹ)\s*fail\s+(\d+)\s*$/m);
    if (!summary || !failures || Number(failures[1]) !== 0 || Number(summary[1]) < 1) {
      throw new Error(`malformed or incomplete test summary: ${filename}`);
    }
    passed += Number(summary[1]);
  }
  console.log(`TEST GATE PASS: ${suites.length} suites, ${passed} cases`);
  if (installMode) console.log('INSTALL MODE: 2 extended 1500-day generation scenarios are release gates; see docs/weryfikacja5/results.json.');
}
main().catch(error => { console.error('TEST GATE FAILED:', error.message); process.exitCode = 1; });
