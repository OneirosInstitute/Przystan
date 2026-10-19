
/* ================= poziomy budynków i rozbudowy ================= */
const STOL={id:'stol',n:'Lepsze stanowisko',d:'Praca idzie o 25% szybciej.',cost:{deski:6,gwozdzie:6},work:5,sp:1.25};
const EXT={
 zbieracz:[{id:'kosze',n:'Kosze z wikliny',d:'Zbieracze przynoszą o 25% więcej.',cost:{drewno:6,wlokna:2},work:4},{id:'suszarnia',n:'Suszarnia',d:'Jagody i grzyby w osadzie psują się o 30% wolniej.',cost:{drewno:10,deski:4},work:6}],
 drwal:[{id:'pila',n:'Kozioł i piła',d:'Drwale pracują o 25% szybciej.',cost:{drewno:8,narz:1},work:4,sp:1.25},{id:'wiatad',n:'Wiata na drewno',d:'Mniej odpadu: z każdego drzewa pół kłody więcej.',cost:{drewno:10,deski:4},work:5}],
 lesnik:[{id:'szkolka',n:'Szkółka drzew',d:'Sadzonki na wyspie rosną o połowę szybciej.',cost:{drewno:6},work:4}],
 pomost:[{id:'lodz',n:'Łódź rybacka',d:'Łowiska dalej od brzegu: zasięg +6, połów o 25% większy.',cost:{deski:16,gwozdzie:12,plotno:2},work:10},{id:'wedzarnia',n:'Wędzarnia',d:'Ryby i mięso w osadzie psują się o 40% wolniej. Pali trochę opału.',cost:{drewno:10,kamien:8},work:6}],
 mysliwy:[{id:'wnyki',n:'Wnyki',d:'Codziennie trochę mięsa z sideł.',cost:{drewno:4,wlokna:6},work:3},{id:'garbarnia',n:'Garbarnia',d:'Z polowań o 30% więcej skór.',cost:{drewno:10,glina:6},work:6}],
 zagroda:[{id:'wybieg',n:'Większy wybieg',d:'Zagroda mieści 16 kóz zamiast 10.',cost:{drewno:16},work:5},{id:'obora',n:'Obora',d:'Zimą kozy dają pełne mleko, wilki rzadziej się przedzierają.',cost:{drewno:20,deski:8},work:8}],
 pole:[{id:'strach',n:'Strach na wróble',d:'Plon o 10% większy.',cost:{drewno:2,plotno:1},work:1},{id:'rowy',n:'Rowy i miedze',d:'Zboże rośnie o 15% szybciej, gleba szybciej odpoczywa.',cost:{kamien:6},work:6}],
 kamien:[{id:'kliny',n:'Kliny i łomy',d:'Kamieniarze pracują o 25% szybciej.',cost:{drewno:6,narz:1},work:3,sp:1.25}],
 glinianka:[{id:'dol',n:'Dół do moczenia',d:'Z każdej odkrywki o połowę więcej gliny.',cost:{kamien:4},work:4}],
 ruda:[{id:'pluczka',n:'Płuczka',d:'Z każdego złoża o połowę więcej rudy.',cost:{deski:6},work:5}],
 drewutnia:[STOL,{id:'wiata',n:'Wiata na opał',d:'Opał nie wilgotnieje: z kłody cztery porcje zamiast trzech.',cost:{drewno:12},work:5}],
 pracownia:[STOL],mielerz:[STOL],warsztat:[STOL],szwalnia:[STOL],cegielnia:[STOL],pasieka:[STOL],ogrodziol:[STOL],
 kuznia:[STOL,{id:'miech',n:'Miech skórzany',d:'Kuźnia pracuje o kolejne 25% szybciej.',cost:{skory:4,deski:4},work:5,sp:1.25}],
 chata:[{id:'ogrod',n:'Ogród warzywny',d:'Rodzina zbiera warzywa od wiosny do jesieni.',cost:{drewno:6},work:3},{id:'piwnica',n:'Piwniczka',d:'Miejsce na 80 porcji żywności więcej.',cost:{kamien:10,deski:4},work:6},{id:'ganek',n:'Ganek z ławą',d:'Wieczorami sąsiedzi siadają razem: więcej nadziei.',cost:{deski:8,gwozdzie:6},work:4}],
 sklad:[{id:'dobud',n:'Dobudówka',d:'Skład mieści 200 więcej.',cost:{drewno:16,deski:6},work:6}],
 spizarnia:[{id:'lodownia',n:'Lodownia',d:'Żywność w osadzie psuje się o 20% wolniej.',cost:{kamien:16,deski:6},work:8}],
 studnia:[{id:'zuraw',n:'Żuraw',d:'Woda dla 8 osób więcej.',cost:{drewno:6},work:3}]};
EXT.chata.push({id:'zielnik',n:'Zielnik rodzinny',d:'Zioła pielęgnowane przy domu.',cost:{drewno:3,kamien:2},work:6},{id:'wyroby',n:'Domowe wyroby',d:'Rodzina kisi własne warzywa.',cost:{drewno:6,deski:4},work:12});
EXT.dom=EXT.chata;STOL.sp=1.25;
const LEVELABLE=k=>!!(BD[k].wk||BD[k].store)&&k!=='pole'||k==='pole';
const lvOf=b=>b.lv||1;
const hasExt=(b,id)=>!!(b&&b.ext&&b.ext.includes(id));
const anyExt=id=>S.bld.filter(b=>bDone(b)&&hasExt(b,id)).length;
const extSlots=b=>(b.kind==='szalas'?0:b.kind==='chata'?5:b.kind==='dom'?5:lvOf(b))+(b.kind==='pole'&&b.ext&&b.ext.includes('plot')?1:0);
const wkOf=b=>BD[b.kind].wk?BD[b.kind].wk+lvOf(b)-1:0;
const rOf=b=>(BD[b.kind].r||0)+2*(lvOf(b)-1)+(hasExt(b,'lodz')?6:0);
function bMul(b){if(!b)return 1;let m=(1+.15*(lvOf(b)-1))*condMul(b);(b.ext||[]).forEach(id=>{const e=(EXT[b.kind]||[]).find(x=>x.id===id);if(e&&e.sp)m*=e.sp});return m}
const penCap=b=>hasExt(b,'wybieg')?16:10;
function lvCost(b,to){const base=BD[b.kind].cost,c={};Object.entries(base).forEach(([k,v])=>c[k]=Math.ceil(v*(to===2?.6:.8)));
 const add=to===2?{deski:6,gwozdzie:10}:{deski:10,kamien:12,gwozdzie:16};Object.entries(add).forEach(([k,v])=>c[k]=(c[k]||0)+v);return c}
const lvWork=(b,to)=>Math.ceil(BD[b.kind].work*(to===2?.6:.8));
function startProj(b,t,id,quiet){if(!b)return;if(!bDone(b)){toast('Najpierw trzeba skończyć budowę.');return}if(b.proj){if(!quiet)toast('Tu już trwają prace.');return}
 let cost,work,n;if(t==='rep'){cost=repCost(b);work=repWork(b);n='remont'}else if(t==='lv'){const to=lvOf(b)+1;if(to>3)return;if(to===3&&!tech('r_zrab')){toast('Trzeci poziom wymaga wiedzy: Zrąb na jaskółczy ogon (Wiedza → Rzemiosło).');return}cost=lvCost(b,to);work=lvWork(b,to);n='poziom '+to}
 else{const e=(EXT[b.kind]||[]).find(x=>x.id===id);if(!e)return;if((b.ext||[]).length>=extSlots(b)){toast('Brak miejsca na kolejną rozbudowę. Najpierw podnieś poziom budynku.');return}cost=e.cost;work=e.work;n=e.n.toLowerCase()}
 if(!canAfford(cost)){toast('Brakuje: '+Object.entries(cost).filter(([k,v])=>(S.res[k]||0)<v).map(([k,v])=>RN[k].toLowerCase()+' '+Math.ceil(v-(S.res[k]||0))).join(', '));return}
 Object.entries(cost).forEach(([k,v])=>S.res[k]-=v);b.proj={t,id,prog:0,work};log('Rozpoczęto prace: '+BD[b.kind].n.toLowerCase()+', '+n+'.');rebuildMesh(b);
 if(freeCount()===0)toast('Nikt nie buduje: wszyscy mają pracę. Zwolnij kogoś w zakładce Praca.');renderSel();renderPanel()}
function finishProj(b){const pr=b.proj;b.proj=null;b.workers=0;
 if(pr.t==='rep'){b.cond=1;log('Remont skończony: '+BD[b.kind].n.toLowerCase()+' znów jak nowe.')}
 else if(pr.t==='lv'){b.lv=lvOf(b)+1;b.cond=1;log(BD[b.kind].n+' rozbudowane do poziomu '+b.lv+'. '+(BD[b.kind].wk?'Mieści więcej ludzi i pracuje sprawniej.':'Mieści więcej.'));toast(BD[b.kind].n+': poziom '+b.lv)}
 else{b.ext=(b.ext||[]).concat(pr.id);const e=EXT[b.kind].find(x=>x.id===pr.id);log('Gotowe: '+e.n.toLowerCase()+' przy budynku: '+BD[b.kind].n.toLowerCase()+'. '+e.d);toast('Gotowe: '+e.n)}
 rebuildMesh(b);assign();renderSel();renderPanel()}
function rebuildMesh(b){const previous=bMesh[b.id];if(previous){previous.removeFromParent();if(previous.userData.scaf)previous.userData.scaf.removeFromParent()}addBuildingMesh(b);if(previous)retireObjects(previous,previous.userData.scaf)}
function bldDaily(){const sea=seasonIdx();
 S.bld.forEach(b=>{if(!bDone(b))return;
  if(hasExt(b,'wnyki'))S.res.mieso+=1.5*K;
  if(hasExt(b,'ogrod')&&sea!==2)S.res.warzywa=(S.res.warzywa||0)+(sea===0?1.2:.8)*K;
  if(hasExt(b,'zielnik')&&sea!==2)S.res.ziola=(S.res.ziola||0)+.4*K;
  if(hasExt(b,'wyroby')&&S.res.warzywa>=6){S.res.warzywa-=6;S.res.kiszonki=(S.res.kiszonki||0)+4;}
  if(hasExt(b,'wedzarnia'))S.res.opal=Math.max(0,S.res.opal-.3*K);
  if(b.kind==='laznia'){if(S.res.opal>=.8*K){S.res.opal-=.8*K;S.people.forEach(p=>p.hp=Math.min(1,p.hp+.012*K));S.bathOk=1}else S.bathOk=0}});
 if(hasB('izbachorych'))S.people.forEach(p=>{if(p.hp<.6)p.hp=Math.min(1,p.hp+.025*K)});
 if(hasB('izbanauki'))techXp('nauka',1.5*K)}
function bldPanelHTML(b){const d=BD[b.kind];let h='';if(!bDone(b))return h;
 {const c=condOf(b),col=c<.15?'var(--bad)':c<.5?'var(--ember)':'var(--moss)';h+=`<p class="mut">Stan: <b style="color:${col}">${Math.round(c*100)}%</b>${c<.15?' · w ruinie':c<.5?' · wymaga remontu':' · remont za ok. '+yearsLeft(b).toFixed(1)+' roku'} · miejsce: ${(locWear(b),b._lt)}</p><div class="pbar"><div style="width:${Math.round(c*100)}%;background:${col}"></div></div>`;
  if(c<.8&&!b.proj)h+=`<button data-rep="${b.id}" style="margin:2px 6px 6px 0">Remontuj</button><span class="cost">${costHTML(repCost(b))}</span>`}
 if(b.proj){const pr=b.proj;const e=pr.t==='ext'?EXT[b.kind].find(x=>x.id===pr.id):null;h+=`<p>Trwają prace: ${pr.t==='rep'?'remont':pr.t==='rozb'?'rozbiórka':pr.t==='lv'?'poziom '+(lvOf(b)+1):e.n.toLowerCase()} · ${Math.round(100*pr.prog/pr.work)}% · przy pracy: ${b.workers||0}</p><div class="pbar"><div style="width:${Math.round(100*pr.prog/pr.work)}%"></div></div>`;return h}
 const canLv=(d.wk||d.store)&&lvOf(b)<3;const exts=EXT[b.kind]||[];
 if(d.house&&exts.length)h+=`<p class="mut">Rozbudowy przy domu: ${(b.ext||[]).length} z ${extSlots(b)}</p>`;else if(d.wk||d.store||exts.length)h+=`<p class="mut">Poziom ${lvOf(b)}${d.wk?` · ${wkOf(b)} prac.`:''}${d.r?` · zasięg ${rOf(b)}`:''}${exts.length?` · rozbudowy ${(b.ext||[]).length}/${extSlots(b)}`:''}</p>`;
 if(canLv){const to=lvOf(b)+1;h+=`<button class="pri" data-lv="${b.id}" style="margin:2px 6px 4px 0">Ulepsz do poziomu ${to}</button><span class="cost">${costHTML(lvCost(b,to))}${to===3&&!tech('r_zrab')?' · <span class="no">wymaga zrębu na jaskółczy ogon</span>':''}</span>`}
 exts.forEach(e=>{const on=hasExt(b,e.id);h+=`<div class="ext${on?' on':''}"><b>${on?'✓ ':''}${e.n}</b><small>${e.d}</small>${on?'':`<span class="cost">${costHTML(e.cost)}</span><button data-ext="${b.id}" data-eid="${e.id}">Dobuduj</button>`}</div>`});
 return h}

/* ---- wygląd: poziomy, rozbudowy, nowe budynki ---- */
let VR=Math.random;
function skep(g,x,z){g.add(tbox(.36,.3,.3,mPlankD,x,.15,z));const s=mesh(new THREE.SphereGeometry(.2,9,6,0,6.283,0,1.7),mThatch,x,.3,z);s.scale.y=1.25;g.add(s);g.add(mesh(new THREE.BoxGeometry(.06,.05,.02),matDark,x,.36,z+.2))}
function newModel(kind,g){
 if(wildModel(kind,g))return 1;
 if(kind==='gaj'){const tr=new THREE.Mesh(oakTrunkG,new THREE.MeshStandardMaterial({color:0x4e3c2c,roughness:1,flatShading:true,vertexColors:true}));tr.scale.set(1.9,1.7,1.9);
  const cr=new THREE.Mesh(oakG,new THREE.MeshStandardMaterial({color:0x5f7d45,roughness:.95,flatShading:true,vertexColors:true}));cr.scale.setScalar(1.75);cr.rotation.y=VR()*6;tr.castShadow=cr.castShadow=true;cr.receiveShadow=true;g.add(tr,cr);
  for(let q=0;q<11;q++){const a=q/11*6.28;g.add(mesh(new THREE.DodecahedronGeometry(.13+(q%3)*.03,0),matStone,Math.cos(a)*1.2,.06,Math.sin(a)*1.2,q,q))}
  for(const[x,z,c,y]of[[.62,.25,0xa83a2a,2.0],[-.55,-.2,0xe8e0cc,2.1],[.2,-.62,0xa83a2a,1.95],[-.25,.6,0xe8e0cc,2.05],[.5,-.4,0xe8e0cc,2.15]]){const rb=new THREE.Mesh(new THREE.PlaneGeometry(.07,.5),M(c,{side:THREE.DoubleSide}));rb.position.set(x,y-.25,z);rb.rotation.y=x*3+z;g.add(rb)}
  g.add(mesh(new THREE.BoxGeometry(.55,.3,.38),matStone,0,.15,.98));return 1}
 if(kind==='laznia'){logHouse(g,1.6,1.3,.85,{chim:-.45,win:false,rh:.55,lamp:false});barrel(g,1.05,.55,.9);woodpile(g,1.1,-.3,8,Math.PI/2);g.add(cyl(.18,.5,mPlank,-1.05,.25,.5,0,0,0,9));return 1}
 if(kind==='wieza'){for(const sx of[-1,1])for(const sz of[-1,1]){g.add(cyl(.07,3.4,matLog2,sx*.42,1.7,sz*.42,sz*.08,0,-sx*.08,6))}
  for(const y of[.9,1.9])g.add(tbox(.95,.05,.05,mPlank,0,y,.45),tbox(.95,.05,.05,mPlank,0,y,-.45),tbox(.05,.05,.95,mPlank,.45,y,0),tbox(.05,.05,.95,mPlank,-.45,y,0));
  g.add(tbox(1.15,.08,1.15,mPlank,0,3.1,0,0,2));for(const s of[-1,1])g.add(tbox(1.15,.3,.04,mPlankD,0,3.28,s*.56),tbox(.04,.3,1.15,mPlankD,s*.56,3.28,0));
  const r=gable(1.1,1.1,.55,mThatch,3.75,.12);g.add(r);for(const sx of[-1,1])for(const sz of[-1,1])g.add(tbox(.05,.6,.05,matDark,sx*.5,3.45,sz*.5));
  for(let k=0;k<11;k++)g.add(tbox(.36,.03,.05,mPlank,0,.25+k*.27,.52));g.add(tbox(.03,3,.03,matDark,-.17,1.5,.52),tbox(.03,3,.03,matDark,.17,1.5,.52));return 1}
 if(kind==='pasieka'){for(let k=0;k<5;k++)skep(g,-.7+(k%3)*.55,-.45+((k/3)|0)*.7);g.add(tbox(.8,.08,.22,mPlank,.6,.38,.65),tbox(.06,.38,.16,matDark,.3,.19,.65),tbox(.06,.38,.16,matDark,.9,.19,.65));
  for(let k=0;k<6;k++)g.add(mesh(new THREE.SphereGeometry(.06,5,4),M([0x9a6aa8,0xe0c050,0xe8e4d8][k%3]),-.9+k*.3,.06,.9));return 1}
 if(kind==='ogrodziol'){g.add(tbox(1.85,.04,1.85,M(0x4a3524),0,.02,0));for(let r=0;r<3;r++){g.add(tbox(1.6,.1,.38,M(0x3e2c1e),0,.06,-.6+r*.6));
   for(let c=0;c<6;c++){const col=[0x9a6aa8,0xe0c050,0x6a9a50,0xd8d8f0][(r+c)%4];g.add(mesh(new THREE.SphereGeometry(.08,6,4),M(0x4a6a38),-.7+c*.28,.16,-.6+r*.6));g.add(mesh(new THREE.SphereGeometry(.04,5,4),M(col),-.7+c*.28,.25,-.6+r*.6))}}
  g.add(tbox(1.95,.32,.04,mWattle,0,.16,.96,0,2),tbox(1.95,.32,.04,mWattle,0,.16,-.96,0,2),tbox(.04,.32,1.95,mWattle,.96,.16,0,0,2));barrel(g,-1.1,.7,.7);return 1}
 if(kind==='domwsp'){logHouse(g,3.6,1.6,1.25,{chim:0,win:false,rh:1.25,dx:-.8,roof:mShingle});door(g,.8,.84,0);win(g,0,.3+1.25*.6,.84);win(g,1.4,.3+1.25*.6,.84);win(g,-1.6,.3+1.25*.6,.84);
  for(const z of[-1,1]){const c1=cyl(.05,.6,matLog2,-.25*z,.3+1.25+1.25+.15,z*1.12,0,0,z*.6,5);g.add(c1)}
  g.add(tbox(1.4,.08,.3,mPlank,0,.42,1.2),tbox(.08,.4,.2,matDark,-.55,.2,1.2),tbox(.08,.4,.2,matDark,.55,.2,1.2));
  {const pole=cyl(.04,2.6,matDark,1.95,1.3,.9,0,0,0,5);g.add(pole);const fl=new THREE.Mesh(new THREE.PlaneGeometry(.6,.4),M(0x8a3a2a,{side:THREE.DoubleSide}));fl.position.set(2.25,2.35,.9);g.add(fl)}return 1}
 if(kind==='izbanauki'){plankHut(g,1.6,1.3,1.0,{win:true,lamp:true,roof:mShingle});g.add(tbox(.9,.6,.05,M(0x2a2a26),-1.1,.75,.3,Math.PI/2));g.add(tbox(.06,.9,.06,matDark,-1.1,.45,-.15),tbox(.06,.9,.06,matDark,-1.1,.45,.75));
  for(let k=0;k<2;k++)g.add(tbox(.8,.06,.2,mPlank,.4,.3,.95+k*.32),tbox(.06,.3,.15,matDark,.05,.15,.95+k*.32),tbox(.06,.3,.15,matDark,.75,.15,.95+k*.32));return 1}
 if(kind==='izbachorych'){plankHut(g,1.7,1.3,.95,{win:true,lamp:true});{const aw=new THREE.Mesh(new THREE.PlaneGeometry(1.2,.8),mCanvas);aw.rotation.x=-1.1;aw.position.set(.1,.95,1.0);g.add(aw)}
  g.add(tbox(.05,.75,.05,matDark,-.45,.37,1.35),tbox(.05,.75,.05,matDark,.65,.37,1.35));g.add(tbox(.9,.18,.4,mCanvas,.1,.12,1.1));
  rack(g,-1.15,.2,Math.PI/2,r=>{for(let k=0;k<4;k++){const b=new THREE.Mesh(new THREE.ConeGeometry(.07,.22,5),M(k%2?0x7a6a9a:0x7a9a50));b.position.set(0,.66,-.27+k*.18);b.rotation.x=Math.PI;r.add(b)}});return 1}
 return 0}
function levelDeco(g,kind,lv){const d=BD[kind];const W=d.w*.5,Hh=d.h*.5;
 if(lv>=2){const s=new THREE.Group();s.add(tbox(.06,.75,.06,matDark,-.3,.37,-.35),tbox(.06,.75,.06,matDark,-.3,.37,.35));const rf=tbox(.75,.05,.9,mPlankD,-.05,.78,0,0,2);rf.rotation.z=.25;s.add(rf);
  crate(s,-.05,-.15,.3);barrel(s,.0,.25,.7);s.position.set(-W-.32,0,-Hh*.3);g.add(s)}
 if(lv>=3){const p=new THREE.Group();p.add(cyl(.04,1.8,matDark,0,.9,0,0,0,0,5));const fl=new THREE.Mesh(new THREE.PlaneGeometry(.5,.32),M(0xb08a3a,{side:THREE.DoubleSide}));fl.position.set(.27,1.6,0);p.add(fl);p.position.set(W+.2,0,Hh+.15);g.add(p);
  for(let k=0;k<4;k++)g.add(mesh(new THREE.DodecahedronGeometry(.08,0),matStone,-W+.3+k*.5,.04,Hh+.35));g.add(tbox(d.w*.9,.1,.12,mPlank,0,.05,Hh+.42,0,2))}}
const EXTV={
 kosze:(g,W,H)=>{for(let k=0;k<3;k++){g.add(cyl(.16,.22,mWattle,W+.3,.11,-H+.3+k*.38,0,0,0,9))}},
 suszarnia:(g,W,H)=>{rack(g,0,-H-.35,0,r=>{for(let k=0;k<5;k++)r.add(new THREE.Mesh(new THREE.BoxGeometry(.12,.03,.12),M([0x7a2a40,0x8a6a3a][k%2])).translateX(-.3+k*.15).translateY(.62))})},
 pila:(g,W,H)=>{const s=new THREE.Group();s.add(tbox(.06,.5,.06,matDark,-.2,.25,0),tbox(.06,.5,.06,matDark,.2,.25,0),cyl(.09,.8,matLog,0,.5,0,0,0,Math.PI/2,7));s.position.set(W+.4,0,H*.3);g.add(s)},
 wiatad:(g,W,H)=>{woodpile(g,0,-H-.35,15,0)},
 szkolka:(g,W,H)=>{for(let k=0;k<6;k++)g.add(new THREE.Mesh(new THREE.ConeGeometry(.07,.22,6),M(0x3f7a3a)).translateX(W+.3).translateY(.11).translateZ(-H+.25+k*.25))},
 lodz:(g,W,H)=>{rowboat(g,W+.6,H+.6,.5)},
 wedzarnia:(g,W,H)=>{const s=new THREE.Group();s.add(tbox(.6,.6,.5,mStone,0,.3,0,0,1.2));s.add(gable(.6,.5,.3,mPlankD,.6,.08));s.add(tbox(.15,.35,.15,mStone,.15,.95,0));s.position.set(-W-.4,0,H*.2);g.add(s)},
 wnyki:(g,W,H)=>{for(let k=0;k<3;k++)g.add(cyl(.01,.5,M(0x9a8a6a),W+.3+k*.15,.25,H+.2,0,0,.3,3))},
 garbarnia:(g,W,H)=>{for(let k=0;k<2;k++)g.add(cyl(.22,.25,mPlank,-W-.3,.12,-H*.4+k*.5,0,0,0,10));rack(g,-W-.35,H*.5,Math.PI/2,r=>{const h=new THREE.Mesh(new THREE.PlaneGeometry(.55,.45),M(0x7a5a3a,{side:THREE.DoubleSide}));h.position.y=.55;r.add(h)})},
 wybieg:(g,W,H)=>{for(let k=0;k<10;k++){const a=-.6+k/9*1.6;g.add(cyl(.04,.6,matDark,Math.cos(a)*2.0,.3,Math.sin(a)*2.0,0,0,0,5))}},
 obora:(g,W,H)=>{const s=new THREE.Group();s.add(tbox(1.2,.7,.8,mLogs,0,.35,0,0,1.1));s.add(gable(1.2,.8,.45,mThatch,.7,.15));s.position.set(-W-.6,0,0);g.add(s)},
 strach:(g,W,H)=>{const s=new THREE.Group();s.add(cyl(.03,1.2,matDark,0,.6,0,0,0,0,5),cyl(.025,.7,matDark,0,.95,0,0,0,Math.PI/2,5));s.add(mesh(new THREE.SphereGeometry(.1,6,4),mCanvas,0,1.25,0));s.add(mesh(new THREE.CylinderGeometry(.16,.06,.1,8),mThatch,0,1.35,0));s.add(tbox(.3,.35,.08,M(0x6a5a8a),0,.82,0));g.add(s)},
 rowy:(g,W,H)=>{g.add(tbox(W*2,.03,.12,M(0x2a3a3c,{roughness:.3}),0,.02,H+.15))},
 kliny:(g,W,H)=>{for(let k=0;k<4;k++)g.add(mesh(new THREE.TetrahedronGeometry(.08,0),M(0x6a6a70,{metalness:.4}),W+.3,.05,-.3+k*.2))},
 dol:(g,W,H)=>{const w=new THREE.Mesh(new THREE.CircleGeometry(.4,10),M(0x6a4a30,{roughness:.2}));w.rotation.x=-Math.PI/2;w.position.set(W+.45,.03,0);g.add(w)},
 pluczka:(g,W,H)=>{g.add(tbox(.9,.15,.3,mPlank,W+.45,.3,0,0,2),tbox(.05,.3,.05,matDark,W+.1,.15,0),tbox(.05,.3,.05,matDark,W+.8,.15,0))},
 stol:(g,W,H)=>{g.add(tbox(.8,.07,.4,mPlank,W+.45,.5,0,Math.PI/2,2),tbox(.06,.48,.06,matDark,W+.45,.24,-.3),tbox(.06,.48,.06,matDark,W+.45,.24,.3))},
 wiata:(g,W,H)=>{const s=new THREE.Group();s.add(tbox(.06,.8,.06,matDark,-.4,.4,-.3),tbox(.06,.8,.06,matDark,.4,.4,-.3));const rf=tbox(1,.05,.8,mShingle,0,.85,0,0,2);rf.rotation.x=.2;s.add(rf);woodpile(s,0,0,10,0);s.position.set(0,0,-H-.45);g.add(s)},
 miech:(g,W,H)=>{g.add(mesh(new THREE.SphereGeometry(.2,8,5),M(0x6a4a30),-W-.25,.35,0));g.children[g.children.length-1].scale.set(1.4,.6,1)},
 ogrod:(g,W,H)=>{garden(g,-.3,-H-.55,Math.min(1.6,W*1.6),.7)},
 piwnica:(g,W,H)=>{const m=mesh(new THREE.SphereGeometry(.55,10,6,0,6.283,0,1.5),M(0x4a5a34),W+.5,-.25,-H*.3);m.scale.set(1,.9,1.2);g.add(m);door(g,W+.5,-H*.3+.6,0,.36,.5)},
 zielnik:(g,W,H)=>{garden(g,W+.3,-H-.5,.7,.6);for(let index=0;index<3;index++)g.add(cyl(.08,.16,M(0x987249),W+.3+index*.2,.08,-H-.8,0,0,0,7));},
 wyroby:(g,W,H)=>{rack(g,-W-.4,0,Math.PI/2,()=>{});barrel(g,-W-.4,.5,.6);barrel(g,-W-.4,-.4,.5);},
 ganek:(g,W,H)=>{g.add(tbox(W*1.6,.1,.5,mPlank,0,.1,H+.25,0,2));g.add(tbox(.8,.07,.22,mPlank,-W*.4,.42,H+.38),tbox(.07,.36,.18,matDark,-W*.4-.32,.2,H+.38),tbox(.07,.36,.18,matDark,-W*.4+.32,.2,H+.38))},
 dobud:(g,W,H)=>{const s=new THREE.Group();shed(s,1.2,1.2,.8,mShingle);crate(s,0,0,.2);sack(s,.3,.3);s.position.set(W+.65,0,0);g.add(s)},
 lodownia:(g,W,H)=>{const m=mesh(new THREE.SphereGeometry(.5,10,6,0,6.283,0,1.5),M(0x5a6a44),-W-.45,-.2,0);m.scale.set(1,.8,1.1);g.add(m);door(g,-W-.45,.45,0,.32,.45)},
 zuraw:(g,W,H)=>{g.add(cyl(.05,1.6,matLog2,.5,.8,.3,0,0,0,6));const arm=cyl(.035,2.4,matLog,.5,1.55,.3,0,0,1.2,5);g.add(arm)}};
function addBldVisuals(g,b){const d=BD[b.kind];const W=d.w*.5,H=d.h*.5;if(lvOf(b)>1)levelDeco(g,b.kind,lvOf(b));
 (b.ext||[]).forEach(id=>{const f=EXTV[id];if(f)f(g,W,H)});
 if(condOf(b)<.5){const r0=rng(b.id*31);for(let k=0;k<(condOf(b)<.15?6:3);k++){const pl=tbox(.5+r0()*.4,.04,.12,mPlankG,(r0()-.5)*d.w*.9,.05,H+.2+r0()*.4,r0()*3,2);pl.rotation.z=(r0()-.5)*.5;g.add(pl)}if(condOf(b)<.15)g.traverse(o=>{if(o.isMesh&&o.position.y>1.2)o.rotation.z+=(r0()-.5)*.08})}
 if(b.proj){const sc=new THREE.Group();const w=.9,h=.9,Hh=1.2;for(const sx of[-1,1])for(const sz of[-1,1])sc.add(cyl(.035,Hh,matDark,sx*w/2,Hh/2,sz*h/2,0,0,0,5));sc.add(tbox(w,.05,.06,mPlank,0,.7,h/2),tbox(w,.05,.06,mPlank,0,.7,-h/2));sc.position.set(W+.55,0,H+.45);g.add(sc)}}

/* ---- zużycie i remonty ---- */
const WEAR={gaj:.15,szalas:2.2,cmentarz:.3,studnia:.5,piec:.6,cegielnia:.8,kuznia:.8,dom:.7,laznia:1.2,pomost:1.4,wieza:1.1,pole:.4,zagroda:1.1};
const condOf=b=>b.cond===undefined?1:b.cond;
function locWear(b){if(b._lf)return b._lf;const c=bCenter(b);const ci=Math.round(c.x+N/2),cj=Math.round(c.z+N/2);let sea=0;
 for(let dj=-3;dj<=3;dj++)for(let di=-3;di<=3;di++){const i=ci+di,j=cj+dj;if(i>=0&&j>=0&&i<N&&j<N&&!land[j*N+i])sea=1}
 const bi=BIOME[Math.min(N-1,Math.max(0,cj))*N+Math.min(N-1,Math.max(0,ci))];const f=(sea?1.3:1)*(bi===3?1.25:bi===2?1.15:bi===4||bi===5?1.1:1);
 b._lf=f;b._lt=(sea?'blisko morza, sól i wiatr':bi===3?'mokradło, wilgoć':bi===2?'hale, wiatr i mróz':bi===4||bi===5?'cień lasu, wilgoć':'dobre, suche miejsce');return f}
function wearRate(b){return .0038*dM()*(WEAR[b.kind]||1)*[1,.85,.7][lvOf(b)-1]*locWear(b)*(seasonIdx()===2?1.4:1)*wxWear()}
function yearsLeft(b){const r=.0038*(WEAR[b.kind]||1)*[1,.85,.7][lvOf(b)-1]*locWear(b)*1.1;return Math.max(0,(condOf(b)-.5)/r/YEAR)}
const repCost=b=>{const c={};Object.entries(BD[b.kind].cost).forEach(([k,v])=>{if(k!=='cegla'||b.kind==='dom'||b.kind==='piec')c[k]=Math.max(1,Math.ceil(v*.25))});return c};
const repWork=b=>Math.max(2,Math.ceil(BD[b.kind].work*.4));
function wearDaily(){S.autoRep=S.autoRep===undefined?true:S.autoRep;
 S.bld.forEach(b=>{if(!bDone(b))return;const was=condOf(b);b.cond=Math.max(0,was-wearRate(b)*K/2.4);
  if((was>=.5&&b.cond<.5)||(was>=.15&&b.cond<.15))rebuildMesh(b);
  if(was>=.5&&b.cond<.5)log(BD[b.kind].n+': '+(BD[b.kind].house?'dach przecieka, ściany pękają':'zużycie widać gołym okiem')+'. Czas na remont.');
  if(was>=.15&&b.cond<.15){log(BD[b.kind].n+' popada w ruinę. '+(BD[b.kind].wk?'Praca tu stanęła.':'Ledwo trzyma się w całości.'));toast('W ruinie: '+BD[b.kind].n)}
  if(S.autoRep&&b.cond<.45&&!b.proj&&canAfford(repCost(b)))startProj(b,'rep',null,true)})}
function condMul(b){const c=condOf(b);return c>=.5?1:c<.15?0:.55+c*.9}
