/* Opcjonalna bramka prawdziwego Chromium; nie zastępuje pomiaru na telefonie. */
const {chromium}=require(process.env.PRZYSTAN_PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const binary=process.env.PRZYSTAN_CHROMIUM_MODULE?require(process.env.PRZYSTAN_CHROMIUM_MODULE):null;
 const launchOptions={headless:true,executablePath:binary?await binary.executablePath():process.env.CHROMIUM_PATH,args:binary?binary.args:JSON.parse(process.env.PRZYSTAN_CHROMIUM_ARGS||'[]')};let browser=await chromium.launch(launchOptions);
 const output=process.env.PRZYSTAN_BROWSER_OUTPUT||path.resolve('browser-evidence');fs.mkdirSync(output,{recursive:true});const results=[];
 let server;
 try{if(process.env.PRZYSTAN_START_SERVER==='1'){server=require('node:child_process').spawn(process.execPath,[path.join(__dirname,'../server.js')],{env:{...process.env,PORT:'4317'},stdio:['ignore','pipe','inherit']});await new Promise((resolve,reject)=>{server.once('error',reject);server.once('exit',code=>reject(new Error('server exit '+code)));server.stdout.once('data',resolve);});}
 for(const viewport of [{width:1280,height:800},{width:412,height:870}]){
  if(results.length){await browser.close();browser=await chromium.launch(launchOptions);}
  const context=await browser.newContext({viewport,isMobile:viewport.width<500,hasTouch:viewport.width<500}),page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(process.env.PRZYSTAN_URL||'http://127.0.0.1:4317/');await page.waitForFunction(()=>!!window.__g,{timeout:60000});
  await page.evaluate(()=>{const game=window.__g;game.gfxSetLevel(0,true);game.startGame(true);game.S.speed=0;game.S.e3={done:1};game.ludInit();game.S.wozy=3;Object.assign(game.S.res,{suchary:8000,ziarno:3000,drewno:3000,deski:3000,kamien:3000,opal:3000,narz:30});game.openSheet('osada');});
  let began=false;
  for(let decision=0;decision<20&&!began;decision++){
   if(await page.locator('#ev').isVisible()){console.log('decision',await page.locator('#event-title').innerText());const close=page.locator('#ev [data-close]');if(await close.count())await close.click();else await page.locator('#ev [data-o="0"]').click();await page.evaluate(()=>window.__g.S.speed=0);continue;}
   await page.evaluate(()=>window.__g.openSheet('osada'));assert.equal(await page.locator('[data-e4-begin]').count(),1);
   try{await page.locator('[data-e4-begin]').click({timeout:10000});began=true;}catch(error){if(!await page.locator('#ev').isVisible())throw error;}
  }
  assert.ok(began,'all starting decisions can be completed');await page.waitForFunction(()=>window.__g.S.epoch===4,{timeout:60000});console.log('entered E4',viewport.width);
  await page.evaluate(()=>{window.__g.S.speed=0;window.__g.S.e4.settlements.przystan.capacity=100000;window.__g.openSheet('budowa');});
  await page.locator('[data-e4-project="ogrodek"]').click();assert.ok(await page.evaluate(()=>window.__g.S.e4.settlements.przystan.projects.some(project=>project.kind==='ogrodek')));
  await page.evaluate(()=>window.__g.openSheet('wyprawy'));
  const region=await page.evaluate(()=>{const state=window.__g.S,town=state.e4.world.town;return state.e4.world.regions.filter(region=>region.id!==state.e4.settlements.przystan.regionId).sort((first,second)=>Math.hypot(first.x-town.x,first.z-town.z)-Math.hypot(second.x-town.x,second.z-town.z))[0].id;});
  await page.locator('#e4-region').selectOption(region);await page.locator('#e4-specialty').selectOption('rolniczy');await page.locator('[data-e4-found]').click();
  const moving=await page.evaluate(()=>window.__g.S.e4.transports.filter(transport=>transport.founding).map(transport=>({id:transport.id,items:transport.items,peopleIds:transport.peopleIds})));
  assert.equal(moving.length,1,'family departs through the UI');await page.evaluate(()=>{window.__g.save();window.__g.startGame(false);window.__g.S.speed=0;});
  assert.deepEqual(await page.evaluate(()=>window.__g.S.e4.transports.filter(transport=>transport.founding).map(transport=>({id:transport.id,items:transport.items,peopleIds:transport.peopleIds}))),moving);
  await page.evaluate(()=>{for(let day=0;day<25;day++)window.__g.step(240);window.__g.S.speed=0;window.__g.openSheet('osada');});
  assert.ok(await page.evaluate(()=>Object.values(window.__g.S.e4.settlements).some(settlement=>settlement.id!=='przystan'&&settlement.buildings.dom_rodowy)));
  for(const tab of ['osada','zadania','budowa','praca','wyprawy','wiedza','natura','kronika']){await page.evaluate(tab=>window.__g.openSheet(tab),tab);assert.ok((await page.locator('#body').innerText()).length>100,tab);}
  await page.evaluate(()=>{window.__g.closeSheet();window.__g.setZoom(1.15);const place=Object.values(window.__g.S.e4.settlements).find(place=>place.id!=='przystan'&&place.buildings.dom_rodowy)||window.__g.S.e4.settlements.przystan;window.__g.look(place.x,place.z);window.__g.S.speed=0;});await page.screenshot({path:path.join(output,'epoka4-'+viewport.width+'.png')});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'viewport does not overflow');assert.deepEqual(errors,[]);
  await page.evaluate(()=>{const game=window.__g;game.step(((.9-game.S.day%1+1)%1)*240);window.__noc.nocStart();if(!game.save())throw new Error('night save failed');});
  const state=await page.evaluate(()=>({day:window.__g.S.day,people:window.__g.S.people.length,settlements:Object.keys(window.__g.S.e4.settlements).length,save:window.__g.save(),bytes:localStorage.getItem('przystan-v7').length,renderer:window.__g.renderer.getContext().getParameter(7937)}));
  await page.evaluate(()=>navigator.serviceWorker.ready);await context.setOffline(true);await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>!!window.__g,{timeout:60000});await page.locator('#go').click();assert.equal(await page.evaluate(()=>window.__g.S.epoch),4);assert.notEqual(await page.evaluate(()=>window.__g.S.speed),40);assert.equal(await page.evaluate(()=>window.__g.S.people.length),state.people);
  results.push({viewport,...state,errors,offlineReload:true});await context.close();
 }}finally{await browser.close();if(server)server.kill('SIGTERM');}
 fs.writeFileSync(path.join(output,'chromium-e4.json'),JSON.stringify({status:'PASS',results},null,2));console.log(JSON.stringify({status:'PASS',results},null,2));
})().catch(error=>{console.error(error);process.exitCode=1;});
