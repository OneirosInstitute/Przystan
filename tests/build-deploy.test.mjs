import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import crypto from 'node:crypto';
const require=createRequire(import.meta.url);
const {checkDeployment,BASE,PACKAGE}=require('../tools/deploy-check.cjs');
const {verifyPackage}=require('../tools/verify-package.cjs');

test('4.6.0-rc.3 deployment targets the verified 4.6.0-rc.2 checkpoint in every release guard',async()=>{
 const expectedBase='222f65973d95397c5974480893fdaf718e9260fa';
 assert.equal(BASE,expectedBase,'preflight must accept the deployed 4.6.0-rc.2 checkpoint');
 const installer=await fs.readFile(new URL('../WDROZ_TERMUX.sh',import.meta.url),'utf8');
 assert.match(installer,new RegExp("EXPECTED_COMMIT='"+expectedBase+"'"));
 assert.match(installer,/npm run test:install/);
 const packageDefinition=JSON.parse(await fs.readFile(new URL('../package.json',import.meta.url),'utf8'));
 assert.equal(packageDefinition.scripts['test:install'],'node tools/check-build.cjs && node tools/run-tests-serial.cjs --install');
 assert.equal(packageDefinition.scripts.test,'node tools/check-build.cjs && node tools/run-tests-serial.cjs');
 const manifest=JSON.parse(await fs.readFile(new URL('../release-manifest.json',import.meta.url),'utf8'));
 assert.equal(manifest.base_commit,expectedBase,'the package must declare the same verified checkpoint');
});

test('package integrity detects missing, changed and out-of-root files',async()=>{
 const directory=await fs.mkdtemp(path.join(os.tmpdir(),'przystan-integrity-'));
 const outside=await fs.mkdtemp(path.join(os.tmpdir(),'przystan-outside-'));
 const file=path.join(directory,'game.txt');const content='expected game';
 const manifest={version:JSON.parse(await fs.readFile(new URL('../package.json',import.meta.url),'utf8')).version,files:{'game.txt':crypto.createHash('sha256').update(content).digest('hex')}};
 try{
  await fs.writeFile(file,content);assert.equal(verifyPackage(directory,manifest),1);
  await fs.writeFile(file,'changed');assert.throws(()=>verifyPackage(directory,manifest));
  assert.throws(()=>verifyPackage(directory,{...manifest,files:{'../outside':manifest.files['game.txt']}}));
  assert.throws(()=>verifyPackage(directory,{...manifest,files:{missing:manifest.files['game.txt']}}));
  await fs.writeFile(path.join(outside,'outside.txt'),content);
  await fs.symlink(outside,path.join(directory,'linked'));
  assert.throws(()=>verifyPackage(directory,{...manifest,files:{'linked/outside.txt':manifest.files['game.txt']}}));
 }finally{await fs.rm(directory,{recursive:true,force:true});await fs.rm(outside,{recursive:true,force:true})}
});

test('deployment preflight checks identity, branch, base and user changes with read-only git calls',()=>{
 const defaults={root:process.cwd(),remote:'git@github.com:OneirosInstitute/Przystan.git',branch:'main',head:BASE,status:''};
 const execute=(overrides,options={})=>{
  const state={...defaults,...overrides},calls=[];
  const responses={'rev-parse --show-toplevel':state.root,'remote get-url origin':state.remote,'branch --show-current':state.branch,'rev-parse HEAD':state.head,'status --porcelain=v1 --untracked-files=all':state.status};
  const valid=checkDeployment((...arguments_)=>{const command=arguments_.join(' ');calls.push(command);assert.ok(command in responses);return responses[command]},options);
  assert.equal(calls.some(command=>/^(add|commit|push|reset|checkout)/.test(command)),false);
  return valid;
 };
 assert.equal(execute({}),true);
 assert.equal(execute({head:'older-commit'},{beforePull:true}),true);
 assert.equal(execute({status:'?? '+PACKAGE+'/src/p_save.js'}),true);
 for(const override of [{root:'/wrong/root'},{remote:'git@github.com:someone/Przystan.git'},{branch:'other'},{head:'changed'},{status:' M src/p_rest.js'},{status:'?? my-notes.txt'}])assert.throws(()=>execute(override));
});

test('asset-only changes invalidate the PWA version; UI viewport permits zoom',async()=>{
 const directory=await fs.mkdtemp(path.join(os.tmpdir(),'przystan-build-'));
 try{
  for(const name of ['build.js','src','assets'])await fs.cp(new URL('../'+name,import.meta.url),path.join(directory,name),{recursive:true});
  const build=()=>execFileSync(process.execPath,['build.js'],{cwd:directory,encoding:'utf8'});
  build();const first=await fs.readFile(path.join(directory,'dist/sw.js'),'utf8');
  await fs.appendFile(path.join(directory,'assets/three.core.js'),'\n// asset-only regression\n');
  build();const second=await fs.readFile(path.join(directory,'dist/sw.js'),'utf8');
  assert.notEqual(first.match(/const V=PREFIX\+'([^']+)'/)[1],second.match(/const V=PREFIX\+'([^']+)'/)[1]);
  const html=await fs.readFile(path.join(directory,'dist/index.html'),'utf8');
  assert.equal(html.includes('user-scalable=no'),false);
 }finally{await fs.rm(directory,{recursive:true,force:true})}
});
