
/* ================= 2.6: opowieści — po jednym wątku na akt i dwa w epoce II ================= */
const fndr=()=>S.people.filter(p=>!p.born&&p.age>=16&&p.state!=='away');
const hiTile=()=>{if(S.hiT)return S.hiT;let best=null,bh=-1;for(let j=2;j<N-2;j+=2)for(let i=2;i<N-2;i+=2){const k=j*N+i;if(!walk[k]||!reach||!reach[k])continue;const h=tileH(i,j);if(h>bh){bh=h;best=[i,j]}}S.hiT=best;return best};
const nearTg=(p,tg,r)=>p&&p.state!=='away'&&Math.hypot(p.x-tcx(tg[0]),p.z-tcx(tg[1]))<r;
// ---- akt II: wilki pod obozem ----
CHAIN.wilki={t:'Płot przeciw wilkom',ok:s=>zLad('plot')>=s.base+12,how:()=>'Budowa → Ład wsi → płot. Dwanaście odcinków wokół domów i zagród. Odcinek kosztuje jedną kłodę.',
 say:()=>'Wilk boi się ognia i płotu. Ognia nie starczy na całą zimę.',
 fin:(s,p)=>{S.wilkPlot=1;openEvent({ey:'Opowieść',t:'Płot',text:()=>`Ostatni pal wbija ${p.name}. Wieczorem wszyscy obchodzą płot dookoła, a dzieci sprawdzają każdą furtkę.\n\nW nocy znów słychać wycie, ale z daleka. Rano przy płocie są ślady łap. Dalej wilki nie weszły.`,
  opts:[{n:'Dalej',d:'wilki rzadziej napadają na zagrody',f:()=>{S.hope=clamp(S.hope+.04,0,1);pamAdd(2,'plot');return'Od tej zimy mówi się w osadzie: płot to drugi ogień.'}}]},{})}};
// ---- akt III: woreczek z domu ----
CHAIN.ziarno={t:'Ziarno z domu',ok:()=>!!S.seen.harvest,how:()=>S.know.pole!=='tak'?'Najpierw trzeba się dowiedzieć, że ziarno tu kiełkuje: zbieracze zbierają dzikie zboże albo ktoś czyta księgę o siewie.':!S.bld.some(b=>b.field)?'Budowa → Pola i stada → Pole. Potem siew wiosną albo na początku lata.':'Pole jest. Siew wiosną albo na początku lata, potem pielenie i żniwa.',
 say:()=>'To ziarno z mojej wsi. Niech wyrośnie tutaj. To będzie znaczyło, że i my tu zostaniemy.',
 fin:(s,p)=>{S.domZiarno=1;openEvent({ey:'Opowieść',t:'Chleb z domu',text:()=>`Pierwszy chleb z naszego pola jest ciemny, ciężki i trochę zakalcowaty. ${p.name} łamie go przy ognisku i rozdaje po kawałku każdemu, nawet najmłodszym.\n\nNikt nic nie mówi. Smakuje jak tamta wieś, której już nikt z nas nie zobaczy.`,
  opts:[{n:'Dalej',d:'pola dają trochę więcej, pieśń, nadzieja',f:()=>{S.hope=clamp(S.hope+.05,0,1);song('Pieśń o chlebie z domu',p.name);return'Odtąd przy każdym siewie pierwszą garść ziarna rzuca najstarsza kobieta w osadzie.'}}]},{})}};
{const _fm=fieldMul;fieldMul=function(b){return _fm(b)*(S&&S.domZiarno?1.1:1)}}
// ---- akt IV: kamienny krąg ----
CHAIN.krag={t:'Kamienny krąg',ok:s=>S.day>s.d0+1&&S.people.some(q=>nearTg(q,s.tg,4)),how:s=>`Zwiadowca albo ktoś, kto pójdzie w tamtą stronę. Miejsce leży ${zDir(s.tg[0],s.tg[1])} od obozu, około ${Math.round(Math.hypot(s.tg[0]-camp.i,s.tg[1]-camp.j))} kroków stąd.`,
 say:()=>'Te same znaki są we wszystkich trzech miejscach. Wszystkie strzałki prowadzą w jedno miejsce.',
 fin:(s,p)=>{openEvent({ey:'Opowieść',t:'Kamienny krąg',text:()=>`Na wzgórzu stoi krąg z dwunastu kamieni, porośniętych mchem do połowy. W środku leży płaski głaz, a na nim wyryto brzeg wyspy, dokładnie taki, jaki znamy. Na zachód od brzegu są małe kropki, a do nich płyną łodzie.\n\n${p.name} długo przesuwa palcem po rysach. Ci, którzy tu żyli przed nami, nie wymarli. Odpłynęli.`,
  opts:[{n:'Przerysować mapę',d:'znamy cały brzeg wyspy, wiedza, pieśń',f:()=>{for(let j=0;j<N;j+=3)for(let i=0;i<N;i+=3){const k=j*N+i;if(beach[k])reveal(i,j,3)}try{regionScan(true)}catch(e){}techXp('nauka',60);pamAdd(3,'krag');song('Pieśń o kamiennym kręgu');S.krag=1;return'Mapa z głazu trafia do Księgi osady. Odtąd znamy cały brzeg wyspy, a starsi mówią o kropkach na zachodzie.'}}]},{})}};
// ---- akt V: ostatni z wraku ----
CHAIN.ostatni={t:'Ostatni z wraku',noRe:true,ok:s=>nearTg(pById(s.pid),s.tg,3.5),how:s=>`Dwoje idzie samo: starsza osoba i ktoś młody do pomocy. Szczyt leży ${zDir(s.tg[0],s.tg[1])} od obozu. Trzeba tylko poczekać.`,
 say:()=>'Zanim umrę, chcę jeszcze raz zobaczyć morze z najwyższej góry. Stamtąd widać wszystko, co zbudowaliśmy.',
 lost:()=>'Na szczyt nie udało się dojść. Wieczorem przy ognisku ktoś mówi, że teraz widać wszystko i bez góry.',
 fin:(s,p)=>{S.people.forEach(q=>{if(q.trek)q.trek=null});const x=tcx(s.tg[0]),z=tcx(s.tg[1]);const nm=`Wierch ${gen(p.name)}`;
  openEvent({ey:'Opowieść',t:'Na szczycie',text:()=>`Wchodzą o świcie. Z góry widać całą wyspę: dymy nad chatami, pola, przysiółki, plażę, gdzie kiedyś leżał wrak.\n\n${p.name} siada na kamieniu i długo milczy. Potem mówi tylko: „Dobrze”. Schodzą wieczorem, wolno.`,
   opts:[{n:'Dalej',d:'miejsce na mapie, pieśń, pamięć osady',f:()=>{try{placeAdd(nm,x,z,'stąd ostatni z rozbitków patrzył na wyspę')}catch(e){}pamAdd(5,'szczyt');song('Pieśń ze szczytu',p.name);S.hope=clamp(S.hope+.05,0,1);return`Szczyt nazywa się odtąd ${nm}.`}}]},{})}};
{const _pj=planJob;planJob=function(p){if(p.trek&&S&&!p.fireB&&isWork()&&p.state!=='away'){if(nearTg(p,p.trek,2.5)){p.act='patrzy na wyspę ze szczytu';p.wait=3;return false}const t=nearestWalk(p.trek[0],p.trek[1]);if(t&&go(p,t,'trek',null)){p.act='idzie na szczyt';return true}}return _pj(p)}}
{const _oa=onArrive;onArrive=function(p){if(p.after!=='trek')return _oa(p);p.after=null;p.state='idle';p.wait=1}}
// ---- epoka II: dzwon ze statku ----
CHAIN.dzwon={t:'Dzwon ze statku',ok:()=>hasB('domwsp')&&S.res.deski>=10&&S.res.gwozdzie>=10,how:()=>{const L=[];if(!hasB('domwsp'))L.push('chata wiecowa');if(S.res.deski<10)L.push('10 desek');if(S.res.gwozdzie<10)L.push('10 gwoździ');return L.length?'Potrzeba: '+L.join(', ')+'. Dzwonnicę stawia się przy chacie wiecowej.':'Wszystko gotowe.'},
 say:()=>'Ten dzwon bił na wachtę tamtej nocy. Niech bije teraz na wiec.',
 fin:(s,p)=>{S.res.deski-=10;S.res.gwozdzie-=10;S.dzwon=1;dzwonVis();openEvent({ey:'Opowieść',t:'Dzwon',text:()=>`Dzwonnica stoi przy chacie wiecowej: dwa słupy, belka i daszek z gontu. ${p.name} pociąga za sznur. Dźwięk niesie się aż nad zatokę.\n\nNajstarsi stają w miejscu. Ostatni raz słyszeli go na pokładzie.`,
  opts:[{n:'Dalej',d:'mniej kłótni, nadzieja, pieśń',f:()=>{S.hope=clamp(S.hope+.05,0,1);pamAdd(3,'dzwon');song('Pieśń o dzwonie ze statku');return'Odtąd dzwon zwołuje wiec, bije na wesela i na pogrzeby.'}}]},{})}};
let dzwonG=null;
function dzwonVis(){if(!S||!S.dzwon||dzwonG)return;const b=S.bld.find(x=>x.kind==='domwsp'&&bDone(x));if(!b)return;const c=bCenter(b),d=BD[b.kind];const x=c.x+d.w*.5+1.1,z=c.z+.4;
 const g=new THREE.Group(),wd=M(0x6e5236),br=M(0x9a7a3c,{metalness:.6,roughness:.45}),rf=M(0x4a4038);
 g.add(mesh(new THREE.BoxGeometry(.12,1.9,.12),wd,-.45,.95,0));g.add(mesh(new THREE.BoxGeometry(.12,1.9,.12),wd,.45,.95,0));g.add(mesh(new THREE.BoxGeometry(1.1,.12,.14),wd,0,1.85,0));
 const rr=mesh(new THREE.BoxGeometry(1.3,.06,.6),rf,0,2.05,0);g.add(rr);g.add(mesh(new THREE.CylinderGeometry(.14,.26,.36,10,1,true),br,0,1.6,0));g.add(mesh(new THREE.SphereGeometry(.05,6,4),br,0,1.42,0));
 g.position.set(x,Hy(x,z),z);g.traverse(o=>{o.castShadow=true});scene.add(g);dzwonG=g}
{const _dd=typeof disDaily==='function'?disDaily:null;if(_dd)disDaily=function(){_dd();if(S&&S.dzwon)S.dis=Math.max(0,(S.dis||0)-.006)}}
// ---- rozpoczęcia wątków ----
const STARTS=[
 {id:'wilki',ok:()=>S.epoch!==2&&seasonIdx()===2&&S.day>YEAR*.5&&S.herds.some(h=>h.type==='wilk'&&h.n>=2),go:R=>{const p=anyZ(adultsZ());if(!p)return;R.ch.wilki='intro';
  openEvent({ey:'Opowieść',t:'Ślady przy obozie',text:()=>`O świcie ${p.name} znajduje na śniegu ślady łap. Wilki obeszły obóz dookoła, kilka razy, w nocy, kiedy wszyscy spali. Przy stosie mięsa śnieg jest zdeptany.\n\nTej zimy będą wracać.`,
   opts:[{n:'Ogniska co noc i płot wokół obejść',d:'opał −20, nowa sprawa: płot',f:()=>{S.res.opal=Math.max(0,S.res.opal-20);R.ch.wilki='szuka';R.a.push({chain:'wilki',id:'ch_wilki',pid:p.id,d0:S.day,base:zLad('plot')});return'Przy chatach płoną ogniska do świtu. Rano mężczyźni idą do lasu po żerdzie.'}},
    {n:'Zapolować na watahę',d:'skóry albo rany',f:()=>{R.ch.wilki='ok';const h=S.people.filter(q=>isAdult(q)&&q.age>=16).sort((a,b)=>(b.sk.mysliwy||0)-(a.sk.mysliwy||0))[0];if(!h)return'Nie ma kogo posłać.';
      if(Math.random()<.4+.12*(h.sk.mysliwy||0)){S.res.skory+=4;S.res.mieso+=10;const w=S.herds.find(x=>x.type==='wilk'&&x.n>0);if(w)w.n=Math.max(0,w.n-2);pamAdd(1,'czyn');return`${h.name} wraca po dwóch dniach z dwiema wilczymi skórami. Reszta watahy odchodzi w góry.`}
      h.hp=Math.max(.15,h.hp-.35);h.hurt=1;return`${h.name} wraca z pogryzionym ramieniem. Wilki rozbiegły się, ale nikt nie wierzy, że na długo.`}},
    {n:'Przeczekać',d:'mięso i ryby mogą zniknąć',f:()=>{R.ch.wilki='ok';if(Math.random()<.45){S.res.mieso=Math.floor((S.res.mieso||0)*.6);S.res.ryby=Math.floor((S.res.ryby||0)*.75);S.dis=clamp((S.dis||0)+.03,0,1);return'Trzeciej nocy wilki dobierają się do zapasów. Rano połowy mięsa nie ma.'}return'Wilki krążą jeszcze kilka nocy, a potem znikają.'}}]},{})}},
 {id:'ziarno',ok:()=>S.epoch!==2&&(S.act||1)>=3&&!S.seen.harvest,go:R=>{const p=fndr().filter(q=>q.sex==='k').sort((a,b)=>b.age-a.age)[0]||fndr().sort((a,b)=>b.age-a.age)[0];if(!p){R.ch.ziarno='x';return}R.ch.ziarno='intro';
  openEvent({ey:'Opowieść',t:'Woreczek z domu',text:()=>`${p.name} rozwiązuje przy ognisku mały skórzany woreczek, który cały czas nosi${p.sex==='k'?'ła':'ł'} na szyi. W środku jest garść żyta z ${p.sex==='k'?'jej':'jego'} rodzinnej wsi.\n\nMówi, że trzymał${p.sex==='k'?'a':''} je na najgorszy czas. Ale teraz chce, żeby wyrosło tutaj.`,
   opts:[{n:'Posiać je na naszym polu',d:'nowa sprawa, ziarno +6',f:()=>{S.res.ziarno=(S.res.ziarno||0)+6;R.ch.ziarno='szuka';R.a.push({chain:'ziarno',id:'ch_ziarno',pid:p.id,d0:S.day});return'Woreczek wisi teraz przy ognisku, a ziarno czeka na siew.'}},
    {n:'Zostawić na czarną godzinę',d:'ziarno +6',f:()=>{S.res.ziarno=(S.res.ziarno||0)+6;R.ch.ziarno='x';return`${p.name} kiwa głową i chowa woreczek. Ziarno trafia do zapasów.`}}]},{})}},
 {id:'krag',ok:()=>S.epoch!==2&&(S.act||1)>=4&&S.found.length>=3,go:R=>{const far=tribe.filter(t=>S.found.includes(t.k)).sort((a,b)=>Math.hypot(b.i-camp.i,b.j-camp.j)-Math.hypot(a.i-camp.i,a.j-camp.j))[0];if(!far){R.ch.krag='x';return}
  const tg=nearestWalk(far.i,far.j)||[far.i,far.j];const p=S.people.filter(q=>isAdult(q)&&q.age>=16).sort((a,b)=>(b.trait==='Dociekliwy')-(a.trait==='Dociekliwy')||b.age-a.age)[0];if(!p)return;R.ch.krag='intro';
  openEvent({ey:'Opowieść',t:'Znaki na kamieniach',text:()=>`${p.name} siedzi nad rysunkami z trzech miejsc dawnego ludu. Te same znaki powtarzają się wszędzie: fale, łodzie i słońce, które zachodzi nad morzem.\n\nWszystkie strzałki prowadzą w jedno miejsce, ${zDir(tg[0],tg[1])} od obozu.`,
   opts:[{n:'Pójść tam',d:'nowa sprawa: wyprawa do kręgu',f:()=>{R.ch.krag='szuka';R.a.push({chain:'krag',id:'ch_krag',pid:p.id,d0:S.day,tg});return'Zwiadowcy dostają przerysowane znaki i ruszają.'}},
    {n:'Zostawić to w spokoju',d:'',f:()=>{R.ch.krag='x';return'Rysunki trafiają do skrzyni. Może kiedyś ktoś do nich wróci.'}}]},{})}},
 {id:'ostatni',ok:()=>{if(S.epoch===2||(S.act||1)<5)return false;const f=fndr();return f.length>0&&f.length<=4&&f.some(q=>q.age>=58&&q.hp>.4)},go:R=>{const p=fndr().filter(q=>q.age>=58&&q.hp>.4).sort((a,b)=>b.age-a.age)[0];const tg=hiTile();if(!p||!tg){R.ch.ostatni='x';return}R.ch.ostatni='intro';
  openEvent({ey:'Opowieść',t:'Ostatni z wraku',text:()=>`${p.name} jest jedn${p.sex==='k'?'ą':'ym'} z ostatnich, którzy pamiętają statek. Mówi, że zanim umrze, chce jeszcze raz zobaczyć morze z najwyższej góry wyspy.\n\nStamtąd widać wszystko, co zbudowaliśmy.`,
   opts:[{n:'Zaprowadzić na szczyt',d:'kilka dni drogi, pójdzie z kimś młodym',f:()=>{const e=S.people.filter(q=>q.born&&q.age>=16&&q.age<30&&q.state!=='away').sort((a,b)=>(b.fam===p.fam)-(a.fam===p.fam))[0];p.trek=tg;if(e)e.trek=tg;R.ch.ostatni='szuka';R.a.push({chain:'ostatni',id:'ch_ostatni',pid:p.id,d0:S.day,tg});return`${e?e.name+' pakuje':'Pakują'} chleb, koc i laskę. Wyruszają rano.`}},
    {n:'To za daleko',d:'',f:()=>{R.ch.ostatni='x';S.hope=clamp(S.hope-.02,0,1);return`${p.name} nie nalega. Wieczorami siada na plaży i patrzy na morze stamtąd.`}}]},{})}},
 {id:'dzwon',ok:()=>S.epoch===2&&S.day>=7*YEAR+3,go:R=>{const p=anyZ(adultsZ());if(!p)return;R.ch.dzwon='intro';
  openEvent({ey:'Opowieść',t:'Dzwon w piasku',text:()=>`Po sztormie morze cofnęło się dalej niż zwykle. Dzieci przybiegają z plaży: z piasku wystaje zielony od śniedzi brąz.\n\nTo dzwon z naszego statku. Ten sam, który bił na wachtę tamtej nocy.`,
   opts:[{n:'Zawiesić go w osadzie',d:'nowa sprawa: dzwonnica przy chacie wiecowej',f:()=>{R.ch.dzwon='szuka';R.a.push({chain:'dzwon',id:'ch_dzwon',pid:p.id,d0:S.day});return'Sześciu ludzi niesie dzwon na drągach. Na razie leży przy ognisku.'}},
    {n:'Oddać go morzu',d:'pieśń, pamięć osady',f:()=>{R.ch.dzwon='x';pamAdd(2,'dzwon');song('Pieśń o dzwonie oddanym morzu');return'Wypływają łodzią na zatokę i spuszczają dzwon w głębinę. Niech bije tym, którzy nie dopłynęli.'}}]},{})}}];
{const _ct=chainTick;chainTick=function(){_ct();const R=S.spr;if(!R||evOpen||placing||!isWork())return;for(const st of STARTS){if(R.ch[st.id])continue;let ok=false;try{ok=st.ok()}catch(e){}if(ok){st.go(R);return}}}}
// zwiadowcy chętniej idą do kręgu
{const _st=scoutTarget;scoutTarget=function(p){const s=S&&S.spr&&S.spr.a.find(x=>x.chain==='krag');if(s&&Math.random()<.3){const t=nearestWalk(s.tg[0],s.tg[1]);if(t)return t}return _st(p)}}
// ---- epoka II: głód w przysiółku (zdarzenie) ----
EVENTS.push({id:'e2_glod',w:1.4,cd:YEAR*.8,cond:()=>S.epoch===2&&(seasonIdx()===2||seasonIdx()===3)&&!!hamPick(h=>(h.zap||0)<.3),t:'Głód w przysiółku',ctx:()=>{const h=hamPick(h=>(h.zap||0)<.3);return h?{h}:null},
 text:c=>`Z przysiółka ${c.h.name} przychodzi kobieta z dzieckiem na ręku. Mówi cicho, że od tygodnia jedzą korę i ostatnie ziarno siewne. Do wiosny nie wytrzymają.`,
 opts:[{n:'Posłać 40 jedzenia',d:'przysiółek przetrwa, więź rośnie',f:c=>{if(!needHave('jedzenie',40))return'W osadzie też nie ma tyle. Kobieta wraca z pustymi rękami.';needTake('jedzenie',40);c.h.zap=Math.min(1,(c.h.zap||0)+.35);c.h.wiez=Math.min(1,(c.h.wiez||.5)+.12);if(typeof spawnWalker==='function')spawnWalker(c.h,1,null,1,0);return`Jeszcze tego dnia wóz z zapasami jedzie do przysiółka ${c.h.name}.`}},
  {n:'Posłać ziarno siewne na wiosnę',d:'10 ziarna, mniej teraz, więcej potem',f:c=>{if((S.res.ziarno||0)<10)return'Ziarna siewnego jest za mało.';S.res.ziarno-=10;c.h.zap=Math.min(1,(c.h.zap||0)+.15);c.h.wiez=Math.min(1,(c.h.wiez||.5)+.06);return'Na wiosnę przysiółek obsieje więcej. Do tego czasu będzie ciężko.'}},
  {n:'Nie mamy nic do oddania',d:'',f:c=>{c.h.wiez=Math.max(0,(c.h.wiez||.5)-.1);if(Math.random()<.4){const nm=hamDeath(c.h);return nm?`Przed wiosną w przysiółku ${c.h.name} umiera ${nm}. Tam długo tego nie zapomną.`:'Przysiółek przetrwa, ale z trudem.'}return'Przysiółek przetrwa, ale ludzie stamtąd przestają przychodzić na targ.'}}]});
{const _dg=dogGuard;dogGuard=function(){return _dg()*(S&&S.wilkPlot?.5:1)}}
{const _sp=sprTick;sprTick=function(){_sp();if(!S)return;try{dzwonVis()}catch(e){}if(!(S.spr&&S.spr.a.some(x=>x.chain==='ostatni')))S.people.forEach(q=>{if(q.trek)q.trek=null})}}
window.__opow={STARTS,hiTile,dzwonVis};
