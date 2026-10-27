import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {once} from 'node:events';

async function startServer(dataDirectory){
 const child=spawn(process.execPath,['server.js'],{cwd:new URL('..',import.meta.url),env:{...process.env,PORT:'0',DATA_DIR:dataDirectory},stdio:['ignore','pipe','pipe']});
 const address=await new Promise((resolve,reject)=>{
  const timeout=setTimeout(()=>reject(new Error('Server startup timeout')),10000);
  child.once('error',reject);child.stdout.on('data',chunk=>{const port=String(chunk).match(/porcie (\d+)/);if(port){clearTimeout(timeout);resolve('http://127.0.0.1:'+port[1])}});
 });
 return {address,child};
}
test('real HTTP: bad inputs finish, identities cannot overwrite by name and scores are derived',async()=>{
 const directory=await fs.mkdtemp(path.join(os.tmpdir(),'przystan-api-'));
 const {address,child}=await startServer(directory);
 const request=(route,body)=>fetch(address+route,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(2500)});
 try{
  for(const route of ['/%00','/%E0%A4%A'])assert.equal((await fetch(address+route,{signal:AbortSignal.timeout(2500)})).status,400);
  for(const invalid of [null,[],7,'text'])assert.equal((await request('/api/wynik',invalid)).status,400);
  assert.equal((await fetch(address+'/api/wynik',{method:'POST',body:'{bad'})).status,400);
  assert.equal((await fetch(address+'/api/wynik',{method:'POST',body:'x'.repeat(3000)})).status,413);
  const week=await (await fetch(address+'/api/tydzien')).json();
  assert.equal((await request('/api/wynik',{...week,day:0,pop:0,score:200000})).status,400);
  const firstRun=await (await request('/api/proba',{})).json();
  const entry={week:week.week,seed:week.seed,token:firstRun.token,name:'Ta sama nazwa',vil:'Żółwia zatoka',day:10,pop:18,pam:0,hamPop:0,epoch:1,score:550,ver:'3.4.1'};
  assert.equal((await request('/api/wynik',{...entry,score:200000})).status,400);
  assert.equal((await request('/api/wynik',{...entry,token:entry.token+'wrong'})).status,401);
  assert.equal((await request('/api/wynik',entry)).status,200);
  await new Promise(resolve=>setTimeout(resolve,1050));
  const secondRun=await (await request('/api/proba',{})).json();
  assert.equal((await request('/api/wynik',{...entry,token:secondRun.token,day:20,score:650})).status,200);
  const table=await (await fetch(address+'/api/wyniki')).json();
  assert.equal(table.list.length,2);
  assert.deepEqual(table.list.map(item=>item.score),[650,550]);
  assert.equal(table.list[0].vil,'Żółwia zatoka');
  assert.equal(table.verification,'declared');
  assert.equal(table.list.some(item=>'id'in item||'token'in item),false);
  assert.equal((await fetch(address+'/')).status,200);
  assert.equal((await fs.readdir(directory)).some(file=>file.endsWith('.tmp')),false);
 }finally{const stopped=once(child,'exit');child.kill();await stopped;await fs.rm(directory,{recursive:true,force:true})}
});
test('real HTTP: a game in epoch IV can send its weekly score (4.9.0-rc.13)',async()=>{
 const directory=await fs.mkdtemp(path.join(os.tmpdir(),'przystan-api4-'));
 const {address,child}=await startServer(directory);
 const request=(route,body)=>fetch(address+route,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(2500)});
 try{
  const week=await (await fetch(address+'/api/tydzien')).json();const run=await (await request('/api/proba',{})).json();
  const entry={week:week.week,seed:week.seed,token:run.token,name:'Rody',vil:'Folwark',day:300,pop:120,pam:40,hamPop:0,epoch:4,score:300*10+120*25+40*3+500,ver:'4.9.0-rc.13'};
  const response=await request('/api/wynik',entry);assert.equal(response.status,200);
  const table=await (await fetch(address+'/api/wyniki')).json();assert.equal(table.list[0].ver,'4.9.0-rc.13','the full version is kept');
  assert.equal((await request('/api/wynik',{...entry,epoch:5})).status,400);
 }finally{const stopped=once(child,'exit');child.kill();await stopped;await fs.rm(directory,{recursive:true,force:true})}
});
test('real HTTP: a missing script or image is 404, a page address still opens the game (4.9.0-rc.13)',async()=>{
 const directory=await fs.mkdtemp(path.join(os.tmpdir(),'przystan-static-'));
 const {address,child}=await startServer(directory);
 try{
  assert.equal((await fetch(address+'/nie-ma.js')).status,404);assert.equal((await fetch(address+'/favicon.ico')).status,404);
  const page=await fetch(address+'/jakas-strona');assert.equal(page.status,200);assert.match(page.headers.get('content-type'),/text\/html/);
  assert.equal((await fetch(address+'/sw.js')).status,200);assert.equal((await fetch(address+'/three.module.js')).status,200);
 }finally{const stopped=once(child,'exit');child.kill();await stopped;await fs.rm(directory,{recursive:true,force:true})}
});
