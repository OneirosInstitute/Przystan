// Prosty serwer plików gry dla Railway (bez zależności). Serwuje folder dist/.
const http=require('http'),fs=require('fs'),path=require('path'),zlib=require('zlib');
const ROOT=path.join(__dirname,'dist'),PORT=process.env.PORT||3000;
const TYPES={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.webmanifest':'application/manifest+json','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon','.txt':'text/plain; charset=utf-8'};
http.createServer((req,res)=>{
 let p=decodeURIComponent((req.url||'/').split('?')[0]);if(p.endsWith('/'))p+='index.html';
 const f=path.normalize(path.join(ROOT,p));if(!f.startsWith(ROOT)){res.writeHead(403);return res.end()}
 fs.stat(f,(err,st)=>{
  const file=err||!st.isFile()?path.join(ROOT,'index.html'):f;const ext=path.extname(file);
  const noCache=ext==='.html'||file.endsWith('sw.js')||ext==='.webmanifest';
  const h={'Content-Type':TYPES[ext]||'application/octet-stream','Cache-Control':noCache?'no-cache':'public, max-age=86400','X-Content-Type-Options':'nosniff'};
  if(file.endsWith('sw.js'))h['Service-Worker-Allowed']='/';
  const gz=/gzip/.test(req.headers['accept-encoding']||'')&&/\.(html|js|webmanifest|json)$/.test(file);
  if(gz)h['Content-Encoding']='gzip';res.writeHead(200,h);
  const s=fs.createReadStream(file);if(gz)s.pipe(zlib.createGzip()).pipe(res);else s.pipe(res);
 });
}).listen(PORT,()=>console.log('Przystań działa na porcie '+PORT));
