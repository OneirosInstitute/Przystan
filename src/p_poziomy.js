
/* ================= 4.9.0-rc.8 Widoczne poziomy budynków ================= */
// Dotąd każdy budynek na poziomie 2 dostawał tę samą szopkę ze skrzynką, a na poziomie 3 chorągiewkę i kamienie.
// Teraz poziom widać po tym, czym budynek się zajmuje:
//  poziom 2: przybudówka z boku na kamiennej podmurówce, pod nią zapas typowy dla fachu (kłody, węgiel, suszone ryby, beczki, ruda, worki, siano);
//  poziom 3: przybudówka kryta gontem, ogrodzone podwórze z drugiej strony z większym zapasem, ścieżka z płaskich kamieni do drzwi
//            i proporzec w barwie fachu.
const LV_T={drewno:['drwal','lesnik','drewutnia','pracownia','warsztat','bednarnia','szkutnia'],ogien:['kuznia','dymarka','mielerz','cegielnia','garncarnia'],
 lowy:['zbieracz','mysliwy','ptasznik','pomost','przystan','pasieka','ogrodziol'],przetw:['zarna','piekarnia','serownia','kiszarnia','warzelnia','slodownia','browar','miodosytnia','piekarz','winiarnia','wiatrak','szwalnia'],
 kop:['kamien','ruda','glinianka','torfowisko','sztolnia','odkrywka','kopalnia','lom','gliniak','szybw'],sklad:['sklad','spizarnia','piwnica','spichlerz','stodola'],zagroda:['zagroda','kurnik','chmielnik','winnica']};
const LV_OF={};for(const[t,ks]of Object.entries(LV_T))for(const k of ks)LV_OF[k]=t;
const LV_FLAG={drewno:0x8a5a2a,ogien:0x9a3a2a,lowy:0x3a6a8a,przetw:0xc09a40,kop:0x5a5a62,sklad:0x6a4a8a,zagroda:0x4a7a3a,inne:0xb08a3a};
const LV_SKIP={pole:1,serce:1,gaj:1,studnia:1,wieza:1,cmentarz:1,lawa:1,plac:1,brama:1,targ:1,cech:1,zajazd:1,browar:1,szpital:1,domwsp:1};// wielkie budynki mają własny dziedziniec na placu
const lvG={stone:new THREE.DodecahedronGeometry(1,0),flat:new THREE.CylinderGeometry(1,1.08,1,7),hay:new THREE.ConeGeometry(1,1,9),heap:new THREE.ConeGeometry(1,1,8),
 fish:new THREE.ConeGeometry(.035,.2,4),flag:new THREE.PlaneGeometry(.46,.3),wheel:new THREE.CylinderGeometry(.16,.16,.04,10)};
// zapas pod przybudówką albo na podwórzu; s=1 mały (poziom 2), s=2 duży (poziom 3)
function lvStock(g,t,s){const big=s>1;
 if(t==='drewno'){wLogs(g,0,big?-.12:0,.95,big?3:2,big?4:3,Math.PI/2);if(big)wBoards(g,0,.32,.9,3,Math.PI/2)}
 else if(t==='ogien'){woodpile(g,-.05,big?-.25:-.1,big?10:5,Math.PI/2);const h=mesh(lvG.heap,wkM.coal,.0,.11,big?.28:.22);wSc(h,.24,.22,.24);g.add(h);
  if(big)for(let k=0;k<3;k++){const c=mesh(wkG.coal,wkM.coal,.18+k*.08,.05,.42-k*.06);g.add(c)}}
 else if(t==='lowy'){rack(g,0,0,Math.PI/2,r=>{for(let k=0;k<(big?6:4);k++){const f=new THREE.Mesh(lvG.fish,k%3?wkMt(0x8a8a7a):wkM.meat);f.position.set(0,.68,-.3+k*(.6/((big?6:4)-1)));f.rotation.x=Math.PI;r.add(f)}});
  if(big){g.add(cyl(.15,.2,mWattle,.15,.1,.5,0,0,0,9),cyl(.13,.18,mWattle,-.15,.09,.55,0,0,0,9))}}
 else if(t==='przetw'){wBarrel(g,0,0,-.2,.9);wBarrel(g,.05,0,.2,.85);if(big){wBarrel(g,0,.36,0,.8,true,Math.PI/2);sack(g,-.2,.5,.9);sack(g,.12,.55,.85)}}
 else if(t==='kop'){const h=mesh(lvG.heap,wkM.earth,0,.14,0);wSc(h,.34,.28,.34);g.add(h);for(let k=0;k<(big?5:3);k++)g.add(mesh(wkG.ore,matStone,-.2+k*.1,.05,.32-(k%2)*.08,k,k*2,0));
  if(big){const c=wSub(g,.05,-.42,0);c.add(tbox(.5,.2,.3,mPlank,0,.26,0,0,2));for(const sx of[-1,1]){const w=mesh(lvG.wheel,matDark,sx*.27,.16,0);w.rotation.z=Math.PI/2;c.add(w)}}}
 else if(t==='sklad'){crate(g,0,-.22,.2);crate(g,.04,.22,-.1);sack(g,-.2,.05,.9);if(big){crate(g,0,0,0);g.children[g.children.length-1].position.y=.54;sack(g,.2,.5,.85)}}
 else if(t==='zagroda'){const h=mesh(lvG.hay,mThatch,0,.3,0);wSc(h,.3,.6,.3);g.add(h);if(big){g.add(tbox(.7,.14,.22,mPlank,.0,.07,.42,0,2));const h2=mesh(lvG.hay,mThatch,0,.24,-.42);wSc(h2,.24,.48,.24);g.add(h2)}}
 else{crate(g,0,-.15,.1);barrel(g,.02,.25,.9);if(big)sack(g,-.2,.4,.9)}}
// przybudówka: dwa słupy z przodu, dach jednospadowy opierający się o ścianę budynku
function lvLean(g,x,z,side,lv,t){const s=wSub(g,x,z,side>0?Math.PI:0);const D=1.05,Wd=.78,h=.92;
 s.add(tbox(Wd+.12,.12,D+.1,mStone,-.02,.06,0,0,.9));
 for(const sz of[-1,1])s.add(tbox(.07,h,.07,matLog2,-Wd/2+.05,.12+h/2,sz*(D/2-.05)));
 const rf=tbox(Wd+.3,.05,D+.24,lv>=3?mShingle:mThatch,-.05,.12+h+.13,0,0,2);rf.rotation.z=.3;s.add(rf);
 s.add(tbox(.06,.06,D,matLog2,-Wd/2+.05,.12+h,0));
 const st=wSub(s,.02,0,0);st.position.y=.12;lvStock(st,t,1);return s}
function lvYard(g,x,z,t,ry){const y=wSub(g,x,z,ry||0);const w=.95,d=1.15;
 wWattle(y,-w/2,-d/2,-w/2,d/2,.36);wWattle(y,-w/2,d/2,w/2,d/2,.36);wWattle(y,w/2,-d/2,w/2,d*.05,.36);
 const st=wSub(y,0,-.05,0);lvStock(st,t,2);return y}
function lvPath(g,Hh){for(let k=0;k<3;k++){const s=mesh(lvG.flat,wkMt(0x7c766a),((k%2)-.5)*.14,.015,Hh+.62+k*.27);wSc(s,.13+(k%3)*.015,.03,.1);s.rotation.y=k*.7;g.add(s)}}
function lvFlag(g,x,z,t){const p=wSub(g,x,z,0);p.add(cyl(.035,1.9,matLog2,0,.95,0,0,0,0,5));p.add(mesh(lvG.stone,matStone,0,.05,0));p.children[1].scale.set(.12,.08,.12);
 const f=new THREE.Mesh(lvG.flag,wkMt(LV_FLAG[t]||LV_FLAG.inne,{side:THREE.DoubleSide}));f.position.set(.25,1.68,0);f.castShadow=true;f.userData.an='flag';f.userData.ph=Math.random()*6.283;f.userData.noMerge=1;p.add(f);
 const tail=new THREE.Mesh(new THREE.PlaneGeometry(.18,.12),wkMt(0xe6dcc4,{side:THREE.DoubleSide}));tail.position.set(.56,1.7,0);p.add(tail)}
// przybudówka, podwórze i ścieżka stają tylko tam, gdzie obok nie stoi inny budynek (ważne dla starych zapisów i ciasnej zabudowy)
let LV_BB=null;
function lvFree(side){const b=LV_BB;if(!b||b.i===undefined||!S)return true;const d=BD[b.kind];if(side!=='F'&&typeof bMir==='function'&&bMir(b))side=side==='L'?'R':'L';
 const R=side==='L'?[b.i-1,b.j,1,d.h]:side==='R'?[b.i+d.w,b.j,1,d.h]:[b.i,b.j+d.h,d.w,1];
 for(const o of S.bld){if(o===b||o.id===b.id)continue;const e=BD[o.kind];if(e&&rectHit(R,[o.i,o.j,e.w,e.h]))return false}return true}
{const _ab=addBldVisuals;addBldVisuals=function(g,b){const keep=LV_BB;LV_BB=b||null;try{return _ab(g,b)}finally{LV_BB=keep}}}
{const _ld=levelDeco;levelDeco=function(g,kind,lv){if(/oldbld/.test(location.search)||LV_SKIP[kind]||!BD[kind]||BD[kind].house)return _ld(g,kind,lv);
 const d=BD[kind],W=d.w*.5,Hh=d.h*.5,t=LV_OF[kind]||'inne';
 if(lv>=2&&lvFree('L')){lvLean(g,-W-.4,Hh*.08,-1,lv,t);if(typeof STY!=='undefined'&&STY)STY.lean=false}
 if(lv>=3){if(lvFree('R'))lvYard(g,W+.55,-Hh*.15,t);if(lvFree('F'))lvPath(g,Hh);lvFlag(g,-W-.15,Hh+.25,t)}}}
window.__lv={LV_OF,lvStock};
