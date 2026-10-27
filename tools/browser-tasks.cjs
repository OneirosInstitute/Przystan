/* Opcjonalne QA w prawdziwym Chromium, z izolowanymi danymi testowymi. */
const {chromium}=require(process.env.PRZYSTAN_PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const binary=process.env.PRZYSTAN_CHROMIUM_MODULE?require(process.env.PRZYSTAN_CHROMIUM_MODULE):null;
 const options={headless:true,executablePath:binary?await binary.executablePath():process.env.CHROMIUM_PATH,args:binary?binary.args:JSON.parse(process.env.PRZYSTAN_CHROMIUM_ARGS||'[]')};
 const output=process.env.PRZYSTAN_BROWSER_OUTPUT||path.resolve('browser-evidence');fs.mkdirSync(output,{recursive:true});
 const results=[];let server,browser;
 try{
  if(process.env.PRZYSTAN_START_SERVER==='1'){
   server=require('node:child_process').spawn(process.execPath,[path.join(__dirname,'../server.js')],{env:{...process.env,PORT:'4317'},stdio:['ignore','pipe','inherit']});
   await new Promise((resolve,reject)=>{server.once('error',reject);server.once('exit',code=>reject(new Error('server exit '+code)));server.stdout.once('data',resolve);});
  }
  for(const viewport of [{width:412,height:870},{width:1280,height:800}]){
   browser=await chromium.launch(options);const context=await browser.newContext({viewport,isMobile:viewport.width<500,hasTouch:viewport.width<500}),page=await context.newPage(),errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   await page.addInitScript(()=>localStorage.setItem('przystan-autocam','0'));
   async function clickUI(locator){for(let attempt=0;attempt<20;attempt++){
    if(await page.locator('#ev').isVisible()){const close=page.locator('#ev [data-close]');if(await close.count())await close.click();else await page.locator('#ev [data-o="0"]').click();await page.evaluate(()=>window.__g.S.speed=0);continue;}
    try{await locator.click({timeout:10000});return}catch(error){if(!await page.locator('#ev').isVisible())throw error;}
   }throw new Error('Too many pending decisions');}
   console.log('tasks viewport',viewport.width);
   await page.goto(process.env.PRZYSTAN_URL||'http://127.0.0.1:4317/');await page.waitForFunction(()=>!!window.__g,{timeout:60000});
   await page.evaluate(()=>{const game=window.__g;game.gfxSetLevel(0,true);game.startGame(true);game.closeSheet();game.S.speed=0;});
   for(let attempt=0;attempt<10&&await page.locator('#ev').isVisible();attempt++){const close=page.locator('#ev [data-close]');if(await close.count())await close.click();else await page.locator('#ev [data-o="0"]').click();}
   await page.evaluate(()=>{const game=window.__g,state=game.S,region=game.REGIONS.find(region=>region&&region.id!==0);state.speed=0;game.ludInit();state.hamlets=[{id:77,rid:region.id,i:region.i,j:region.j,name:'Lubomirowice',head:'Lubomir',rod:1,pop:5,st:1,day:state.day,zap:.5,wiez:.5,road:1,need:{k:'odziez',q:2,until:state.day+5}}];state.res.odziez=92;game.reveal(region.i,region.j,4);game.closeSheet();game.look(-game.tcx(region.i),-game.tcx(region.j));game.mapTick(1);if(!game.save())throw new Error('fixture save failed');});
   await clickUI(page.locator('.cze-request .cze-open'));const card=page.locator('[data-task-card="ham:77"]');
   await card.waitFor();assert.match(await card.innerText(),/W osadzie: 92/);assert.match(await card.innerText(),/Potrzeba 2/);
   await clickUI(card.locator('[data-task-dismiss="77"]'));assert.equal(await page.locator('.cze-request').count(),0);
   assert.ok(await card.isVisible(),'dismissal retains the actionable request');
   await page.screenshot({path:path.join(output,'tasks-'+viewport.width+'.png')});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'page fits narrow viewport');
   assert.equal(await card.evaluate(element=>element.scrollWidth>element.clientWidth+1),false,'task card has no overflow');
   await clickUI(card.locator('[data-task-help="77"]'));assert.equal(await page.evaluate(()=>window.__g.S.res.odziez),90);assert.equal(await page.evaluate(()=>window.__g.S.hamlets[0].need),null);
   assert.equal(await page.locator('[data-task-card="ham:77"]').count(),0);await page.locator('.task-history summary').click();assert.match(await page.locator('.task-history').innerText(),/Lubomirowice/);
   await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>!!window.__g);await page.locator('#go').click();
   assert.equal(await page.evaluate(()=>window.__g.S.res.odziez),90);assert.equal(await page.evaluate(()=>window.__g.S.hamlets[0].need),null);
   await page.evaluate(()=>{const game=window.__g,hamlet=game.S.hamlets[0];hamlet.need={k:'opal',q:10,until:game.S.day+6};game.closeSheet();game.S.speed=0;game.look(-game.tcx(hamlet.i),-game.tcx(hamlet.j));game.mapTick(1);});
   await clickUI(page.locator('.cze-request .cze-close'));assert.equal(await page.locator('.cze-request').count(),0);
   await page.evaluate(()=>window.__g.openSheet('zadania'));assert.match(await page.locator('#body').innerText(),/Potrzeba 10/);
   await clickUI(page.locator('[data-task-filter="people"]'));assert.equal(await page.locator('.task-person').count(),await page.evaluate(()=>window.__g.S.people.length));
   await clickUI(page.locator('[data-task-person="0"]'));assert.equal(await page.locator('#sheet').isHidden(),true);assert.match(await page.locator('#sel').innerText(),/Bożydar/);
   // Fill this context's real localStorage until Chromium rejects the next larger value.
   const quota=await page.evaluate(()=>{const game=window.__g,state=game.S;state.speed=0;state.day=2.4;if(!game.save())throw new Error('pre-quota save');localStorage.setItem('przystan-v7-bak',localStorage.getItem('przystan-v7'));
    let low=0,high=6*1024*1024,rejected=false;while(high-low>16){const middle=Math.floor((low+high)/2);try{localStorage.setItem('qa-padding','p'.repeat(middle));low=middle}catch(error){if(error.name!=='QuotaExceededError')throw error;rejected=true;high=middle;}}
    state.kron.push([3,'Nowy wpis do sprawdzenia większego zapisu. '.repeat(200)]);state.res.drewno=73;const saved=game.save();
    return {realQuotaExceeded:rejected,recovered:saved,backupRemoved:localStorage.getItem('przystan-v7-bak')===null,paddingPreserved:localStorage.getItem('qa-padding')?.length===low,savedWood:JSON.parse(localStorage.getItem('przystan-v7')).res.drewno};});
   assert.equal(quota.realQuotaExceeded,true);assert.equal(quota.recovered,true);assert.equal(quota.backupRemoved,true);assert.equal(quota.paddingPreserved,true);assert.equal(quota.savedWood,73);
   await page.evaluate(()=>{localStorage.removeItem('qa-padding');const game=window.__g;game.S.people[0].hp=NaN;});
   assert.equal(await page.evaluate(()=>window.__g.save()),false);await page.evaluate(()=>window.__g.openSheet('kronika'));
   assert.match(await page.locator('#save-status').innerText(),/people\[0\].hp/);
   const downloadEvent=page.waitForEvent('download');await page.locator('[data-kron="diagnostic"]').click();const download=await downloadEvent;const diagnosticPath=path.join(output,'save-diagnostic-'+viewport.width+'.json');await download.saveAs(diagnosticPath);const diagnostic=JSON.parse(fs.readFileSync(diagnosticPath,'utf8'));
   assert.equal(diagnostic.version,require('../package.json').version);assert.equal(diagnostic.ok,false);assert.match(diagnostic.error,/people\[0\].hp/);
   await page.evaluate(()=>{window.__g.S.people[0].hp=1;if(!window.__g.save())throw new Error('recovery save');});assert.equal(await page.locator('#save-warning').isHidden(),true);
   await page.evaluate(()=>navigator.serviceWorker.ready);await context.setOffline(true);await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>!!window.__g,{timeout:60000});await page.locator('#go').click();
   assert.equal(await page.evaluate(()=>window.__g.S.res.drewno),73);assert.equal(await page.evaluate(()=>window.__g.S.tasksUI.dismissed[77]!==undefined),true);
   await page.evaluate(()=>window.__g.openSheet('zadania'));await clickUI(page.locator('[data-task-filter="all"]'));assert.ok(await page.locator('[data-task-card="ham:77"]').count());assert.deepEqual(errors,[]);
   results.push({viewport,status:'PASS',helpOnce:true,dismissalPersists:true,peopleLocated:true,quota,diagnosticExport:true,offlineReload:true,errors});
   await context.close();await browser.close();browser=null;
  }
 }finally{if(browser)await browser.close();if(server)server.kill('SIGTERM');}
 fs.writeFileSync(path.join(output,'chromium-tasks.json'),JSON.stringify({status:'PASS',results},null,2));console.log(JSON.stringify({status:'PASS',results},null,2));
})().catch(error=>{console.error(error);process.exitCode=1});
