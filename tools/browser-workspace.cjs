/* Real DOM/WebGL QA for the restored classic menu and both screen modes. */
const {chromium}=require(process.env.PRZYSTAN_PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const output=process.env.PRZYSTAN_BROWSER_OUTPUT||path.resolve('browser-evidence');fs.mkdirSync(output,{recursive:true});
 let browser,server;const results=[];
 try{
  if(process.env.PRZYSTAN_START_SERVER==='1'){
   server=require('node:child_process').spawn(process.execPath,[path.join(__dirname,'../server.js')],{env:{...process.env,PORT:'4317'},stdio:['ignore','pipe','inherit']});
   await new Promise((resolve,reject)=>{server.once('error',reject);server.once('exit',code=>reject(new Error('server exit '+code)));server.stdout.once('data',resolve)});
  }
  browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH,args:JSON.parse(process.env.PRZYSTAN_CHROMIUM_ARGS||'[]')});
  for(const viewport of [{width:412,height:870},{width:870,height:412},{width:1280,height:800}]){
   const context=await browser.newContext({viewport,isMobile:viewport.width<900,hasTouch:viewport.width<900}),page=await context.newPage(),errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   await page.addInitScript(()=>{localStorage.setItem('przystan-gfx','0');localStorage.setItem('przystan-autocam','0');localStorage.setItem('przystan-bat','1')});
   async function dismiss(){for(let attempt=0;attempt<12&&await page.locator('#ev').isVisible();attempt++){const close=page.locator('#ev [data-close]');if(await close.count())await close.click();else await page.locator('#ev [data-o="0"]').click();await page.evaluate(()=>window.__g.S.speed=0)}}
   async function click(locator){for(let attempt=0;attempt<5;attempt++){await dismiss();try{await locator.click({timeout:15000});return}catch(error){if(!await page.locator('#ev').isVisible())throw error;}}throw new Error('Story modal did not settle');}
   async function open(key){const quiet=await page.evaluate(()=>document.body.classList.contains('cz'));if(quiet&&await page.locator('#sheet').isHidden())await click(page.locator('#cz-osada'));const locator=page.locator(quiet?'#cz-chips [data-czt="'+key+'"]':'#tabbar [data-tab="'+key+'"]');if(!await page.locator('#sheet').isHidden()&&await locator.evaluate(button=>button.classList.contains('on')))return;await click(locator);}
   async function minimize(){await click(page.locator('#smin'));assert.equal(await page.locator('#body').isVisible(),false);assert.ok((await page.locator('#sheet').boundingBox()).height<160);await click(page.locator('#smin'));assert.equal(await page.locator('#body').isVisible(),true);}
   async function fits(label){
    const layout=await page.evaluate(()=>{const body=document.getElementById('body'),sheet=document.getElementById('sheet'),quiet=document.body.classList.contains('cz'),nav=document.getElementById(quiet?'cz-chips':'tabbar'),bounds=sheet.getBoundingClientRect();return {page:document.documentElement.scrollWidth,viewport:innerWidth,body:body.clientWidth,scroll:body.scrollWidth,top:bounds.top,bottom:bounds.bottom,height:innerHeight,navWidth:nav.clientWidth,quiet,buttons:[...nav.querySelectorAll('button')].map(button=>({height:button.getBoundingClientRect().height,key:button.dataset.czt||button.dataset.tab}))}});
    assert.ok(layout.page<=layout.viewport+1,label+' page overflow');assert.ok(layout.scroll<=layout.body+1,label+' content overflow');assert.ok(layout.top>=0&&layout.bottom<=layout.height+1,label+' panel bounds');assert.equal(layout.buttons.length,8);assert.ok(layout.buttons.every(button=>button.height>=44));assert.ok(layout.buttons.some(button=>button.key==='zadania'));assert.equal(await page.locator('.menu-directory,.menu-hero').count(),0);
   }
   console.log('classic menu viewport',viewport.width,viewport.height);
   await page.goto(process.env.PRZYSTAN_URL||'http://127.0.0.1:4317/');await page.waitForFunction(()=>!!window.__g,{timeout:60000});await page.locator('#go').click();await dismiss();
   await page.evaluate(()=>{window.__g.S.speed=2;window.__g.S.evT=10000;window.__g.closeSheet()});
   await click(page.locator('#cz-osada'));assert.equal(await page.evaluate(()=>window.__g.S.speed),0);await fits('quiet people');
   await page.waitForTimeout(500);await dismiss();await page.screenshot({path:path.join(output,'menu-cicha-'+viewport.width+'.png')});await minimize();
   for(const key of ['osada','praca','budowa','zadania','wyprawy','wiedza','natura','kronika']){await open(key);await fits('quiet '+key);console.log(viewport.width,'quiet',key)}
   await open('zadania');await click(page.locator('[data-task-filter="goals"]'));assert.ok(await page.locator('.task-milestones').count());
   await click(page.locator('[data-task-filter="people"]'));const name=await page.locator('.task-person b').first().innerText();await click(page.locator('.task-person [data-task-person]').first());assert.equal(await page.locator('#sheet').isHidden(),true);assert.ok((await page.locator('#sel').innerText()).includes(name));await page.evaluate(()=>window.__g.select(null));
   await open('kronika');if(!await page.locator('[data-ui-section="game:options"]').evaluate(section=>section.open))await click(page.locator('[data-ui-section="game:options"] > summary'));await click(page.locator('[data-czui]'));assert.equal(await page.evaluate(()=>document.body.classList.contains('cz')),false);
   await click(page.locator('#sclose'));await page.evaluate(()=>window.__g.S.speed=2);await open('osada');assert.equal(await page.evaluate(()=>window.__g.S.speed),2);await fits('full people');await page.screenshot({path:path.join(output,'menu-pelne-'+viewport.width+'.png')});await minimize();
   for(const key of ['zadania','budowa','osada','praca','wyprawy','wiedza','natura','kronika']){await open(key);await fits('full '+key);console.log(viewport.width,'full',key)}
   if(!await page.locator('[data-ui-section="game:options"]').evaluate(section=>section.open))await click(page.locator('[data-ui-section="game:options"] > summary'));await click(page.locator('[data-czui]'));assert.equal(await page.evaluate(()=>document.body.classList.contains('cz')),true);
   await page.evaluate(()=>{const game=window.__g,state=game.S,region=game.REGIONS.find(candidate=>candidate.id!==0);state.hamlets=[{id:77,rid:region.id,i:region.i,j:region.j,name:'Lubomirowice',head:'Lubomir',rod:1,pop:5,st:1,day:state.day,zap:.5,wiez:.5,road:1,need:{k:'odziez',q:2,until:state.day+5}}];state.res.odziez=92;game.closeSheet();game.S.speed=0});
   await open('zadania');await click(page.locator('[data-task-filter="all"]'));const request=page.locator('[data-task-card="ham:77"]');if(await request.getAttribute('open')===null)await click(request.locator('summary'));
   await click(request.locator('[data-task-pin]'));await click(page.locator('#sclose'));await page.locator('#task-tracker:not([hidden])').waitFor();await click(page.locator('#task-tracker [data-task-locate]'));assert.equal(await page.locator('#sheet').isHidden(),true);await click(page.locator('#task-tracker [data-task-open]'));assert.ok(await request.getAttribute('open')!==null);
   await page.screenshot({path:path.join(output,'menu-zadania-'+viewport.width+'.png')});await click(request.locator('[data-task-help="77"]'));assert.equal(await page.evaluate(()=>window.__g.S.res.odziez),90);assert.equal(await page.evaluate(()=>window.__g.S.hamlets[0].need),null);
   await page.evaluate(()=>window.__g.save());await page.evaluate(()=>navigator.serviceWorker.ready);await context.setOffline(true);await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>!!window.__g,{timeout:60000});await page.locator('#go').click();await dismiss();assert.equal(await page.evaluate(()=>window.__g.S.res.odziez),90);await context.setOffline(false);
   await page.evaluate(()=>{const game=window.__g;game.startGame(true);game.closeSheet();game.S.speed=0;game.ludInit();game.S.e3={done:1};game.S.evT=10000;game.openSheet('osada')});await dismiss();await click(page.locator('[data-e4-begin]'));await page.waitForFunction(()=>window.__g.S.epoch===4,{timeout:60000});await page.evaluate(()=>window.__g.S.speed=0);
   for(const key of ['osada','zadania','budowa','praca','wyprawy','wiedza','natura','kronika']){await open(key);await fits('epoka4 '+key);console.log(viewport.width,'epoka4',key)}
   assert.deepEqual(errors,[]);results.push({viewport,status:'PASS',classicLayout:true,quietAndFull:true,sections:8,helpOnce:true,pinning:true,locating:true,peopleLocations:true,pauseSemantics:true,offlineReload:true,epoka4:true,errors});await context.close();
  }
 }finally{if(browser)await browser.close();if(server)server.kill('SIGTERM')}
 const report={status:'PASS',results,unverified:['physical Android touch','phone performance','battery power']};fs.writeFileSync(path.join(output,'chromium-workspace.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
})().catch(error=>{console.error(error);process.exitCode=1});
