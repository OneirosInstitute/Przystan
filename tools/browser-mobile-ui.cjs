/* Local real-browser acceptance: portrait, inline options, live ledger and SW updates. */
const {chromium}=require(process.env.PRZYSTAN_PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
(async()=>{
 const output=process.env.PRZYSTAN_BROWSER_OUTPUT||path.resolve('browser-evidence');fs.mkdirSync(output,{recursive:true});
 const dist=path.resolve(__dirname,'../dist');let generation=1,browser;const results=[];
 const server=http.createServer((request,response)=>{
  const name=new URL(request.url,'http://localhost').pathname;
  const file=path.resolve(dist,name==='/'?'index.html':'.'+name);if(!file.startsWith(dist+path.sep)){response.writeHead(403);response.end();return}
  if(!fs.existsSync(file)){response.writeHead(404);response.end();return}
  const extension=path.extname(file),types={'.html':'text/html','.js':'text/javascript','.webmanifest':'application/manifest+json','.png':'image/png'};response.setHeader('Content-Type',types[extension]||'application/octet-stream');response.setHeader('Cache-Control','no-store');
  let content=fs.readFileSync(file);
  if(name==='/'||name==='/index.html')content=content.toString().replace(/\n\}\);\s*<\/script>/,'\nwindow.__qaEval=expression=>eval(expression);\n});\n</script>');
  if(name==='/sw.js')content=content.toString().replace(/const V=PREFIX\+'([^']+)'/,(_,version)=>"const V=PREFIX+'"+version+'-qa'+generation+"'");
  response.end(content);
 });
 await new Promise(resolve=>server.listen(4317,'127.0.0.1',resolve));
 try{
  browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH,args:JSON.parse(process.env.PRZYSTAN_CHROMIUM_ARGS||'[]')});
  async function dismiss(page){
   // Przygotuj osadę przez rzeczywiste decyzje; ukrycie dialogu zostawiałoby sprawę niezałatwioną.
   await page.evaluate(()=>window.__qaEval('S.speed=0;S.evT=10000'));
   for(let attempt=0;attempt<16;attempt++){
    await page.evaluate(()=>window.__qaEval('custTick()'));
    if(await page.locator('#ev').isVisible()){
     const close=page.locator('#ev [data-close]');if(await close.count())await close.click();else await page.locator('#ev [data-o="0"]').click();
     await page.evaluate(()=>window.__g.S.speed=0);
    }else if(await page.evaluate(()=>window.__qaEval('!!S.cust.umowa&&!evOpen')))return;
   }
   throw Error('Initial settlement decisions did not settle');
  }
  for(const viewport of [{width:352,height:768},{width:768,height:352},{width:412,height:870}]){
   const context=await browser.newContext({viewport,screen:viewport,isMobile:true,hasTouch:true}),page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
   await page.addInitScript(()=>{localStorage.setItem('przystan-gfx','0');localStorage.setItem('przystan-autocam','0');Object.defineProperty(navigator,'standalone',{get:()=>true})});
   await page.goto('http://127.0.0.1:4317/');await page.waitForFunction(()=>!!window.__g);await page.locator('#go').click();await page.waitForFunction(()=>!!document.fullscreenElement);
   await page.waitForTimeout(800);await dismiss(page);await page.evaluate(()=>window.__qaEval("closeSheet();S.speed=0;S.evT=10000"));
   const fullscreen=await page.evaluate(()=>({active:!!document.fullscreenElement,standalone:navigator.standalone,app:{x:document.querySelector('#app').getBoundingClientRect().x,y:document.querySelector('#app').getBoundingClientRect().y,width:document.querySelector('#app').clientWidth,height:document.querySelector('#app').clientHeight},viewport:{width:innerWidth,height:innerHeight}}));
   assert.ok(fullscreen.active&&fullscreen.standalone);assert.equal(fullscreen.app.x,0);assert.equal(fullscreen.app.y,0);assert.equal(fullscreen.app.width,fullscreen.viewport.width);assert.equal(fullscreen.app.height,fullscreen.viewport.height);
   for(const quiet of [true,false]){
    await page.evaluate(value=>window.__qaEval(`menuSetMode(${value});nvGo('mieszkancy')`),quiet);
    await dismiss(page);const section=page.locator('[data-ui-section="osada:people"]');assert.equal(await section.evaluate(element=>element.open),false);await section.locator(':scope > summary').click();
    await page.evaluate(()=>window.__qaEval('renderPanel()'));assert.equal(await section.evaluate(element=>element.open),true);await section.locator(':scope > summary').click();
    await page.evaluate(()=>window.__qaEval("nvGo('opcje')"));const options=page.locator('[data-ui-section="game:options"]');await options.evaluate(element=>{if(!element.open)element.querySelector('summary').click()});
    assert.equal(await options.locator('a').count(),0);assert.ok((await options.innerText()).includes(require('../package.json').version));assert.ok(await options.locator('[data-ui-fullscreen]').isVisible());
    await page.evaluate(()=>window.__qaEval("closeSheet();zapShow()"));const woodGroup=page.locator('[data-ui-section="stock:compact:przystan:Opał i budulec"]');await woodGroup.evaluate(element=>{if(!element.open)element.querySelector('summary').click()});
    await page.evaluate(()=>window.__qaEval("ResourceFlow.attach(S,{reset:true});ResourceFlow.run(S,'economy',()=>{S.res.drewno+=10;S.res.drewno-=4});S.day+=.25;S.t+=60;zapFill(true)"));
    const compact=page.locator('[data-stock-resource="drewno"]');assert.match(await compact.innerText(),/\+24/);assert.ok(await compact.evaluate(element=>element.classList.contains('stock-surplus')));const details=page.locator('[data-ui-section="stock:details:przystan"]');await details.evaluate(element=>{if(!element.open)element.querySelector('summary').click()});
    const row=page.locator('[data-flow-resource="drewno"]');await page.waitForFunction(()=>document.querySelector('[data-flow-resource="drewno"]')?.innerText.includes('+40'));assert.ok((await row.innerText()).includes('−16'));
    assert.equal(await woodGroup.evaluate(element=>element.open),true);assert.equal(await page.locator('#zappop').evaluate(element=>element.scrollWidth<=element.clientWidth+2),true);
    await page.screenshot({path:path.join(output,`stock-${viewport.width}-${quiet?'quiet':'full'}.png`)});
    await page.locator('[data-zapclose]').last().scrollIntoViewIfNeeded();await page.locator('[data-zapclose]').last().click();assert.equal(await page.locator('#zappop').isHidden(),true);
    await page.evaluate(()=>window.__qaEval('zapShow()'));assert.equal(await page.locator('#zappop').evaluate(element=>element.scrollTop),0);await page.locator('.zap-close').click();assert.equal(await page.locator('#zappop').isHidden(),true);
   }
   await page.evaluate(()=>window.__qaEval("menuSetMode(true);document.documentElement.style.setProperty('--safe-top','24px');document.documentElement.style.setProperty('--safe-bottom','20px')"));
   const safe=await page.evaluate(()=>({appY:document.querySelector('#app').getBoundingClientRect().y,padding:parseFloat(getComputedStyle(document.querySelector('#cz-top')).paddingTop)}));assert.equal(safe.appY,0);assert.equal(safe.padding,34);
   assert.deepEqual(errors,[]);results.push({viewport,fullscreen,inlineSections:true,liveRates:{production:40,use:16},disclosuresSurviveRefresh:true,noHorizontalOverflow:true,reopenStartsAtTop:true,topCloseButton:true,safeInsetOnce:true,errors});await context.close();
  }
  const context=await browser.newContext({viewport:{width:412,height:870}}),page=await context.newPage();let navigations=0;page.on('framenavigated',frame=>{if(frame===page.mainFrame())navigations++});
  await page.addInitScript(()=>{localStorage.setItem('przystan-gfx','0');localStorage.setItem('przystan-autocam','0')});await page.goto('http://127.0.0.1:4317/');await page.waitForFunction(()=>!!window.__g);await page.locator('#go').click();await page.waitForTimeout(800);await dismiss(page);await page.evaluate(()=>window.__qaEval("S.evT=10000;S.speed=0;S.res.drewno=73.25"));await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
  const before=navigations;generation++;
  await page.evaluate(()=>navigator.serviceWorker.getRegistration().then(registration=>registration.update()));await page.waitForFunction(()=>!!window.__g&&document.querySelector('#intro')?.style.display!=='none');assert.equal(navigations,before+1);await page.locator('#go').click();await dismiss(page);await page.waitForFunction(()=>window.__g?.S?.res.drewno===73.25);
  await page.evaluate(()=>window.__qaEval("S.speed=0;S.evT=10000;S.res.drewno=91.5;window.__storageSet=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key==='przystan-v7')throw Error('QA full storage');return window.__storageSet.call(this,key,value)}"));
  const failedBefore=navigations;generation++;await page.evaluate(()=>navigator.serviceWorker.getRegistration().then(registration=>registration.update()));await page.locator('#game-update').waitFor();assert.equal(navigations,failedBefore);assert.equal(await page.evaluate(()=>window.__g.S.res.drewno),91.5);
  await page.evaluate(()=>Storage.prototype.setItem=window.__storageSet);await page.locator('#game-update').click();await page.waitForFunction(()=>!!window.__g&&document.querySelector('#intro')?.style.display!=='none');await page.locator('#go').click();await dismiss(page);await page.waitForFunction(()=>window.__g?.S?.res.drewno===91.5);assert.equal(navigations,failedBefore+1);
  await context.close();const report={status:'PASS',results,serviceWorker:{realControllerChange:true,oneReload:true,savedBeforeReload:true,failedSavePreservesGame:true,retryPreservesGame:true},limits:['Physical Android system bars and touch feel require device verification.']};fs.writeFileSync(path.join(output,'mobile-ui-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
 }finally{await browser?.close();await new Promise(resolve=>server.close(resolve))}
})().catch(error=>{console.error(error);process.exitCode=1});
