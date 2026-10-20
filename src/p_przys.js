
/* ================= 4.6 Budowa w przysiółkach: od szałasu do domu rodu ================= */
// Przysiółek nie rośnie sam. Każdy budynek to decyzja gracza (lista w karcie przysiółka albo zgoda na prośbę rodu).
// Budują ludzie przysiółka: najpierw zbierają w krainie to, co tam jest (drewno, kamień, glina), resztę przynoszą
// tragarze z Przystani. Przy dużej budowie przysiółek może poprosić o budowniczych z Przystani; idą tylko za zgodą.
// Budynki stoją w stałych miejscach działki i przebudowują się w miejscu: szałas → chata → dom z piecem → dom rodu.
// Etap przysiółka wynika z tego, co stoi. Ludzi przybywa tylko wtedy, gdy jest dla nich dach.
// Wszystko liczy się raz na dobę gry; model przebudowuje się tylko po zmianie (bateria).
const HCH={drewno:30,kamien:10,glina:8,gwozdzie:16},HDOM={drewno:20,cegla:20,deski:16,gwozdzie:24,kamien:10};
const HB={
 szalas:{n:'Szałas',slot:'glowa',lv:0,cap:5,cost:{drewno:8,plotno:2},W:.8,d:'Pierwszy dach założycieli.'},
 chata:{n:'Chata z bali',slot:'glowa',lv:1,from:'szalas',cap:6,cost:HCH,W:3,d:'Przebudowa szałasu w ciepłą chatę dla rodziny (6 osób).'},
 dom:{n:'Dom z piecem',slot:'glowa',lv:2,from:'chata',cap:8,cost:HDOM,W:4,st:2,ep:2,d:'Przebudowa chaty na czele podwórza: piec, gont, 8 osób. Cegła i gwoździe tylko z Przystani.'},
 domrodu:{n:'Dom rodu',slot:'glowa',lv:3,from:'dom',cap:14,cost:{drewno:30,deski:10,kamien:8},W:6,st:3,ep:3,d:'Siedziba rodu na 14 osób. W epoce IV od niego zaczyna się folwark.'},
 ognisko:{n:'Ognisko z okapem',slot:'srodek',lv:0},
 studnia:{n:'Studnia',slot:'srodek',lv:1,from:'ognisko',cost:{kamien:12,drewno:4},W:1.5,st:1,d:'Czysta woda na środku podwórza: latem mniej chorób.'},
 stanowisko:{n:'Stanowisko krainy',slot:'praca',lv:0,cost:{drewno:8},W:1.5,d:'Pierwsza praca z krainy: więcej darów dla Przystani.'},
 warsztat:{n:'Warsztat krainy',slot:'praca',lv:1,from:'stanowisko',cost:{drewno:16,kamien:8,deski:6},W:2.5,st:2,d:'Przysiółek robi wyroby ze swojej krainy.'},
 ogrod:{n:'Ogród',slot:'tyl',lv:0,cost:{drewno:3},W:.5,d:'Warzywa za domem: lepsze zapasy.'},
 zielnik:{n:'Ogród z zielnikiem',slot:'tyl',lv:1,from:'ogrod',cost:{drewno:3,kamien:2},W:.8,st:1,d:'Zioła na gorączki i rany.'},
 chata2:{n:'Druga chata',slot:'lewa',lv:0,cap:6,cost:HCH,W:3,st:1,d:'Dach dla kolejnej rodziny (6 osób).'},
 dom2:{n:'Druga chata → dom z piecem',slot:'lewa',lv:1,from:'chata2',cap:8,cost:HDOM,W:4,st:3,ep:2,d:'Więcej miejsca i mniej opału (8 osób).'},
 chata3:{n:'Trzecia chata',slot:'prawa',lv:0,cap:6,cost:HCH,W:3,st:2,d:'Dach dla kolejnej rodziny (6 osób).'},
 dom3:{n:'Trzecia chata → dom z piecem',slot:'prawa',lv:1,from:'chata3',cap:8,cost:HDOM,W:4,st:3,ep:2,d:'Więcej miejsca i mniej opału (8 osób).'},
 ziemianka:{n:'Ziemianka',slot:'zapas',lv:0,cost:{drewno:8,kamien:6},W:1.2,st:1,d:'Chłodny dół na zapasy: przetrwają zimę.'},
 spichlerz:{n:'Spichlerz',slot:'zapas',lv:1,from:'ziemianka',cost:{drewno:18,deski:8,kamien:4},W:2,st:3,d:'Zboże i zapasy na cały rok.'},
 pole:{n:'Pole',slot:'pole1',lv:0,cost:{drewno:4,ziarno:10},W:1.5,st:1,d:'Własne zboże przysiółka.'},
 pole2:{n:'Drugie pole',slot:'pole2',lv:0,cost:{drewno:4,ziarno:10},W:1.5,st:3,d:'Więcej zboża dla większej wsi.'},
 plot:{n:'Płot',slot:'plot',lv:0,cost:{drewno:30},W:2,st:2,d:'Płot wokół podwórza: zwierzęta nie uciekają, dziki nie ryją ogrodu.'},
 stodola:{n:'Stodoła',slot:'brama',lv:0,cost:{drewno:24,deski:8},W:2.5,st:2,d:'Siano i snopy pod dachem, przy drodze do Przystani.'}};
// to, co zależy od krainy: pierwsza praca, warsztat i jego wyrób
const HB_T={coast:{st:['Suszarnia ryb',{drewno:8}],ws:['Wędzarnia ryb','warzelnia'],gift:['ryby',3]},
 forest:{st:['Chata drwala',{drewno:8}],ws:['Pracownia cieśli','pracownia'],gift:['deski',2]},
 high:{st:['Łom kamienia',{drewno:10}],ws:['Warsztat kamieniarza','warsztat'],gift:['kamien',3]},
 meadow:{st:['Zagroda kóz',{drewno:24}],ws:['Serownia','serownia'],gift:['ser',1]}};
// co musi stać na każdym etapie (miejsce, najmniejszy poziom); lista w liście to „albo”
const HREQ=[[],
 [['glowa',1],['praca',0],['tyl',0]],
 [['lewa',0],['zapas',0],['srodek',1],[['pole1',0],['tyl',1]]],
 [['glowa',2],['prawa',0],['plot',0],['brama',0],['praca',1]],
 [['glowa',3],['zapas',1],['pole2',0]]];
const HDOMS=['glowa','lewa','prawa'];
function hbT(h){return HB_T[hType(h)]||HB_T.forest}
function hbName(h,k){if(k==='stanowisko')return hbT(h).st[0];if(k==='warsztat')return hbT(h).ws[0];return HB[k].n}
function hbCost(h,k){return k==='stanowisko'?hbT(h).st[1]:HB[k].cost||{}}
function hamInit(h){if(!h.bud)hamGrant(h,h.st||0);h.mag=h.mag||{};h.proj=h.proj||[];h.dost=h.dost||[];h.st=hamStage(h)}
// dawne przysiółki (i te od razu duże) dostają to, co widać było na ich modelu: etap się nie cofa
function hamGrant(h,st){const b={glowa:'szalas',srodek:'ognisko'};
 if(st>=1)Object.assign(b,{glowa:'chata',praca:'stanowisko',tyl:'ogrod'});
 if(st>=2)Object.assign(b,{lewa:'chata2',zapas:'ziemianka',srodek:'studnia',pole1:'pole'});
 if(st>=3)Object.assign(b,{glowa:'dom',prawa:'chata3',plot:'plot',brama:'stodola',praca:'warsztat'});
 if(st>=4)Object.assign(b,{glowa:'domrodu',zapas:'spichlerz',pole2:'pole2'});h.bud=b}
function hamHas(h,slot,lv){const k=h.bud&&h.bud[slot];return!!k&&HB[k].lv>=lv}
function hamReqOK(h,q){return Array.isArray(q[0])?q.some(x=>hamHas(h,x[0],x[1])):hamHas(h,q[0],q[1])}
function hamStage(h){let s=0;for(let k=1;k<HREQ.length;k++){if(HREQ[k].every(q=>hamReqOK(h,q)))s=k;else break}return s}
function hamCap(h){return HDOMS.reduce((a,s)=>a+(h.bud&&h.bud[s]?HB[h.bud[s]].cap||0:0),0)}
function hamRoom(h){if(!h.bud)return 99;return hamCap(h)-h.pop}
// rodzaj budowli, który stoi w danym miejscu na danym poziomie (do listy „czego brakuje”)
function hbAt(slot,lv){return Object.keys(HB).find(k=>HB[k].slot===slot&&HB[k].lv===lv)}
function hamMissing(h){const nx=HREQ[hamStage(h)+1];if(!nx)return[];return nx.filter(q=>!hamReqOK(h,q)).map(q=>Array.isArray(q[0])?q.map(x=>hbName(h,hbAt(x[0],x[1])).toLowerCase()).join(' albo '):hbName(h,hbAt(q[0],q[1])).toLowerCase())}
function hamEpochOK(lv){if(lv===2)return(S.epoch||1)>=2;if(lv===3)return!!(S.e3&&(S.e3.on||S.e3.done))||S.epoch===4;return true}
// dlaczego nie można zacząć tej budowy ('' gdy można)
function hamCan(h,k){const d=HB[k];if(!d||!d.cost&&k!=='stanowisko')return'Tego się nie buduje.';if(h.arr&&S.day<h.arr)return'Są jeszcze w drodze.';
 if((h.proj||[]).some(p=>HB[p.k].slot===d.slot))return'W tym miejscu już trwa budowa.';const cur=h.bud[d.slot];
 if(d.from?cur!==d.from:!!cur)return cur?'Już stoi.':'Najpierw '+hbName(h,d.from).toLowerCase()+'.';
 if((d.st||0)>h.st)return'Najpierw etap '+HST[d.st][0]+'.';if(d.ep&&!hamEpochOK(d.ep))return d.ep===2?'Od epoki II.':'Od epoki III.';
 if((h.proj||[]).length>=2)return'Najwyżej dwie budowy naraz.';return''}
function hamAvail(h){return Object.keys(HB).filter(k=>{const d=HB[k];if(!d.cost&&k!=='stanowisko')return false;const cur=h.bud[d.slot];return d.from?cur===d.from:!cur})}
function hamNeed(h,p){const c=hbCost(h,p.k),o={};for(const r in c){const m=c[r]-(p.got[r]||0);if(m>0)o[r]=m}return o}
function hamRate(h,r){const t=hType(h),R=REGIONS[h.rid],kr=R&&R.kr;
 // porcje na jednego zbierającego dziennie
 if(r==='drewno')return kr==='gran'?6:t==='forest'?20:t==='meadow'?14:10;if(r==='kamien')return t==='high'?14:6;
 if(r==='glina')return['gliniska','niziny','mokradla'].includes(kr)?10:4;if(r==='ziarno')return(t==='meadow'?6:0)+(h.bud.pole1?4:0);
 if(r==='deski')return t==='forest'&&h.bud.praca==='warsztat'?6:0;return 0}
const hamFmt=o=>Object.entries(o).map(([r,q])=>`${(RN[r]||r).toLowerCase()} ${Math.ceil(q)}`).join(', ');
function hamStart(h,k,why){hamInit(h);const r=hamCan(h,k);if(r){toast(r);return false}
 const p={k,got:{},w:0,d0:S.day};h.proj.push(p);hamAlloc(h);
 log(`${why==='prosba'?'Wiec zgadza się na prośbę rodu. ':''}W przysiółku ${h.name} zaczyna się budowa: ${hbName(h,k).toLowerCase()}.${Object.keys(hamNeed(h,p)).length?' Potrzeba: '+hamFmt(hamNeed(h,p))+'.':''}`);
 if(HB[k].W>=2.5&&hamWorkers(h)<=3&&!h.ask)h.ask={k,n:2,until:S.day+SD*1.5};
 hamVis();return true}
// to, co leży w składzie przysiółka, idzie na budowy po kolei
function hamAlloc(h){for(const p of h.proj){const n=hamNeed(h,p);for(const r in n){const q=Math.min(n[r],h.mag[r]||0);if(q>0){p.got[r]=(p.got[r]||0)+q;h.mag[r]-=q}}}}
function hamWorkers(h){return Math.max(1,Math.round(h.pop*.62))}
function hamHelp(h){const e=(S.exps||[]).find(x=>x.type==='bud'&&x.h===h.id);if(!e)return 0;const out=S.people.filter(p=>p.exp===e.id);return out.length&&out.every(p=>p.state==='away')?out.length*1.5:0}
function hamDaily(h){hamInit(h);if(h.arr&&S.day<h.arr)return;
 // dostawy z Przystani
 if(h.dost.length){const now=h.dost.filter(d=>d.arr<=S.day);if(now.length){h.dost=h.dost.filter(d=>d.arr>S.day);now.forEach(d=>{for(const r in d.mat)h.mag[r]=(h.mag[r]||0)+d.mat[r]});log(`Do przysiółka ${h.name} doszli tragarze: ${hamFmt(now.reduce((a,d)=>{for(const r in d.mat)a[r]=(a[r]||0)+d.mat[r];return a},{}))}.`)}}
 hamAlloc(h);
 if(h.proj.length){const w=hamWorkers(h),food=Math.ceil(w*.4),bld=Math.max(1,w-food),help=hamHelp(h),share=bld/h.proj.length;
  for(const p of h.proj.slice()){const need=hamNeed(h,p),loc=Object.keys(need).filter(r=>hamRate(h,r)>0);
   if(loc.length){for(const r of loc){const q=Math.min(need[r],hamRate(h,r)*share/loc.length*(1+(help?.5:0)));p.got[r]=(p.got[r]||0)+q}p.st='zbierają: '+loc.map(r=>(RN[r]||r).toLowerCase()).join(', ');continue}
   if(Object.keys(need).length){p.st='czekają na: '+hamFmt(need);continue}
   p.w+=share+help/h.proj.length;p.st=help?'budują razem z ludźmi z Przystani':'budują';
   if(p.w>=HB[p.k].W)hamDone(h,p)}}
 if(h.ask&&S.day>h.ask.until){h.ask=null;log(`Przysiółek ${h.name} radzi sobie sam: budowa potrwa dłużej.`)}
 if(h.prop&&S.day>h.prop.until){h.prop=null;h.propD=S.day}
 if(!h.prop&&!h.proj.length&&h.wiez>=.15&&S.day-(h.propD||h.day||0)>=SD*1.4)hamPropose(h)}
function hamDone(h,p){const d=HB[p.k],old=h.st;h.proj=h.proj.filter(x=>x!==p);h.bud[d.slot]=p.k;h.st=hamStage(h);
 log(`W przysiółku ${h.name} ${d.from?'skończono przebudowę: stoi '+hbName(h,p.k).toLowerCase():'stanęła nowa budowla: '+hbName(h,p.k).toLowerCase()}.`);toast(h.name+': '+hbName(h,p.k));
 if(h.st>old){pamAdd(1,'przysiolek');const T=HAM_T[hType(h)];
  log(['',`W przysiółku ${h.name} stoi już chata z bali. To nie obozowisko, tylko zagroda.`,`W przysiółku ${h.name} są dwie chaty, studnia i zapasy. Ludzie mówią o nim jak o prawdziwym miejscu.`,`Wokół przysiółka ${h.name} stanął płot, a na czele podwórza dom z piecem. To już osiedle.`,`${h.name} to już wieś z domem rodu. ${T.n==='rybacki'?'Od morza':'Z daleka'} widać dym z jego komina.`][h.st]);toast(h.name+': '+HST[h.st][0])}
 if(h.ask&&h.ask.k===p.k)h.ask=null;hamVis();try{renderPanel()}catch(e){}}
// prośba rodu: najpierw dach, gdy jest ciasno, potem to, czego brakuje do następnego etapu
function hamPropose(h){let k=null;const can=x=>!hamCan(h,x);
 if(hamRoom(h)<=1)k=['chata','chata2','chata3','dom','dom2','dom3','domrodu'].find(can);
 if(!k){const nx=HREQ[h.st+1];if(nx)for(const q of nx){if(hamReqOK(h,q))continue;const opts=Array.isArray(q[0])?q:[q];for(const x of opts){const kk=hbAt(x[0],x[1]);if(kk&&can(kk)){k=kk;break}}if(k)break}}
 if(!k)return;h.prop={k,until:S.day+SD*2};log(`${h.head} z przysiółka ${h.name} prosi wiec o zgodę na budowę: ${hbName(h,k).toLowerCase()}${hamRoom(h)<=1?'. Jest ciasno, ludzie śpią po kilka rodzin pod jednym dachem':''}.`);toast(h.name+' prosi o zgodę na budowę')}
// tragarze z Przystani niosą to, czego brakuje (4 porcje na osobę), wóz po drodze idzie szybciej
function hamSend(h,p){const need=hamNeed(h,p),inWay={};h.dost.forEach(d=>{for(const r in d.mat)inWay[r]=(inWay[r]||0)+d.mat[r]});const mat={};
 for(const r in need){const q=Math.min(Math.ceil(need[r]-(h.mag[r]||0)-(inWay[r]||0)),Math.floor(S.res[r]||0));if(q>0)mat[r]=q}
 if(!Object.keys(mat).length){toast('W Przystani nie ma tego, czego brakuje.');return false}
 for(const r in mat)S.res[r]-=mat[r];const P=hamPath[h.id],t=(P?P.len:120)/.95/DAY*(h.road===2?.7:1);h.dost.push({mat,arr:S.day+t});
 const tot=Object.values(mat).reduce((a,b)=>a+b,0),n=Math.min(6,Math.ceil(tot/4));for(let k=0;k<n;k++)spawnWalker(h,1,null,1,k*1.6);
 log(`Z Przystani do przysiółka ${h.name} idą tragarze: ${hamFmt(mat)}. Dojdą za około ${Math.max(1,Math.round(t))} ${dniW(Math.max(1,Math.round(t)))}.`);toast('Tragarze wyruszyli');save();return true}
// budowniczowie z Przystani: idą tylko wtedy, gdy wiec się zgodzi; na ten czas ubywa ich w Przystani
function hamHelpWhy(h){const a=h.ask;if(!a)return'Nikt nie prosi o pomoc.';const r=REGIONS[h.rid];if(!r)return'Nie ma drogi.';if(S.exps.some(e=>e.type==='bud'&&e.h===h.id))return'Budowniczowie już tam są.';
 const c=hamHelpers(a.n);if(c.length<a.n)return'Za mało wolnych, zdrowych ludzi w Przystani.';if(foodTotal()<a.n*hamHelpDays(h)+20)return'Za mało jedzenia na drogę.';if(!expRouteReady(c,exitTile(r)))return'Brak drogi do wyjścia z osady.';return''}
function hamHelpers(n){return expCandidates(40).sort((a,b)=>(b.sk.ciesla||0)-(a.sk.ciesla||0)).slice(0,n)}
function hamHelpDays(h){const P=hamPath[h.id],t=Math.max(1,Math.round((P?P.len:120)/.95/DAY));const left=(h.proj||[]).reduce((a,p)=>a+Math.max(0,HB[p.k].W-p.w),0);return Math.min(12,2*t+Math.ceil(left/2)+2)}
function hamSendHelp(h){const why=hamHelpWhy(h);if(why){toast(why);return false}const r=REGIONS[h.rid],n=h.ask.n,ppl=hamHelpers(n),days=hamHelpDays(h),food=n*days;
 const departure=expCharge(ppl,food);if(!departure)return false;
 const e={id:(S.expN=(S.expN||0)+1),r:r.id,type:'bud',h:h.id,ppl:ppl.map(p=>p.id),days,left:days,exit:exitTile(r),departure,started:false,risk:0};S.exps.push(e);
 ppl.forEach(p=>{release(p);p.path=null;p.state='idle';p.wait=0;p.job='wyp';p.wb=null;p.exp=e.id;p.act='idzie budować do: '+h.name});
 log(`${ppl.map(p=>p.name).join(' i ')} ${n>1?'idą':'idzie'} do przysiółka ${h.name} pomagać przy budowie. Biorą ${food} porcji jedzenia. Wrócą za około ${days} dni.`);
 h.ask=null;h.wiez=Math.min(1,h.wiez+.08);toast('Budowniczowie wyruszyli');assign();save();return true}
{const _fe=finishExp;finishExp=function(e,people){if(e.type!=='bud')return _fe(e,people);
  S.exps=S.exps.filter(x=>x!==e);const h=(S.hamlets||[]).find(x=>x.id===e.h);people.forEach(p=>{gainXp(p,'ciesla',30);expReturn(p,e)});
  log(`${people.map(p=>p.name).join(' i ')} ${people.length>1?'wracają':'wraca'} z przysiółka ${h?h.name:'w głębi wyspy'}. Opowiadają, co tam stanęło.`);assign();try{renderPanel()}catch(er){}}}
// pożar, osuwisko: ginie ostatnio postawiony dach (boczna chata albo poziom domu na czele)
function hamLoseHut(h){hamInit(h);const b=h.bud;if(b.prawa)delete b.prawa;else if(b.lewa)delete b.lewa;else if(HB[b.glowa].from)b.glowa=HB[b.glowa].from;h.st=hamStage(h);hamVis()}
// dary: warsztat krainy dokłada swój wyrób
{const _hg=hamGifts;hamGifts=function(h){const g=_hg(h);return h.bud&&h.bud.praca==='warsztat'?g.concat([hbT(h).gift]):g}}
// nowy przysiółek zaczyna od szałasu z ogniskiem (przysiółki tworzone inaczej, np. szybki start epoki III, dostają budynki według etapu w hamInit)
function hamNew(h){if(!h||h.bud)return;hamGrant(h,0);h.st=0;h.mag={};h.proj=[];h.dost=[]}
{const _f=foundHamlet;foundHamlet=function(m,why,rid,o){const h=_f(m,why,rid,o);if(h){hamNew(h);hamVis()}return h}}

/* ---- karta przysiółka: budowa ---- */
function hamBudHTML(x){hamInit(x);const cap=hamCap(x),miss=hamMissing(x),nx=HST[x.st+1];let h=`<div class="hbud">${hamLadder(x.st)}<p><b>${HST[x.st][0][0].toUpperCase()+HST[x.st][0].slice(1)}</b> · dachy: ${x.pop} z ${cap} miejsc${x.pop>=cap?' · <span class="warn">ciasno, nikt nowy nie zamieszka</span>':''}</p>`;
 if(nx&&miss.length)h+=`<p class="mut">Do etapu ${nx[0]} brakuje: ${miss.join(', ')}.</p>`;
 if(x.prop)h+=`<div class="hask"><p><b>Ród prosi o zgodę:</b> ${hbName(x,x.prop.k)}. <span class="mut">${hamFmt(hbCost(x,x.prop.k))}</span></p><div class="hrow"><button class="pri" data-hprop="${x.id}:1" ${hamCan(x,x.prop.k)?'disabled':''}>Zgoda</button><button data-hprop="${x.id}:0">Nie teraz</button></div></div>`;
 if(x.ask){const why=hamHelpWhy(x);h+=`<div class="hask"><p><b>Prośba o pomoc:</b> ${x.ask.n} budowniczych z Przystani przy budowie: ${hbName(x,x.ask.k).toLowerCase()}. Pójdą na około ${hamHelpDays(x)} dni i wezmą jedzenie na drogę.</p>${why?`<p class="mut">${why}</p>`:''}<div class="hrow"><button class="pri" data-hhelp="${x.id}:1" ${why?'disabled':''}>Poślij budowniczych</button><button data-hhelp="${x.id}:0">Niech radzą sobie sami</button></div></div>`}
 x.proj.forEach((p,q)=>{const d=HB[p.k],need=hamNeed(x,p),pc=Math.round(100*Math.min(1,p.w/d.W)),c=hbCost(x,p.k),canSend=Object.keys(need).some(r=>(S.res[r]||0)>=1);
  h+=`<div class="hproj"><p><b>Buduje się: ${hbName(x,p.k)}</b> · ${Object.keys(need).length?'materiał '+Object.keys(c).map(r=>`${(RN[r]||r).toLowerCase()} ${Math.floor(p.got[r]||0)}/${c[r]}`).join(', '):'praca '+pc+'%'}</p><p class="mut">${p.st||'zaczynają'}</p>${Object.keys(need).length?`<button data-hsend="${x.id}:${q}" ${canSend?'':'disabled'}>Poślij z Przystani: ${hamFmt(need)}</button>`:''}</div>`});
 if(x.dost.length)h+=`<p class="mut">Tragarze w drodze: ${hamFmt(x.dost.reduce((a,d)=>{for(const r in d.mat)a[r]=(a[r]||0)+d.mat[r];return a},{}))}.</p>`;
 const av=hamAvail(x);if(av.length){h+=`<details class="hlist"><summary>Co można zbudować (${av.filter(k=>!hamCan(x,k)).length})</summary>`;
  av.sort((a,b)=>(!!hamCan(x,a))-(!!hamCan(x,b))).forEach(k=>{const why=hamCan(x,k);h+=`<div class="hopt"><div><b>${hbName(x,k)}</b><small>${HB[k].d||''} · ${hamFmt(hbCost(x,k))}</small>${why?`<small class="mut">${why}</small>`:''}</div><button data-hbud="${x.id}:${k}" ${why?'disabled':''}>Buduj</button></div>`});h+='</details>'}
 return h+'</div>'}
{const st=document.createElement('style');st.textContent=`.hbud{margin-top:6px;border-top:1px solid #33402f;padding-top:6px}.hbud .warn{color:#e2b45a}.hask,.hproj{margin:6px 0;padding:6px 8px;border-radius:8px;background:#ffffff08;border:1px solid #3d4a40}.hask{border-color:#d9a44166}
 .hrow{display:flex;gap:6px;flex-wrap:wrap;margin-top:4px}.hlist summary{cursor:pointer;padding:6px 0;color:var(--hi)}.hopt{display:flex;gap:8px;align-items:center;justify-content:space-between;padding:6px 0;border-top:1px solid #2a2f2c}.hopt small{display:block;font-size:12px;color:var(--mut)}.hopt button{flex:none}`;document.head.appendChild(st)}
document.addEventListener('click',e=>{if(!S)return;const t=e.target.closest('[data-hbud],[data-hsend],[data-hhelp],[data-hprop]');if(!t||t.disabled)return;
 const[a,b]=(t.dataset.hbud||t.dataset.hsend||t.dataset.hhelp||t.dataset.hprop).split(':');const h=(S.hamlets||[]).find(x=>x.id===+a);if(!h)return;hamInit(h);
 if(t.dataset.hbud){if(hamStart(h,b))save()}
 else if(t.dataset.hsend){const p=h.proj[+b];if(p)hamSend(h,p)}
 else if(t.dataset.hhelp){if(b==='1')hamSendHelp(h);else{h.ask=null;log(`Wiec odpowiada przysiółkowi ${h.name}, że budowniczowie są potrzebni w Przystani. Zbudują sami, wolniej.`)}}
 else if(t.dataset.hprop){const k=h.prop&&h.prop.k;if(b==='1'&&k){h.prop=null;h.propD=S.day;hamStart(h,k,'prosba')}else{h.prop=null;h.propD=S.day;h.wiez=Math.max(0,h.wiez-.03);log(`Wiec prosi przysiółek ${h.name}, żeby z budową jeszcze poczekał.`)}}
 renderPanel()});

/* ---- model: stałe miejsca na działce ---- */
// lokalnie: +z to brama i droga do Przystani, -z to czoło podwórza z domem; jednostka = pole
const HSLOT={glowa:[0,-5.2,0],srodek:[0,0,0],praca:[-6,2.6,.6],lewa:[-5.6,-2.2,.9],prawa:[5.6,-2.2,-.9],zapas:[6,2.6,-.6],tyl:[0,-8.8,0],pole1:[-12.5,0,0],pole2:[12.5,0,0],brama:[-3.2,7.2,3.14]};
function hamModel(h,k){const t=hType(h);
 if(k==='szalas')return makeBuildingModel('szalas',null);if(k==='chata'||k==='chata2'||k==='chata3')return makeBuildingModel('chata',null);
 if(k==='dom'||k==='dom2'||k==='dom3')return makeBuildingModel('dom',null);if(k==='domrodu')return makeBuildingModel('dwor',null);
 if(k==='studnia')return makeBuildingModel('studnia',null);if(k==='stanowisko')return t==='coast'?fishCamp():makeBuildingModel(t==='forest'?'drwal':t==='high'?'kamien':'zagroda',null);
 if(k==='warsztat')return makeBuildingModel(hbT(h).ws[1],null);if(k==='ziemianka')return makeBuildingModel('piwnica',null);if(k==='spichlerz')return makeBuildingModel('spichlerz',null);
 if(k==='ogrod'){const m=makeBuildingModel('ogrodziol',null);m.scale.setScalar(.75);return m}if(k==='zielnik')return makeBuildingModel('ogrodziol',null);
 if(k==='pole'||k==='pole2')return makeBuildingModel('pole',null);if(k==='stodola')return makeBuildingModel('stodola',null);return null}
// rusztowanie i stos bali tam, gdzie trwa budowa
function hamScaffold(){const g=new THREE.Group();for(const[x,z]of[[-.9,-.6],[.9,-.6],[-.9,.6],[.9,.6]])g.add(tbox(.09,1.7,.09,matDark,x,.85,z));
 g.add(tbox(1.9,.08,.08,mPlank,0,1.55,-.6));g.add(tbox(1.9,.08,.08,mPlank,0,1.55,.6));for(let q=0;q<4;q++)g.add(tbox(1.2,.16,.16,mPlankD,1.7,.1+(q>1?.16:0),-.3+(q%2)*.22+(q>1?.11:0)));return g}
function hamKey(h){return h.st+'|'+JSON.stringify(h.bud||{})+'|'+(h.proj||[]).map(p=>p.k).join(',')+'|'+(h.pal?1:0)+'|'+(hamPath[h.id]?1:0)}
// obrót działki: brama w stronę ścieżki do Przystani; zapamiętany raz, żeby w epoce IV folwark stał tak samo
function hamAngle(h,x0,z0){if(h.ang===undefined){const P=hamPath[h.id];if(!P||P.tiles.length<4)return h.id*2.1;const k=P.tiles[P.tiles.length-4];h.ang=Math.atan2(tcx((k/N)|0)-z0,tcx(k%N)-x0)}return h.ang}
function hamAt(x0,z0,gap,lx,lz){const a0=Math.atan2(-Math.cos(gap),Math.sin(gap)),c=Math.cos(a0),s=Math.sin(a0);for(const f of[1,.8,.62]){const wx=x0+(lx*c-lz*s)*f,wz=z0+(lx*s+lz*c)*f,t=tileOf(wx,wz);if(t[0]>=0&&t[1]>=0&&t[0]<N&&t[1]<N&&land[t[1]*N+t[0]])return[wx,wz,a0]}return null}
function hamBuildModel(h,g,x0,z0){hamInit(h);const gap=hamAngle(h,x0,z0),a0=Math.atan2(-Math.cos(gap),Math.sin(gap));
 const at=(lx,lz)=>hamAt(x0,z0,gap,lx,lz);
 const clear=(wx,wz,r)=>nodeBy.tree.forEach(n=>{if(n.amt>0&&Math.hypot(n.x-wx,n.z-wz)<r){n.amt=0;const q=nodes.indexOf(n);if(q>=0)S.nodeAmt[q]=0;nodeVis(n)}});
 const put=(m,slot,dx)=>{const L=HSLOT[slot],p=at(L[0]+(dx||0),L[1]);if(!p||!m)return null;m.position.set(p[0],Hy(p[0],p[1]),p[1]);m.rotation.y=L[2]-a0;g.add(m);clear(p[0],p[1],slot.startsWith('pole')?3.4:2.4);return p};
 clear(x0,z0,2.5+h.st*1.6);   // podwórze bez drzew, rośnie z etapem
 for(const slot in h.bud){const k=h.bud[slot];if(slot==='plot')continue;
  if(k==='ognisko'){const p=at(0,0);if(p)makeFire(g,p[0],Hy(p[0],p[1]),p[1],true);continue}
  const p=put(hamModel(h,k),slot);if(p&&HDOMS.includes(slot))g.userData.chims.push(p)}
 (h.proj||[]).forEach(pr=>{const slot=HB[pr.k].slot;put(hamScaffold(),slot,h.bud[slot]?2.1:0)});
 if(h.pal)ringFence(g,x0,z0,9.6,true,gap);else if(h.bud.plot)ringFence(g,x0,z0,8.8,false,gap)}

/* ---- epoka IV: ten sam układ działki dla folwarku (etapy 5–7) ---- */
const E4SLOT={glowa:[0,-5.2,0],skrzydlo:[-3.9,-5.6,0],piwnica:[4.2,-7.2,0],lewa:[-5.6,-2.2,.9],prawa:[5.6,-2.2,-.9],praca:[-6,2.6,.6],zapas:[6,2.6,-.6],
 spec2:[-8.4,7.6,.4],spec3:[8.4,7.6,-.4],stodola:[-3.2,7.2,3.14],obora:[3.2,7.2,3.14],kuznia:[-8.6,-7.4,.5],karczma:[8.6,-7.4,-.5],czw3:[-9.8,.6,1.2],czw4:[9.8,.6,-1.2],
 srodek:[0,0,0],tyl:[0,-9,0],sad:[-4,-10.5,0],pasieka:[4,-10.5,0],pole1:[-13.5,0,0],pole2:[13.5,0,0]};
function e4Slots(settlement){if(settlement.id==='przystan')return null;if(settlement._slots)return settlement._slots;
 const fixed={dom_rodowy:'glowa',dwor:'glowa',skrzydlo:'skrzydlo',piwnica:'piwnica',magazyn:'zapas',zagroda:'obora',kuznia:'kuznia',karczma:'karczma',sad:'sad',pasieka:'pasieka'};
 const spec=(E4Catalog.specialties[settlement.specialization]?.buildings||[]).filter(kind=>!fixed[kind]&&!E4Catalog.buildings[kind]?.crop&&!['pole','ogrodek','zielnik','len'].includes(kind));
 const free=['praca','spec2','spec3','czw3','czw4'];const map={...fixed};spec.forEach((kind,index)=>{if(free[index])map[kind]=free[index]});
 Object.defineProperty(settlement,'_slots',{value:map,enumerable:false,configurable:true});return map}
function e4SlotAngle(settlement){if(settlement.ang!==undefined)return settlement.ang;const town=S.e4.settlements.przystan;return Math.atan2(town.z-settlement.z,town.x-settlement.x)}
// położenie budynku folwarku w stałym miejscu działki (n: która z kolei chata), albo null, gdy rodzaj nie ma miejsca
function e4SlotPos(settlement,kind,n){const map=e4Slots(settlement);if(!map)return null;let slot=map[kind];
 if(kind==='chata')slot=['lewa','prawa','czw3','czw4'][Math.max(0,(n||1)-1)];if(!slot)return null;const L=E4SLOT[slot];if(!L)return null;
 const p=hamAt(settlement.x,settlement.z,e4SlotAngle(settlement),L[0],L[1]);return p?{x:p[0],z:p[1],ry:L[2]-p[2],slot}:null}
// dawne budowle przysiółka, których epoka IV nie liczy osobno: studnia, stodoła, płot
function e4Legacy(group,settlement){if(settlement.id==='przystan')return;const gap=e4SlotAngle(settlement);
 // podwórze folwarku bez drzew (raz, przy budowie modelu)
 if(!settlement.cleared&&settlement.stage!=='podroz'){settlement.cleared=1;nodeBy.tree.forEach(n=>{if(n.amt>0&&Math.hypot(n.x-settlement.x,n.z-settlement.z)<10.5){n.amt=0;const q=nodes.indexOf(n);if(q>=0)S.nodeAmt[q]=0;nodeVis(n)}})}
 const bud=settlement.bud;if(!bud)return;
 const put=(model,slot)=>{const L=E4SLOT[slot],p=hamAt(settlement.x,settlement.z,gap,L[0],L[1]);if(!p||!model)return;model.position.set(p[0],Hy(p[0],p[1]),p[1]);model.rotation.y=L[2]-p[2];group.add(model)};
 if(bud.srodek==='studnia')put(makeBuildingModel('studnia',null),'srodek');else if(bud.srodek==='ognisko'){const p=hamAt(settlement.x,settlement.z,gap,0,0);if(p)makeFire(group,p[0],Hy(p[0],p[1]),p[1],true)}
 if(bud.brama==='stodola')put(makeBuildingModel('stodola',null),'stodola');
 if(bud.plot)ringFence(group,settlement.x,settlement.z,(settlement.stage==='folwark'?11:8.8),settlement.stage==='folwark',gap)}
// etap folwarku: 0–4 jak przysiółek, 5–7 w epoce IV
const E4ST=['obozowisko','zagroda','przysiółek','osiedle','wieś z domem rodu','folwark','folwark rozwinięty','dwór z folwarkiem'];
function e4FolwarkStage(settlement){if(!settlement||settlement.id==='przystan')return null;const b=settlement.buildings||{},C=E4Catalog.buildings,name=k=>(C[k]?.name||k).toLowerCase();
 let st=settlement.bud?hamStage({bud:settlement.bud}):b.dom_rodowy?4:1;if(b.dom_rodowy)st=Math.max(st,4);
 const spec=E4Catalog.specialties[settlement.specialization]?.buildings||[],grain=(settlement.fields||[]).filter(f=>f.crop==='zboze').length;
 const req5=[[!!b.dom_rodowy,name('dom_rodowy')],[!!settlement.specialization,'wybrana specjalność'],[spec.some(k=>b[k]),'pierwszy budynek specjalności'],[(b.chata||0)>=1,'czworak (chata dla pracowników)'],[!!b.magazyn,name('magazyn')],[grain>=2,'dwa pola zboża (trójpolówka)']];
 const req6=[[spec.every(k=>b[k]),'cały łańcuch specjalności'],[!!b.piwnica,name('piwnica')],[!!b.skrzydlo,name('skrzydlo')],[!!b.zagroda,'obora ('+name('zagroda')+')'],[!!(b.sad||b.pasieka),'sad albo pasieka']];
 const req7=[[!!b.dwor,'dwór'],[(b.chata||0)>=2,'drugi czworak'],[!!(b.kuznia||b.karczma),'kuźnia albo karczma']];
 if(st>=4&&req5.every(r=>r[0])){st=5;if(req6.every(r=>r[0])){st=6;if(req7.every(r=>r[0]))st=7}}
 const nextReq=st===4?req5:st===5?req6:st===6?req7:null;const missing=nextReq?nextReq.filter(r=>!r[0]).map(r=>r[1]):settlement.bud&&st<4?hamMissing({bud:settlement.bud,st}):[];
 return{st,name:E4ST[st],next:E4ST[st+1]||null,missing}}

/* ---- ludzie przy budowie (tylko blisko kamery) ---- */
// Przy każdej budowie, na której naprawdę się pracuje, stoją dwie albo trzy osoby z przysiółka i ciosają bale.
// Postacie są osobno od scalonego modelu przysiółka, pokazują się tylko w promieniu 40 pól od kamery i nie liczą niczego.
const hamBld={};let hamBldT=0;
function hamBuilders(){if(!S||!S.hamlets)return;const seen=new Set();
 for(const h of S.hamlets){const g=hamM[h.id];if(!g||!h.proj)continue;const busy=h.proj.filter(p=>/budują/.test(p.st||''));const key=busy.map(p=>p.k).join(',')+'|'+Math.min(3,Math.max(1,Math.round(h.pop*.3)));
  let B=hamBld[h.id];if(B&&B.userData.key!==key){wGroup.remove(B);retireObjects(B);B=null;delete hamBld[h.id]}
  if(!B&&busy.length){B=new THREE.Group();B.userData={key,ppl:[]};const x0=tcx(h.i),z0=tcx(h.j),gap=hamAngle(h,x0,z0);
   busy.forEach((p,q)=>{const L=HSLOT[HB[p.k].slot],n=Math.min(3,Math.max(1,Math.round(h.pop*.3)));for(let k=0;k<n;k++){const pos=hamAt(x0,z0,gap,L[0]+(h.bud[HB[p.k].slot]?2.1:0)+(k-1)*.9,L[1]+1.3);if(!pos)continue;
    const fake={id:95000+h.id*10+q*3+k,sex:k%2?'k':'m',age:24+k*9,cloth:WCL[(h.id+k)%WCL.length]},m=makePersonMesh(fake);m.scale.setScalar(personScale(fake));m.position.set(pos[0],Hy(pos[0],pos[1]),pos[1]);m.rotation.y=Math.atan2(-(L[0]-pos[0]),-(L[1]-pos[1]))+k;B.add(m);B.userData.ppl.push({m,ph:k*1.7})}});
   wGroup.add(B);hamBld[h.id]=B}
  if(B){seen.add(String(h.id));B.visible=g.visible&&Math.hypot(tcx(h.i)-camT.x,tcx(h.j)-camT.z)<40}}
 for(const id of Object.keys(hamBld))if(!seen.has(id)){wGroup.remove(hamBld[id]);retireObjects(hamBld[id]);delete hamBld[id]}}
{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);if(!S||!S.hamlets||!S.hamlets.length)return;hamBldT+=rdt;if(hamBldT>1){hamBldT=0;hamBuilders()}
 const sp=S.speed||0;if(!sp)return;for(const id in hamBld){const B=hamBld[id];if(!B.visible)continue;for(const w of B.userData.ppl){const U=w.m.userData,a=Math.sin(clock*7+w.ph);if(U.aR)U.aR.rotation.x=-1.2-a*.7;if(U.aL)U.aL.rotation.x=-.5-a*.3}}}}

/* ---- plansza etapów w karcie ---- */
function hamLadder(st){const names=['Obozowisko','Zagroda','Przysiółek','Osiedle','Wieś','Folwark','Folwark rozwinięty','Dwór'],short=['Oboz.','Zagr.','Przys.','Osied.','Wieś','Folw.','Rozw.','Dwór'];
 return'<div class="hlad" aria-label="Etap '+(st+1)+' z 8: '+names[st]+'">'+names.map((n,k)=>`<span class="${k<st?'done':k===st?'now':''}" title="${n}"><i></i><small>${short[k]}</small></span>`).join('')+'</div>'}
{const st=document.createElement('style');st.textContent=`.hlad{display:flex;gap:2px;margin:6px 0 4px}.hlad span{flex:1 1 0;min-width:0;text-align:center;font-size:10px;color:var(--mut);white-space:nowrap;overflow:hidden}.hlad i{display:block;height:6px;border-radius:3px;background:#2c352f;margin-bottom:3px}.hlad .done i{background:#8a6a3a}.hlad .now i{background:var(--ks-amber,#d9a441)}.hlad .now small{color:var(--hi);font-weight:600}`;document.head.appendChild(st)}
