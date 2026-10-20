
/* ================= 4.1 Złoża: skupione, duże i skończone (projekt: docs/PROJEKT_WYSPY_5.md, rozdz. 3) ================= */
// Złoża dopisują się do miejsc na wyspie (ODK): widać je z daleka jako zagadkę, a rozpoznaje je ten, kto do nich dojdzie.
// Każde złoże ma warstwy: płytką, głębszą i najgłębszą. Budynek stoi na złożu i czerpie z warstw, do których sięga.
// Drobne kamienie, glina i ruda darniowa leżące luzem nie odrastają; od epoki II osada sięga do złóż.
Object.assign(ODK_T,{
 rudne:{q:'Rdzawa woda w potoku',n:['Rudne Wzgórze','Żelazny Dział','Rdzawa Góra'],r:5,d:'Złoże rudy żelaza w skale. Kopalnia z szybem i kieratem daje rudę latami, warstwa po warstwie.',
  find:p=>`Woda w potoku jest tu rdzawa, a kamienie ciężkie jak żelazo. ${p.name} rozbija jeden: w środku ciemne, błyszczące ziarna. Ruda żelaza, i to nie darniowa z bagna, ale w skale, w całym wzgórzu.`},
 lom:{q:'Szare ściany skalne',n:['Kamienne Łomy','Szara Ściana','Granitowy Próg'],r:5,d:'Lita skała tuż pod darnią. Łom kamienia daje kamień budowlany i granit na bruk bez szukania kamieni po polach.',
  find:p=>`${p.name} zdziera mech ze ściany skalnej. Pod spodem jest szary, twardy kamień, który łupie się w równe płyty. Z takiego stawia się fundamenty i układa bruk.`},
 glinisko:{q:'Biała maź nad wodą',n:['Gliniska','Białe Brzegi','Garncarski Brzeg'],r:5,d:'Gruba warstwa tłustej gliny nad wodą. Gliniak daje glinę na cegły, naczynia i polepę.',
  find:p=>`Nad wodą ${p.name} zapada się po kostki w białą, tłustą maź. Glina, czysta, bez kamieni, na głębokość łopaty i głębiej. Dobra na garnki i na cegłę.`}});
ODK_T.wegiel.d='Wychodnia węgla kamiennego: początek Zagłębia. Odkrywka bierze węgiel z płytkiej warstwy, głębszych sięga dopiero szyb.';
// warstwy złóż: [płytka, głębsza, najgłębsza] w porcjach surowca
const ZL={wegiel:{res:'wegiel',L:[2000,6000,12000]},torf:{res:'opal',L:[1500,3500]},rudne:{res:'ruda',L:[1500,5000,9000]},lom:{res:'kamien',L:[4000,12000,30000]},glinisko:{res:'glina',L:[2000,5000]}};
const ZL_LN=['płytka','głębsza','najgłębsza'];
// które budynki czerpią z których warstw
const ZL_B={odkrywka:{t:'wegiel',lay:[0]},szybw:{t:'wegiel',lay:[1,2]},kopalnia:{t:'rudne',lay:[0,1,2]},lom:{t:'lom',lay:[0,1,2]},gliniak:{t:'glinisko',lay:[0,1]},torfowisko:{t:'torf',lay:[0,1]}};
const ZL_KNOW={rudne:'zl_rudne',lom:'zl_lom',glinisko:'zl_glin',wegiel:'wegiel_k',torf:'torf'};
// ---------- położenie złóż: z ziarna wyspy, zawsze te same ----------
// 4.5: złoża dawnej wyspy jak dawniej (jej współrzędne i losowanie), złoża nowego lądu z projektu wyspy 384
(function zlGen(){const N=N0,land=LEG.land,beach=LEG.beach,reach=reach0,biomeOf=LEG.biomeOf,tileHH=LEG.tileHH,slope=LEG.slope,tcx=LEG.tcx,camp=CAMP0;
 const R0=rng(SEED*13+977);const dc=(i,j)=>Math.hypot(i-camp.i,j-camp.j);
 const ok=(i,j)=>i>5&&j>5&&i<N-6&&j<N-6&&land[j*N+i]&&reach[j*N+i]&&!beach[j*N+i];
 const far=(i,j,d)=>ODK.every(o=>Math.hypot(o.i-OFF-i,o.j-OFF-j)>=(ZL[o.t]?d:8))&&dc(i,j)>=12;
 const cnt=(type,i,j,r)=>(nodeBy[type]||[]).filter(n=>n.id<coreNodes&&Math.abs(n.i-OFF-i)<=r&&Math.abs(n.j-OFF-j)<=r).length;
 const pick=(t,n,score,dmin,dmax,sep)=>{for(let m=0;m<n;m++){let best=null,bv=-1e9;for(let k=0;k<7000;k++){const i=(R0()*N)|0,j=(R0()*N)|0;if(!ok(i,j))continue;const d=dc(i,j);if(d<dmin||d>dmax||!far(i,j,sep))continue;const v=score(i,j);if(v>bv){bv=v;best=[i,j]}}
  if(best)ODK.push({id:ODK.length,t,i:best[0]+OFF,j:best[1]+OFF,x:tcx(best[0]),z:tcx(best[1]),rot:R0()*6.28})}};
 pick('rudne',2,(i,j)=>{const h=tileHH(i,j);return(biomeOf(i,j)==='high'?3:0)+h*4+slope(i,j)*1.2-(h>.92?6:0)},25,90,35);
 pick('lom',2,(i,j)=>cnt('rock',i,j,6)*2+(biomeOf(i,j)==='high'?3:0)+slope(i,j)*1.5,14,75,25);
 pick('glinisko',2,(i,j)=>cnt('clay',i,j,6)*2.5+(biomeOf(i,j)==='wet'?3:0)-tileHH(i,j)*4-slope(i,j),10,75,25)})();
// złoża nowego lądu: duże, z własnymi warstwami (L); sól i bursztyn jako miejsca do odkrycia
{const R1=rng(SEED*13+1977);for(const[t,i0,j0,L]of WY.deposits){let best=null,bd=1e9;
 const want=WY.regions.reduce((b,r,q)=>Math.hypot(r[2]-i0,r[3]-j0)<Math.hypot(WY.regions[b][2]-i0,WY.regions[b][3]-j0)?q:b,0);   // złoże zostaje w swojej krainie także na innych wyspach
 for(const strict of[1,0]){if(best)break;for(let r=0;r<60&&!best;r++)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){const i=i0+a,j=j0+b;if(i<4||j<4||i>=N-4||j>=N-4)continue;const k=j*N+i;if(!land[k]||!reach[k]||beach[k]||WYD.core[k]||(strict&&WYD.reg[k]!==want))continue;const d=Math.hypot(a,b);if(d<bd){bd=d;best=[i,j]}}}
 if(best){const o={id:ODK.length,t,i:best[0],j:best[1],x:tcx(best[0]),z:tcx(best[1]),rot:R1()*6.28,ring:1};if(L)o.L=L.slice();ODK.push(o)}}}
const zlIs=o=>!!ZL[o.t];
function zlInit(o){const st=odkSt(o);if(!st)return null;if(!st.zl){st.zl=(o.L||ZL[o.t].L).slice();if(o.t==='wegiel'&&st.left!==undefined){st.zl[0]=Math.max(0,ZL.wegiel.L[0]-(600-st.left));}}
 if(o.t==='wegiel'){st.left=st.zl[0];if(st.left>0)st.exh=0}return st.zl}
const zlTot=o=>{const z=zlInit(o);return z?z.reduce((a,b)=>a+b,0):0};
function zlOf(b){const r=ZL_B[b.kind];if(!r)return null;const c=bCenter(b);let best=null,bd=1e9;for(const o of ODK){if(o.t!==r.t)continue;const st=odkSt(o);if(!st||st.s!==2)continue;const d=Math.hypot(o.x-c.x,o.z-c.z);if(d<bd){bd=d;best=o}}return best&&bd<=9?best:null}
function zlLeft(b){const o=zlOf(b),r=ZL_B[b.kind];if(!o)return 0;const z=zlInit(o);return r.lay.reduce((a,l)=>a+(z[l]||0),0)}
function zlLayer(b){const o=zlOf(b),r=ZL_B[b.kind];if(!o)return -1;const z=zlInit(o);return r.lay.find(l=>(z[l]||0)>0)??-1}
// ---------- odkrycie: wiedza i budowle ----------
function zlKeys(){if(!S)return;for(const[t,k]of Object.entries(ZL_KNOW)){if(ODK.some(o=>o.t===t&&odkSt(o)&&odkSt(o).s===2))S.know[k]='tak'}}
{const _of=odkFind;odkFind=function(o,p){const was=odkSt(o)&&odkSt(o).s===2;_of(o,p);if(was||!zlIs(o))return;zlInit(o);zlKeys();zlVis();
  const z=ZL[o.t];log(`${odkName(o)}: złoże na lata. Szacunek: ${zlTot(o)} porcji (${RN[z.res].toLowerCase()}) w ${z.L.length} warstwach.${o.t==='wegiel'?' Tak zaczyna się Zagłębie.':''}`)}}
// ---------- nowe budowle na złożach ----------
Object.assign(BD,{
 kopalnia:{cat:'surowce',n:'Kopalnia rudy',w:2,h:2,cost:{drewno:24,deski:10,kamien:12,narz:2},work:14,wk:3,c:'kamieniarz',need:'zl_rudne',site:'rudne',prod:{in:{drewno:1},out:{ruda:6},t:30,target:150},d:'Szyb w skale z kieratem i obudową z drewna. Daje rudę żelaza latami, warstwa po warstwie. Obudowa zużywa trochę drewna. Stawia się ją na odkrytym złożu rudy.'},
 lom:{cat:'surowce',n:'Łom kamienia',w:2,h:2,cost:{drewno:14,narz:1},work:8,wk:3,c:'kamieniarz',need:'zl_lom',site:'lom',prod:{in:{},out:{kamien:4},t:12,target:400},d:'Ściana skalna, kliny i żuraw. Dużo kamienia budowlanego i granitu na bruk. Stawia się go przy odkrytych łomach.'},
 gliniak:{cat:'surowce',n:'Gliniak',w:2,h:2,cost:{drewno:10},work:5,wk:2,c:'murarz',need:'zl_glin',site:'glinisko',prod:{in:{},out:{glina:3},t:10,target:250},d:'Wyrobisko w złożu gliny i daszek, pod którym glina schnie. Glina na cegły i naczynia bez szukania odsłonięć. Stawia się go na odkrytym glinisku.'},
 szybw:{cat:'surowce',n:'Szyb węglowy',w:2,h:2,cost:{drewno:30,deski:14,kamien:16,narz:3},work:16,wk:3,c:'kamieniarz',need:'wegiel_k',site:'wegiel',prod:[{in:{drewno:1},out:{wegiel:6},t:28,target:150},{in:{drewno:1},out:{opal:8},t:24,target:300}],d:'Głęboki szyb z kieratem w Zagłębiu. Sięga warstw, do których odkrywka nie dojdzie. Obudowa zużywa drewno. Stawia się go na odkrytym złożu węgla.'}});
['kopalnia','lom','gliniak','szybw'].forEach(k=>{if(!BKEYS.includes(k))BKEYS.push(k)});
Object.assign(E2ACT,{kopalnia:'kopie rudę w szybie',lom:'łupie kamień',gliniak:'kopie glinę',szybw:'kopie węgiel w szybie'});
Object.assign(SIGNK,{kopalnia:'ruda',lom:'kamien',gliniak:'glina',szybw:'wegiel'});
Object.assign(ODK_WHERE,{kopalnia:'kopalnia musi stać na odkrytym złożu rudy (Rudne Wzgórze)',lom:'łom musi stać przy odkrytej ścianie skalnej (Kamienne Łomy)',gliniak:'gliniak musi stać na odkrytym glinisku',szybw:'szyb musi stać na odkrytym złożu węgla'});
{const _tp=tryPlace;tryPlace=function(){if(placing&&ZL_B[placing]&&BD[placing].site&&ghostTile&&!checkPlace(placing,ghostTile[0],ghostTile[1])){const d=BD[placing];if(!odkNear(d.site,ghostTile[0],ghostTile[1],d.w,d.h,7)){toast('Tu nie da się budować: '+ODK_WHERE[placing]);return}}return _tp()}}
{const _mg=moveGhost;moveGhost=function(i,j){_mg(i,j);if(!placing||!ZL_B[placing]||placing==='odkrywka'||placing==='torfowisko'||!ghostTile)return;const d=BD[placing];if(odkNear(d.site,ghostTile[0],ghostTile[1],d.w,d.h,7))return;const el=$('pinfo');if(el)el.innerHTML=el.innerHTML.replace(/<span class="no">[^<]*<\/span>/,`<span class="no">Tu nie da się budować: ${ODK_WHERE[placing]}</span>`)}}
// ---------- wydobycie zjada warstwy ----------
{const _gm=gospMade;gospMade=function(b,r,v){const x=_gm(b,r,v);try{if(S&&b&&ZL_B[b.kind]&&v>0){const o=zlOf(b);if(o){const z=zlInit(o),R=ZL_B[b.kind];let left=v;
   if(b.kind==='odkrywka'){z[0]=Math.max(0,odkSt(o).left||0);left=0}// odkrywkę liczy już jej własny licznik żyły
   for(const l of R.lay){if(left<=0)break;const take=Math.min(z[l]||0,left);z[l]-=take;left-=take}
   const st=odkSt(o);const rem=zlLeft(b),rate=(st.rate=(st.rate||0)*.98+v*.02*50);
   if(rem<=0&&!b.zlEx){b.zlEx=1;log(`${BD[b.kind].n} w miejscu ${odkName(o)}: warstwy, do których sięga, są wyczerpane.${R.lay[R.lay.length-1]<z.length-1?' Głębiej jest jeszcze surowiec: potrzebny szyb.':''}`);toast(BD[b.kind].n+': złoże wyczerpane')}
   else if(!b.zlWarn&&rem<1500&&rem<(o.L||ZL[o.t].L)[0]*.3){b.zlWarn=1;log(`${BD[b.kind].n} w miejscu ${odkName(o)}: zostało ok. ${Math.round(rem)} porcji. Warto szykować następną warstwę albo inne złoże.`)}}}}catch(e){console.warn(e)}return x}}
{const _pj=planJob;planJob=function(p){if(p.job==='wb'&&S){const b=bById(p.wb);if(b&&ZL_B[b.kind]&&b.kind!=='odkrywka'&&bDone(b)){const o=zlOf(b);
   if(o&&zlLeft(b)<=0){p.act='złoże wyczerpane — potrzebny głębszy szyb albo inne złoże';return false}
   if(!o&&b.kind!=='torfowisko'){p.act='budynek nie stoi na odkrytym złożu';return false}}}return _pj(p)}}
// ---------- zarys złoża: paliki dookoła, w kolorze surowca ----------
const ZLG=new THREE.Group();scene.add(ZLG);const ZLC={wegiel:0x2a2a2e,torf:0x5a3e26,rudne:0x9a4a2a,lom:0x9a9a94,glinisko:0xd8c8a8};
const ZL_PEG=new THREE.CylinderGeometry(.08,.1,.95,5),ZL_TOP=new THREE.BoxGeometry(.26,.16,.04),ZL_TOPM=M(0xe8dcc0);
function zlVis(){ZLG.children.slice().forEach(o=>{ZLG.remove(o);o.dispose&&o.dispose()});if(!S)return;
 for(const t of Object.keys(ZL)){const L=ODK.filter(o=>o.t===t&&odkSt(o)&&odkSt(o).s===2);if(!L.length)continue;const n=L.length*14,m=new THREE.InstancedMesh(ZL_PEG,M(ZLC[t]),n),f=new THREE.InstancedMesh(ZL_TOP,ZL_TOPM,n),d=new THREE.Object3D();let q=0;
  L.forEach(o=>{const R=ODK_T[o.t].r+.5;for(let k=0;k<14;k++){const a=k/14*6.283+o.rot;const x=o.x+Math.cos(a)*R,z=o.z+Math.sin(a)*R*.8,y=Hy(x,z);
   d.position.set(x,y+.45,z);d.rotation.set(0,-a,0);d.updateMatrix();m.setMatrixAt(q,d.matrix);d.position.set(x,y+.86,z);d.updateMatrix();f.setMatrixAt(q,d.matrix);q++}});
  m.count=f.count=q;m.castShadow=true;ZLG.add(m);ZLG.add(f)}}
// ---------- karta złoża ----------
{const _oc=odkCard;odkCard=function(o){let h=_oc(o);const st=odkSt(o);if(!zlIs(o)||!st||st.s!==2)return h;const z=zlInit(o),Z=ZL[o.t];
  const kinds=Object.entries(ZL_B).filter(([k,r])=>r.t===o.t&&BD[k]&&BKEYS.includes(k));
  h=h.replace(/<p class="mut">(W żyle zostało około \d+ węgla\.|Żyła wyczerpana\.)<\/p>/,'');
  h+=`<div class="zlw">${(o.L||Z.L).map((cap,l)=>`<div class="zlr"><span>Warstwa ${ZL_LN[l]}</span><em>${Math.round(z[l])} z ${cap}</em></div><div class="pbar" style="height:5px"><div style="width:${Math.round(z[l]/cap*100)}%;background:${l===0?'#c9a66b':l===1?'#a88a56':'#86704a'}"></div></div>`).join('')}</div>`;
  const here=S.bld.filter(b=>ZL_B[b.kind]&&zlOf(b)===o);
  h+=`<p class="mut">${here.length?'Pracuje tu: '+here.map(b=>BD[b.kind].n.toLowerCase()).join(', ')+'.':'Nikt tu jeszcze nie kopie.'}</p>`;
  h+=`<div class="cz-act">${kinds.map(([k,r])=>`<button data-zlb="${k}"${bAvail(k)?'':' disabled'}>${BD[k].n} · warstwy: ${r.lay.map(l=>ZL_LN[l]).join(', ')}</button>`).join('')}</div>`;return h}}
$('sel').addEventListener('click',e=>{const s=e.target.closest('[data-zlb]');if(!s||!S)return;e.stopPropagation();const k=s.dataset.zlb;if(!bAvail(k)){toast('Jeszcze nie umiecie tego postawić');return}const o=ODK[selO];startPlace(k);if(o){lookAt(o.x,o.z,Math.max(zoomT,1.2));try{moveGhost(o.i,o.j)}catch(er){}}});
{const st=document.createElement('style');st.textContent=`.zlw{margin:6px 0}.zlr{display:flex;justify-content:space-between;font-size:13px;margin-top:5px}.zlr em{font-style:normal;color:#d8d2bf}`;document.head.appendChild(st)}
// ---------- modele ----------
function zlHeadframe(g,hx,hz,h){for(const[x,z]of[[-.32,-.32],[.32,-.32],[-.32,.32],[.32,.32]])g.add(cyl(.05,h,matLog2,hx+x,h/2,hz+z));g.add(tbox(.8,.08,.8,mPlankD,hx,h,hz));
 const w=new THREE.Mesh(new THREE.TorusGeometry(.28,.04,5,12),matWood);w.position.set(hx,h+.3,hz);g.add(w);g.add(cyl(.02,h+.1,matDark,hx,h/2+.1,hz,0,0,0,3));g.add(tbox(.7,.12,.7,matDark,hx,.04,hz))}
function zlKierat(g,x,z){g.add(cyl(.06,.7,matLog2,x,.35,z));g.add(cyl(.03,1.5,matWood,x,.62,z,0,0,Math.PI/2));const r=new THREE.Mesh(new THREE.RingGeometry(.7,.82,16),M(0x5a4a36));r.rotation.x=-Math.PI/2;r.position.set(x,.02,z);g.add(r)}
const zlHeap=(g,x,z,c,s)=>g.add(mesh(new THREE.ConeGeometry(.45*s,.42*s,9),M(c),x,.2*s,z));
{const _nm=newModel;newModel=function(kind,g){
  if(kind==='kopalnia'){zlHeadframe(g,-.35,-.3,1.5);zlKierat(g,.45,.45);zlHeap(g,.6,-.55,0x6a5a4a,1);for(let k=0;k<5;k++)g.add(mesh(new THREE.DodecahedronGeometry(.11,0),M(0x8a4a2e),-.75+k*.13,.08,.7));barrel(g,-.8,.25,.8);return 1}
  if(kind==='szybw'){zlHeadframe(g,-.35,-.3,1.7);zlKierat(g,.45,.45);zlHeap(g,.6,-.55,0x1c1c1f,1.1);g.add(tbox(.5,.22,.32,mPlankD,-.7,.12,.6));return 1}
  if(kind==='lom'){for(let k=0;k<4;k++)g.add(tbox(.9-k*.12,.32,.5,matStone,-.25+k*.05,.16+k*.3,-.55+k*.08,0,1.1));for(let k=0;k<6;k++)g.add(tbox(.22,.16,.18,matStone,.25+(k%3)*.25,.08+((k/3)|0)*.16,.45));
   g.add(cyl(.05,1.6,matLog2,.6,.8,-.3));g.add(cyl(.035,1.1,matWood,.35,1.45,-.3,0,0,Math.PI/2.6));g.add(cyl(.01,.7,matDark,.08,1.2,-.3,0,0,0,3));return 1}
  if(kind==='gliniak'){const pit=mesh(new THREE.CylinderGeometry(.75,.6,.1,12),M(0xb8a888),-.2,.02,-.1);g.add(pit);g.add(mesh(new THREE.CircleGeometry(.35,10),M(0x6a8088,{roughness:.2}),-.35,.075,-.2,-Math.PI/2));
   zlHeap(g,.6,.5,0xc8b898,.8);for(const[x,z]of[[.25,-.75],[.85,-.75],[.25,-.25],[.85,-.25]])g.add(cyl(.04,.7,matLog2,x,.35,z));{const r=gable(.75,.65,.25,mThatch,.7,.08);r.position.set(.55,0,-.5);g.add(r)}
   for(let k=0;k<6;k++)g.add(tbox(.14,.06,.08,M(0xa0603a),.35+(k%3)*.18,.1+((k/3)|0)*.07,-.5));return 1}
  return _nm(kind,g)}}
// ---------- dzień: stare zapisy, wiedza, zarys ----------
function zlDaily(){if(!S)return;odkInit();
 // budynki postawione na złożu przed 4.1 rozpoznają złoże od razu
 for(const b of S.bld){const r=ZL_B[b.kind];if(!r||!bDone(b))continue;const c=bCenter(b);const o=ODK.find(q=>q.t===r.t&&Math.hypot(q.x-c.x,q.z-c.z)<=9);if(o){const st=S.odk[o.id]||(S.odk[o.id]={s:1,d:S.day});if(st.s!==2){st.s=2;st.d=S.day;st.nm=ODK_T[o.t].n[0];odkLblDirty=true}}}
 ODK.forEach(o=>{if(zlIs(o)&&odkSt(o)&&odkSt(o).s===2)zlInit(o)});zlKeys();zlVis()}
{const _ad=actDaily;actDaily=function(){_ad();try{zlDaily()}catch(e){console.warn(e)}}}
{const _b=boot;boot=function(f){_b(f);try{zlDaily()}catch(e){console.warn(e)}}}
// ---------- „Jeszcze nie umiecie”: zrozumiały powód ----------
const ZL_WHY={zl_rudne:'odkryć złoże rudy: zwiadowcy szukają rdzawej wody w potokach',zl_lom:'odkryć ścianę skalną na łom',zl_glin:'odkryć glinisko nad wodą'};
window.__zl={ZL,ZL_B,zlOf,zlLeft,zlLayer,zlInit,zlTot,zlVis,zlDaily,deposits:()=>ODK.filter(zlIs)};
