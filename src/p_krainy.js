
/* ================= 4.3 Krainy z charakterem (projekt: docs/PROJEKT_WYSPY_5.md, rozdz. 2.2) ================= */
// Każda kraina wyspy (REGIONS) dostaje jedną z dziesięciu ról, liczoną z ziemi pod nią: las, łąka, mokradło, hale,
// wybrzeże, nachylenie do słońca i złoża. Każda rola jest na wyspie co najmniej raz. Rola zmienia to, co kraina
// daje: pola na żyznych nizinach rodzą więcej, barcie na kwietnych łąkach dają więcej miodu, drwale w starych borach
// rąbią szybciej. Krainy różnią się też barwą ziemi, a łąki kwitną od wiosny do jesieni.
const KR={
 niziny:{n:'Żyzne Niziny',d:'Ciemna, tłusta ziemia nad wodą. Zboże, len i kapusta rodzą tu najlepiej.',field:1.3,b:{zagroda:1.15},tint:[.9,1.07,.84]},
 stoki:{n:'Słoneczne Stoki',d:'Zbocza zwrócone na południe, ciepłe od rana. Dobre pod winnice, chmiel i ogrody ziół.',b:{winnica:1.35,chmielnik:1.2,ogrodziol:1.25},tint:[1.1,1.05,.86]},
 laki:{n:'Kwietne Łąki',d:'Otwarte łąki pełne kwiatów od wiosny do jesieni. Pszczoły, siano i zioła.',b:{pasieka:1.5,zagroda:1.2,zbieracz:1.1},tint:[1.08,1.08,.9],flowers:1},
 bory:{n:'Stare Bory',d:'Gęste sosny i świerki. Drewno budulcowe, smoła, grzyby i zwierzyna.',b:{drwal:1.2,mysliwy:1.15,mielerz:1.15,lesnik:1.15}},
 grad:{n:'Grąd i Dąbrowa',d:'Dęby, lipy i polany. Barcie w dziuplach starych drzew, twarde drewno.',b:{pasieka:1.25,drwal:1.1,mysliwy:1.1},tint:[.97,1.03,.92]},
 gran:{n:'Kamienna Grań',d:'Skały, piarg i kosodrzewina. Kamień i granit, ale mało jedzenia.',b:{kamien:1.25,lom:1.15}},
 zaglebie:{n:'Zagłębie',d:'Wychodnie węgla i rudy w jednym miejscu. Tu stoją szyby i kopalnie.',b:{odkrywka:1.1,szybw:1.1,kopalnia:1.1,ruda:1.15},tint:[.95,.95,.97]},
 mokradla:{n:'Mokradła',d:'Trzciny, oczka wodne i torf. Ruda darniowa i zioła bagienne.',b:{torfowisko:1.2,ruda:1.25,ogrodziol:1.1},tint:[.9,.95,.84]},
 gliniska:{n:'Gliniska nad wodą',d:'Grube warstwy gliny przy wodzie. Gliniaki, cegielnie i garncarze.',b:{glinianka:1.25,gliniak:1.15,cegielnia:1.1,garncarnia:1.1},tint:[1.04,1,.95]},
 wybrzeze:{n:'Wybrzeże i Zatoki',d:'Plaże, zatoki i pomosty. Ryby, sól i bursztyn.',b:{pomost:1.2,warzelnia:1.15}}};
// ---------- przydział ról: z ziemi i złóż, każda rola co najmniej raz ----------
(function krAssign(){const R=REGIONS.filter(Boolean);if(!R.length)return;const st={};R.forEach(r=>st[r.id]={n:0,h:0,sl:0,sun:0,bi:{},dep:{}});
 for(let j=1;j<N-1;j+=2)for(let i=1;i<N-1;i+=2){const k=j*N+i,q=REGION[k];if(q<0||!st[q]||!land[k])continue;const s=st[q];const b=biomeOf(i,j);s.n++;s.bi[b]=(s.bi[b]||0)+1;s.h+=tileH(i,j);s.sl+=slope(i,j);s.sun+=Math.max(0,tileH(i,j-1)-tileH(i,j+1))}
 ODK.forEach(o=>{const q=REGION[o.j*N+o.i];if(q>=0&&st[q])st[q].dep[o.t]=(st[q].dep[o.t]||0)+1});
 const f=(s,b)=>(s.bi[b]||0)/Math.max(1,s.n);
 const SC={
  zaglebie:s=>(s.dep.wegiel||s.dep.rudne)?5+(s.dep.wegiel||0)*2+(s.dep.rudne||0)*2:-99,
  gliniska:s=>s.dep.glinisko?5+f(s,'wet')*2:-99,
  gran:s=>f(s,'high')*6+(s.dep.lom||0)*3+s.sl/s.n*2,
  wybrzeze:s=>f(s,'coast')*12,
  mokradla:s=>f(s,'wet')*8+(s.dep.torf||0)*3,
  bory:s=>f(s,'conif')*5-f(s,'decid')*1,
  grad:s=>f(s,'decid')*6,
  laki:s=>f(s,'meadow')*4+s.h/s.n/7-f(s,'wet')*3,
  niziny:s=>f(s,'meadow')*3+(1-s.h/s.n/7)*2+f(s,'wet')*1.5-s.sl/s.n*2,
  stoki:s=>f(s,'meadow')*2+s.sl/s.n*3+s.sun/s.n*6};
 // nazwy krain powstały wcześniej z rodzaju terenu, więc rola trzyma się rodzaju, żeby „Plaża” nie była mokradłem
 const FIT={coast:['wybrzeze','mokradla','gliniska'],forest:['bory','grad','mokradla','zaglebie'],high:['gran','zaglebie','stoki'],meadow:['laki','niziny','stoki','mokradla','gliniska','grad']};
 const sc=(role,id)=>SC[role](st[id])+((FIT[REGIONS[id].type]||[]).includes(role)?1.5:-4);
 const free=new Set(R.filter(r=>r.id!==0&&st[r.id].n>=8).map(r=>r.id));
 for(const role of ['zaglebie','gliniska','gran','wybrzeze','mokradla','bory','laki','niziny','stoki','grad']){let best=null,bv=-50;
  const pool=(role==='zaglebie'||role==='gliniska')&&REGIONS[0]&&!REGIONS[0].kr?[...free,0]:free;
  for(const id of pool){const v=sc(role,id);if(v>bv){bv=v;best=id}}if(best!==null){REGIONS[best].kr=role;free.delete(best)}}
 // reszta: najlepsza rola bez złóż (Zagłębie i Gliniska są tam, gdzie przydział je postawił)
 if(REGIONS[0]&&!REGIONS[0].kr)free.add(0);
 for(const id of free){let best='laki',bv=-1e9;for(const role of Object.keys(SC)){if(role==='zaglebie'||role==='gliniska')continue;const v=sc(role,id);if(v>bv){bv=v;best=role}}REGIONS[id].kr=best}
 R.forEach(r=>{if(!r.kr)r.kr=r.type==='coast'?'wybrzeze':r.type==='high'?'gran':r.type==='forest'?'bory':'laki'})})();
const krAt=(i,j)=>{if(i<0||j<0||i>=N||j>=N)return null;const r=regionAt(i,j);return r&&r.kr?r:null};
function krOfB(b){if(!b)return null;const c=bCenter(b);const t=tileOf(c.x,c.z);return krAt(t[0],t[1])}
function krMulKind(r,kind){if(!r)return 1;const K=KR[r.kr];return(K&&K.b[kind])||1}
// ---------- wpływ na pracę: bMul dla budynków, plon dla pól ----------
{const _bm=bMul;bMul=function(b){const m=_bm(b);try{if(!b||!S||b.kind===undefined)return m;return m*krMulKind(krOfB(b),b.kind)}catch(e){return m}}}
{const _fm=fieldMul;fieldMul=function(b){const m=_fm(b);try{const r=krOfB(b);return r&&KR[r.kr].field?m*KR[r.kr].field:m}catch(e){return m}}}
// ---------- opis: karta krainy w Wyprawach, karta budynku, podgląd stawiania, etykieta ----------
function krBonus(K){const L=Object.entries(K.b).filter(([k])=>BD[k]).map(([k,v])=>`${BD[k].n.toLowerCase()} +${Math.round((v-1)*100)}%`);if(K.field)L.unshift(`plon pól +${Math.round((K.field-1)*100)}%`);return L.join(', ')}
function krLine(r){const K=r&&KR[r.kr];if(!K)return'';return`<p class="kr-line"><b>${K.n}.</b> ${K.d}${krBonus(K)?` <span class="mut">Tu: ${krBonus(K)}.</span>`:''}</p>`}
function krBld(b){const r=krOfB(b);if(!r)return'';const K=KR[r.kr];const v=b.field?(K.field||1):krMulKind(r,b.kind);if(v===1)return'';
 return`<p class="kr-box"><b>${K.n}</b> (${r.known?r.name:'kraina'}): ${b.field?'plon':'praca idzie'} o ${Math.round((v-1)*100)}% ${b.field?'większy':'szybciej'}.</p>`}
{const _rs=renderSel;renderSel=function(){_rs();try{if(!S||selB===null)return;const b=bById(selB),el=$('sel');if(!b||el.style.display!=='block'||el.querySelector('.kr-box'))return;const h=krBld(b);if(h)el.insertAdjacentHTML('beforeend',h)}catch(e){}}}
{const _mg=moveGhost;moveGhost=function(i,j){_mg(i,j);try{if(!placing||!ghostTile||!BD[placing])return;const d=BD[placing],r=krAt(ghostTile[0]+((d.w-1)>>1),ghostTile[1]+((d.h-1)>>1));if(!r)return;const K=KR[r.kr];
  const v=d.field||placing==='pole'?(K.field||1):krMulKind(r,placing);const el=$('pinfo');if(!el)return;el.querySelector('.kr-pi')?.remove();
  if(v!==1)el.insertAdjacentHTML('beforeend',`<div class="kr-pi">${K.n}: ${placing==='pole'?'plon':'praca'} +${Math.round((v-1)*100)}%</div>`)}catch(e){}}}
{const st=document.createElement('style');st.textContent=`.kr-line{margin:6px 0 4px}.kr-line b{color:var(--hi)}.kr-box{margin:8px 0 0;color:#cfe3a8}.kr-box b{color:var(--hi)}.kr-pi{color:#cfe3a8;font-size:13px;margin-top:4px}.rl small.kr{display:block;font-size:11px;opacity:.8;font-style:normal}`;document.head.appendChild(st)}
{const _scan=regionScan;regionScan=function(quiet){const before=S&&S.regs?{...S.regs}:{};_scan(quiet);try{REGIONS.forEach(r=>{if(!r||!r.known||!r.kr)return;const sp=r.el&&r.el.querySelector('span');if(sp&&!sp.querySelector('small.kr'))sp.insertAdjacentHTML('beforeend',`<small class="kr">${KR[r.kr].n}</small>`);
   if(!quiet&&!before[r.id]&&S.regs[r.id]){const K=KR[r.kr];log(`${r.name} to ${K.n.toLowerCase()}. ${K.d}`)}})}catch(e){}}}
// ---------- wygląd: barwa ziemi i kwiaty na łąkach ----------
let krTintOn=true;
function krTint(yd){if(!krTintOn)return;const winter=yd>=50&&yd<70;const w=winter?.25:1;const tint=new Float32Array(N*N*3).fill(1);
 for(let k=0;k<N*N;k++){const q=REGION[k];if(q<0)continue;const r=REGIONS[q];const t=r&&KR[r.kr]&&KR[r.kr].tint;if(!t)continue;const hh=HH[(Math.floor(k/N))*VW+(k%N)];if(beach[k]||hh<.04)continue;tint[k*3]=1+(t[0]-1)*w;tint[k*3+1]=1+(t[1]-1)*w;tint[k*3+2]=1+(t[2]-1)*w}
 for(let j=0;j<VW;j++)for(let i=0;i<VW;i++){let a=0,b=0,c=0,n=0;for(let dj=-1;dj<=0;dj++)for(let di=-1;di<=0;di++){const x=i+di,y=j+dj;if(x<0||y<0||x>=N||y>=N)continue;const k=(y*N+x)*3;a+=tint[k];b+=tint[k+1];c+=tint[k+2];n++}
  if(!n)continue;const v=(j*VW+i)*3;baseCol0[v]*=a/n;baseCol0[v+1]*=b/n;baseCol0[v+2]*=c/n}}
{const _pb=paintBase;paintBase=function(yd){_pb(yd);try{krTint(yd);applyTread()}catch(e){console.warn(e)}}}
const KRF_MAX=2400,krFlowers=new THREE.InstancedMesh(new THREE.ConeGeometry(.1,.22,5),new THREE.MeshStandardMaterial({roughness:.9}),KRF_MAX);
krFlowers.count=0;krFlowers.castShadow=false;krFlowers.receiveShadow=false;krFlowers.frustumCulled=false;scene.add(krFlowers);
const KRF_C=[0xf2efe2,0xe8c84a,0x9a6ad0,0x6a8ae0,0xe08aa8,0xf0a040].map(c=>new THREE.Color(c));
let krFKey='';
function krFlowerBuild(){if(!S)return;const sea=seasonIdx(),key=sea+':'+S.bld.length;if(key===krFKey)return;krFKey=key;if(sea===2){krFlowers.count=0;return}
 const R0=rng(SEED*7+31),d=new THREE.Object3D(),occ=new Set();S.bld.forEach(b=>{const D=BD[b.kind];if(!D)return;for(let a=-1;a<=D.w;a++)for(let c=-1;c<=D.h;c++)occ.add((b.j+c)*N+b.i+a)});
 const share=sea===1?.35:1;let q=0;
 const C=[];for(let j=2;j<N-2;j++)for(let i=2;i<N-2;i++){const k=j*N+i;const reg=REGION[k];if(reg<0)continue;const r=REGIONS[reg];if(!r||!r.kr)continue;const K=KR[r.kr];const dens=K.flowers?.4:r.kr==='stoki'||r.kr==='niziny'||r.kr==='grad'?.05:0;
  const roll=R0(),pick=R0(),x0=R0(),z0=R0(),s0=R0();if(!dens||roll>dens*share||occ.has(k)||!land[k]||beach[k]||biomeOf(i,j)!=='meadow'||slope(i,j)>.8)continue;
  C.push([i,j,pick,x0,z0,s0])}
 // równo po całej wyspie, gdy kępek jest więcej niż miejsca
 const step=Math.max(1,C.length*5/KRF_MAX);for(let c=0;c<C.length&&q<KRF_MAX;c+=step){const[i,j,pick,x0,z0,s0]=C[Math.floor(c)];
  // kępka: kilka kwiatów jednego koloru, jak na prawdziwej łące
  const col=KRF_C[(pick*KRF_C.length)|0],m=3+((s0*4)|0);for(let f=0;f<m&&q<KRF_MAX;f++){const a=f*2.4+s0*6,rr=.08+.07*f;
   const x=tcx(i)+(x0-.5)*.7+Math.cos(a)*rr,z=tcx(j)+(z0-.5)*.7+Math.sin(a)*rr;d.position.set(x,Hy(x,z)+.09,z);d.rotation.set(0,a,0);const sc=.75+((f*37+s0*10)%1)*.5;d.scale.set(sc,sc,sc);d.updateMatrix();krFlowers.setMatrixAt(q,d.matrix);krFlowers.setColorAt(q,col);q++}}
 krFlowers.count=q;krFlowers.instanceMatrix.needsUpdate=true;if(krFlowers.instanceColor)krFlowers.instanceColor.needsUpdate=true}
{const _ad=actDaily;actDaily=function(){_ad();try{krFlowerBuild()}catch(e){console.warn(e)}}}
{const _b=boot;boot=function(f){_b(f);krFKey='';try{krFlowerBuild()}catch(e){}}}
window.__kr={KR,krAt,krOfB,krMulKind,krLine,flowers:()=>krFlowers.count,regions:()=>REGIONS.filter(Boolean).map(r=>({id:r.id,name:r.name,kr:r.kr,i:r.i,j:r.j}))};
