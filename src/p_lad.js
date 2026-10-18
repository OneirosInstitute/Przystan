
/* ================= 0.20: ład wsi — ścieżki, płoty, ławy, drzewa owocowe, grządki, kwiaty, słupy rodowe; tryb zdjęć ================= */
const LAD={sciezka:{n:'Ścieżka',line:1,cost:{},d:'Wytyczona i wydeptana. Ludzie chodzą po niej o 20% szybciej.'},
 bruk:{n:'Ścieżka z kamieni',line:1,cost:{kamien:1},d:'Płaskie kamienie w ziemi. Nie błoci się, chodzi się po niej o 30% szybciej.'},
 plot:{n:'Płot z żerdzi',line:1,cost:{drewno:1},d:'Odgradza obejścia, pola i zagrody. Ludzie przechodzą przez furtki.'},
 lawa:{n:'Ława',cost:{drewno:3},d:'Siada się na niej wieczorem przed chatą. Starsi patrzą, jak dzieci się bawią.'},
 drzewo:{n:'Drzewo owocowe',cost:{},d:'Młoda jabłonka albo grusza. Po roku owocuje: jesienią daje owoce.',need:()=>slad('sad')||tech('u_sad'),why:'Najpierw trzeba zrozumieć zdziczały sad dawnego ludu.'},
 grzadka:{n:'Grządka',cost:{drewno:1},d:'Warzywa i zioła przy domu. Od wiosny do jesieni daje trochę warzyw.'},
 kwiaty:{n:'Kwiaty',cost:{},d:'Dzikie kwiaty przesadzone z łąki pod okna. Nic nie dają poza tym, że jest ładniej.'},
 slup:{n:'Słup rodowy',cost:{drewno:6},d:'Rzeźbiony słup ze znakiem rodu. Każdy ród stawia jeden. Wzmacnia mir i pamięć rodu.',need:()=>!!S.vname&&!!ladFreeRod(),why:'Najpierw osada musi mieć imię, a rody znaki. Każdy ród stawia tylko jeden słup.'}};
const LAD_K=Object.keys(LAD);
function ladInit(){S.lad=S.lad||{};}
function ladFreeRod(){S.rody=S.rody||{};const has=new Set(Object.values(S.lad||{}).filter(x=>x.t==='slup').map(x=>String(x.rod)));const c={};S.people.forEach(p=>{if(p.rod!==undefined&&!has.has(String(p.rod))&&S.rody[p.rod])c[p.rod]=(c[p.rod]||0)+1});
 const ids=Object.keys(c).sort((a,b)=>c[b]-c[a]);return ids[0]||null}
function ladOK(i,j){if(i<1||j<1||i>=N-1||j>=N-1)return false;const k=j*N+i;if(!land[k]||!rev[k]||occ[k]>=0||tileHH(i,j)<.05)return false;if(Math.hypot(i-camp.i,j-camp.j)<1.6||Math.hypot(i-camp.i,j-camp.j)>42)return false;
 if(tribe.some(t=>Math.abs(t.i-i)<=1&&Math.abs(t.j-j)<=1))return false;return true}
function ladAfford(c){return Object.entries(c).every(([k,v])=>(S.res[k]||0)>=v)}
function ladPut(t,i,j,quiet){ladInit();const k=j*N+i,d=LAD[t];if(!ladOK(i,j))return 0;const ex=S.lad[k];if(ex&&ex.t===t)return 0;if(ex&&!(d.line&&LAD[ex.t].line))return 0;
 if(d.need&&!d.need()){if(!quiet)toast(d.why);return -1}if(!ladAfford(d.cost)){if(!quiet)toast('Brakuje: '+Object.entries(d.cost).map(([k,v])=>RN[k].toLowerCase()).join(', '));return -1}
 Object.entries(d.cost).forEach(([r,v])=>S.res[r]-=v);
 nodes.forEach(n=>{if(n.type!=='fish'&&n.i===i&&n.j===j&&n.amt>0){if(n.type==='tree')S.res.drewno+=2;n.gone=1;n.amt=0;S.nodeAmt[n.id]=0;nodeVis(n)}});
 const it={t,d:S.day};if(t==='slup'){it.rod=ladFreeRod();pamAdd(2,'slup');const r=S.rody[it.rod];log(`${rodName(it.rod)} stawia słup rodowy ze znakiem ${r&&r.znak||''}. Kto przechodzi obok, wie, czyje to obejście.`)}
 if(t==='lawa')it.r=(i+j)%4;S.lad[k]=it;if(t!=='kwiaty'&&t!=='drzewo')decoHidden.add(k);ladDeco(k);ladDirty=1;return 1}
function ladDel(i,j){const k=j*N+i;if(!S.lad||!S.lad[k])return 0;delete S.lad[k];decoHidden.delete(k);ladDeco(k);ladDirty=1;return 1}
function ladDeco(k){const ds=tileDeco.get(k);if(ds){ds.forEach(([t,x])=>setDeco(t,x));decoMeshes.forEach(m=>m.instanceMatrix.needsUpdate=true)}}
function line4(i0,j0,i1,j1){const o=[[i0,j0]];let i=i0,j=j0;while(i!==i1||j!==j1){const di=i1-i,dj=j1-j;if(Math.abs(di)*Math.abs(j1-j0)>=Math.abs(dj)*Math.abs(i1-i0)&&di!==0)i+=Math.sign(di);else if(dj!==0)j+=Math.sign(dj);else i+=Math.sign(di);o.push([i,j]);if(o.length>200)break}return o}
function ladSpeed(p){if(!S.lad)return 1;const t=tileOf(p.x,p.z),x=S.lad[t[1]*N+t[0]];return!x?1:x.t==='bruk'?1.3:x.t==='sciezka'?1.2:1}
{const _pf=placeFootprint;placeFootprint=function(kind,i,j,val){_pf(kind,i,j,val);if(val>=0&&S&&S.lad){const d=BD[kind];for(let a=0;a<d.w;a++)for(let b=0;b<d.h;b++){const k=(j+b)*N+i+a;if(S.lad[k]){delete S.lad[k];ladDirty=1}}}}}

/* ---- wygląd ---- */
let ladDirty=1,ladSea=-1;const ladG=new THREE.Group();scene.add(ladG);
const LG={post:new THREE.CylinderGeometry(.045,.055,.95,5),rail:new THREE.BoxGeometry(1,.045,.04),stone:new THREE.DodecahedronGeometry(.17,0),seat:new THREE.BoxGeometry(1.05,.07,.34),leg:new THREE.BoxGeometry(.08,.34,.28),
 trunk:new THREE.CylinderGeometry(.06,.1,1,6),crown:new THREE.IcosahedronGeometry(.55,0),fruit:new THREE.SphereGeometry(.055,5,4),soil:new THREE.BoxGeometry(.86,.08,.86),row:new THREE.BoxGeometry(.7,.12,.12),
 flower:new THREE.ConeGeometry(.07,.16,5),pole:new THREE.CylinderGeometry(.14,.17,2.1,7),ring:new THREE.CylinderGeometry(.2,.2,.12,7)};
const LM={stone:M(0x8d8a82),soil:M(0x4a3626),green:M(0x5c7f3a),crown:M(0x6c8f48),crownA:M(0x8a8a3c),fruit:M(0xc2492a),pole:M(0x6a4e34),flower:M(0xffffff)};
const znakTex={};function znakMat(z){if(znakTex[z])return znakTex[z];const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');x.fillStyle='rgba(30,22,14,.85)';x.beginPath();x.arc(32,32,30,0,6.3);x.fill();
 x.fillStyle='#e2c48c';x.font='36px Georgia, serif';x.textAlign='center';x.textBaseline='middle';x.fillText(z||'◆',32,34);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return znakTex[z]=new THREE.SpriteMaterial({map:t,depthWrite:false})}
function ladBuild(){ladDirty=0;ladSea=seasonIdx();ladG.children.slice().forEach(o=>{ladG.remove(o);if(o.isInstancedMesh)o.dispose()});if(!S||!S.lad)return;
 const items=Object.entries(S.lad).map(([k,v])=>[+k,v]);const pos=k=>{const i=k%N,j=(k/N)|0,x=tcx(i),z=tcx(j);return[x,Hy(x,z),z,i,j]};const dm=new THREE.Object3D();const win=ladSea===2;
 const inst=(geo,mat,arr,fn)=>{if(!arr.length)return;const m=new THREE.InstancedMesh(geo,mat,arr.length);arr.forEach((a,q)=>{fn(a,dm);dm.updateMatrix();m.setMatrixAt(q,dm.matrix)});m.castShadow=true;m.receiveShadow=true;ladG.add(m);return m};
 const by=t=>items.filter(([k,v])=>v.t===t);
 // płoty
 const fen=by('plot'),fs=new Set(fen.map(a=>a[0]));inst(LG.post,matDark,fen,([k],o)=>{const p=pos(k);o.position.set(p[0],p[1]+.45,p[2]);o.rotation.set(0,k,0);o.scale.set(1,1,1)});
 const rails=[];fen.forEach(([k])=>{[1,N].forEach(d=>{if(fs.has(k+d))[.38,.7].forEach(h=>rails.push([k,k+d,h]))})});
 inst(LG.rail,mPlank,rails,([a,b,h],o)=>{const p=pos(a),q=pos(b);o.position.set((p[0]+q[0])/2,(p[1]+q[1])/2+h,(p[2]+q[2])/2);o.rotation.set(0,-Math.atan2(q[2]-p[2],q[0]-p[0]),0);o.scale.set(1,1,1)});
 // bruk
 const st=[];by('bruk').forEach(([k])=>{const r=rng(k);for(let q=0;q<4;q++)st.push([k,(r()-.5)*.6,(r()-.5)*.6,r()])});
 inst(LG.stone,LM.stone,st,([k,dx,dz,r],o)=>{const p=pos(k);o.position.set(p[0]+dx,Hy(p[0]+dx,p[2]+dz)+.01,p[2]+dz);o.rotation.set(0,r*6,0);o.scale.set(1+r*.4,.22,1+r*.3)});
 // ławy
 by('lawa').forEach(([k,v])=>{const p=pos(k),g=new THREE.Group();g.add(mesh(LG.seat,mPlank,0,.38,0),mesh(LG.leg,matDark,-.4,.17,0),mesh(LG.leg,matDark,.4,.17,0));g.position.set(p[0],p[1],p[2]);g.rotation.y=(v.r||0)*Math.PI/2;ladG.add(g)});
 // drzewa owocowe
 by('drzewo').forEach(([k,v])=>{const p=pos(k),age=Math.min(1,(S.day-v.d)/YEAR),s=.45+.55*age,g=new THREE.Group();const t=mesh(LG.trunk,LM.pole,0,.5,0);g.add(t);
  const c=mesh(LG.crown,ladSea===1&&age>.6?LM.crownA:LM.crown,0,1.25,0);c.scale.set(1.1,.85,1.1);c.visible=!win;g.add(c);
  if(age>=1&&ladSea===1)for(let f=0;f<6;f++)g.add(mesh(LG.fruit,LM.fruit,Math.cos(f*1.9)*.5,1.05+(f%3)*.18,Math.sin(f*1.9)*.5));
  g.position.set(p[0],p[1],p[2]);g.scale.setScalar(s*1.25);g.rotation.y=k;ladG.add(g)});
 // grządki
 const gz=by('grzadka');inst(LG.soil,LM.soil,gz,([k],o)=>{const p=pos(k);o.position.set(p[0],p[1]+.03,p[2]);o.rotation.set(0,0,0);o.scale.set(1,1,1)});
 if(!win){const rows=[];gz.forEach(([k])=>[-.25,0,.25].forEach(d=>rows.push([k,d])));inst(LG.row,LM.green,rows,([k,d],o)=>{const p=pos(k);o.position.set(p[0],p[1]+.1,p[2]+d);o.rotation.set(0,0,0);o.scale.set(1,ladSea===3?.5:1,1)})}
 // kwiaty
 if(!win){const fl=[];by('kwiaty').forEach(([k])=>{const r=rng(k*3);for(let q=0;q<9;q++)fl.push([k,(r()-.5)*.8,(r()-.5)*.8,(r()*5)|0])});const cols=[0xf2efe4,0xe8c84a,0x8a6ab8,0xc8463c,0xe39ab0];
  const m=inst(LG.flower,LM.flower,fl,([k,dx,dz],o)=>{const p=pos(k);o.position.set(p[0]+dx,Hy(p[0]+dx,p[2]+dz)+.08,p[2]+dz);o.rotation.set(Math.PI,0,0);o.scale.set(1,1,1)});
  if(m){const c=new THREE.Color();fl.forEach((f,q)=>{c.setHex(cols[f[3]]);m.setColorAt(q,c)});m.instanceColor.needsUpdate=true}}
 // słupy rodowe
 by('slup').forEach(([k,v])=>{const p=pos(k),g=new THREE.Group();g.add(mesh(LG.pole,LM.pole,0,1.05,0));[.6,1.2,1.75].forEach(h=>g.add(mesh(LG.ring,matDark,0,h,0)));
  const z=(S.rody[v.rod]||{}).znak;const sp=new THREE.Sprite(znakMat(z));sp.scale.set(.6,.6,1);sp.position.y=2.45;g.add(sp);g.position.set(p[0],p[1],p[2]);ladG.add(g)})}
function ladTread(){if(!S||!S.lad)return;Object.entries(S.lad).forEach(([k,v])=>{if(v.t==='sciezka'&&tread[k]<.9)tread[k]=.9;if(v.t==='bruk'&&tread[k]<1)tread[k]=1});treadDirty=true}

/* ---- ład: ocena i skutki ---- */
function ladScore(){const c={};Object.values(S.lad||{}).forEach(v=>c[v.t]=(c[v.t]||0)+(v.t==='drzewo'&&S.day-v.d<YEAR?.5:1));
 const rep=S.bld.filter(b=>typeof condOf==='function'&&condOf(b)<.5).length,homeless=S.people.filter(p=>!homeOf(p)).length;
 const raw=Math.min(25,((c.sciezka||0)+(c.bruk||0)*1.5)*.6)+Math.min(12,(c.plot||0)*.4)+Math.min(10,(c.lawa||0)*2.5)+Math.min(15,(c.drzewo||0)*2)+Math.min(12,(c.grzadka||0)*1.5)+Math.min(8,(c.kwiaty||0))+Math.min(10,(c.slup||0)*4)-rep*3-homeless*1.5;
 return{sc:Math.max(0,Math.min(100,Math.round(raw/92*100))),c,rep,homeless}}
function ladWord(s){return s<10?'bezład':s<30?'obozowisko':s<50?'schludnie':s<75?'ładna wieś':'piękny ład'}
function ladDaily(){ladInit();ladTread();const L=ladScore(),sc=L.sc,sea=seasonIdx();S.ladSc=sc;
 S.hope=clamp(S.hope+(sc>10?(sc-10)/90*.0025:-.0004),0,1);if(sc>40)S.dis=clamp((S.dis||0)-(sc-40)/60*.002,0,1);
 if(sc>=40&&!S.seen.lad40){S.seen.lad40=1;log('Ktoś wracający z wyprawy staje na wzgórzu i patrzy na osadę: ścieżki, płoty, kwiaty pod oknami. Mówi, że z daleka wygląda jak prawdziwa wieś.');pamAdd(3,'lad')}
 if(sc>=75&&!S.seen.lad75){S.seen.lad75=1;song('Pieśń o naszej wsi');pamAdd(3,'lad')}
 // plony z drzew i grządek
 Object.values(S.lad).forEach(v=>{if(v.t==='drzewo'&&sea===1&&S.day-v.d>=YEAR)S.res.jagody+=K*.5;if(v.t==='grzadka'&&(sea===0||sea===1||sea===3))S.res.warzywa=(S.res.warzywa||0)+K*(sea===3?.1:.25)});
 // słup rodowy: mir rodu
 Object.values(S.lad).forEach(v=>{if(v.t==='slup')S.people.forEach(p=>{if(String(p.rod)===String(v.rod))p.mirX=(p.mirX||0)+.002})});
 if(sea!==ladSea||Object.values(S.lad).some(v=>v.t==='drzewo'&&S.day-v.d<YEAR+1))ladDirty=1}
{const _ad=actDaily;actDaily=function(){_ad();ladDaily()}}
{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);if(S&&ladDirty)ladBuild()}}
function ladHTML(){if(!S.lad)ladInit();const L=ladScore();const c=L.c;
 return`<div class="card"><h4>Ład wsi: ${ladWord(L.sc)} <span class="mut" style="font-size:13px">${L.sc}/100</span></h4><div class="pbar"><div style="width:${L.sc}%"></div></div>
 <p>Ścieżki ${Math.round((c.sciezka||0)+(c.bruk||0))} · płoty ${c.plot||0} · ławy ${c.lawa||0} · drzewa owocowe ${Math.ceil(c.drzewo||0)} · grządki ${c.grzadka||0} · kwiaty ${c.kwiaty||0} · słupy rodowe ${c.slup||0}</p>
 <p class="mut">${L.rep?`Psują ład: budynki do remontu (${L.rep}). `:''}${L.homeless?`Ludzie bez dachu (${L.homeless}). `:''}Ład podnosi nadzieję i łagodzi spory. Budowa → Ład wsi.</p></div>`}
{const _hh=hamletHTML;hamletHTML=function(){return ladHTML()+_hh()}}

/* ---- narzędzie ładu ---- */
let ladTool=null,ladAnchor=null;
function ladChip(){const n=Object.keys(S.lad||{}).length;return`<button data-bcat="lad" class="${buildCat==='lad'?'on':''}">Ład wsi<small>${n?n+' pól':'nowe'}</small></button>`}
function ladBuildHTML(){let h=`<div class="card"><h4>Ład wsi</h4><p>Ścieżki, płoty, ławy, drzewa, grządki i kwiaty stawia się od razu, bez robotników. Ścieżki i płoty wytycza się od punktu do punktu: dotknij początku, potem kolejnych miejsc. Ład podnosi nadzieję i łagodzi spory.</p><p class="mut">Ład wsi: ${ladWord(ladScore().sc)} (${ladScore().sc}/100).</p></div>`;
 LAD_K.forEach(k=>{const d=LAD[k],av=!d.need||d.need();h+=`<div class="card"${av?'':' style="opacity:.62"'}><h4>${d.n}</h4><p>${d.d}</p><div class="cost">${Object.keys(d.cost).length?costHTML(d.cost)+(d.line?' za pole':''):'bez kosztu'}</div>${av?`<button class="pri" style="margin-top:7px" data-ladt="${k}">Wybierz</button>`:`<div class="cost">${d.why}</div>`}</div>`});
 return h+`<div class="card"><h4>Usuwanie</h4><p>Zdejmuje ścieżkę, płot albo ozdobę z pola.</p><button style="margin-top:7px" data-ladt="usun">Usuń</button></div>`}
{const bar=document.createElement('div');bar.id='ladbar';bar.className='ui';bar.hidden=true;document.body.appendChild(bar);
 const st=document.createElement('style');st.textContent=`#ladbar{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(84px + var(--safe-bottom));z-index:40;background:rgba(22,26,25,.94);border:1px solid #3b3a2e;border-radius:14px;padding:8px;width:min(560px,calc(100% - 24px));box-shadow:0 8px 30px #0007}
 #ladbar[hidden]{display:none}#ladbar .lt{display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none}#ladbar .lt button{flex:0 0 auto;padding:7px 10px;font-size:13px}#ladbar .lt button.on{border-color:var(--gold);color:var(--hi);background:#2c2a20}
 #ladbar .li{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:6px;font-size:13px;color:var(--mut)}#ladbar .li b{color:var(--hi)}
 body.photo .ui,body.photo #labels,body.photo .rl,body.photo #toast{display:none!important}#photobar{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(18px + var(--safe-bottom));z-index:60;display:none;gap:8px;background:rgba(18,20,19,.72);border:1px solid #3b3a2e;border-radius:30px;padding:6px}
 body.photo #photobar{display:flex}#photobar button{border-radius:22px;min-width:44px;height:44px;padding:0 14px}#flash{position:fixed;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:80;transition:opacity .5s}`;document.head.appendChild(st);
 bar.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.ladt){ladStart(b.dataset.ladt);return}if(b.dataset.ladnew!==undefined){ladAnchor=null;ladMarker.visible=false;ladBar();return}if(b.dataset.ladend!==undefined)ladEnd()})}
const ladMarker=new THREE.Mesh(new THREE.RingGeometry(.3,.45,20),new THREE.MeshBasicMaterial({color:0xe2c48c,transparent:true,opacity:.9,depthWrite:false,toneMapped:false}));ladMarker.rotation.x=-Math.PI/2;ladMarker.visible=false;scene.add(ladMarker);
function ladStart(t){if(t!=='usun'&&LAD[t].need&&!LAD[t].need()){toast(LAD[t].why);return}ladTool=t;ladAnchor=null;ladMarker.visible=false;closeSheet();if(placing)cancelPlace();select(null);$('ladbar').hidden=false;ladBar();
 toast(t==='usun'?'Dotknij pola, z którego zdjąć ścieżkę lub ozdobę':LAD[t].line?'Dotknij początku, potem kolejnych punktów':'Dotknij miejsca, by postawić')}
function ladEnd(){ladTool=null;ladAnchor=null;ladMarker.visible=false;$('ladbar').hidden=true}
function ladBar(){const t=ladTool;const d=LAD[t];$('ladbar').innerHTML=`<div class="lt">${LAD_K.filter(k=>!LAD[k].need||LAD[k].need()).map(k=>`<button data-ladt="${k}" class="${k===t?'on':''}">${LAD[k].n}</button>`).join('')}<button data-ladt="usun" class="${t==='usun'?'on':''}">Usuń</button></div>
 <div class="li"><span>${t==='usun'?'<b>Usuwanie</b>':`<b>${d.n}</b> · ${Object.keys(d.cost).length?costHTML(d.cost):'bez kosztu'}`} · ład: ${ladScore().sc}</span><span style="display:flex;gap:6px">${d&&d.line&&ladAnchor?'<button data-ladnew>Nowa linia</button>':''}<button class="pri" data-ladend>Gotowe</button></span></div>`}
function ladTap(x,y){const h=pick(x,y,[terrain])[0];if(!h)return;const i=Math.floor(h.point.x+N/2),j=Math.floor(h.point.z+N/2);
 if(ladTool==='usun'){if(ladDel(i,j)){sfx&&sfx('tap')}ladBar();return}
 const d=LAD[ladTool];let n=0,fail=0;
 if(d.line&&ladAnchor){for(const[a,b]of line4(ladAnchor[0],ladAnchor[1],i,j)){const r=ladPut(ladTool,a,b,true);if(r===1)n++;if(r===-1){fail=1;break}}}
 else{const r=ladPut(ladTool,i,j,false);if(r===1)n++;else if(r===0&&!d.line)toast('Tu nie da się: woda, budynek, stromizna albo za daleko od osady')}
 if(fail)toast('Zabrakło materiału');if(d.line){ladAnchor=[i,j];const x0=tcx(i),z0=tcx(j);ladMarker.position.set(x0,Hy(x0,z0)+.08,z0);ladMarker.visible=true}
 if(n&&d.line)ladTread();ladBar()}
{const _ot=onTap;onTap=function(x,y){if(ladTool&&S){ladTap(x,y);return}_ot(x,y)}}
addEventListener('keydown',e=>{if(e.key==='Escape'&&ladTool)ladEnd()});
document.addEventListener('click',e=>{const b=e.target.closest('[data-ladt]');if(!b||!S||b.closest('#ladbar'))return;ladStart(b.dataset.ladt)});

/* ---- tryb zdjęć ---- */
{const pb=document.createElement('div');pb.id='photobar';pb.innerHTML=`<button data-ph="l" aria-label="Obróć w lewo">⟲</button><button data-ph="shot" class="pri">Zdjęcie</button><button data-ph="r" aria-label="Obróć w prawo">⟳</button><button data-ph="lab">Napisy</button><button data-ph="x">Wyjdź</button>`;document.body.appendChild(pb);
 const fl=document.createElement('div');fl.id='flash';document.body.appendChild(fl);
 pb.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const a=b.dataset.ph;if(a==='l')yawT+=Math.PI/8;if(a==='r')yawT-=Math.PI/8;if(a==='shot')photoQ=1;if(a==='x')photoMode(false);
  if(a==='lab'){photoLab=!photoLab;b.classList.toggle('on',photoLab)}})}
let photoQ=0,photoLab=true;
function photoMode(on){if(!S)return;document.body.classList.toggle('photo',on);if(on){if(ladTool)ladEnd();closeSheet();select(null)}}
{const _rc=renderCtl;renderCtl=function(){_rc();const c=$('ctl');if(c&&!c.querySelector('[data-photo]'))c.insertAdjacentHTML('beforeend','<button data-photo="1" aria-label="Tryb zdjęć" class="txt">Foto</button>')}}
document.addEventListener('click',e=>{if(e.target.closest('[data-photo]'))photoMode(true)});
function photoGrab(){if(!photoQ)return;photoQ=0;try{const src=renderer.domElement,c=document.createElement('canvas');c.width=src.width;c.height=src.height;const x=c.getContext('2d');x.drawImage(src,0,0);
  if(photoLab){const s=Math.max(14,Math.round(c.width/70));x.font=`${s}px Georgia, serif`;x.textBaseline='bottom';const t=`${S.vname||'Przystań'} · ${dayName(Math.floor(S.day)+1)}`;x.fillStyle='rgba(0,0,0,.45)';x.fillText(t,s*1.1+2,c.height-s*.9+2);x.fillStyle='#f1e7cf';x.fillText(t,s*1.1,c.height-s*.9)}
  const fl=$('flash');fl.style.transition='none';fl.style.opacity=.7;requestAnimationFrame(()=>{fl.style.transition='opacity .6s';fl.style.opacity=0});
  c.toBlob(b=>{if(!b){toast('Nie udało się zrobić zdjęcia');return}const y=Math.floor(S.day/YEAR)+1;dlFile(`${(S.vname||'przystan').toLowerCase()}-rok-${y}-${Date.now()%100000}.jpg`,b,'image/jpeg')},'image/jpeg',.92)}catch(er){toast('Nie udało się zrobić zdjęcia')}}
