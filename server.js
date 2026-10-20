// Serwer statyczny i tabela deklarowanych wyników. Rozgrywka odbywa się lokalnie;
// podpis próby chroni jej tożsamość, nie stanowi serwerowego dowodu uczciwej gry.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const crypto = require('node:crypto');
const {pipeline} = require('node:stream');
const ROOT = path.join(__dirname, 'dist');
const PORT = process.env.PORT || 3000;
const DATA = process.env.DATA_DIR || path.join(__dirname, 'data');
const TYPES = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.webmanifest':'application/manifest+json','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon','.txt':'text/plain; charset=utf-8'};
const posts = new Map(), starts = new Map();
function isoWeek(date) {
 const utc = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
 utc.setUTCDate(utc.getUTCDate() + 4 - (utc.getUTCDay() || 7));
 const first = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
 const number = Math.ceil(((utc-first)/864e5+1)/7);
 return {id:utc.getUTCFullYear()+'-W'+String(number).padStart(2,'0'),n:number};
}
function hash(text) {let value=2166136261;for(const character of text){value^=character.charCodeAt(0);value=Math.imul(value,16777619)}return value>>>0}
function weekInfo() {
 const now=new Date(),week=isoWeek(now),end=new Date(now);
 end.setUTCDate(end.getUTCDate()+(8-(now.getUTCDay()||7)));end.setUTCHours(0,0,0,0);
 return {week:week.id,seed:1000+hash('przystan-'+week.id)%89000,chal:week.n%3,diff:1,until:end.toISOString(),verification:'declared'};
}
function json(response,status,body) {
 if(response.headersSent||response.destroyed)return;
 response.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
 response.end(JSON.stringify(body));
}
function resultFile(week) {if(!/^\d{4}-W\d{2}$/.test(week))throw new Error('week');return path.join(DATA,'wyniki-'+week+'.json')}
function loadResults(week) {
 try{const list=JSON.parse(fs.readFileSync(resultFile(week),'utf8'));if(!Array.isArray(list))throw new Error('bad results');return list}
 catch(error){if(error.code==='ENOENT')return [];throw error}
}
function saveResults(week,list) {
 fs.mkdirSync(DATA,{recursive:true});const file=resultFile(week),temporary=file+'.tmp';
 fs.writeFileSync(temporary,JSON.stringify(list),{mode:0o600});fs.renameSync(temporary,file);
}
let signingKey;
function key() {
 if(signingKey)return signingKey;fs.mkdirSync(DATA,{recursive:true});const file=path.join(DATA,'rank-secret.key');
 try{fs.writeFileSync(file,crypto.randomBytes(32),{flag:'wx',mode:0o600})}catch(error){if(error.code!=='EEXIST')throw error}
 signingKey=fs.readFileSync(file);if(signingKey.length!==32)throw new Error('bad signing key');return signingKey;
}
function sign(payload) {return crypto.createHmac('sha256',key()).update(payload).digest('base64url')}
function issueRun() {const week=weekInfo(),payload=Buffer.from(JSON.stringify({id:crypto.randomBytes(16).toString('hex'),week:week.week,seed:week.seed})).toString('base64url');return {token:payload+'.'+sign(payload),verification:'declared'}}
function verifyRun(token,week) {
 if(typeof token!=='string'||token.length>512)return null;const [payload,signature,...extra]=token.split('.');
 if(!payload||!signature||extra.length)return null;const expected=Buffer.from(sign(payload));const supplied=Buffer.from(signature);
 if(expected.length!==supplied.length||!crypto.timingSafeEqual(expected,supplied))return null;
 try{const run=JSON.parse(Buffer.from(payload,'base64url').toString());return /^[a-f0-9]{32}$/.test(run.id)&&run.week===week.week&&run.seed===week.seed?run:null}catch(error){return null}
}
const clean=value=>String(value||'').replace(/[^\p{L}\p{N} .'-]/gu,'').trim().slice(0,24);
function validMetrics(body) {
 const bounded=(value,max,integer=false)=>typeof value==='number'&&Number.isFinite(value)&&value>=0&&value<=max&&(!integer||Number.isInteger(value));
 return bounded(body.day,4000)&&bounded(body.pop,999,true)&&body.pop>0&&bounded(body.pam,100000)&&bounded(body.hamPop,100000,true)&&[1,2,3].includes(body.epoch);
}
function remoteAddress(request) {
 const socket=request.socket.remoteAddress||'';
 return process.env.TRUST_PROXY==='1'?String(request.headers['x-forwarded-for']||socket).split(',').pop().trim():socket;
}
function limited(map,identity,interval) {
 const now=Date.now(),previous=map.get(identity);if(previous!==undefined&&now-previous<interval)return true;
 if(map.size>=5000)for(const [entry,time]of map)if(now-time>=60000)map.delete(entry);
 if(map.size>=5000)return true;map.set(identity,now);return false;
}
function publicResults(list) {return list.slice().sort((left,right)=>right.score-left.score).slice(0,20).map(entry=>({name:clean(entry.name),vil:clean(entry.vil),day:entry.day,pop:entry.pop,score:entry.score,ver:entry.ver,verification:'declared'}))}
function api(request,response,pathname) {
 try{
  if(pathname==='/api/tydzien'&&request.method==='GET')return json(response,200,weekInfo());
  if(pathname==='/api/wyniki'&&request.method==='GET'){
   const week=new URL(request.url,'http://localhost').searchParams.get('week')||weekInfo().week;
   if(!/^\d{4}-W\d{2}$/.test(week))return json(response,400,{err:'zły tydzień'});
   return json(response,200,{week,list:publicResults(loadResults(week)),verification:'declared'});
  }
  if(pathname==='/api/proba'&&request.method==='POST'){
   request.resume();if(limited(starts,remoteAddress(request),1000))return json(response,429,{err:'za często'});
   return json(response,200,issueRun());
  }
  if(pathname!=='/api/wynik'||request.method!=='POST')return json(response,404,{err:'nie ma'});
  const chunks=[];let bytes=0,finished=false;
  const timer=setTimeout(()=>{finished=true;json(response,408,{err:'przekroczono czas żądania'})},6000);timer.unref();
  const finish=(status,payload)=>{clearTimeout(timer);finished=true;json(response,status,payload)};
  response.on('close',()=>clearTimeout(timer));
  request.on('error',()=>finish(400,{err:'przerwane żądanie'}));
  request.on('data',chunk=>{if(finished)return;bytes+=chunk.length;if(bytes>2048)return finish(413,{err:'za duże'});chunks.push(chunk)});
  request.on('end',()=>{
   if(finished)return;
   try{
    let submitted;try{submitted=JSON.parse(Buffer.concat(chunks).toString('utf8'))}catch(error){return finish(400,{err:'zły JSON'})}
    if(!submitted||typeof submitted!=='object'||Array.isArray(submitted))return finish(400,{err:'oczekiwano obiektu'});
    const week=weekInfo();if(submitted.week!==week.week||submitted.seed!==week.seed)return finish(400,{err:'to nie jest wyspa tego tygodnia'});
    if(!validMetrics(submitted))return finish(400,{err:'nieprawidłowy postęp'});
    const run=verifyRun(submitted.token,week);if(!run)return finish(401,{err:'brak ważnej próby'});
    const score=Math.min(200000,Math.round(submitted.day*10+submitted.pop*25+submitted.pam*3+submitted.hamPop*10+(submitted.epoch>=2?500:0)));
    if(submitted.score!==score)return finish(400,{err:'wynik nie zgadza się z postępem'});
    if(limited(posts,run.id,4000))return finish(429,{err:'za często'});
    const entry={id:run.id,name:clean(submitted.name)||'Bezimienni',vil:clean(submitted.vil),day:submitted.day,pop:submitted.pop,score,ver:String(submitted.ver||'').slice(0,10),t:Date.now(),verification:'declared'};
    const list=loadResults(week.week),index=list.findIndex(item=>item.id===run.id);
    if(index>=0&&list[index].score>=score)return finish(200,{ok:true,best:list[index].score,place:list.slice().sort((a,b)=>b.score-a.score).findIndex(item=>item.id===run.id)+1,of:list.length,verification:'declared'});
    if(index>=0)list[index]=entry;else list.push(entry);list.sort((a,b)=>b.score-a.score);list.length=Math.min(500,list.length);
    saveResults(week.week,list);return finish(200,{ok:true,best:score,place:list.findIndex(item=>item.id===run.id)+1,of:list.length,verification:'declared'});
   }catch(error){console.warn('API wyników:',error.message);return finish(503,{err:'wyniki są chwilowo niedostępne; spróbuj ponownie'})}
  });
 }catch(error){console.warn('API:',error.message);return json(response,503,{err:'wyniki są chwilowo niedostępne'})}
}
const server=http.createServer((request,response)=>{
 try{
  let pathname;try{pathname=decodeURIComponent((request.url||'/').split('?')[0])}catch(error){return json(response,400,{err:'zły adres'})}
  if(/[\u0000-\u001f]/.test(pathname))return json(response,400,{err:'zły adres'});
  if(pathname.startsWith('/api/'))return api(request,response,pathname);
  if(!['GET','HEAD'].includes(request.method)){response.setHeader('Allow','GET, HEAD');return json(response,405,{err:'niedozwolona metoda'})}
  if(pathname.endsWith('/'))pathname+='index.html';const resolved=path.resolve(ROOT,'.'+pathname);
  if(resolved!==ROOT&&!resolved.startsWith(ROOT+path.sep))return json(response,403,{err:'niedozwolona ścieżka'});
  fs.stat(resolved,(error,stat)=>{
   const file=error||!stat.isFile()?path.join(ROOT,'index.html'):resolved,extension=path.extname(file);
   const headers={'Content-Type':TYPES[extension]||'application/octet-stream','Cache-Control':extension==='.html'||file.endsWith('sw.js')||extension==='.webmanifest'?'no-cache':'public, max-age=86400','X-Content-Type-Options':'nosniff'};
   if(file.endsWith('sw.js'))headers['Service-Worker-Allowed']='/';
   // bez ponownego pobierania: przeglądarka pyta „czy się zmieniło”, a serwer odpowiada 304, gdy plik jest ten sam
   const tag=stat&&stat.isFile()?'W/"'+stat.size.toString(36)+'-'+Math.floor(stat.mtimeMs).toString(36)+'"':null;
   if(tag){headers.ETag=tag;if(request.headers['if-none-match']===tag){response.writeHead(304,headers);return response.end()}}
   const zipped=/gzip/.test(request.headers['accept-encoding']||'')&&/\.(html|js|webmanifest|json)$/.test(file);
   if(zipped){headers['Content-Encoding']='gzip';headers.Vary='Accept-Encoding'}
   if(request.method==='HEAD'){response.writeHead(200,headers);return response.end()}
   const stream=fs.createReadStream(file);stream.once('open',()=>{response.writeHead(200,headers);if(zipped)pipeline(stream,zlib.createGzip(),response,()=>{});else pipeline(stream,response,()=>{})});
   stream.once('error',()=>{if(!response.headersSent)json(response,503,{err:'gra jest chwilowo niedostępna'})});
  });
 }catch(error){json(response,500,{err:'błąd żądania'})}
});
server.requestTimeout=15000;server.headersTimeout=10000;
server.on('clientError',(error,socket)=>{if(socket.writable)socket.end('HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n')});
server.listen(PORT,()=>console.log('Przystań działa na porcie '+server.address().port));
