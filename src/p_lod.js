
/* ================= 4.5 Szczegóły blisko kamery (wyspa 384) ================= */
// Drzewa, krzaki, kamienie, zioła, trawy i kwiaty mają po jednej siatce z instancjami na całą wyspę („wzorzec”).
// Wzorzec niczego nie rysuje (count=0), ale dalej przyjmuje wszystkie zmiany (ścięte drzewo, pora roku, mgła).
// Rysuje widok: kopia tylko tych instancji, które leżą w oknie wokół kamery. Okno liczy się w sektorach 8×8 kafli
// i odświeża, gdy kamera przejdzie pół sektora, zmieni przybliżenie albo wzorzec się zmieni.
// Z daleka drobiazgi (trawy, kwiaty, kamyki, paprocie, zioła) znikają, bo i tak byłyby mniejsze od piksela,
// a drzewa zamieniają się w proste bryły (jeden stożek albo kula), żeby las dalej było widać.
const LOD_SEC=8,LOD_SN=Math.ceil(N/LOD_SEC),LODS=[];
let lodKey='',lodFar=false,lodR=0,lodT=-1e9;
function lodBuckets(m){const n=m.instanceMatrix.count,a=m.instanceMatrix.array,B=new Array(LOD_SN*LOD_SN);
 for(let q=0;q<n;q++){const x=a[q*16+12],z=a[q*16+14];const si=clamp(Math.floor((x+N/2)/LOD_SEC),0,LOD_SN-1),sj=clamp(Math.floor((z+N/2)/LOD_SEC),0,LOD_SN-1),s=sj*LOD_SN+si;(B[s]||(B[s]=[])).push(q)}
 return B.map(v=>v?Int32Array.from(v):null)}
function lodWrap(m,o){if(!m||m.userData.lod)return;o=o||{};const cap=m.instanceMatrix.count;
 const v=new THREE.InstancedMesh(m.geometry,m.material,cap);v.count=0;v.castShadow=m.castShadow;v.receiveShadow=m.receiveShadow;v.frustumCulled=false;v.renderOrder=m.renderOrder;
 if(m.instanceColor)v.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(cap*3),3);
 let farV=null;if(o.farGeo){farV=new THREE.InstancedMesh(o.farGeo,m.material,cap);farV.count=0;farV.castShadow=false;farV.receiveShadow=true;farV.frustumCulled=false;if(m.instanceColor)farV.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(cap*3),3);(m.parent||scene).add(farV)}
 (m.parent||scene).add(v);m.count=0;m.userData.lod=1;
 LODS.push({m,v,farV,o,B:null,mv:-1,cv:-1,key:''})}
const lodV=new THREE.Vector3();
function lodSync(L,list){const src=L.m.instanceMatrix.array,cs=L.m.instanceColor&&L.m.instanceColor.array;
 if(L.v.geometry!==L.m.geometry)L.v.geometry=L.m.geometry;if(L.v.material!==L.m.material)L.v.material=L.m.material;if(L.farV&&L.farV.material!==L.m.material)L.farV.material=L.m.material;
 for(const tgt of[L.v,L.farV]){if(!tgt)continue;const show=tgt===L.v?!(lodFar&&(L.o.far||L.farV)):lodFar;if(!show){tgt.count=0;continue}
  const dm=tgt.instanceMatrix.array,dc=tgt.instanceColor&&tgt.instanceColor.array;let q=0;
  // w oknie dodatkowo tylko to, co w kadrze (jak dawne wycinanie pojedynczych drzew), i bez zerowej skali (ścięte, ukryte)
  for(const idx of list){const s=idx*16;if(src[s]===0&&src[s+5]===0&&src[s+10]===0)continue;lodV.set(src[s+12],src[s+13],src[s+14]).project(cam);if(lodV.x<-1.3||lodV.x>1.3||lodV.y<-1.45||lodV.y>1.3)continue;
   const d=q*16;for(let e=0;e<16;e++)dm[d+e]=src[s+e];if(dc&&cs){dc[q*3]=cs[idx*3];dc[q*3+1]=cs[idx*3+1];dc[q*3+2]=cs[idx*3+2]}q++}
  tgt.count=q;tgt.instanceMatrix.needsUpdate=true;if(dc)tgt.instanceColor.needsUpdate=true}}
function lodTick(){if(!LODS.length)return;
 // promień okna: połowa przekątnej kadru (kamera ortogonalna) plus zapas; przy dalekim widoku tryb „z daleka”
 // ślad kadru na ziemi: szerokość size·asp, głębokość size/sin(nachylenia); promień = pół przekątnej + zapas na ruch
 const size=34/zoom,asp=innerWidth/innerHeight,half=Math.hypot(size*asp/2,size/Math.sin(pitch)/2)+6;
 lodFar=size>(GFX&&GFX.level===0?90:120);lodR=half;
 // klucz: położenie i obrót kamery (jak przy wycinaniu kadru), najwyżej ~8 razy na sekundę
 const now=performance.now();if(now-lodT<120)return;
 const key=[camT.x,camT.z,zoom,yaw].map(x=>Math.round(x*8)).join(',')+':'+(lodFar?1:0);
 let secs=null;
 for(const L of LODS){L.v.visible=L.m.visible;if(L.farV)L.farV.visible=L.m.visible;
  const mv=L.m.instanceMatrix.version,cv=L.m.instanceColor?L.m.instanceColor.version:0;
  if(L.key===key&&L.mv===mv&&L.cv===cv)continue;
  if(!L.B)L.B=lodBuckets(L.m);
  if(!secs){secs=[];const cx=(camT.x+N/2)/LOD_SEC,cz=(camT.z+N/2)/LOD_SEC,r=lodFar?1e9:half/LOD_SEC+.75;
   for(let sj=0;sj<LOD_SN;sj++)for(let si=0;si<LOD_SN;si++)if(Math.hypot(si+.5-cx,sj+.5-cz)<=r+.71)secs.push(sj*LOD_SN+si)}
  const list=[];for(const s of secs){const b=L.B[s];if(b)for(let t=0;t<b.length;t++)list.push(b[t])}
  lodSync(L,list);L.key=key;L.mv=mv;L.cv=cv;lodT=now}}
// które siatki: drzewa (z prostą bryłą z daleka), reszta drobiazgów znika z daleka
{const farCone=(()=>{const g=new THREE.ConeGeometry(.7,2.4,5);g.translate(0,1.7,0);const c=new Float32Array(g.attributes.position.count*3).fill(.9);g.setAttribute('color',new THREE.BufferAttribute(c,3));return g})();
 const farBall=(()=>{const g=new THREE.IcosahedronGeometry(.85,0);g.scale(1.05,.9,1.05);g.translate(0,2.05,0);const c=new Float32Array(g.attributes.position.count*3).fill(.95);g.setAttribute('color',new THREE.BufferAttribute(c,3));return g})();
 for(const sp in crownM)lodWrap(crownM[sp],{farGeo:sp==='pine'||sp==='spruce'?farCone:farBall});
 for(const sp in trunkM)lodWrap(trunkM[sp],{far:1});
 for(const m of[ziolaM,ulM,rocks,bushes,berries,mushM,clays,zbozeM,lenM,rudaM,rudaPool])lodWrap(m,{far:1});
 for(const m of[tufts,flowers,pebbles,drifts,ferns,reeds,heaths,logsD,snags])lodWrap(m,{far:1});
}
{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);try{lodTick()}catch(e){console.warn(e)}}}
// po wczytaniu gry pozycje są już ustawione: przelicz sektory od nowa
{const _b=boot;boot=function(f){_b(f);for(const L of LODS){L.B=null;L.key=''}try{lodTick()}catch(e){}}}
window.__lod={LODS,get far(){return lodFar},get r(){return lodR},counts:()=>LODS.map(L=>[L.v.count,L.farV?L.farV.count:0,L.m.instanceMatrix.count])};
