/* Isolated Chromium/WebGL lifecycle QA; visibility override is explicit, freeze is native CDP. */
const {chromium}=require(process.env.PRZYSTAN_PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
(async()=>{
 const binary=process.env.PRZYSTAN_CHROMIUM_MODULE?require(process.env.PRZYSTAN_CHROMIUM_MODULE):null;
 const output=process.env.PRZYSTAN_BROWSER_OUTPUT||path.resolve('browser-evidence');fs.mkdirSync(output,{recursive:true});
 let server,browser;const results=[];
 try{
  if(process.env.PRZYSTAN_START_SERVER==='1'){
   server=require('node:child_process').spawn(process.execPath,[path.join(__dirname,'../server.js')],{env:{...process.env,PORT:'4317'},stdio:['ignore','pipe','inherit']});
   await new Promise((resolve,reject)=>{server.once('error',reject);server.once('exit',code=>reject(new Error('server exit '+code)));server.stdout.once('data',resolve)});
  }
  browser=await chromium.launch({headless:true,executablePath:binary?await binary.executablePath():process.env.CHROMIUM_PATH,args:binary?binary.args:JSON.parse(process.env.PRZYSTAN_CHROMIUM_ARGS||'[]')});
  for(const viewport of [{width:412,height:870},{width:1280,height:800}]){
   const context=await browser.newContext({viewport,serviceWorkers:'block'}),page=await context.newPage(),errors=[],requests=[];
   page.on('pageerror',error=>errors.push(error.message));page.on('request',request=>requests.push(request.url()));
   await page.addInitScript(()=>{
    localStorage.setItem('przystan-autocam','0');localStorage.setItem('przystan-gfx','0');
    const qa=window.__lifeQA={frames:0,draws:0,raf:new Set(),intervals:new Set(),timeouts:new Set(),audio:[],visibilityOverride:true};
    const raf=window.requestAnimationFrame.bind(window),cancel=window.cancelAnimationFrame.bind(window);
    window.requestAnimationFrame=callback=>{const id=raf(now=>{qa.raf.delete(id);qa.frames++;callback(now)});qa.raf.add(id);return id};
    window.cancelAnimationFrame=id=>{qa.raf.delete(id);cancel(id)};
    const interval=window.setInterval.bind(window),clearIntervalNative=window.clearInterval.bind(window);
    window.setInterval=(callback,ms,...args)=>{const id=interval(callback,ms,...args);qa.intervals.add(id);return id};
    window.clearInterval=id=>{qa.intervals.delete(id);clearIntervalNative(id)};
    const timeout=window.setTimeout.bind(window),clearTimeoutNative=window.clearTimeout.bind(window);
    window.setTimeout=(callback,ms,...args)=>{const id=timeout(()=>{qa.timeouts.delete(id);callback(...args)},ms);qa.timeouts.add(id);return id};
    window.clearTimeout=id=>{qa.timeouts.delete(id);clearTimeoutNative(id)};
    for(const type of ['WebGLRenderingContext','WebGL2RenderingContext'])for(const method of ['drawArrays','drawElements','drawArraysInstanced','drawElementsInstanced']){
     const prototype=window[type]?.prototype,original=prototype?.[method];if(original)prototype[method]=function(...args){qa.draws++;return original.apply(this,args)};
    }
    const Audio=window.AudioContext;if(Audio)window.AudioContext=class extends Audio{constructor(...args){super(...args);qa.audio.push(this)}};
    qa.hide=hidden=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>hidden});Object.defineProperty(document,'visibilityState',{configurable:true,get:()=>hidden?'hidden':'visible'});document.dispatchEvent(new Event('visibilitychange'))};
    qa.sample=()=>({frames:qa.frames,draws:qa.draws,queuedFrames:qa.raf.size,intervals:qa.intervals.size,timeouts:qa.timeouts.size,audio:qa.audio.map(audio=>audio.state),day:window.__g.S.day,stored:JSON.parse(localStorage.getItem('przystan-v7'))?.res.drewno});
   });
   await page.goto(process.env.PRZYSTAN_URL||'http://127.0.0.1:4317/');await page.waitForFunction(()=>!!window.__g,{timeout:60000});
   await page.locator('#go').click();await page.waitForFunction(()=>!!window.__g?.S&&document.getElementById('intro').style.display==='none');await page.evaluate(()=>{const game=window.__g;game.closeSheet();game.S.speed=0});
   await wait(300);const foreground=await page.evaluate(()=>__lifeQA.sample());assert.ok(foreground.draws>0);
   assert.equal(foreground.queuedFrames,1);assert.equal(foreground.intervals,1);assert.deepEqual(foreground.audio,['running']);
   await page.evaluate(()=>{window.__g.S.res.drewno=61;__lifeQA.hide(true)});await wait(200);
   const before=await page.evaluate(()=>__lifeQA.sample()),networkBefore=requests.length;
   assert.equal(before.queuedFrames,0);assert.equal(before.intervals,0);assert.equal(before.timeouts,0);assert.deepEqual(before.audio,['suspended']);assert.equal(before.stored,61);
   await wait(16000);const after=await page.evaluate(()=>__lifeQA.sample());assert.deepEqual(after,before);assert.equal(requests.length,networkBefore,'no background network activity');
   await page.evaluate(()=>__lifeQA.hide(false));await wait(200);const returned=await page.evaluate(()=>__lifeQA.sample());
   assert.ok(returned.draws>after.draws);assert.equal(returned.queuedFrames,1);assert.equal(returned.intervals,1);assert.deepEqual(returned.audio,['running']);
   // Rapidly alternate visibility without multiplying loops or stranding audio in suspend.
   await page.evaluate(()=>{for(let index=0;index<8;index++){__lifeQA.hide(true);__lifeQA.hide(false)}});await wait(250);
   const rapid=await page.evaluate(()=>__lifeQA.sample());assert.equal(rapid.queuedFrames,1);assert.equal(rapid.intervals,1);assert.deepEqual(rapid.audio,['running']);
   const cdp=await context.newCDPSession(page);await cdp.send('Page.setWebLifecycleState',{state:'frozen'});await wait(1000);await cdp.send('Page.setWebLifecycleState',{state:'active'});await wait(200);
   const resumed=await page.evaluate(()=>__lifeQA.sample());assert.equal(resumed.queuedFrames,1);assert.equal(resumed.intervals,1);assert.deepEqual(resumed.audio,['running']);
   await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true})));await wait(150);
   const hiddenPage=await page.evaluate(()=>__lifeQA.sample());assert.equal(hiddenPage.queuedFrames,0);assert.equal(hiddenPage.intervals,0);assert.deepEqual(hiddenPage.audio,['suspended']);
   await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true})));await wait(150);
   assert.equal(await page.evaluate(()=>__lifeQA.sample().queuedFrames),1);
   await page.evaluate(()=>{window.__g.S.res.drewno=59;__lifeQA.hide(true)});await wait(100);await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>!!window.__g,{timeout:60000});await page.locator('#go').click();await page.waitForFunction(()=>!!window.__g?.S&&document.getElementById('intro').style.display==='none');
   assert.equal(await page.evaluate(()=>window.__g.S.res.drewno),59);assert.deepEqual(errors,[]);
   results.push({viewport,status:'PASS',hiddenSeconds:16,visibility:'document visibility overridden in isolated QA page',nativeFreezeResume:true,foreground,hidden:before,afterHidden:after,returned,rapid,saveSurvivesReload:true,errors});
   await context.close();console.log('lifecycle viewport PASS',viewport.width);
  }
 }finally{if(browser)await browser.close();if(server)server.kill('SIGTERM')}
 const report={status:'PASS',results,unverified:['physical Android lifecycle','battery discharge','GPU power','temperature','Android process eviction']};
 fs.writeFileSync(path.join(output,'chromium-lifecycle.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
})().catch(error=>{console.error(error);process.exitCode=1});
