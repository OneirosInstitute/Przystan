
/* ================= v8: woda, pożary, rozbudowa, rada, niezgoda, prośby, dymki ================= */
const law=id=>!!(S&&S.laws&&S.laws[id]);
const isWorker=p=>p.age>=12||(law('pomoc')&&p.age>=10);
const wellCount=()=>S.bld.filter(b=>b.kind==='studnia'&&bDone(b)).length;
const waterCap=()=>18+14*wellCount();
function waterNeedOn(){return seasonIdx()===0||S.weather.k==='drought'}

/* ---- rozbudowa domów w miejscu ---- */
const UPG={szalas:'chata',chata:'dom'};
function upCost(from,to){const a=BD[to].cost,b=BD[from].cost,c={};Object.keys(a).forEach(k=>{const v=a[k]-Math.floor((b[k]||0)*.8);if(v>0)c[k]=v});return c}
function upFree(b,to){const d=BD[to];if(b.i+d.w>N||b.j+d.h>N)return false;for(let a=0;a<d.w;a++)for(let q=0;q<d.h;q++){const k=(b.j+q)*N+b.i+a;if(!land[k])return false;if(occ[k]>=0&&occ[k]!==b.id)return false}return true}
function upgradeB(id){const b=bById(id);if(!b||!bDone(b))return;const to=UPG[b.kind];if(!to)return;
 if(!bAvail(to)){toast('Jeszcze nie wiemy, jak to zbudować. Zobacz zakładkę Wiedza.');return}
 if(!upFree(b,to)){toast('Obok musi być wolne miejsce na większy dom.');return}
 const c=upCost(b.kind,to);if(!canAfford(c)){toast('Brakuje: '+Object.entries(c).filter(([k,v])=>(S.res[k]||0)<v).map(([k,v])=>RN[k].toLowerCase()+' '+Math.ceil(v-(S.res[k]||0))).join(', '));return}
 Object.entries(c).forEach(([k,v])=>S.res[k]-=v);
 const old=bMesh[b.id];if(old){bGroup.remove(old);if(old.userData.scaf)bGroup.remove(old.userData.scaf)}
 log('Rozbudowa: '+BD[b.kind].n.toLowerCase()+' staje się '+(to==='chata'?'chatą z bali':'domem z piecem')+'.');
 b.kind=to;b.prog=0;b.work=BD[to].work;b.workers=0;placeFootprint(to,b.i,b.j,b.id);
 const d=BD[to];nodes.forEach(n=>{if(n.type!=='fish'&&n.i>=b.i&&n.i<b.i+d.w&&n.j>=b.j&&n.j<b.j+d.h){n.gone=1;n.amt=0;S.nodeAmt[n.id]=0;nodeVis(n)}});
 addBuildingMesh(b);if(freeCount()===0)toast('Nikt nie buduje: wszyscy mają pracę.');renderSel();renderPanel()}
function removeBuilding(b,why){S.bld=S.bld.filter(x=>x!==b);const d=BD[b.kind];
 for(let a=0;a<d.w;a++)for(let q=0;q<d.h;q++){const k=(b.j+q)*N+b.i+a;if(occ[k]===b.id)occ[k]=-1}recomputeWalk();
 const m=bMesh[b.id];if(m){bGroup.remove(m);if(m.userData.scaf)bGroup.remove(m.userData.scaf);delete bMesh[b.id]}
 Object.values(S.fams).forEach(f=>{if(f.home===b.id)f.home=null});if(selB===b.id)select(null);fireFxRemove(b.id);assign();assignHomes()}

/* ---- pożary ---- */
const FLAM={szalas:1.4,chata:1,dom:.6,zbieracz:1,mysliwy:1,drwal:1.2,lesnik:1,kamien:.5,glinianka:.6,drewutnia:1.6,pracownia:1.4,mielerz:3,kuznia:2,warsztat:1.2,szwalnia:1.2,sklad:1.3,spizarnia:1,pomost:.6,ruda:.6,zagroda:.5,cmentarz:0,studnia:0,piec:.3,cegielnia:.4,pole:0};
function fireRoll(){if(S.day<6||S.bld.some(b=>b.fire))return;const s=seasonIdx();const sea=(law('warta')?.7:1)*[1.8,1,.5,.8][s]*(S.weather.k==='drought'?3:S.weather.k==='rain'||S.weather.k==='snow'?.25:1)*(law('straz')?.45:1);
 for(const b of S.bld){if(!bDone(b))continue;const f=FLAM[b.kind]||0;if(f&&Math.random()<.0022*K*f*sea){startFire(b);break}}}
function startFire(b){b.fire={s:1,hp:1};log('Pożar! Pali się '+BD[b.kind].n.toLowerCase()+'. Ludzie biegną z wiadrami.'+(wellCount()?'':' Bez studni wodę trzeba nosić z daleka.'));toast('Pożar: '+BD[b.kind].n);sfx('bell');
 const c=bCenter(b);const ppl=S.people.filter(p=>p.age>=13&&p.job!=='wyp'&&p.state!=='away').sort((x,y)=>Math.hypot(x.x-c.x,x.z-c.z)-Math.hypot(y.x-c.x,y.z-c.z)).slice(0,law('straz')?6:4);
 ppl.forEach(p=>{release(p);if(p.workKind==='build'&&p.tgt&&p.tgt.workers)p.tgt.workers--;p.path=null;p.state='idle';p.wait=0;p.fireB=b.id});b.fire.crew=ppl.map(p=>p.id);fireFx(b)}
function fireStep(dt){for(const b of S.bld){if(!b.fire)continue;const f=b.fire;f.hp-=dt*.0055*(law('straz')?.6:1);
  if(f.hp<.55&&seasonIdx()===0&&Math.random()<dt*.0015){const c=bCenter(b);const nb=S.bld.find(x=>x!==b&&!x.fire&&bDone(x)&&(FLAM[x.kind]||0)>0&&Math.hypot(bCenter(x).x-c.x,bCenter(x).z-c.z)<3.6);if(nb){startFire(nb);log('Ogień przeskakuje na '+BD[nb.kind].n.toLowerCase()+'.')}}
  if(f.s<=0||f.hp<=0)endFire(b)}}
function endFire(b){const f=b.fire;b.fire=null;fireFxRemove(b.id);S.people.forEach(p=>{if(p.fireB===b.id){p.fireB=null;if(p.state==='work'){p.state='idle';p.wait=.5}}});
 if(f.hp<=0){log('Ogień strawił '+BD[b.kind].n.toLowerCase()+'. Zostały zgliszcza.');toast('Spłonęło: '+BD[b.kind].n);S.dis=clamp((S.dis||0)+.06,0,1);S.hope=clamp(S.hope-.04,0,1);
  if(BD[b.kind].store){['drewno','deski','opal','skory','plotno'].forEach(k=>S.res[k]=(S.res[k]||0)*.75)}removeBuilding(b);return}
 if(f.hp<.8){b.prog=b.work*Math.max(.2,f.hp);const m=bMesh[b.id];if(m){bGroup.remove(m);if(m.userData.scaf)bGroup.remove(m.userData.scaf)}addBuildingMesh(b);log('Pożar ugaszony, ale '+BD[b.kind].n.toLowerCase()+' trzeba naprawić ('+Math.round((1-f.hp)*100)+'% zniszczeń).')}
 else log('Pożar ugaszony w porę. '+BD[b.kind].n+' ocalało.');S.dis=clamp((S.dis||0)+.02,0,1)}
const fireFxs={};
function fireFx(b){fireFxRemove(b.id);const c=bCenter(b);const g=new THREE.Group();g.position.set(c.x,Hy(c.x,c.z),c.z);const d=BD[b.kind];const fl=[];
 for(let k=0;k<11;k++){const big=k<5;const m=new THREE.Mesh(new THREE.ConeGeometry(big?.32+Math.random()*.15:.18+Math.random()*.1,big?1.2+Math.random()*.6:.7+Math.random()*.4,6),new THREE.MeshBasicMaterial({color:k%3===0?0xffd070:k%3===1?0xff8a30:0xff5a20,toneMapped:false,transparent:true,opacity:.92}));m.position.set((Math.random()-.5)*d.w*.8,(big?1.9:1.2)+Math.random()*.7,(Math.random()-.5)*d.h*.8);m.renderOrder=6;g.add(m);fl.push(m)}
 const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:.8}));gl.scale.set(6,6,1);gl.position.y=2.2;g.add(gl);
 const sm=[];for(let k=0;k<8;k++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:softTex,color:0x3a3632,transparent:true,opacity:0,depthWrite:false}));s.userData.t=k/8;g.add(s);sm.push(s)}
 scene.add(g);fireFxs[b.id]={g,fl,gl,sm}}
function fireFxRemove(id){const f=fireFxs[id];if(f){scene.remove(f.g);delete fireFxs[id]}}
function fireFxTick(rdt){for(const id in fireFxs){const f=fireFxs[id],b=bById(+id);if(!b||!b.fire){fireFxRemove(id);continue}const k=.4+.6*Math.max(b.fire.s,.15);
  f.fl.forEach((m,i)=>{m.scale.set(k,k*(.8+.4*Math.sin(clock*10+i*1.7)),k)});f.gl.material.opacity=.5+.3*Math.sin(clock*7);
  f.sm.forEach(s=>{s.userData.t=(s.userData.t+rdt*.25)%1;const t=s.userData.t;s.position.set(Math.sin(t*5+s.id)*.4+t*1.5,2.6+t*5,Math.cos(t*4+s.id)*.4);const sc=.8+t*3;s.scale.set(sc,sc,1);s.material.opacity=(1-t)*.55*k})}}

/* ---- rada osady: prawa w stylu edyktów (autorytet, miejsca, utrzymanie, uchylanie) ---- */
const LCAT=[['gosp','Gospodarka'],['porz','Porządek'],['lud','Ludzie'],['rozw','Rozwój']];
const LAWS=[
 {id:'oszczedne',c:'gosp',g:'racje',n:'Racjonowanie',cost:15,d:'Każdy je o 20% mniej. Zapasy starczą dłużej, ale ludzie słabną, a niezgoda rośnie.'},
 {id:'wspolne',c:'gosp',g:'racje',n:'Wspólne posiłki',cost:20,up:{opal:.4},d:'Wszyscy jedzą razem przy ognisku. Rośnie nadzieja, spada niezgoda.'},
 {id:'zapasy',c:'gosp',n:'Zapasy na zimę',cost:15,up:{auth:.3},d:'Suszenie, solenie i szczelne skrzynie. Żywność psuje się o 20% wolniej.'},
 {id:'dlugi',c:'gosp',n:'Praca do zmroku',cost:20,d:'Dzień pracy dłuższy o ponad godzinę. Więcej zrobione, ale ludzie się męczą, a niezgoda rośnie.'},
 {id:'lup',c:'gosp',n:'Podział łupów z wypraw',cost:10,d:'Kto idzie na wyprawę, zatrzymuje część zdobyczy. Wyprawy przynoszą o 25% więcej, ale reszta osady szemrze.'},
 {id:'straz',c:'porz',n:'Straż ogniowa',cost:15,up:{auth:.2},d:'Pożary wybuchają rzadziej, ogień niszczy wolniej, a do gaszenia biegnie więcej osób.'},
 {id:'warta',c:'porz',n:'Nocna warta',cost:15,up:{opal:.3},d:'Ognie przy zagrodach i obozie. Wilki rzadko atakują kozy, mniej pożarów.'},
 {id:'sad',c:'porz',g:'dyscyplina',n:'Sąd starszych',cost:25,up:{auth:.5},d:'Spory rozstrzygają starsi. Niezgoda wyraźnie spada.'},
 {id:'kary',c:'porz',g:'dyscyplina',n:'Kary za lenistwo',cost:20,d:'Kto się leni, traci przydział. Praca idzie o 8% szybciej, ale nadzieja spada, a niezgoda rośnie.'},
 {id:'pomoc',c:'lud',g:'dzieci',n:'Dzieci pomagają',cost:15,d:'Dzieci od 10 lat pracują jako pomocnicy, o połowę słabiej od dorosłych. Nadzieja spada.'},
 {id:'nauka',c:'lud',g:'dzieci',n:'Dzieci się uczą',cost:15,d:'Dzieci podpatrują fach półtora raza szybciej. Rośnie nadzieja.'},
 {id:'odpoczynek',c:'lud',g:'chorzy',n:'Chorzy odpoczywają',cost:10,d:'Ranni i chorzy nie pracują, za to zdrowieją dwa razy szybciej.'},
 {id:'kazdy',c:'lud',g:'chorzy',n:'Każdy pracuje',cost:10,d:'Ranni pracują dalej. Więcej rąk do pracy, wolniejsze zdrowienie, większa niezgoda.'},
 {id:'cmentarz',c:'lud',g:'pochowek',n:'Godny pochówek',cost:10,d:'Zmarłych chowa się w miejscu pamięci. Każda śmierć mniej rani osadę.',need:()=>hasB('cmentarz'),nt:'Najpierw trzeba postawić miejsce pamięci.'},
 {id:'morze',c:'lud',g:'pochowek',n:'Pochówek w morzu',cost:5,d:'Zmarłych oddaje się morzu. Nie trzeba miejsca pamięci, ale każda śmierć zostawia większy żal.'},
 {id:'opowiesci',c:'lud',n:'Wieczory przy ognisku',cost:15,up:{opal:.6},d:'Starsi opowiadają o dawnym świecie. Rośnie nadzieja i nauka, spada niezgoda.'},
 {id:'swieto',c:'lud',n:'Święto plonów',cost:20,d:'Na początku każdej jesieni osada ucztuje. Zjada zapas na dwa dni, ale nadzieja rośnie, a niezgoda spada.'},
 {id:'npracy',c:'rozw',n:'Nauka przy pracy',cost:20,d:'Mistrzowie tłumaczą, zamiast robić sami. Fachu uczy się o 20% szybciej, praca idzie o 5% wolniej.'},
 {id:'wymiana',c:'rozw',n:'Wymiana wiedzy',cost:25,up:{auth:.5},d:'Wieczorne narady rzemieślników. Postęp we wszystkich dziedzinach o 15% szybszy.'}];
const LAW_BY={};LAWS.forEach(l=>LAW_BY[l.id]=l);
const lawSlots=()=>[2,3,4,5][S.tier||0]+(offHolder('starszy')?1:0);
const lawCount=()=>Object.keys(S.laws).filter(k=>S.laws[k]).length;
function lawRival(l){return l.g?LAWS.find(x=>x.g===l.g&&x!==l&&S.laws[x.id]):null}
function lawState(l){if(S.laws[l.id])return'on';const cd=(S.lawCD||{})[l.id];if(cd&&cd>S.day)return'cd';if(l.need&&!l.need())return'need';
 const riv=lawRival(l);if(!riv&&lawCount()>=lawSlots())return'slots';if((S.auth||0)<l.cost)return'auth';return riv?'swap':'ok'}
const upTxt=up=>up?Object.entries(up).map(([k,v])=>(k==='auth'?'autorytet':RN[k].toLowerCase())+' '+v+'/d').join(', '):'';
function passLaw(id){const l=LAW_BY[id];if(!l)return;const st=lawState(l);if(st!=='ok'&&st!=='swap'){toast({cd:'Tego prawa nie da się teraz uchwalić ponownie.',need:l.nt,slots:'Brak miejsca na kolejne prawo. Uchyl inne albo rozwiń osadę.',auth:'Za mało autorytetu rady.'}[st]||'Nie teraz');return}
 const riv=lawRival(l);if(riv)repealLaw(riv.id,'swap');S.auth-=l.cost;S.laws[id]=1;
 const fx={pomoc:()=>{S.hope=clamp(S.hope-.05,0,1);S.dis=clamp(S.dis+.04,0,1)},nauka:()=>{S.hope=clamp(S.hope+.02,0,1)},oszczedne:()=>{S.dis=clamp(S.dis+.04,0,1)},kary:()=>{S.dis=clamp(S.dis+.03,0,1)}};
 if(fx[id])fx[id]();log('Rada uchwala: „'+l.n+'”. '+l.d);toast('Nowe prawo: '+l.n);assign();renderPanel()}
function repealLaw(id,why){const l=LAW_BY[id];if(!l||!S.laws[id])return;delete S.laws[id];S.lawCD=S.lawCD||{};S.lawCD[id]=Math.floor(S.day)+3;
 if(why==='upkeep')log('Brakuje środków na „'+l.n+'”. Prawo przestaje obowiązywać.');
 else{S.dis=clamp((S.dis||0)+(why==='swap'?.02:.03),0,1);log('Rada uchyla prawo: „'+l.n+'”.'+(why==='swap'?'':' Część ludzi narzeka na zmianę zdania.'))}
 if(why!=='swap'&&why!=='upkeep')toast('Uchylono: '+l.n);assign();renderPanel()}
function lawDaily(){S.auth=S.auth===undefined?30:S.auth;S.lawCD=S.lawCD||{};
 for(const id of Object.keys(S.laws)){const l=LAW_BY[id];if(!l||!S.laws[id]){delete S.laws[id];continue}if(!l.up)continue;
  const ok=Object.entries(l.up).every(([k,v])=>k==='auth'?S.auth>=v*K:(S.res[k]||0)>=v*K);
  if(!ok){repealLaw(id,'upkeep');continue}Object.entries(l.up).forEach(([k,v])=>{if(k==='auth')S.auth-=v*K;else S.res[k]-=v*K})}
 const st=offHolder('starszy');const gain=(1+1.5*S.hope+.5*S.tier+(st?.6+.15*(st.trait==='Nauczyciel'||st.trait==='Pogodny'?3:Math.min(3,st.age/20)):0))*(1-.6*(S.dis||0));
 S.auth=clamp(S.auth+gain*K,0,100);
 if(law('swieto')&&Math.floor(rday())===SD&&!S.seen['swieto'+Math.floor(S.day/YEAR)]){S.seen['swieto'+Math.floor(S.day/YEAR)]=1;const need=K*S.people.length*2;const tot=foodTotal();if(tot>need*4){FOOD.forEach(k=>S.res[k]-=need*(S.res[k]/tot));S.hope=clamp(S.hope+.1,0,1);S.dis=clamp(S.dis-.15,0,1);log('Święto plonów. Cała osada ucztuje do późnej nocy. Ktoś gra na flecie z kości.');toast('Święto plonów')}else log('Na święto plonów nie starczy jedzenia. Ludzie są rozczarowani.')}}

/* ---- urzędy: ludzie z rady ---- */
const OFFICES=[{id:'starszy',n:'Starszy osady',sk:null,d:'Prowadzi radę: więcej autorytetu, łagodniejsze spory i jedno prawo więcej.'},
 {id:'spizarnia',n:'Strażnik spiżarni',sk:'zbieracz',d:'Pilnuje zapasów: żywność psuje się wolniej.'},
 {id:'budowa',n:'Mistrz budowy',sk:'ciesla',d:'Prowadzi budowy: idą szybciej.'},
 {id:'zielarz',n:'Zielarz',sk:'zbieracz',d:'Dogląda chorych i rannych: zdrowieją szybciej.'},
 {id:'lowczy',n:'Łowczy',sk:'mysliwy',d:'Prowadzi polowania i wyprawy: mniej ran.'}];
function offHolder(id){const pid=S&&S.offices&&S.offices[id];if(pid===undefined||pid===null)return null;const p=pById(pid);if(!p||!isAdult(p)){S.offices[id]=null;return null}return p.state==='away'?null:p}
function offLv(id){const p=offHolder(id);if(!p)return 0;const o=OFFICES.find(x=>x.id===id);return o.sk?1+(p.sk[o.sk]||0):2+(p.trait==='Nauczyciel'||p.trait==='Pogodny'?2:0)}
function offScore(o,p){return o.sk?(p.sk[o.sk]||0)*10-Math.abs(p.age-40)/10:(p.trait==='Nauczyciel'?30:p.trait==='Pogodny'?25:0)+p.age/2}
function setOffice(id,pid){S.offices=S.offices||{};Object.keys(S.offices).forEach(k=>{if(S.offices[k]===pid&&k!==id)S.offices[k]=null});S.offices[id]=pid===''||pid===null?null:+pid;const p=pById(+pid);const o=OFFICES.find(x=>x.id===id);
 if(p)log(p.name+' obejmuje urząd: '+o.n.toLowerCase()+'.');renderPanel()}
function offEffTxt(o){const lv=offLv(o.id);if(!lv)return'Urząd pusty.';return{starszy:`+${(.6+.15*Math.min(3,lv)).toFixed(1)} autorytetu dziennie, jedno miejsce na prawo więcej`,spizarnia:`żywność psuje się o ${Math.round(Math.min(.3,.05*lv)*100)}% wolniej`,budowa:`budowa szybsza o ${Math.round(.04*lv*100)}%`,zielarz:`chorzy zdrowieją szybciej (poziom ${lv})`,lowczy:`rany na polowaniach i wyprawach rzadsze o ${Math.round(Math.min(.5,.08*lv)*100)}%`}[o.id]}
function councilHTML(){S.offices=S.offices||{};let h=`<h3>Rada osady</h3><div class="card"><div class="authbox"><div><b>${Math.floor(S.auth||0)}</b><span>autorytet</span></div><div><b>${lawCount()}/${lawSlots()}</b><span>prawa</span></div><div><b>${Math.round((S.dis||0)*100)}%</b><span>niezgoda</span></div></div>
 <p class="mut">Autorytet rośnie z nadzieją i rozwojem osady, maleje przy niezgodzie. Uchwalenie prawa kosztuje autorytet. Prawo można uchylić w każdej chwili, ale ludzie nie lubią zmian zdania, a do tego samego prawa wraca się najwcześniej po 3 dniach.</p></div>`;
 h+='<h3>Urzędy</h3>';const adults=S.people.filter(p=>isAdult(p));
 OFFICES.forEach(o=>{const cur=S.offices[o.id];const opts=adults.slice().sort((a,b)=>offScore(o,b)-offScore(o,a)).map(p=>`<option value="${p.id}"${cur===p.id?' selected':''}>${p.name}${o.sk?' · '+CN[o.sk]+' '+p.sk[o.sk]:' · '+Math.floor(p.age)+' l. · '+traitN(p).toLowerCase()}${Object.entries(S.offices).some(([k,v])=>v===p.id&&k!==o.id)?' (inny urząd)':''}</option>`).join('');
  h+=`<div class="card off"><h4>${o.n}</h4><p>${o.d}</p><select data-off="${o.id}"><option value="">nikt</option>${opts}</select><p class="mut" style="margin-top:5px">${offEffTxt(o)}</p></div>`});
 LCAT.forEach(([c,cn])=>{h+=`<h3>Prawa: ${cn.toLowerCase()}</h3>`;LAWS.filter(l=>l.c===c).forEach(l=>{const st=lawState(l);const riv=lawRival(l);
  h+=`<div class="card law ${st}"><h4>${l.n}${st==='on'?' <span class="ok" style="font-size:13px">· obowiązuje</span>':''}</h4><p>${l.d}</p><p class="mut">Koszt: ${l.cost} autorytetu${l.up?' · utrzymanie: '+upTxt(l.up):''}${l.g?' · wyklucza: '+LAWS.filter(x=>x.g===l.g&&x!==l).map(x=>x.n.toLowerCase()).join(', '):''}</p>`+
  (st==='on'?`<button data-repeal="${l.id}">Uchyl</button>`:st==='ok'?`<button class="pri" data-law="${l.id}">Uchwal</button>`:st==='swap'?`<button class="pri" data-law="${l.id}">Zamień z „${riv.n}”</button>`:
   `<p class="mut">${{cd:'Niedawno uchylone. Wróci pod obrady za '+Math.ceil(S.lawCD[l.id]-S.day)+' d.',need:l.nt,slots:'Brak miejsca. Uchyl inne prawo albo rozwiń osadę.',auth:'Za mało autorytetu.'}[st]}</p>`)+'</div>'})});
 return h}

/* ---- niezgoda ---- */
function disDaily(){let d=0;if(S.hungerDays>0)d+=.03;if(S.warm<.75)d+=.025*(1-S.warm);if(law('oszczedne'))d+=.01;if(law('dlugi'))d+=.008;if(law('pomoc'))d+=.004;
 if(law('kazdy')&&S.people.some(p=>p.hp<.5&&isWorker(p)))d+=.006;if(S.thirst>0)d+=.02*S.thirst;if(law('opowiesci'))d-=.012;if(law('sad'))d-=.01;if(law('kary'))d+=.006;if(law('lup'))d+=.002;d-=.002*offLv('starszy');if(law('wspolne'))d-=.008;d-=.01*(S.hope-.5);
 S.dis=clamp((S.dis||0)+K*d+(.08-(S.dis||0))*.03*K,0,1);
 if(S.dis>.8&&Math.random()<.25*K){const a=S.people.filter(isAdult);if(a.length>1){const x=a[(Math.random()*a.length)|0],y=a[(Math.random()*a.length)|0];if(x!==y)log(['Kłótnia przy ognisku: '+x.name+' i '+y.name+' oskarżają się o lenistwo.',x.name+' mówi głośno, że rada prowadzi wszystkich na zgubę.','Ktoś podzielił zapasy po swojemu. Nikt się nie przyznaje.'][(Math.random()*3)|0])}}
 if(S.dis>=.97){const fams=Object.values(S.fams).map(f=>famMembers(f.id)).filter(m=>m.length&&m.length<=4&&!m.some(p=>p.id===selId));if(fams.length){const m=fams[(Math.random()*fams.length)|0];const nm=famName(m[0].fam);
   m.forEach(p=>leavePerson(p));log('Rodzina '+nm+' odchodzi w głąb wyspy. Mówią, że sami poradzą sobie lepiej.');toast('Rodzina '+nm+' opuściła osadę');S.dis=.6}}}
function leavePerson(p){S.people=S.people.filter(q=>q!==p);release(p);if(p.pair!==null){const q=pById(p.pair);if(q&&q.fam!==p.fam)q.pair=null}removePersonMesh(p.id);if(selId===p.id)select(null);
 const f=S.fams[p.fam];if(f&&!famMembers(f.id).length){f.home=null;delete S.fams[f.id]}S.left=(S.left||0)+1;assign()}

/* ---- woda ---- */
function waterDaily(){const pop=S.people.length;if(!pop)return;const cap=waterCap();S.thirst=waterNeedOn()?Math.max(0,pop-cap)/pop:0;
 if(S.thirst>0){const n=Math.ceil(S.thirst*pop*.5);for(let k=0;k<n;k++){const p=S.people[(Math.random()*pop)|0];p.hp=Math.max(.15,p.hp-.06*K)}
  if(!S.seen['woda'+Math.floor(S.day/YEAR)]){S.seen['woda'+Math.floor(S.day/YEAR)]=1;log('Upał. Woda w strumieniu jest mętna, kilka osób ma biegunkę. Osada potrzebuje studni.');toast('Brakuje czystej wody')}}}

/* ---- prośby mieszkańców ---- */
const pickAdult=f=>{const a=S.people.filter(p=>isAdult(p)&&p.job!=='wyp'&&!S.reqs.some(r=>r.pid===p.id)&&(!f||f(p)));return a.length?a[(Math.random()*a.length)|0]:null};
const REQS={
 dach:{w:3,make:()=>{const p=pickAdult(p=>!homeOf(p));return p?{pid:p.id}:null},t:(r,p)=>`${p.name} prosi o własny dach nad głową`,d:'Rodzina śpi pod gołym niebem. Postaw szałas albo chatę.',done:(r,p)=>!!(homeOf(p)&&bDone(homeOf(p)))},
 fach:{w:2,make:()=>{const masters=Object.keys(CN).filter(c=>S.people.some(q=>isAdult(q)&&q.sk[c]>=3));const p=pickAdult(p=>p.age<22&&Math.max(...Object.values(p.sk))<2);if(!p||!masters.length)return null;return{pid:p.id,c:masters[(Math.random()*masters.length)|0]}},
  t:(r,p)=>`${p.name} chce się uczyć fachu: ${CN[r.c]}`,d:'Przydziel tę osobę do budynku, w którym pracuje mistrz tego fachu.',done:(r,p)=>p.sk[r.c]>=2},
 slodkie:{w:1,make:()=>S.people.some(isChild)&&(tech('u_bart')||S.res.miod>0)?{pid:(pickAdult(p=>famMembers(p.fam).some(isChild))||{}).id}:null,t:()=>'Dzieci proszą o coś słodkiego',d:'Zgromadź 4 porcje miodu.',done:()=>S.res.miod>=4,take:()=>{S.res.miod-=4}},
 pamiec:{w:3,make:()=>S.died>0&&!hasB('cmentarz')?{pid:(S.people.filter(isAdult).sort((a,b)=>b.age-a.age)[0]||{}).id}:null,t:(r,p)=>`${p.name} prosi o miejsce pamięci dla zmarłych`,d:'Postaw miejsce pamięci (zakładka Budowa).',done:()=>hasB('cmentarz')},
 opowiesci:{w:1,make:()=>S.day>8&&!law('opowiesci')?{pid:(S.people.filter(isAdult).sort((a,b)=>b.age-a.age)[0]||{}).id}:null,t:(r,p)=>`${p.name} chce opowiadać dzieciom o dawnym świecie`,d:'Uchwal prawo „Wieczory przy ognisku” (zakładka Ludzie, rada osady).',done:()=>law('opowiesci')},
 ubrania:{w:2,make:()=>seasonIdx()===1&&S.res.odziez<8?{pid:(pickAdult(p=>famMembers(p.fam).some(isChild))||{}).id}:null,t:()=>'Matki proszą o ciepłe ubrania na zimę',d:'Zgromadź 8 sztuk odzieży (szwalnia szyje ją ze skór).',done:()=>S.res.odziez>=8},
 studnia:{w:3,make:()=>(seasonIdx()===0||seasonIdx()===3)&&!hasB('studnia')?{pid:(pickAdult()||{}).id}:null,t:(r,p)=>`${p.name} mówi, że woda w strumieniu jest mętna`,d:'Postaw studnię, zanim przyjdzie upał.',done:()=>hasB('studnia')},
 gory:{w:1,make:()=>REGIONS.some(r=>r&&r.type==='high'&&!r.known)?{pid:(pickAdult(p=>p.age<40)||{}).id}:null,t:(r,p)=>`${p.name} chce zobaczyć, co jest za górami`,d:'Wyślij zwiad w hale albo skały.',done:()=>REGIONS.some(r=>r&&r.type==='high'&&r.known)},
 ziola:{w:1,make:()=>tech('u_rozp')&&S.res.ziola<8?{pid:(pickAdult(p=>p.age>35)||{}).id}:null,t:(r,p)=>`${p.name} prosi o zapas ziół na zimę`,d:'Zgromadź 8 porcji ziół.',done:()=>S.res.ziola>=8},
 pomost:{w:2,make:()=>!hasB('pomost')&&S.day>4?{pid:(pickAdult(p=>p.sk.rybak>=1)||pickAdult()||{}).id}:null,t:(r,p)=>`${p.name} chce łowić ryby z pomostu`,d:'Postaw pomost rybacki na brzegu.',done:()=>hasB('pomost')},
 cieply:{w:2,make:()=>{const f=Object.values(S.fams).find(f=>{const h=f.home&&bById(f.home);return h&&h.kind==='szalas'&&bDone(h)});if(!f||seasonIdx()===2)return null;const p=famMembers(f.id).find(isAdult);return p&&!S.reqs.some(r=>r.pid===p.id)?{pid:p.id}:null},
  t:(r,p)=>`${p.name} prosi o cieplejszy dom przed zimą`,d:'Rozbuduj ich szałas w chatę z bali (zaznacz dom i wybierz „Rozbuduj”).',done:(r,p)=>{const h=homeOf(p);return !!(h&&h.kind!=='szalas'&&bDone(h))}}};
function reqTick(){S.reqs=S.reqs||[];
 for(const r of [...S.reqs]){const p=pById(r.pid);const R=REQS[r.k];if(!p||!R){S.reqs=S.reqs.filter(x=>x!==r);continue}
  if(R.done(r,p)){if(R.take)R.take(r);S.reqs=S.reqs.filter(x=>x!==r);S.hope=clamp(S.hope+.04,0,1);S.dis=clamp((S.dis||0)-.07,0,1);if(r.k==='fach')p.xp[r.c]+=40;S.reqDone=(S.reqDone||0)+1;log('Prośba spełniona. '+R.t(r,p)+'. '+p.name+' dziękuje.');toast('Prośba spełniona');continue}
  if(S.day>r.until){S.reqs=S.reqs.filter(x=>x!==r);S.dis=clamp((S.dis||0)+.04,0,1);log('Prośba bez odpowiedzi. '+R.t(r,p)+'.')}}
 if(S.reqs.length<3&&S.day>=(S.reqNext||3)){const keys=Object.keys(REQS).filter(k=>!S.reqs.some(r=>r.k===k));const pool=[];keys.forEach(k=>{for(let q=0;q<REQS[k].w;q++)pool.push(k)});
  for(let t=0;t<8&&pool.length;t++){const k=pool[(Math.random()*pool.length)|0];const x=REQS[k].make();if(x&&x.pid!==undefined&&pById(x.pid)){const r=Object.assign({k,made:Math.floor(S.day),until:Math.floor(S.day)+12},x);S.reqs.push(r);const p=pById(r.pid);log('Prośba: '+REQS[k].t(r,p)+'. '+REQS[k].d);toast('Nowa prośba: '+p.name);break}}
  S.reqNext=S.day+3+Math.random()*4}}
function reqHTML(){S.reqs=S.reqs||[];let h='<h3>Prośby mieszkańców</h3>';
 if(!S.reqs.length)return h+'<p class="lead">Nikt teraz o nic nie prosi.</p>';
 S.reqs.forEach(r=>{const p=pById(r.pid);if(!p)return;const R=REQS[r.k];h+=`<div class="card req"><h4>${R.t(r,p)}</h4><p>${R.d}</p><p class="mut">Zostało ${Math.max(0,Math.ceil(r.until-S.day))} dni · spełnienie: nadzieja w górę, niezgoda w dół</p></div>`});return h}

/* ---- dymki potrzeb nad głowami ---- */
const bubTex={};
function bubbleTex(key,col){const id=key+col;if(bubTex[id])return bubTex[id];const c=document.createElement('canvas');c.width=c.height=96;const x=c.getContext('2d');
 x.fillStyle='rgba(244,236,216,.96)';x.strokeStyle=col;x.lineWidth=6;x.beginPath();x.arc(48,44,34,0,6.283);x.fill();x.stroke();x.beginPath();x.moveTo(40,76);x.lineTo(48,92);x.lineTo(56,76);x.fill();
 x.save();x.translate(48-24*1.15,44-24*1.15);x.scale(1.15,1.15);x.strokeStyle=col;x.lineWidth=2.8;x.lineCap='round';x.lineJoin='round';
 if(key==='!'){x.restore();x.fillStyle='#8a5a1a';x.font='bold 50px Georgia,serif';x.textAlign='center';x.textBaseline='middle';x.fillText('!',48,46)}
 else{const svg=IC[key]||'';(svg.match(/d="([^"]+)"/g)||[]).forEach(m=>{x.stroke(new Path2D(m.slice(3,-1)))});(svg.match(/<circle[^>]*>/g)||[]).forEach(m=>{const g=a=>+(m.match(new RegExp(a+'="([\\d.]+)"'))||[0,0])[1];x.beginPath();x.arc(g('cx'),g('cy'),g('r'),0,6.283);x.stroke()});x.restore()}
 const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;bubTex[id]=new THREE.SpriteMaterial({map:t,depthTest:false,transparent:true});return bubTex[id]}
function needOf(p){if(p.state==='away')return null;if(p.fireB)return['fire','#d0501c'];if(p.hp<.45)return['zdrowie','#b8342a'];if(S.fedR<.95&&S.hungerDays>0&&p.id%3===1)return['zywnosc','#a8641a'];
 if(p.warm!==undefined&&p.warm<.6)return['cieplo','#2a6aa8'];if(S.thirst>0&&p.id%3===0)return['woda','#2a74a8'];if(S.reqs&&S.reqs.some(r=>r.pid===p.id))return['!','#c9a66b'];if((S.dis||0)>.72&&p.id%4===0&&isAdult(p))return['niezgoda','#a8342a'];return null}
let bubT=0;
function bubbleTick(rdt){bubT+=rdt;for(const p of S.people){const m=pMesh[p.id];if(!m)continue;let s=m.userData.bub;const n=needOf(p);
  if(!n){if(s)s.visible=false;continue}if(!s){s=new THREE.Sprite(bubbleTex(n[0],n[1]));s.renderOrder=20;m.add(s);m.userData.bub=s}
  s.material=bubbleTex(n[0],n[1]);s.visible=m.visible;const k=1/m.scale.x;s.scale.set(.6*k*1.55,.6*k*1.55,1);s.position.y=(2.15+Math.sin(bubT*3+p.id)*.06)*k}}
