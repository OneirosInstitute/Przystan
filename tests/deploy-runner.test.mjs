import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {parseOptions,selectWorkers,runTests,passedCases}=require('../tools/run-tests-serial.cjs');
const command=promisify(execFile),capacity={cpus:4,totalBytes:8*2**30,freeBytes:4*2**30};
const quiet={stdout:()=>{},stderr:()=>{}};
async function fixture(files){
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'przystan-runner-'));
 await fs.mkdir(path.join(root,'tests'));await fs.mkdir(path.join(root,'tools'));
 await fs.copyFile(new URL('../tools/run-tests-serial.cjs',import.meta.url),path.join(root,'tools/run-tests-serial.cjs'));
 for(const [filename,body]of Object.entries(files))await fs.writeFile(path.join(root,'tests',filename),body);
 return root;
}
const remove=root=>fs.rm(root,{recursive:true,force:true});

test('deployment runner validates options, resource limits and complete successful reports',()=>{
 assert.deepEqual(parseOptions(['--install','--workers=1']),{installMode:true,requestedWorkers:1});
 for(const arguments_ of [['--wat'],['--install','--install'],['--install','--workers=9'],['--workers=2'],['--install','--workers=1','--workers=2']])assert.throws(()=>parseOptions(arguments_));
 assert.equal(selectWorkers({installMode:true},capacity),process.platform==='win32'?1:2);
 assert.equal(selectWorkers({installMode:false},capacity),1);
 assert.equal(selectWorkers({installMode:true,requestedWorkers:1},capacity),1);
 for(const constrained of [{cpus:1},{freeBytes:200*2**20},{totalBytes:2*2**30}])assert.equal(selectWorkers({installMode:true},{...capacity,...constrained}),1);
 assert.equal(passedCases('ok',{status:0,stdout:'# pass 3\n# fail 0\n'}),3);
 for(const report of [{status:1,stdout:'# pass 3\n# fail 0\n'},{status:0,stdout:'# pass 3\n# fail 1\n'},{status:0,stdout:''},{status:0,stdout:'# pass 0\n# fail 0\n'}])assert.throws(()=>passedCases('bad',report));
});

test('public install CLI runs every independent suite once with at most two overlapping processes',async()=>{
 const files={};
 for(const name of ['a','b','c'])files[name+'.test.mjs']=`import test from 'node:test';import fs from 'node:fs';test('${name}',async()=>{fs.appendFileSync('events.log','${name}:start\\n');await new Promise(resolve=>setTimeout(resolve,350));fs.appendFileSync('events.log','${name}:end\\n')});`;
 const root=await fixture(files);
 try{
  const serial=await runTests({root,installMode:true,requestedWorkers:1,capacity,output:quiet});assert.equal(serial.cases,3);
  await fs.writeFile(path.join(root,'events.log'),'');
  const {stdout}=await command(process.execPath,[path.join(root,'tools/run-tests-serial.cjs'),'--install'],{cwd:root});
  assert.match(stdout,/TEST GATE PASS: 3 suites, 3 cases/);
  const lines=(await fs.readFile(path.join(root,'events.log'),'utf8')).trim().split('\n');let active=0,peak=0;
  for(const line of lines){active+=line.endsWith(':start')?1:-1;peak=Math.max(peak,active);assert.ok(active>=0&&active<=2)}
  assert.equal(active,0);for(const name of ['a','b','c']){assert.equal(lines.filter(line=>line===name+':start').length,1);assert.equal(lines.filter(line=>line===name+':end').length,1)}
  if(stdout.includes('2 worker(s)'))assert.equal(peak,2);
 }finally{await remove(root)}
});

test('a red suite cancels active work and prevents the next suite and a green gate',async()=>{
 const root=await fixture({
  'a-fail.test.mjs':`import test from 'node:test';import assert from 'node:assert/strict';test('red',async()=>{await new Promise(resolve=>setTimeout(resolve,250));assert.fail('expected failure')});`,
  'b-wait.test.mjs':`import test from 'node:test';test('waiting',()=>new Promise(resolve=>setTimeout(resolve,30000)));`,
  'c-never.test.mjs':`import fs from 'node:fs';fs.writeFileSync('must-not-start','bad');`
 });let output='';
 try{
  await assert.rejects(runTests({root,installMode:true,capacity,output:{stdout:text=>{output+=text},stderr:()=>{}}}),/a-fail\.test\.mjs: exit=1/);
  await assert.rejects(fs.access(path.join(root,'must-not-start')));assert.equal(output.includes('TEST GATE PASS:'),false);
 }finally{await remove(root)}
});

test('timeout terminates the test process group including a resource-writing descendant',async()=>{
 const root=await fixture({'a-timeout.test.mjs':`import test from 'node:test';import {spawn} from 'node:child_process';test('hang',async()=>{spawn(process.execPath,['-e',"const fs=require('node:fs');setInterval(()=>fs.appendFileSync('heartbeat','x'),20)"],{stdio:'ignore'});await new Promise(resolve=>setTimeout(resolve,30000))});`});
 try{
  await assert.rejects(runTests({root,installMode:true,requestedWorkers:1,capacity,timeoutForSuite:()=>2000,output:quiet}),/timeout after 2s/);
  const first=await fs.readFile(path.join(root,'heartbeat'),'utf8');assert.ok(first.length>0);
  await new Promise(resolve=>setTimeout(resolve,150));assert.equal(await fs.readFile(path.join(root,'heartbeat'),'utf8'),first);
 }finally{await remove(root)}
});

test('test discovery rejects empty plans and symlinks before starting a child',async()=>{
 const root=await fixture({});
 try{
  await assert.rejects(runTests({root,installMode:true,output:quiet}),/No test suites/);
  const outside=path.join(root,'outside.mjs');await fs.writeFile(outside,"throw new Error('must not execute')");
  await fs.symlink(outside,path.join(root,'tests/linked.test.mjs'));
  await assert.rejects(runTests({root,installMode:true,output:quiet}),/regular file/);
 }finally{await remove(root)}
});

test('install mode preserves the legacy migration test and full mode retains both extended scenarios',async()=>{
 const root=await fixture({
  'e4-population.test.mjs':`import test from 'node:test';import fs from 'node:fs';test('legacy twins migration',()=>{});test('long scenario one',()=>fs.appendFileSync('extended','1'));test('long scenario two',()=>fs.appendFileSync('extended','2'));`,
  'other.test.mjs':`import test from 'node:test';test('ordinary independent behavior',()=>{});`
 });
 try{
  const install=await runTests({root,installMode:true,capacity,output:quiet});assert.equal(install.cases,2);assert.equal(install.suites,2);await assert.rejects(fs.access(path.join(root,'extended')));
  const full=await runTests({root,output:quiet});assert.equal(full.cases,4);assert.equal(full.workers,1);assert.equal(await fs.readFile(path.join(root,'extended'),'utf8'),'12');
 }finally{await remove(root)}
});

test('the release suites split into balanced shards that together run every suite exactly once',()=>{
 const {shardSuites}=require('../tools/run-tests-serial.cjs');
 const suites=['a.test.mjs','b.test.mjs','c.test.mjs','d.test.mjs','e.test.mjs','f.test.mjs','g.test.mjs'];
 const weights={'a.test.mjs':300,'b.test.mjs':200,'c.test.mjs':150,'d.test.mjs':100,'e.test.mjs':90,'f.test.mjs':60};
 const parts=[1,2,3].map(index=>shardSuites(suites,{index,count:3},weights));
 assert.deepEqual(parts.flat().sort(),suites);
 const load=part=>part.reduce((sum,file)=>sum+(weights[file]??60),0);
 const loads=parts.map(load);assert.ok(Math.max(...loads)-Math.min(...loads)<=150,loads.join(','));
 assert.deepEqual(shardSuites(suites,{index:2,count:3},weights),parts[1],'the same split on every machine');
 assert.deepEqual(parseOptions(['--install','--shard=2/8']),{installMode:true,requestedWorkers:undefined,shard:{index:2,count:8}});
 for(const arguments_ of [['--shard=2/8'],['--install','--shard=0/8'],['--install','--shard=9/8'],['--install','--shard=1/8','--shard=2/8']])assert.throws(()=>parseOptions(arguments_));
});
