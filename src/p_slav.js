
/* ================= klimat słowiański: rok obrzędów i wierzenia ================= */
// Nic nadprzyrodzonego się nie dzieje. Obrzędy i wierzenia działają tylko przez ludzi: na nastrój (S.wh) i porządek (S.wd).
function wiaraF(){return law('obrzedy')?1:.45}
function gajF(){return hasB('gaj')?1.4:1}
function lata(n){return n===1?'rok':(n%10>=2&&n%10<=4&&(n%100<10||n%100>=20))?'lata':'lat'}
function slavHope(){if(!S)return 0;let h=clamp(S.wh||0,-.12,.15);
 const fams=Object.values(S.fams).filter(f=>famMembers(f.id).length);if(fams.length&&S.cust&&S.cust.wiara){let warm=0,cold=0;
  fams.forEach(f=>{const b=f.home?bById(f.home):null;if(!b||!bDone(b))return;if(b.kind==='szalas')cold++;else warm++});
  h+=(.03*warm-.015*cold)/fams.length*(law('obrzedy')?1:.5)}
 return h}
function slavDis(){if(!S)return 0;return(S.wd||0)+(law('skromnie')?.002:0)-(hasB('gaj')?.004:0)}
function slavDaily(){if(!S.slav){S.slav=1;S.people.forEach(p=>{if(p.age>=7)S.seen['postr'+p.id]=1})}
 S.wh=(S.wh||0)*.8;S.wd=(S.wd||0)*.7;
 const rd=Math.floor(rday()),yr=Math.floor(S.day/YEAR),f=wiaraF(),g=gajF(),ob=law('obrzedy'),n=S.people.length,fear=(ob?1:.6)*(hasB('gaj')?.6:1)*(offHolder('zielarka')?.7:1);
 if(!n)return;
 const once=k=>{const key=k+yr;if(S.seen[key])return false;S.seen[key]=1;return true};
 const eat=c=>{const tot=foodTotal();if(tot>c*3){FOOD.forEach(k=>S.res[k]=Math.max(0,S.res[k]-c*(S.res[k]/tot)));return true}return false};
 // zaległa scena
 if(S.slavQ&&!evOpen&&!placing){const q=S.slavQ;S.slavQ=null;if(q==='dziadyLud')openEvent(DZIADY_LUD,{})}
 // Noc Kupały: rocznica rozbicia
 if(rd===0&&yr>=1&&once('kupala')){const krag=S.bld.some(b=>b.kind==='gaj'&&bDone(b));if(ob&&S.res.opal>=6)S.res.opal-=6;
  S.wh+=.07*f*g*(krag?1.25:1);S.wd-=.03*f*g;if(krag)techXp('nauka',10);
  log(ob?`Noc Kupały. ${yr===1?'Rok':yr+' '+lata(yr)} temu morze wyrzuciło nas na ten brzeg. Płoną ogniska${krag?' pod świętym dębem':''}, młodzi skaczą przez ogień, dziewczęta puszczają wianki na wodę zatoki.`:`Najkrótsza noc w roku. ${yr===1?'Rok':yr+' '+lata(yr)} temu rozbiliśmy się o ten brzeg. Ktoś pali małe ognisko na plaży i długo patrzy w morze.`);
  toast('Noc Kupały');pamAdd(2,'obrzed');if(ob)fujarka()}
 // Dziady
 if(rd===18&&S.died>=1&&once('dziady')){if(ob)eat(K*n*.25);S.wh+=.04*f*g;S.wd-=.03*f*g;
  const lud=S.seen.dziadyLud==='tak';
  log((law('morze')?'Dziady. Kaszę i chleb puszcza się na wodę zatoki, dla tych, których oddaliśmy morzu.':'Dziady. Na grobach stoją miski z kaszą i miodem, przy mogiłach płoną małe ognie. Nikt nie mówi głośno: tej nocy zmarli wracają do swoich.')+(lud?' Na kopcu w zdziczałym sadzie też płonie ogień.':'')+(S.deadNames&&S.deadNames.length?' Wspomina się imiona: '+S.deadNames.slice(-10).join(', ')+'.':''));
  toast('Dziady');pamAdd(2,'obrzed');if(lud)S.wh+=.01;
  if(ob&&S.found.includes(7)&&!S.seen.dziadyLud)S.slavQ='dziadyLud'}
 // Szczodre Gody
 if(rd===25&&once('gody')){
  if(ob&&eat(K*n*.8)){S.wh+=.07*g;S.wd-=.05*g;log('Szczodre Gody. Najdłuższa noc. Cała osada siada do jednej wieczerzy, jedno miejsce zostaje puste dla tych, których zabrakło. Dzieci chodzą od chaty do chaty i śpiewają.');toast('Szczodre Gody');pamAdd(2,'obrzed');fujarka()}
  else if(ob){S.wh+=.02*g;S.wd-=.02;log('Szczodre Gody. Wieczerza skromna, bo zapasów mało, ale wszyscy siedzą razem.')}
  else{S.wh+=.02;log('Najdłuższa noc w roku. Ktoś cicho śpiewa kolędę z dawnych stron.')}}
 // Topienie Marzanny
 if(rd===30&&once('marzanna')){S.wh+=.06*f*g;S.wd-=.02*f;
  log(ob?'Topienie Marzanny. Dzieci niosą słomianą kukłę do strumienia i wrzucają ją do wody. Zima odchodzi razem z nią. Wracają z zieloną gałązką.':'Pierwszy ciepły dzień. Ktoś mówi, że w domu topiono by dziś Marzannę.');toast('Koniec zimy');pamAdd(2,'obrzed');if(ob)fujarka()}
 // Postrzyżyny
 S.people.forEach(p=>{if(p.age<7||p.age>=12||S.seen['postr'+p.id])return;S.seen['postr'+p.id]=1;
  const par=S.people.filter(q=>q.fam===p.fam&&isAdult(q)&&q!==p).sort((a,b)=>b.age-a.age)[0];
  const c=par?Object.keys(CN).sort((a,b)=>par.sk[b]-par.sk[a])[0]:'zbieracz';
  const mm=S.people.filter(q=>isAdult(q)&&q!==p).sort((a,b)=>b.sk[c]-a.sk[c])[0];
  p.xp[c]=(p.xp[c]||0)+10+20*f;while(p.sk[c]<5&&p.xp[c]>=LVL[p.sk[c]])p.sk[c]++;S.wh+=.02*f*g;
  log(ob?`Postrzyżyny. ${p.name} kończy siedem lat. ${par?par.name:'Najstarszy w osadzie'} obcina ${p.sex==='k'?'jej':'mu'} pierwsze pasmo włosów. Odtąd jest przy pracy: ${CN[c]}. Uczy ${p.sex==='k'?'ją':'go'} ${mm?mm.name:'cała osada'}.`:`${p.name} kończy siedem lat i zaczyna kręcić się przy pracy: ${CN[c]}.`)});
 // wierzenia: lęki i otucha
 const w=S.weather.k;
 if(w==='fog'&&(S.exps||[]).some(e=>REGIONS[e.r]&&REGIONS[e.r].type==='forest')&&Math.random()<.5){S.wh-=.03*fear;S.wd+=.008*fear;
  if(!S.seen['leszy'+yr]){S.seen['leszy'+yr]=1;log('Mgła w borze. Wyprawa długo krąży w miejscu, a po powrocie ktoś przysięga, że leszy ich wodził. Nikt nie chce iść do lasu przed świtem.')}}
 if(w==='drought'&&S.bld.some(b=>b.field&&bDone(b))&&Math.random()<.5){S.wh-=.015*fear;
  if(!S.seen['poludnica'+yr]){S.seen['poludnica'+yr]=1;log('Upał w samo południe. Ludzie kładą się w cieniu miedzy, bo po polu chodzi południca. Kto zostanie w słońcu, tego zamroczy.')}}
 if(w==='storm'&&!S.seen['perun'+Math.floor(S.day/4)]&&Math.random()<.35*f){S.seen['perun'+Math.floor(S.day/4)]=1;log('Grzmi nad morzem. Starzy mówią, że to Perun bije w złe moce i że burza oczyści wyspę.');S.wh+=.01}
 if(ob&&!S.seen.domowik&&S.bld.some(b=>b.kind==='chata'&&bDone(b))){S.seen.domowik=1;S.wh+=.03;log('W nowej chacie z bali gospodyni zostawia okruchy przy palenisku. Dla domowika, żeby dom był ciepły i zgodny.')}
 if(hasB('gaj')&&!S.seen.gaj){S.seen.gaj=1;S.wh+=.03;log('Pod starym dębem ułożono krąg kamieni, na gałęziach wiszą wstążki. Odtąd tam zbiera się wiec i tam składa się przysięgi.')}
 const sick=S.people.filter(p=>p.hp<.45).length;if(sick>=3&&!S.seen['licho'+yr]){S.seen['licho'+yr]=1;S.wd+=.01*fear;log('Choroba chodzi od chaty do chaty. „Licho nie śpi”, mówią starzy, i wieszają nad drzwiami pęki suszonych ziół.')}}
const DZIADY_LUD={ey:'Dziady',t:'Mogiła dziadów',
 text:()=>'Ktoś pyta, czy postawić miskę także na kopcu pod najstarszą jabłonią w zdziczałym sadzie. Ten, kto sadził te drzewa, też miał swoich, a teraz nie ma go kto wspomnieć.',
 opts:[{n:'Postawić miskę i na ich mogile',d:'nadzieja co roku',f:()=>{S.seen.dziadyLud='tak';S.wh+=.03;return'Na kopcu płonie mały ogień. Od tego roku na Dziady wspomina się też dawny lud wyspy.'}},
  {n:'Zostawić ich w spokoju',d:'',f:()=>{S.seen.dziadyLud='nie';return'Kopiec zostaje w ciemności. Każdy ma swoich zmarłych.'}}]};
// licho przy pożarze
{const _sf=startFire;startFire=function(b){_sf(b);if(!S)return;S.wd=(S.wd||0)+.01;const k='lichoF'+Math.floor(S.day/SD);if(!S.seen[k]&&(law('obrzedy')||Math.random()<.4)){S.seen[k]=1;log('„Licho nie śpi”, mówią starzy, patrząc na dym.')}}}
// panel obyczajów: rok obrzędów
const RITES=[[0,'Noc Kupały','rocznica rozbicia, ogień i wianki'],[10,'Dożynki','wieniec i uczta po żniwach'],[18,'Dziady','jadło dla zmarłych'],[25,'Szczodre Gody','wspólna wieczerza w najdłuższą noc'],[30,'Topienie Marzanny','koniec zimy']];
function slavHTML(){if(!S||!S.cust||!S.cust.wiara)return'';const rd=rday(),ob=law('obrzedy');
 const act=RITES.filter(r=>r[1]!=='Dożynki'||law('swieto')).filter(r=>r[1]!=='Dziady'||S.died>=1);
 const nx=act.map(r=>({r,d:(r[0]-rd+YEAR)%YEAR||YEAR})).sort((a,b)=>a.d-b.d)[0];
 const wh=S.wh||0,mood=wh>.05?'podniosły':wh>.015?'pogodny':wh<-.03?'lękliwy':wh<-.01?'niespokojny':'spokojny';
 let h=`<div class="card"><h4>Rok obrzędów</h4><p>${ob?'Osada trzyma się dawnych obrzędów.':'Obrzędy tylko się wspomina.'}${hasB('gaj')?' Święty gaj wzmacnia obrzędy i łagodzi wiec.':''}</p>`;
 h+=`<p class="mut">${act.map(r=>`<b>${r[1]}</b>: ${r[2]}`).join('<br>')}</p>`;
 if(nx)h+=`<p>Najbliżej: <b>${nx.r[1]}</b> za ${Math.ceil(nx.d)} d.</p>`;
 h+=`<p class="mut">Nastrój wierzeń: <b>${mood}</b>. Mgła w borze, upał w polu i choroby budzą lęki, obrzędy i święty gaj dają otuchę.</p></div>`;return h}
{const _ch=custHTML;custHTML=function(){return _ch()+slavHTML()}}
// fujarka: krótka pentatoniczna melodia
let fujT=40;
function fujarka(){if(typeof AUD==='undefined'||!AUD||muted)return;try{const t0=AUD.currentTime+.05,sc=[0,2,4,7,9,12,14],base=500+Math.random()*80;let t=t0,idx=2+((Math.random()*3)|0);const len=6+((Math.random()*5)|0);
 const o=AUD.createOscillator(),g=AUD.createGain(),v=AUD.createOscillator(),vg=AUD.createGain(),fl=AUD.createBiquadFilter();o.type='triangle';v.frequency.value=5.2;vg.gain.value=5;v.connect(vg);vg.connect(o.frequency);
 fl.type='lowpass';fl.frequency.value=2600;o.connect(fl);fl.connect(g);g.connect(AUD.destination);g.gain.setValueAtTime(.0001,t0);
 for(let k=0;k<len;k++){idx=Math.max(0,Math.min(sc.length-1,idx+[-2,-1,-1,1,1,2][(Math.random()*6)|0]));const fq=base*Math.pow(2,sc[idx]/12),d=k===len-1?1:[.2,.28,.42][(Math.random()*3)|0];
  o.frequency.setValueAtTime(fq,t);g.gain.setTargetAtTime(.03,t,.02);g.gain.setTargetAtTime(.011,t+d*.65,.06);t+=d}
 g.gain.setTargetAtTime(.0001,t,.18);o.start(t0);v.start(t0);o.stop(t+1);v.stop(t+1)}catch(e){}}
function slavSound(rdt,Lt){fujT-=rdt;if(fujT>0)return;fujT=50+Math.random()*90;
 if(Lt.night>.25&&S.hope>.45&&seasonIdx()!==2&&S.weather.k!=='storm'&&S.weather.k!=='rain'&&Math.random()<.6)fujarka()}
