// Prosty serwer gry dla Railway (bez zależności). Serwuje folder dist/ i API „Wyspa tygodnia”.
const http=require('http'),fs=require('fs'),path=require('path'),zlib=require('zlib');
const ROOT=path.join(__dirname,'dist'),PORT=process.env.PORT||3000;
// Wyniki trzymamy w pliku. Na Railway dodaj Volume i ustaw DATA_DIR na jego ścieżkę (np. /data), inaczej wyniki znikną przy każdym wdrożeniu.
const DATA=process.env.DATA_DIR||path.join(__dirname,'data');try{fs.mkdirSync(DATA,{recursive:true})}catch(e){}
const TYPES={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.webmanifest':'application/manifest+json','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon','.txt':'text/plain; charset=utf-8'};
const CHALS=3;
// tydzień ISO w UTC, np. 2026-W42
function isoWeek(d){const t=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()));const day=t.getUTCDay()||7;t.setUTCDate(t.getUTCDate()+4-day);const y0=new Date(Date.UTC(t.getUTCFullYear(),0,1));const w=Math.ceil(((t-y0)/864e5+1)/7);return{id:t.getUTCFullYear()+'-W'+String(w).padStart(2,'0'),n:w}}
function hash(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function weekInfo(){const now=new Date(),w=isoWeek(now);const end=new Date(now);end.setUTCDate(end.getUTCDate()+(8-(now.getUTCDay()||7)));end.setUTCHours(0,0,0,0);
 return{week:w.id,seed:1000+hash('przystan-'+w.id)%89000,chal:w.n%CHALS,diff:1,until:end.toISOString()}}
const fileOf=w=>path.join(DATA,'wyniki-'+String(w).replace(/[^0-9W-]/g,'')+'.json');
function load(w){try{return JSON.parse(fs.readFileSync(fileOf(w),'utf8'))}catch(e){return[]}}
function saveRes(w,L){try{fs.writeFileSync(fileOf(w),JSON.stringify(L))}catch(e){console.warn('zapis wyników',e.message)}}
const place=(L,name)=>L.slice().sort((a,b)=>b.score-a.score).findIndex(x=>x.name===name)+1;
const lastPost=new Map();
function json(res,code,o){res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(o))}
const clean=v=>String(v||'').replace(/[^\p{L}\p{N} .'-]/gu,'').trim().slice(0,24);
function api(req,res,p){
 if(p==='/api/tydzien'&&req.method==='GET')return json(res,200,weekInfo());
 if(p==='/api/wyniki'&&req.method==='GET'){const w=new URL(req.url,'http://x').searchParams.get('week')||weekInfo().week;return json(res,200,{week:w,list:load(w).sort((a,b)=>b.score-a.score).slice(0,20)})}
 if(p==='/api/wynik'&&req.method==='POST'){// ostatni adres dopisuje serwer pośredniczący Railway; pierwsze może podać sam klient
  const ip=String(req.headers['x-forwarded-for']||req.socket.remoteAddress||'').split(',').pop().trim();const t=Date.now();
  if(t-(lastPost.get(ip)||0)<4000)return json(res,429,{err:'za często'});lastPost.set(ip,t);if(lastPost.size>5000)lastPost.clear();
  let body='',big=false;req.on('data',c=>{if(big)return;body+=c;if(body.length>2048){big=true;json(res,413,{err:'za duże'});req.destroy()}});
  req.on('end',()=>{if(big)return;let o;try{o=JSON.parse(body)}catch(e){return json(res,400,{err:'zły JSON'})}
   const W=weekInfo();if(o.week!==W.week||+o.seed!==W.seed)return json(res,400,{err:'to nie jest wyspa tego tygodnia'});
   const n=(v,max)=>Math.max(0,Math.min(max,Math.round(+v||0)));
   const e={name:clean(o.name)||'Bezimienni',vil:clean(o.vil),day:n(o.day,4000),pop:n(o.pop,999),score:n(o.score,200000),ver:String(o.ver||'').slice(0,10),t};
   const L=load(W.week);const i=L.findIndex(x=>x.name===e.name);
   if(i>=0){if(L[i].score>=e.score)return json(res,200,{ok:true,best:L[i].score,place:place(L,e.name),of:L.length});L[i]=e}else L.push(e);
   L.sort((a,b)=>b.score-a.score);if(L.length>500)L.length=500;saveRes(W.week,L);json(res,200,{ok:true,best:e.score,place:place(L,e.name),of:L.length})});return}
 json(res,404,{err:'nie ma'})}
http.createServer((req,res)=>{
 let p;try{p=decodeURIComponent((req.url||'/').split('?')[0])}catch(e){res.writeHead(400);return res.end()}if(p.startsWith('/api/'))return api(req,res,p);if(p.endsWith('/'))p+='index.html';
 const f=path.normalize(path.join(ROOT,p));if(f!==ROOT&&!f.startsWith(ROOT+path.sep)){res.writeHead(403);return res.end()}
 fs.stat(f,(err,st)=>{
  const file=err||!st.isFile()?path.join(ROOT,'index.html'):f;const ext=path.extname(file);
  const noCache=ext==='.html'||file.endsWith('sw.js')||ext==='.webmanifest';
  const h={'Content-Type':TYPES[ext]||'application/octet-stream','Cache-Control':noCache?'no-cache':'public, max-age=86400','X-Content-Type-Options':'nosniff'};
  if(file.endsWith('sw.js'))h['Service-Worker-Allowed']='/';
  const gz=/gzip/.test(req.headers['accept-encoding']||'')&&/\.(html|js|webmanifest|json)$/.test(file);
  if(gz)h['Content-Encoding']='gzip';res.writeHead(200,h);
  const s=fs.createReadStream(file);s.on('error',()=>{try{res.end()}catch(e){}});if(gz)s.pipe(zlib.createGzip()).pipe(res);else s.pipe(res);
 });
}).on('clientError',(e,sock)=>{try{sock.end('HTTP/1.1 400 Bad Request\r\n\r\n')}catch(er){}}).listen(PORT,()=>console.log('Przystań działa na porcie '+PORT));

// siatka bezpieczeństwa: pojedyncze złe żądanie nie może położyć gry
process.on('uncaughtException',e=>console.error('błąd serwera',e&&e.message));
