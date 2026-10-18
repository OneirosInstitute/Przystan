/* Real DOM/WebGL verification of the RC6 daily checkpoint and save boundary. */
const {chromium}=require(process.env.PRZYSTAN_PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const output=process.env.PRZYSTAN_BROWSER_OUTPUT||path.resolve('browser-evidence');fs.mkdirSync(output,{recursive:true});
 let browser,server;
 try{
  server=require('node:child_process').spawn(process.execPath,[path.join(__dirname,'../server.js')],{env:{...process.env,PORT:'4317'},stdio:['ignore','pipe','inherit']});await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject)});
  browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH,args:JSON.parse(process.env.PRZYSTAN_CHROMIUM_ARGS||'[]')});
  const page=await browser.newPage({viewport:{width:412,height:870}}),errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.route('http://127.0.0.1:4317/',async route=>{const response=await route.fetch();const html=(await response.text()).replace(/\n\}\);\s*<\/script>/,'\nwindow.__qaEval=expression=>eval(expression);\n});\n</script>');await route.fulfill({response,body:html})});
  await page.goto('http://127.0.0.1:4317/');await page.waitForFunction(()=>!!window.__g);await page.locator('#go').click();await page.waitForTimeout(800);
  const result=await page.evaluate(()=>window.__qaEval(`(()=>{
   evOpen=null;$('ev').hidden=true;closeSheet();S.speed=0;S.evT=10000;S.day=2.01;
   const old=e2Daily;e2Daily=function(){old();S.res.opal+=.125};
   const meat=SPOIL.mieso,fish=SPOIL.ryby;S.res.sol=5;newDay();e2Daily=old;
   const stored=JSON.parse(localStorage.getItem(SAVEKEY));
   const daily={saved:stored.res.opal===S.res.opal,loadable:!!decodeSave(JSON.stringify(stored)),spoilRestored:meat===SPOIL.mieso&&fish===SPOIL.ryby,saveOk:saveStatus.ok};
   S.e3={done:1};const migrated=e4Start().ok;E4Economy.advance(S,.01,e4Daily);
   const before=serializeSave(),broken=JSON.parse(before);broken.e4.startTime='broken';
   const rejected=decodeSave(JSON.stringify(broken))===null,unchanged=before===serializeSave();
   return {daily,migrated,rejected,unchanged,validSave:save()&&!!decodeSave(serializeSave())};
  })()`));
  assert.ok(Object.values(result.daily).every(Boolean));assert.ok(result.migrated&&result.rejected&&result.unchanged&&result.validSave);assert.deepEqual(errors,[]);
  const report={status:'PASS',result,errors,environment:'Chromium with software WebGL; no physical Android performance measurement'};fs.writeFileSync(path.join(output,'chromium-hardening.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
 }finally{await browser?.close();server?.kill()}
})().catch(error=>{console.error(error);process.exitCode=1});
