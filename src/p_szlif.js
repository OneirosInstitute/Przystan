
/* ================= 1.0: szlif — wydajność, zapis odporny na wersje, nowe wyspy i wyzwania, łagodny początek, „Od ostatniego razu”, „Na co czekamy”, rytm sesji ================= */
const GAME_VER='4.9.0-rc.13';
// ---------- wydajność: gotowe budynki scalane w jedną bryłę na materiał ----------
const _mInv=new THREE.Matrix4(),_mM=new THREE.Matrix4(),_mN=new THREE.Matrix3(),_vP=new THREE.Vector3(),_vN=new THREE.Vector3();
function mergeGroup(g){if(!g)return 0;g.updateMatrixWorld(true);_mInv.copy(g.matrixWorld).invert();const fireSet=new Set(fires.map(f=>f.g));const byMat=new Map();
 const walk=o=>{if(o!==g&&(o.userData.noMerge||fireSet.has(o)||o.isSprite))return;for(const c of o.children.slice())walk(c);
  if(o.isMesh&&!o.isInstancedMesh&&o.visible&&o.geometry&&o.material&&!Array.isArray(o.material)&&o.geometry.attributes.position){const m=o.material;if(!byMat.has(m))byMat.set(m,[]);byMat.get(m).push(o)}};
 walk(g);let saved=0;const retired=[];
 byMat.forEach((list,mat)=>{if(list.length<2)return;let tot=0;const parts=list.map(o=>{const geo=o.geometry.index?o.geometry.toNonIndexed():o.geometry;tot+=geo.attributes.position.count;return[o,geo]});
  const P=new Float32Array(tot*3),Nn=new Float32Array(tot*3),U=new Float32Array(tot*2),useC=!!mat.vertexColors,C=useC?new Float32Array(tot*3):null;let off=0;
  for(const[o,geo]of parts){_mM.multiplyMatrices(_mInv,o.matrixWorld);_mN.getNormalMatrix(_mM);const pa=geo.attributes.position,na=geo.attributes.normal,ua=geo.attributes.uv,ca=geo.attributes.color;
   for(let i=0;i<pa.count;i++){_vP.fromBufferAttribute(pa,i).applyMatrix4(_mM);P[(off+i)*3]=_vP.x;P[(off+i)*3+1]=_vP.y;P[(off+i)*3+2]=_vP.z;
    if(na){_vN.fromBufferAttribute(na,i).applyMatrix3(_mN).normalize();Nn[(off+i)*3]=_vN.x;Nn[(off+i)*3+1]=_vN.y;Nn[(off+i)*3+2]=_vN.z}
    if(ua){U[(off+i)*2]=ua.getX(i);U[(off+i)*2+1]=ua.getY(i)}if(C){if(ca){C[(off+i)*3]=ca.getX(i);C[(off+i)*3+1]=ca.getY(i);C[(off+i)*3+2]=ca.getZ(i)}else{C[(off+i)*3]=C[(off+i)*3+1]=C[(off+i)*3+2]=1}}}
   off+=pa.count;if(geo!==o.geometry)geo.dispose()}
  const mg=new THREE.BufferGeometry();mg.setAttribute('position',new THREE.BufferAttribute(P,3));mg.setAttribute('normal',new THREE.BufferAttribute(Nn,3));mg.setAttribute('uv',new THREE.BufferAttribute(U,2));if(C)mg.setAttribute('color',new THREE.BufferAttribute(C,3));mg.computeBoundingSphere();
  const mm=new THREE.Mesh(mg,mat);mm.castShadow=list.some(o=>o.castShadow);mm.receiveShadow=true;mm.userData.bid=g.userData.bid;mm.userData.merged=1;
  list.forEach(o=>{if(o.parent)o.parent.remove(o)});g.add(mm);retired.push(...list);saved+=list.length-1});
 if(retired.length)retireObjects(retired);return saved}
{const _ab=addBuildingMesh;addBuildingMesh=function(b){const g=_ab(b);if(bDone(b)&&!g.userData.crops&&!/nomerge/.test(location.search)){g.userData.bid=b.id;g.traverse(o=>{if(o.userData&&(o===g.userData.stock))o.userData.noMerge=1});try{mergeGroup(g)}catch(e){console.warn(e)}}return g}}
{const _sm=stockMake;stockMake=function(g,b){_sm(g,b);if(g.userData.stock)g.userData.stock.userData.noMerge=1}}
{const _hv=hamVis;hamVis=function(){_hv();Object.values(hamM).forEach(g=>{if(!g.userData.merged0){g.userData.merged0=1;try{mergeGroup(g)}catch(e){}}})}}

// ---------- zapis odporny na nowe wersje, kopia zapasowa ----------
function saveFix(o){if(!o||!o.people)return o;o.ver=o.ver||'0.x';
 if(o.nodeAmt&&o.nodeAmt.length!==nodes.length&&(!o.seed||o.seed===SEED)){const old=o.nodeAmt;o.nodeAmt=nodes.map((n,i)=>i<old.length?old[i]:n.amt);o.grow={};o._fixNodes=1}
 o.hamlets=o.hamlets||[];o.lad=o.lad||{};o.bld=o.bld||[];o.exps=o.exps||[];o.found=o.found||[];o.seen=o.seen||{};o.res=o.res||{};o.toolQ=o.toolQ||{};o.kron=o.kron||[];
 ['maka','chleb','ser','kiszonki','naczynia','warzywa','miod','ziola'].forEach(k=>{if(o.res[k]===undefined)o.res[k]=0});
 Object.values(o.fams||{}).forEach(f=>{if(f.sp===undefined)f.sp=0});if(o.diff===undefined)o.diff=1;if(!o.seed)o.seed=2207;return o}
{const originalSave=save;save=function(){if(S){S.sess=S.sess||{};S.sess.lt=Date.now()}
 const day=S&&Math.floor(S.day);let previous=null;try{if(S&&day%4===0&&S._bakD!==day){const current=localStorage.getItem(SAVEKEY);if(decodeSave(current))previous=current}}catch(error){}
 const success=originalSave();if(success&&previous){try{localStorage.setItem(SAVEKEY+'-bak',previous);S._bakD=day}catch(error){toast('Zapisano grę, ale nie udało się odświeżyć kopii zapasowej.')}}return success}}
let loadNote='';
{const originalLoad=load;load=function(raw){const state=originalLoad(raw);if(state){saveStatus.blocked=false;saveStatus.blockedRaw=null;if(state._fixNodes)loadNote='Zapis z dawnej wersji: zasoby przyrody na wyspie wczytane na nowo.';return state}
 if(raw!==undefined)return null;
 try{const backup=originalLoad(localStorage.getItem(SAVEKEY+'-bak'));if(backup){saveStatus.blocked=false;saveStatus.blockedRaw=null;loadNote='Główny zapis był uszkodzony. Wczytano kopię sprzed kilku dni.';return backup}
  const current=localStorage.getItem(SAVEKEY);if(current){saveStatus.blocked=true;saveStatus.blockedRaw=current}
 }catch(error){saveStatus.blocked=true}return null}}

// ---------- nowe wyspy i wyzwania (przy nowej grze) ----------
let CHAL_SEL=0;try{CHAL_SEL=+(localStorage.getItem('przystan-chal')||0)}catch(e){}
const CHAL=[['Bez wyzwania','Tak, jak gra była pomyślana.'],['Mała załoga','Na brzeg wychodzi dwanaście osób. Nie ma wśród nich kowala.'],['Długie zimy','Zimy są mroźniejsze, a domy palą więcej opału.']];
let freshFlag=false;try{freshFlag=localStorage.getItem('przystan-fresh')==='1'}catch(e){}
{const box=document.createElement('details');box.className='newset';const isle=SEED===2207?'Przystań (znana)':'Nowa wyspa nr '+SEED;
 box.innerHTML=`<summary>Nowa gra: wyspa i wyzwanie</summary><div class="ns"><span>Wyspa: <b>${isle}</b></span><div><button data-isle="known">Znana wyspa</button><button data-isle="new">Wylosuj nową</button></div>
 <span>Wyzwanie</span><div>${CHAL.map((c,i)=>`<button data-chal="${i}" class="${i===CHAL_SEL?'on':''}">${c[0]}</button>`).join('')}</div><small id="chalInfo">${CHAL[CHAL_SEL][1]}</small></div><small class="ver">Wersja ${GAME_VER}</small>`;
 const acts=document.querySelector('#intro .acts');if(acts)acts.parentNode.insertBefore(box,acts);if(freshFlag)box.open=true;
 const st=document.createElement('style');st.textContent=`.newset{margin:8px 0 4px;font-size:13px;color:var(--mut)}.newset summary{cursor:pointer;color:var(--gold);font-size:11px;letter-spacing:.14em;text-transform:uppercase;padding:4px 0}
 .newset .ns{display:grid;gap:6px;margin-top:6px}.newset .ns>div{display:flex;gap:6px;flex-wrap:wrap}.newset button{padding:6px 9px;font-size:13px}.newset button.on{border-color:var(--gold);background:#2c2a20;color:var(--hi)}.newset b{color:var(--hi)}.newset .ver{display:block;margin-top:6px;opacity:.6}
 .hintp{animation:hintp 1.5s ease-out infinite}@keyframes hintp{0%{box-shadow:0 0 0 0 rgba(226,196,140,.8)}75%{box-shadow:0 0 0 11px rgba(226,196,140,0)}100%{box-shadow:0 0 0 0 rgba(226,196,140,0)}}`;document.head.appendChild(st);
 box.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;e.preventDefault();
  if(b.dataset.chal!==undefined){CHAL_SEL=+b.dataset.chal;try{localStorage.setItem('przystan-chal',String(CHAL_SEL))}catch(er){}box.querySelectorAll('[data-chal]').forEach(x=>x.classList.toggle('on',+x.dataset.chal===CHAL_SEL));$('chalInfo').textContent=CHAL[CHAL_SEL][1];return}
  if(b.dataset.isle){const s=b.dataset.isle==='known'?2207:1000+Math.floor(Math.random()*89000);try{localStorage.setItem('przystan-seed',String(s));localStorage.setItem('przystan-fresh','1')}catch(er){}location.reload()}})
 if(freshFlag)gameLater(()=>{const go=$('go');go.textContent='Zejdź na brzeg: nowa gra';$('goNew').hidden=true},0)}
{const _sg=startGame;startGame=function(fresh){if(freshFlag){fresh=true;freshFlag=false;try{localStorage.removeItem('przystan-fresh')}catch(e){}}

 _sg(fresh)}}
{const _fs=freshState;freshState=function(){const st=_fs();st.chal=CHAL_SEL;st.seed=SEED;if(CHAL_SEL===1){const gone=new Set(st.people.filter(p=>p.fam===3||p.fam===6).map(p=>p.id));st.people=st.people.filter(p=>!gone.has(p.id));delete st.fams[3];delete st.fams[6];st.people.forEach(p=>{if(gone.has(p.pair))p.pair=null})}st.crew0=st.people.length;return st}}
{const _dw=diffWeather;diffWeather=function(){_dw();if(!S||S.chal!==2)return;const w=S.weather,sea=seasonIdx();if(w.adj2===Math.floor(S.day))return;w.adj2=Math.floor(S.day);
 if(sea===2&&(w.k==='clear'||w.k==='fog')&&Math.random()<.3)w.k='frost';if(sea===3&&w.k==='clear'&&yday()<80&&Math.random()<.3)w.k='snow'}}
function chalDaily(){if(S.chal===2&&seasonIdx()===2){const h=S.bld.filter(b=>bDone(b)&&BD[b.kind].house).length;S.res.opal=Math.max(0,S.res.opal-K*.25*h)}}
{const _kt=ksiegaText;ksiegaText=function(){let t=_kt();if(S.crew0&&S.crew0!==18)t=t.replace('Osiemnaścioro wyszło na brzeg',(S.crew0===12?'Dwanaścioro':S.crew0+' osób')+' wyszło na brzeg');if(S.chal)t=t.replace('Poziom trudności:',`Wyzwanie: ${CHAL[S.chal][0].toLowerCase()}. Poziom trudności:`);if(S.seed&&S.seed!==2207)t=t.replace('KSIĘGA ROZBITKÓW',`KSIĘGA ROZBITKÓW (wyspa nr ${S.seed})`);return t}}

// ---------- łagodny początek: pulsujące wskazówki ----------
let hintsOn=true;try{hintsOn=localStorage.getItem('przystan-hints')!=='0'}catch(e){}
const HINT={'Postaw chatę zbieracza':['budowa','jedzenie','[data-b="zbieracz"]'],'Postaw chatę drwala':['budowa','surowce','[data-b="drwal"]'],'Rozpoznaj kajutę kapitana na wraku':['praca',null,'[data-wt="2"]'],
 'Każda rodzina pod własnym dachem':['budowa','dom','[data-b="szalas"]'],'Postaw drewutnię i zgromadź 80 opału':['budowa',()=>BD.drewutnia.cat,'[data-b="drewutnia"]'],'Wynieś z wraku, co się da, zanim przyjdzie sztorm':['praca',null,'[data-wt]'],
 'Przeczytaj księgę z wraku':['praca',null,'[data-al="czyt"][data-d="1"]'],'Zbierz pierwsze plony z pola':['budowa','uprawa','[data-b="pole"]'],'Oswój pierwszą kozę':['budowa','uprawa','[data-b="zagroda"]'],'Załóż pierwszy przysiółek':['osada',null,'[data-knew]']};
let hintT=0,hintEl=[];
function hintTick(rdt){hintT+=rdt;if(hintT<.6)return;hintT=0;hintEl.forEach(e=>e.classList.remove('hintp'));hintEl=[];if(!S||!hintsOn||(S.act||1)>4||evOpen||placing)return;
 const g=goalInfo();if(!g)return;const h=HINT[g.t];if(!h)return;const[tb,cat0,sel]=h;const cat=typeof cat0==='function'?cat0():cat0;let el=null;
 if($('sheet').hidden||tab!==tb)el=document.querySelector(`#tabbar [data-tab="${tb}"]`);
 else if(cat&&tb==='budowa'&&buildCat!==cat)el=document.querySelector(`[data-bcat="${cat}"]`);
 else el=document.querySelector('#body '+sel);
 if(el){el.classList.add('hintp');hintEl.push(el)}}

// ---------- Na co czekamy ----------
function czekamy(){const L=[],d=Math.floor(S.day);
 S.bld.forEach(b=>{if(!bDone(b))L.push([`${BD[b.kind].n}: budowa ${Math.round(100*b.prog/b.work)}%${b.mat?', materiał '+Math.round(100*Math.min(1,(b.del||0)/b.mat))+'%':''}`,1]);else if(b.proj)L.push([`${BD[b.kind].n}: ${b.proj.t==='rep'?'remont':b.proj.t==='rozb'?'rozbiórka':b.proj.t==='lv'?'nowy poziom':'rozbudowa'} ${Math.round(100*b.proj.prog/b.proj.work)}%`,2]);
  if(b.field&&b.field.st==='rosnie')L.push([`Pole: zboże rośnie (${Math.round(100*(b.field.g||0))}%)`,3]);if(b.field&&b.field.st==='dojrzale')L.push(['Pole: czas na żniwa',0])});
 if(S.know&&S.know.active&&typeof TRIAL!=='undefined'){const T=TRIAL[S.know.active];L.push([`Próba: ${T.n.toLowerCase()} ${Math.round(100*(S.know[S.know.active+'_p']||0)/T.need)}%`,2])}
 Object.keys(S.books||{}).forEach(k=>{if(S.books[k]===1)L.push([`Czytanie: „${BOOKS[k]}” ${Math.round(100*(S.readP[k]||0)/200)}%`,2])});
 (S.exps||[]).forEach(e=>{const r=REGIONS[e.r];L.push([`Wyprawa ${r&&r.known?'do: '+r.name:'w nieznane'}: wróci za ${Math.max(1,Math.ceil(e.left))} ${dniW(Math.max(1,Math.ceil(e.left)))}`,1])});
 (S.hamlets||[]).forEach(h=>{if(h.arr&&S.day<h.arr)L.push([`Rodzina w drodze do przysiółka ${h.name}`,1]);if(h.rb)L.push([`Droga do przysiółka ${h.name}: ${Math.round(100*h.rb.p/h.rb.n)}%`,2]);if(h.need)L.push([`${h.name} czeka na: ${NEEDS[h.need.k][1]}`,0])});
 if(!S.wreck.gone){const left=YEAR-5-d;if(left>0)L.push([`Sztorm zabierze wrak za ${left} ${dniW(left)}`,left<8?0:3])}
 const sea=seasonIdx(),toNext=SD-Math.floor(rday())%SD;if(sea===1)L.push([`Zima za ${toNext} ${dniW(toNext)}: opał, odzież, zapasy`,toNext<5?0:3]);else if(sea===2)L.push([`Wiosna za ${toNext} ${dniW(toNext)}`,4]);
 const kup=YEAR-Math.floor(rday());if(kup<=6&&d>=YEAR-6)L.push([`Noc Kupały i rocznica rozbicia za ${kup} ${dniW(kup)}`,3]);
 return L.sort((a,b)=>a[1]-b[1])}
function czekamyHTML(){const L=czekamy();if(!L.length)return'';return`<div class="card"><h4>Na co czekamy</h4>${L.slice(0,7).map(x=>`<p style="margin:3px 0">${x[1]===0?'<b style="color:var(--ember)">!</b> ':''}${x[0]}</p>`).join('')}${L.length>7?`<p class="mut">…i jeszcze ${L.length-7}.</p>`:''}</div>`}
{const _th=troubleHTML;troubleHTML=function(){return czekamyHTML()+_th()}}

// ---------- Od ostatniego razu ----------
const SINCE_RX=/urodził|umiera|zmarł|ślub|wesel|Ukończono|Cel osiągnięty|Zaczyna się akt|przysiół|Ktoś ułożył pieśń|Dar dawnego|Ślad dawnego|Nowy poziom|Osada rośnie|Wyprawa .*wraca|Pożar|wyrusza|Rok na wyspie|Prządki|wyrób|Wspomnienie/;
function sinceLast(fresh){S.sess=S.sess||{};const d0=S.sess.d0,lt=S.sess.lt;S.sess.d0=S.day;if(fresh||d0===undefined)return;
 const kr=(S.kron||[]).filter(x=>x[0]>=Math.floor(d0)+1&&SINCE_RX.test(x[1])&&!/^Wspomnienie/.test(x[1])).slice(-7);const L=czekamy().slice(0,4);const g=goalInfo();
 let ago='';if(lt){const h=(Date.now()-lt)/36e5;ago=h<1?'':h<24?`Ostatnia wizyta: ${Math.round(h)} godz. temu. `:`Ostatnia wizyta: ${Math.round(h/24)} ${dniW(Math.round(h/24))} temu. `}
 const days=Math.floor(S.day-d0);if(days<1&&!kr.length&&!loadNote)return;
 const txt=`${loadNote?loadNote+'\n\n':''}${ago}${S.vname||'Przystań'}: ${S.people.length} ${osb(S.people.length)}, ${dayName(Math.floor(S.day)+1)}.\n\n`+(kr.length?'Ostatnio:\n'+kr.map(x=>'· '+x[1].split('. ')[0].replace(/\.$/,'')+'.').join('\n')+'\n\n':'')+
  (L.length?'Na co czekamy:\n'+L.map(x=>'· '+x[0]).join('\n')+'\n\n':'')+(g?`Cel: ${g.t}.`:'');
 S.evT=Math.max(S.evT||0,S.day+.6);let tries=0;const show=()=>{if(evOpen){if(++tries<40)gameLater(show,1500);return}openEvent({ey:'Od ostatniego razu',t:S.vname||'Przystań',text:()=>txt.trim().replace(/\n/g,'<br>'),opts:[{n:'Wracam do osady',d:'',f:()=>'Dobrze cię widzieć. Osada czekała.'}]},{})};gameLater(show,700)}
{const _b=boot;boot=function(fresh){_b(fresh);try{sinceLast(fresh)}catch(e){console.warn(e)}}}

// ---------- rytm sesji ----------
let sessT0=performance.now(),breakT=performance.now();
function rhythmDaily(){if(Math.floor(rday())%SD!==0)return;const min=(performance.now()-breakT)/6e4;if(min<25)return;breakT=performance.now();save();
 log(`Mija pora roku. Grasz już ${Math.round((performance.now()-sessT0)/6e4)} min. Gra zapisana: to dobry moment na przerwę.`);toast('Gra zapisana. Dobry moment na przerwę.')}
{const _ad=actDaily;actDaily=function(){_ad();chalDaily();rhythmDaily()}}
{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);hintTick(rdt)}}
{const _kt=kronTools;kronTools=function(){return _kt()+uiDisclosure('game:hints','Wskazówki',`<div class="card"><h4>Wskazówki na początek</h4><p class="mut">Pulsujące przyciski prowadzą do najbliższego celu w pierwszych aktach.</p><button data-hints class="${hintsOn?'pri':''}">${hintsOn?'Włączone':'Wyłączone'}</button></div>`)+
 uiDisclosure('game:about','O grze',`<div class="card"><h4>O grze</h4><p class="mut">Przystań, wersja ${GAME_VER}. Wyspa nr ${S?S.seed||SEED:SEED}${S&&S.chal?', wyzwanie: '+CHAL[S.chal][0].toLowerCase():''}. Gra zapisuje się od razu po uruchomieniu osady, co 15 sekund, każdego dnia i przy przejściu w tło. Co kilka dni zostawia kopię zapasową.</p></div>`)}}
document.addEventListener('click',e=>{if(!e.target.closest('[data-hints]'))return;hintsOn=!hintsOn;try{localStorage.setItem('przystan-hints',hintsOn?'1':'0')}catch(er){}renderPanel()});
