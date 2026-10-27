const {chromium}=require(process.env.PRZYSTAN_PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 let browser,server;const errors=[];
 try{
  if(process.env.PRZYSTAN_START_SERVER==='1'){
   server=require('node:child_process').spawn(process.execPath,[path.join(__dirname,'../server.js')],{env:{...process.env,PORT:'4317'},stdio:['ignore','pipe','inherit']});
   await new Promise((resolve,reject)=>{server.once('error',reject);server.once('exit',code=>reject(new Error('server exit '+code)));server.stdout.once('data',resolve)});
  }
  const binary=process.env.PRZYSTAN_CHROMIUM_MODULE?require(process.env.PRZYSTAN_CHROMIUM_MODULE):null;
  browser=await chromium.launch({headless:true,executablePath:binary?await binary.executablePath():process.env.CHROMIUM_PATH,args:binary?binary.args:JSON.parse(process.env.PRZYSTAN_CHROMIUM_ARGS||'[]')});
  const page=await browser.newPage({viewport:{width:412,height:870},isMobile:true,hasTouch:true});page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>{localStorage.setItem('przystan-gfx','0');localStorage.setItem('przystan-autocam','0');localStorage.setItem('przystan-mute','1');localStorage.setItem('przystan-bat','1')});
  await page.goto(process.env.PRZYSTAN_URL||'http://127.0.0.1:4317/');await page.waitForFunction(()=>!!window.__g,{timeout:60000});await page.locator('#go').click();await page.waitForFunction(()=>!!window.__g?.S&&document.getElementById('intro').style.display==='none');
  const start=await page.evaluate(()=>{
   const game=window.__g,state=game.S;game.closeSheet();state.speed=0;state.day=.4;state.wreck.gone=1;state.know.kuznia='tak';
   const node=game.nodes.find(candidate=>candidate.type==='ruda'&&candidate.amt>=1&&candidate.claim===0&&game.nearestWalk(candidate.i,candidate.j));if(!node)throw new Error('No real ore source');
   game.reveal(node.i,node.j,6);const tile=game.nearestWalk(node.i,node.j),worker=state.people[0];worker.x=game.tcx(tile[0]);worker.z=game.tcx(tile[1]);worker.hp=1;worker.job='wb';worker.wb=501;worker.state='idle';worker.wait=0;
   state.bld.push({id:501,kind:'kuznia',i:node.i+2,j:node.j,prog:12,work:12,cmp:1,lv:1,cond:1,ext:[],want:1});Object.assign(state.res,{ruda:0,wegiel:8,narz:0,gwozdzie:0});
   if(!game.planJob(worker)||!worker.supply)throw new Error('No supply assignment');game.selectB(501);
   return {nodeId:node.id,sourceBefore:node.amt,after:worker.after,target:worker.tgt.type,job:worker.job,workplace:worker.wb};
  });
  assert.equal(start.target,'ruda');assert.equal(start.workplace,501);assert.match(await page.locator('.production-policy').innerText(),/Zaopatrzenie/);
  const carrying=await page.evaluate(()=>{const game=window.__g,worker=game.S.people[0];for(let tick=0;tick<4000&&!worker.carry;tick++)game.step(.1);if(!game.save())throw new Error('Supply save failed');return {cargo:worker.carry,ore:game.S.res.ruda,source:game.nodes[worker.supply.node].amt,job:worker.job,workplace:worker.wb}});
  assert.equal(carrying.ore,0);assert.equal(carrying.cargo[0].res,'ruda');assert.equal(carrying.cargo[0].q,1.5);assert.equal(carrying.source,start.sourceBefore-1);
  await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>!!window.__g,{timeout:60000});await page.locator('#go').click();await page.waitForFunction(()=>!!window.__g?.S&&document.getElementById('intro').style.display==='none');
  const delivered=await page.evaluate(nodeId=>{const game=window.__g;game.S.speed=0;const worker=game.S.people[0];for(let tick=0;tick<6000&&worker.carry;tick++)game.step(.1);return {ore:game.S.res.ruda,cargo:worker.carry,source:game.nodes[nodeId].amt,job:worker.job,workplace:worker.wb,saved:game.save()}},start.nodeId);
  assert.equal(delivered.ore,1.5);assert.equal(delivered.cargo,null);assert.equal(delivered.source,carrying.source);assert.equal(delivered.job,'wb');assert.equal(delivered.workplace,501);assert.equal(delivered.saved,true);assert.deepEqual(errors,[]);
  const report={status:'PASS',viewport:{width:412,height:870},nativeWorldNodes:true,nativePathfinding:true,selectedBuildingPolicy:true,restartDuringDelivery:true,start,carrying,delivered,errors};const output=process.env.PRZYSTAN_BROWSER_OUTPUT||path.resolve('browser-evidence');fs.mkdirSync(output,{recursive:true});fs.writeFileSync(path.join(output,'chromium-supply.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{if(browser)await browser.close();if(server)server.kill('SIGTERM')}
})().catch(error=>{console.error(error);process.exitCode=1});
