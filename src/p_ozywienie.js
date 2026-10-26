
/* ================= 4.9.0-rc.10 Życie przy budynkach (grafika wysoka i ultra) ================= */
// Na grafice wysokiej i ultra budynki żyją:
//  - z kominów domów idzie dym: jesienią, zimą i wiosną cały dzień, latem rano i wieczorem;
//  - dym nad warsztatami (kuźnia, wędzarnia, mielerz, piekarnia…) unosi się i rozwiewa;
//  - żar w paleniskach i piecach migocze;
//  - proporce i chorągwie łopoczą, pranie na sznurze kołysze się na wietrze;
//  - kury w kurniku dziobią.
// Na grafice niskiej (oszczędzanie baterii) nic się nie rusza, a dym z kominów nie powstaje.
// Pętla działa tylko dla budynków blisko środka widoku, gdy czas płynie i karta gry jest widoczna.
const OZ_SMK=[.5,.34,.16].map(o=>new THREE.SpriteMaterial({map:softTex,transparent:true,opacity:o,depthWrite:false,color:0xcfd1cc}));
const OZ_IDS=new Set();let OZ_T=0,OZ_SEEN=-1;
function ozTag(o,t,ph){if(!o)return o;o.userData.an=t;o.userData.ph=ph===undefined?Math.random()*6.283:ph;if(t==='flag'||t==='sway')o.userData.noMerge=1;return o}
// scalanie siatek budynku (mniej wywołań rysowania) omija to, co ma się ruszać; na niskiej grafice scala wszystko jak dotąd
{const _mg=mergeGroup;mergeGroup=function(g){if(g&&GFX.level>0&&typeof wkG!=='undefined')g.traverse(o=>{if(o.isMesh&&o.geometry===wkG.hen){o.userData.noMerge=1;if(!o.userData.an)ozTag(o,'hen');o.userData.rx=o.rotation.x}});
  else if(g&&GFX.level===0)g.traverse(o=>{if(o.userData.an==='flag'||o.userData.an==='sway')o.userData.noMerge=0});return _mg(g)}}
{const _ws=wSmoke;wSmoke=function(g,x,y,z,s){return ozTag(_ws(g,x,y,z,s),'smoke')}}
{const _wg=wGlow;wGlow=function(g,x,y,z,w,h,ry){return ozTag(_wg(g,x,y,z,w,h,ry),'glow')}}
{const _la=laundry;laundry=function(g,x,z,ry){_la(g,x,z,ry);const l=g.children[g.children.length-1];if(l)l.children.forEach(c=>{if(c.isMesh&&c.geometry&&c.geometry.type==='PlaneGeometry')ozTag(c,'sway')})}}
// komin domu: trzy kłęby dymu, które wędrują w górę i rzedną
{const _lh=logHouse;logHouse=function(g,w,d,h,opt){const n0=g.children.length;const r=_lh(g,w,d,h,opt);
  if(opt&&opt.chim&&GFX.level>0){let cap=null;for(let k=g.children.length-1;k>=n0;k--){const c=g.children[k],p=c.geometry&&c.geometry.parameters;if(c.isMesh&&p&&Math.abs(p.width-.46)<.01&&Math.abs(p.depth-.46)<.01&&p.height<.1){cap=c;break}}
   if(cap){const ph=Math.random();for(let k=0;k<3;k++){const sp=new THREE.Sprite(OZ_SMK[0]);sp.position.set(cap.position.x,cap.position.y+.2,cap.position.z);sp.scale.set(.35,.35,1);
    sp.userData.an='chim';sp.userData.ph=(ph+k/3)%1;sp.userData.y0=cap.position.y+.12;sp.userData.x0=cap.position.x;sp.visible=false;g.add(sp)}}}
  return r}}
function ozCollect(g){const L=[];g.traverse(o=>{if(o.userData.an){L.push(o);if(o.userData.base===undefined){o.userData.base=o.rotation.y;o.userData.sc=o.scale.x;o.userData.py=o.position.y}}
  else if(o.isMesh&&typeof wkG!=='undefined'&&o.geometry===wkG.hen){ozTag(o,'hen');o.userData.rx=o.rotation.x;L.push(o)}});return L}
{const _ab=addBuildingMesh;addBuildingMesh=function(b){const r=_ab(b);try{const g=bMesh[b.id];if(g){const L=ozCollect(g);if(L.length){g.userData.anims=L;OZ_IDS.add(b.id)}else OZ_IDS.delete(b.id)}}catch(e){}return r}}
function ozChimOn(){const s=seasonIdx(),t=tod();if(s!==0)return true;return (t>T0-.04&&t<T0+.12)||(t>T1-.1&&t<T1+.08)}
function ozFrame(rdt){if(!S||GFX.level<1||document.hidden)return false;if(typeof batOn!=='undefined'&&batOn)return false;
 const sp=Math.min(3,S.speed||0);if(!sp)return true;OZ_T+=rdt*Math.min(1.6,.7+sp*.3);const t=OZ_T,wind=.5+((typeof WX!=='undefined'&&WX.wind)||.3);
 const chim=ozChimOn(),R2=(26+10/Math.max(.4,zoom||1))**2;
 // żar: jeden wspólny materiał, migocze dla wszystkich palenisk
 mGlow.color.setRGB(1,.54+.08*Math.sin(t*7.3)+.05*Math.sin(t*13.1),.23);
 for(const id of OZ_IDS){const g=bMesh[id];if(!g||!g.userData.anims||!g.parent){OZ_IDS.delete(id);continue}
  const dx=g.position.x-camT.x,dz=g.position.z-camT.z;if(dx*dx+dz*dz>R2)continue;
  const b=bById(id),done=b&&bDone(b);
  for(const o of g.userData.anims){const u=o.userData,ph=u.ph;
   if(u.an==='flag'){o.rotation.y=u.base+Math.sin(t*2.4*wind+ph)*.22;o.scale.x=u.sc*(1-.08*Math.abs(Math.sin(t*3.1*wind+ph)))}
   else if(u.an==='sway'){o.rotation.z=Math.sin(t*1.7*wind+ph)*.14*wind;o.rotation.x=Math.sin(t*1.1+ph)*.06}
   else if(u.an==='smoke'){o.position.y=u.py+Math.sin(t*.55+ph)*.08;const s=u.sc*(1+.14*Math.sin(t*.8+ph));o.scale.set(s,s,1)}
   else if(u.an==='hen'){const k=Math.sin(t*2.2+ph*3);o.rotation.x=u.rx+(k>.55?(k-.55)*1.4:0)}
   else if(u.an==='chim'){const on=done&&chim;o.visible=on;if(!on)continue;const f=(t*.16*(1+.15*wind)+ph)%1;o.position.y=u.y0+f*1.05;o.position.x=u.x0+(g.scale.x<0?-1:1)*f*(.12+.22*wind)+Math.sin(t*.9+ph*6)*.05*f;const s=.42+f*.95;o.scale.set(s,s,1);o.material=OZ_SMK[Math.min(2,(f*3)|0)]}}}
 return true}
{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);try{const on=ozFrame(rdt);
  // przełączenie na niską grafikę: dym z kominów znika, reszta staje w miejscu
  const lv=on===false?0:1;if(lv!==OZ_SEEN){OZ_SEEN=lv;if(!lv){mGlow.color.setHex(0xff8a3a);for(const id of OZ_IDS){const g=bMesh[id];if(g&&g.userData.anims)g.userData.anims.forEach(o=>{if(o.userData.an==='chim')o.visible=false})}}}}catch(e){}}}
window.__oz={OZ_IDS,ozFrame,ozChimOn};
