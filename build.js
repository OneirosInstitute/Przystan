// Składa grę z plików w src/ w jeden index.html i przygotowuje wersję do instalacji (PWA) w dist/.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const SRC=path.join(__dirname,'src'),AS=path.join(__dirname,'assets'),OUT=path.join(__dirname,'dist');
const PARTS=['p_head.html','p_const.js','p_wyspa.js','p_mid.js','p_resources.js','p_flow.js','p_worksites.js','p_navigation.js','p_lifecycle.js','p_rest.js','p_daily.js','p_save.js','p_ui_sections.js','p_map.js','p_tech.js','p_exp.js','p_v8.js','p_bld.js','p_story.js','p_slav.js','p_wild.js','p_ludzie.js','p_urz.js','p_pamiec.js','p_akt.js','p_kol.js','p_przys.js','p_slady.js','p_lad.js','p_gosp.js','p_bud.js','p_swiat.js','p_szlif.js','p_mapa.js','p_karcz.js','p_cisza.js','p_sluzba.js','p_zycie.js','p_rok.js','p_wiedza.js','p_gfx.js','p_grafika.js','p_ksiega.js','p_ratunek.js','p_g18.js','p_e2.js','p_e2d.js','p_e2m.js','p_e21.js','p_e22.js','p_woz.js','p_zad.js','p_rozb.js','p_noc.js','p_opow.js','p_przyr.js','p_handel.js','p_tydzien.js','p_e3.js','p_zwierz.js','p_postaci.js','p_pogoda.js','p_rola.js','p_odkr.js','p_zloza.js','p_krainy.js','p_rod.js','p_cel.js','p_hod.js','p_serce.js','p_ognisko.js','p_misje.js','p_drogi.js','p_postep.js','p_dusza.js','p_wieczor.js','p_e4_world.js','p_e4_catalog.js','p_e4_domain.js','p_e4_life.js','p_e4_economy.js','p_e4_population.js','p_e4_audit.js','p_bat.js','p_tasks.js','p_supply.js','p_e4_view.js','p_e4_game.js','p_e4_ui.js','p_tracking.js','p_journal.js','p_menu.js','p_people_motion.js','p_world_detail.js','p_glow.js','p_nawigacja.js','p_klimat.js','p_ai.js','p_departure.js','p_flow_bridge.js','p_update.js','p_lod.js','p_end.js'];
fs.rmSync(OUT,{recursive:true,force:true});fs.mkdirSync(OUT,{recursive:true});
let game=PARTS.map(f=>fs.readFileSync(path.join(SRC,f),'utf8')).join('');
game=game.replace('https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.min.js','./three.module.js');
const head=`<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#141b18">
<meta name="description" content="Przystań – spokojna gra o rozbitkach, którzy budują osadę na dzikiej wyspie.">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Przystań">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
`;
const html=head+game.replace('<div id="app">','</head>\n<body>\n<div id="app">')+'\n</body>\n</html>\n';
fs.writeFileSync(path.join(OUT,'index.html'),html);
for(const f of fs.readdirSync(AS))fs.copyFileSync(path.join(AS,f),path.join(OUT,f));
const man={name:'Przystań – dzika wyspa',short_name:'Przystań',description:'Spokojna gra o rozbitkach, którzy budują osadę na dzikiej wyspie.',lang:'pl',id:'./',start_url:'./',scope:'./',
 display:'fullscreen',display_override:['fullscreen','standalone'],orientation:'any',background_color:'#141b18',theme_color:'#141b18',categories:['games'],
 icons:[{src:'icon-192.png',sizes:'192x192',type:'image/png',purpose:'any'},{src:'icon-512.png',sizes:'512x512',type:'image/png',purpose:'any'},{src:'icon-maskable-512.png',sizes:'512x512',type:'image/png',purpose:'maskable'}],
 screenshots:[{src:'screen-wide.png',sizes:'1280x800',type:'image/png',form_factor:'wide',label:'Osada nad zatoką'},{src:'screen-narrow.png',sizes:'412x870',type:'image/png',form_factor:'narrow',label:'Osada na telefonie'}]};
fs.writeFileSync(path.join(OUT,'manifest.webmanifest'),JSON.stringify(man,null,1));
const core=['./','index.html','three.module.js','three.core.js','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png'];
const digest=crypto.createHash('sha256').update(html+JSON.stringify(man));
for(const filename of fs.readdirSync(AS).sort()){digest.update(filename);digest.update(fs.readFileSync(path.join(AS,filename)))}
const ver=digest.digest('hex').slice(0,10);
fs.writeFileSync(path.join(OUT,'sw.js'),`// Przystań: działa bez internetu. Pliki gry w pamięci podręcznej, czcionki dociągane przy pierwszym uruchomieniu.
const PREFIX='przystan-'+new URL(self.registration.scope).pathname.replace(/[^a-zA-Z0-9]/g,'_')+'-';
const V=PREFIX+'${ver}';
const CORE=${JSON.stringify(core)};
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith(PREFIX)&&x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(u.origin===location.origin&&u.pathname.includes("/api/"))return;
 if(u.origin===location.origin){
  // 4.6.0-rc.2: strona najpierw z sieci (krótkie oczekiwanie), z pamięci tylko bez sieci. Wcześniej po każdej aktualizacji
  // najpierw uruchamiała się stara gra z pamięci, a po chwili cała strona ładowała się drugi raz już w nowej wersji.
  if(r.mode==='navigate'){e.respondWith(caches.open(V).then(async c=>{try{const res=await Promise.race([fetch(r),new Promise((_,no)=>setTimeout(()=>no(new Error('wolna sieć')),3500))]);if(res&&res.ok){await c.put('index.html',res.clone());return res}}catch(error){}return(await c.match('index.html'))||fetch(r)}));return}
  e.respondWith(caches.open(V).then(cache=>cache.match(r).then(m=>m||fetch(r).then(async res=>{if(res.ok)await cache.put(r,res.clone());return res}))));return}
 if(/fonts\\.(googleapis|gstatic)\\.com$/.test(u.hostname)){e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put(r,c));return res}).catch(()=>new Response('',{status:200,headers:{'Content-Type':'text/css'}}))))}
});
`);
console.log('Zbudowano dist/ (wersja '+ver+', '+Math.round(html.length/1024)+' kB index.html)');
