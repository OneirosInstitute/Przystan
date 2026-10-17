/* Real DOM/WebGL QA for both menu modes; test data lives in an isolated context. */
const {chromium}=require(process.env.PRZYSTAN_PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const binary=process.env.PRZYSTAN_CHROMIUM_MODULE?require(process.env.PRZYSTAN_CHROMIUM_MODULE):null;
 const output=process.env.PRZYSTAN_BROWSER_OUTPUT||path.resolve('browser-evidence');fs.mkdirSync(output,{recursive:true});
 let browser,server;const results=[];
 try{
  if(process.env.PRZYSTAN_START_SERVER==='1'){
   server=require('node:child_process').spawn(process.execPath,[path.join(__dirname,'../server.js')],{env:{...process.env,PORT:'4317'},stdio:['ignore','pipe','inherit']});
   await new Promise((resolve,reject)=>{server.once('error',reject);server.once('exit',code=>reject(new Error('server exit '+code)));server.stdout.once('data',resolve)});
  }
  browser=await chromium.launch({headless:true,executablePath:binary?await binary.executablePath():process.env.CHROMIUM_PATH,args:binary?binary.args:JSON.parse(process.env.PRZYSTAN_CHROMIUM_ARGS||'[]')});
  for(const viewport of [{width:412,height:870},{width:870,height:412},{width:1280,height:800}]){
   const context=await browser.newContext({viewport,isMobile:viewport.width<900,hasTouch:viewport.width<900}),page=await context.newPage(),errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   await page.addInitScript(()=>{localStorage.setItem('przystan-gfx','0');localStorage.setItem('przystan-autocam','0');localStorage.setItem('przystan-bat','1')});
   async function dismiss(){for(let attempt=0;attempt<12&&await page.locator('#ev').isVisible();attempt++){const close=page.locator('#ev [data-close]');if(await close.count())await close.click();else await page.locator('#ev [data-o="0"]').click();await page.evaluate(()=>window.__g.S.speed=0)}}
   async function click(locator){await dismiss();await locator.click({timeout:15000});}
   async function open(key){if(await page.locator('#sheet').isHidden())await click(page.locator('#cz-osada'));if(['pulpit','zadania','praca','budowa','dzialy'].includes(key)){await click(page.locator('[data-czt="'+key+'"]'));return}await click(page.locator('[data-czt="dzialy"]'));await click(page.locator('[data-menu-go="'+key+'"]'));}
   async function fits(label){
    const dimensions=await page.evaluate(()=>{const body=document.getElementById('body'),sheet=document.getElementById('sheet');return {page:document.documentElement.scrollWidth,viewport:innerWidth,body:body.clientWidth,scroll:body.scrollWidth,top:sheet.getBoundingClientRect().top,bottom:sheet.getBoundingClientRect().bottom,height:innerHeight,nav:[...document.querySelectorAll('#cz-chips button')].map(button=>{const bounds=button.getBoundingClientRect();return {left:bounds.left,right:bounds.right,height:bounds.height}})}});
    assert.ok(dimensions.page<=dimensions.viewport+1,label+' page overflow');assert.ok(dimensions.scroll<=dimensions.body+1,label+' body overflow');assert.ok(dimensions.top>=0&&dimensions.bottom<=dimensions.height+1,label+' panel bounds');
    assert.equal(dimensions.nav.length,5);for(const button of dimensions.nav){if(!(button.left>=0&&button.right<=dimensions.viewport+1&&button.height>=44)){console.log('LAYOUT',label,JSON.stringify(dimensions));await page.screenshot({path:path.join(output,'failure-'+viewport.width+'.png')});}assert.ok(button.left>=0&&button.right<=dimensions.viewport+1&&button.height>=44,label+' nav fits');}
   }
   console.log('workspace viewport',viewport.width,viewport.height);
   await page.goto(process.env.PRZYSTAN_URL||'http://127.0.0.1:4317/');await page.waitForFunction(()=>!!window.__g,{timeout:60000});await page.locator('#go').click();await page.waitForTimeout(500);await dismiss();
   await page.evaluate(()=>{window.__g.S.speed=2;window.__g.S.evT=10000;window.__g.closeSheet()});
   await click(page.locator('#cz-osada'));assert.equal(await page.evaluate(()=>window.__g.S.speed),0);await fits('quiet dashboard');
   await dismiss();await page.screenshot({path:path.join(output,'menu-cicha-'+viewport.width+'.png')});
   await open('zadania');await click(page.locator('[data-task-filter="goals"]'));assert.ok(await page.locator('.task-milestones').count());await fits('goals');
   await open('dzialy');await fits('directory');assert.equal(await page.locator('.menu-directory [data-menu-go]').count(),10);
   await page.screenshot({path:path.join(output,'menu-dzialy-'+viewport.width+'.png')});
   await open('ludzie');await page.locator('[data-menu-search="people"]').fill('Bożydar');assert.equal(await page.locator('.menu-people-list .task-person').count(),1);
   await click(page.locator('.menu-people-list [data-task-person]'));assert.equal(await page.locator('#sheet').isHidden(),true);assert.match(await page.locator('#sel').innerText(),/Bożydar/);await page.evaluate(()=>window.__g.select(null));
   await open('praca');assert.ok(await page.locator('.menu-section').count());await fits('quiet work');
   await open('ustawienia');await click(page.locator('[data-menu-control="battery"]'));assert.equal(await page.evaluate(()=>Number.isFinite(window.__g.S.speed)&&window.__g.save()),true);await click(page.locator('[data-menu-control="battery"]'));await click(page.locator('[data-menu-mode="full"]'));assert.equal(await page.evaluate(()=>document.body.classList.contains('cz')),false);
   await click(page.locator('#sclose'));await page.evaluate(()=>window.__g.S.speed=2);await click(page.locator('#tabbar [data-tab="pulpit"]'));
   assert.equal(await page.evaluate(()=>window.__g.S.speed),2);await fits('full dashboard');await click(page.locator('#menu-time'));assert.equal(await page.evaluate(()=>window.__g.S.speed),0);
   await page.screenshot({path:path.join(output,'menu-pelne-'+viewport.width+'.png')});
   for(const key of ['zadania','budowa','osada','praca','zapasy','wyprawy','wiedza','natura','kronika','ustawienia']){await open(key);await fits('full '+key)}
   await click(page.locator('[data-menu-mode="quiet"]'));
   // Real help, details, pinning, map route and reload through the new hierarchy.
   await page.evaluate(()=>{const game=window.__g,state=game.S,region=game.REGIONS.find(candidate=>candidate.id!==0);state.hamlets=[{id:77,rid:region.id,i:region.i,j:region.j,name:'Lubomirowice',head:'Lubomir',rod:1,pop:5,st:1,day:state.day,zap:.5,wiez:.5,road:1,need:{k:'odziez',q:2,until:state.day+5}}];state.res.odziez=92;game.closeSheet();game.S.speed=0});
   await click(page.locator('#cz-tasks'));await click(page.locator('[data-task-filter="all"]'));
   const request=page.locator('[data-task-card="ham:77"]');if(await request.getAttribute('open')===null)await click(request.locator('summary'));
   await click(request.locator('[data-task-pin]'));await click(page.locator('#sclose'));await page.locator('#task-tracker:not([hidden])').waitFor();
   await click(page.locator('#task-tracker [data-task-locate]'));assert.equal(await page.locator('#sheet').isHidden(),true);
   await click(page.locator('#task-tracker [data-task-open]'));assert.ok(await request.getAttribute('open')!==null);
   await page.screenshot({path:path.join(output,'menu-zadania-'+viewport.width+'.png')});
   await click(request.locator('[data-task-help="77"]'));assert.equal(await page.evaluate(()=>window.__g.S.res.odziez),90);
   assert.equal(await page.evaluate(()=>window.__g.S.hamlets[0].need),null);
   await page.evaluate(()=>window.__g.save());await page.evaluate(()=>navigator.serviceWorker.ready);await context.setOffline(true);await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>!!window.__g,{timeout:60000});await page.locator('#go').click();await dismiss();
   assert.equal(await page.evaluate(()=>window.__g.S.res.odziez),90);await context.setOffline(false);
   // Epoka IV entry uses the real migration UI; all new views must remain usable.
   await page.evaluate(()=>{const game=window.__g;game.startGame(true);game.closeSheet();game.S.speed=0;game.ludInit();game.S.e3={done:1};game.S.evT=10000;game.openSheet('pulpit')});await dismiss();
   await click(page.locator('[data-e4-begin]'));await page.waitForFunction(()=>window.__g.S.epoch===4,{timeout:60000});await page.evaluate(()=>window.__g.S.speed=0);
   for(const key of ['pulpit','zadania','ludzie','zapasy','dzialy','praca','wyprawy','ustawienia']){await open(key);await fits('epoka4 '+key)}
   assert.deepEqual(errors,[]);results.push({viewport,status:'PASS',quietAndFull:true,primaryDestinations:5,directorySections:10,helpOnce:true,pinning:true,locating:true,peopleSearch:true,pauseSemantics:true,offlineReload:true,epoka4:true,errors});await context.close();
  }
 }finally{if(browser)await browser.close();if(server)server.kill('SIGTERM')}
 const report={status:'PASS',results,unverified:['physical Android touch','phone performance','battery power']};fs.writeFileSync(path.join(output,'chromium-workspace.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
})().catch(error=>{console.error(error);process.exitCode=1});
