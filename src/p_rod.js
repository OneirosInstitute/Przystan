
/* ================= 3.3 Pokolenia: ciąża, połóg, baba pępowa, dzieciństwo i zastępowalność pokoleń ================= */
// Rok gry to dwa lata życia (dzień = 0,1 roku). Ciąża: 9 miesięcy = 7,5 dnia gry. Karmienie piersią: ok. 7 dni (pół roku z okładem) bez kolejnej ciąży.
const RD_CIAZA=.75*10,RD_POLOG=7;
const RD_AGE=a=>a<18?0:a<20?.8:a<30?1:a<35?.9:a<40?.7:a<45?.35:a<46?.1:0;
// grupy wieku matek do dzietności: 18–24, 25–29, 30–34, 35–39, 40–45
const RD_G=a=>a<25?0:a<30?1:a<35?2:a<40?3:4,RD_GW=[7,5,5,5,6],RD_GREL=[.95,1,.9,.7,.3];
// stan kobiety: ciaza {s,d,n}, polog (dzień końca), dz (urodzone dzieci), dzm (dzieci zmarłe przed 12. rokiem)
function rodYr(){S.demo=S.demo||{y:{}};const y=Math.floor(S.day/YEAR);let o=S.demo.y[y];if(!o){o=S.demo.y[y]={b:0,cd:0,md:0,sb:0,wy:0,cy:0,bk:{},wa:[0,0,0,0,0],ba:[0,0,0,0,0]};const ks=Object.keys(S.demo.y).map(Number).sort((a,b)=>a-b);while(ks.length>12)delete S.demo.y[ks.shift()]}return o}
function rodBad(p){return(fedOf(p)<.7?1:0)+(p.hp<.5?1:0)+(p.warm!==undefined&&p.warm<.6?1:0)+(p.ill?1:0)}
function rodCare(){return(offHolder('baba')?.5:1)*(tech('u_ziel')||hasB('izbachorych')?.75:1)}
function rodWhyNot(w,f){// powód, dla którego zamężna kobieta nie może teraz począć (albo null)
 if(w.pair===null||!pById(w.pair))return'pair';if(w.waitHome)return'wait';if(w.ciaza)return'preg';if(w.polog&&S.day<w.polog)return'polog';
 const h=f&&f.home?bById(f.home):null;if(!h||!bDone(h))return'house';if(pById(w.pair).fam!==w.fam)return'pair';return null}
function rodPregN(fid){return famMembers(fid).reduce((a,p)=>a+(p.ciaza?(p.ciaza.n||1):0),0)}
function rodSpace(f){const h=f&&f.home?bById(f.home):null;if(!h||!bDone(h))return 0;return BD[h.kind].house-famMembers(f.id).length-rodPregN(f.id)}
function rodConc(w){// szansa poczęcia w ciągu dnia
 return .17*RD_AGE(w.age)*(.6+.6*S.hope)*(fedOf(w)>=.9?1:fedOf(w)>=.75?.55:fedOf(w)>=.6?.3:.1)*(w.hp<.5?.5:1)*(w.warm!==undefined&&w.warm<.6?.7:1)*(w.ill?.5:1)}
function rodBorn(w,f,h,twin){const sex=Math.random()<.5?'k':'m';const c=newPerson(S.pid++,newName(sex),0,sex,f.id,{},TKEYS[(Math.random()*TKEYS.length)|0]);c.born=1;c.rod=(pById(w.pair)||w).rod;c.par=[w.id,w.pair];{const fa=pById(w.pair);c.gp=[...(w.par||[]),...(fa&&fa.par||[])]}c.mirX=0;
 const hc=h?bCenter(h):{x:tcx(camp.i),z:tcx(camp.j)};c.x=hc.x+.6+(twin?.3:0);c.z=hc.z+.8;S.people.push(c);addPersonMesh(c);S.born++;return c}
function rodQuiet(fn){const L=log;log=function(t){if(/umiera/.test(t))return;return L.apply(this,arguments)};try{fn()}finally{log=L}}
function rodPorod(w){const c0=w.ciaza;delete w.ciaza;const f=S.fams[w.fam];const h=f&&f.home?bById(f.home):null;const Y=rodYr();
 const bad=rodBad(w)+(h&&bDone(h)?0:1),care=rodCare(),n=c0.n||1;const kids=[];let lost=0;
 for(let q=0;q<n;q++){if(Math.random()<.02*(1+bad)*care*(n>1?1.6:1)){lost++;Y.sb++;continue}kids.push(rodBorn(w,f||{id:w.fam},h,q>0))}
 w.dz=(w.dz||0)+kids.length;if(w.age>=18&&w.age<46){Y.ba=Y.ba||[0,0,0,0,0];Y.ba[RD_G(w.age)]+=kids.length}w.pologS=S.day;w.polog=S.day+(kids.length?RD_POLOG*(.85+Math.random()*.3):2.5);Y.b+=kids.length;
 const fn=famName(w.fam),bb=offHolder('baba');
 if(kids.length===2)log(`Bliźnięta! W rodzinie ${gen(fn)} rodzą się ${kids[0].name} i ${kids[1].name}.${bb?` Poród przyjęła ${bb.name}.`:''}`),toast('Bliźnięta: '+kids[0].name+' i '+kids[1].name);
 else if(kids.length===1){log(`Rodzi się ${kids[0].name} w rodzinie ${gen(fn)}.${bb&&bb!==w?` Poród przyjęła ${bb.name}.`:''}`);toast('Narodziny: '+kids[0].name)}
 if(lost)log(kids.length?`Drugie z bliźniąt ${w.name} rodzi się martwe.`:`${w.name} rodzi martwe dziecko. W chacie ${gen(fn)} cisza, kobiety siedzą przy niej do rana.`);
 // śmierć przy porodzie: rzadka, częstsza w głodzie, zimnie i bez baby pępowej
 if(Math.random()<.006*(1+bad)*care*(n>1?1.5:1)){Y.md++;const wn=w.name,age=Math.floor(w.age);rodQuiet(()=>killPerson(w,'przy porodzie'));
  log(`${wn} umiera przy porodzie, w wieku ${age} lat.${kids.length?` ${kids.length>1?'Dzieci żyją':kids[0].name+' żyje'}: zaopiekuje się ${kids.length>1?'nimi':kids[0].sex==='k'?'nią':'nim'} rodzina.`:''}`);toast(wn+' umiera przy porodzie')}
 if(kids.length&&!(S.seen.rodFirst)){S.seen.rodFirst=1}}
// śmiertelność dzieci: niemowlęta najbardziej, potem coraz mniej; głód, zimno i choroba mnożą ryzyko
function rodChildRisk(p){const a=p.age;if(a>=12)return 0;let r=a<1?.006:a<5?.001:.0002;
 r*=1+4*Math.max(0,.95-fedOf(p));if(p.warm!==undefined&&p.warm<.6)r*=2.2;if(p.ill)r*=p.ill.k==='szkorbut'?(a<1?1.2:1.6):2.2;if(p.hp<.6)r*=1.5;if(S.health<.55)r*=1.3;
 if(offHolder('zielarka'))r*=.8;if(a<1&&offHolder('baba'))r*=.65;if(tech('u_ziel'))r*=.85;if(hasB('studnia'))r*=.9;return r}
function rodChildWhy(p){if(fedOf(p)<.7)return'głód';if(p.warm!==undefined&&p.warm<.6)return'zimno';if(p.ill)return ILL&&ILL[p.ill.k]?ILL[p.ill.k][0]:'gorączka';return['gorączka','kaszel','gorączka','biegunka','krup'][(Math.random()*5)|0]}
// biernik imienia: Mira → Mirę, Ostoja → Ostoję, Mieszko → Mieszka, Racibor → Racibora
function acc(n){return/a$/.test(n)?n.slice(0,-1)+'ę':gen(n)}
// liczebniki zbiorowe: jedno dziecko, dwoje, troje… dzieci
const DZW=['','jedno','dwoje','troje','czworo','pięcioro','sześcioro','siedmioro','ośmioro','dziewięcioro','dziesięcioro'];
function dzieciN(n){return n===1?'jedno dziecko':n<=10?DZW[n]+' dzieci':n+' dzieci'}
const rodKill0=killPerson;let rodIn=0;
function rodChildDie(p,why0){const Y=rodYr();Y.cd++;const why=why0||rodChildWhy(p),nm=p.name,k=p.sex==='k',a=p.age;const mo=pById(p.par&&p.par[0]);if(mo)mo.dzm=(mo.dzm||0)+1;
 const fn=famName(p.fam);rodIn=1;try{rodQuiet(()=>killPerson(p,why))}finally{rodIn=0}S.dis=clamp((S.dis||0)-.02,0,1);
 const wiek=a<1?(k?'nie miała jeszcze roku':'nie miał jeszcze roku'):`${k?'miała':'miał'} ${Math.floor(a)} ${lata(Math.floor(a))}`;
 const T=why==='głód'?`Głód zabiera ${k?'małą':'małego'} ${acc(nm)}, ${wiek}.`:why==='zimno'?`Zimno w chacie zabiera ${k?'małą':'małego'} ${acc(nm)}, ${wiek}.`:`${why[0].toUpperCase()+why.slice(1)} zabiera ${k?'małą':'małego'} ${acc(nm)} z rodziny ${gen(fn)}, ${wiek}.`;
 log(T+' Pochowano '+(k?'ją':'go')+' pod brzozą za chatami.');if(!S.seen.rodCd){S.seen.rodCd=1;toast('Zmarło dziecko: '+nm)}}
// każda śmierć dziecka liczy się do wskaźników; głód i zimno opisane po ludzku zamiast „w wieku 0 lat”
killPerson=function(p,why){if(!rodIn&&p&&p.age<12&&S&&S.people.includes(p)){if(why==='z głodu'||why==='z wyziębienia')return rodChildDie(p,why==='z głodu'?'głód':'zimno');rodYr().cd++;const mo=pById(p.par&&p.par[0]);if(mo)mo.dzm=(mo.dzm||0)+1}return rodKill0(p,why)};
familyLife=function(){const Y=rodYr();const day=S.day;
 // ekspozycja i powody braku poczęć (dla wskaźnika zastępowalności)
 S.people.forEach(p=>{if(p.age<12)Y.cy+=.1;if(p.sex==='k'&&p.age>=18&&p.age<46){Y.wy+=.1;Y.wa=Y.wa||[0,0,0,0,0];Y.wa[RD_G(p.age)]+=.1;const f=S.fams[p.fam];let r=rodWhyNot(p,f);if(!r&&rodSpace(f)<=0)r='full';Y.bk[r||'ok']=(Y.bk[r||'ok']||0)+1}});
 // porody
 S.people.filter(w=>w.ciaza&&day>=w.ciaza.d).forEach(rodPorod);
 // poronienia: tylko w głodzie albo ciężkiej chorobie
 S.people.forEach(w=>{if(!w.ciaza||!S.people.includes(w))return;const b=(fedOf(w)<.6?1:0)+(w.hp<.35?1:0);if(b&&Math.random()<.012*b){delete w.ciaza;w.polog=day+2;Y.sb++;log(`${w.name} traci dziecko, które nosiła. ${fedOf(w)<.6?'Głód':'Choroba'} odbiera siły także tym, którzy jeszcze się nie urodzili.`)}
  else if(!w.ciaza.ann&&day-w.ciaza.s>=RD_CIAZA*.3){w.ciaza.ann=1;const m=pById(w.pair);log(`${w.name}${m?' i '+m.name:''} spodziewają się dziecka.${(w.dz||0)===0?' To będzie ich pierwsze.':''}`)}});
 // poczęcia: w domu musi być miejsce dla dziecka (liczą się też dzieci w drodze)
 Object.values(S.fams).forEach(f=>{let sp=rodSpace(f);if(sp<=0)return;
  famMembers(f.id).forEach(w=>{if(sp<=0||w.sex!=='k'||RD_AGE(w.age)<=0||rodWhyNot(w,f))return;if(Math.random()<rodConc(w)){const tw=sp>=2&&Math.random()<.012;w.ciaza={s:day,d:day+RD_CIAZA*(.96+Math.random()*.08),n:tw?2:1};sp-=w.ciaza.n}})});
 // dzieci
 for(const p of [...S.people]){if(p.age<12&&S.people.includes(p)&&Math.random()<rodChildRisk(p))rodChildDie(p)}
 assignHomes()};
// pod koniec ciąży i tuż po porodzie kobieta pracuje lżej
{const _e=eff;eff=function(p){let m=_e(p);if(p.ciaza&&S.day-p.ciaza.s>RD_CIAZA*.7)m*=.85;else if(p.polog&&S.day<p.polog&&S.day<p.pologS+1.2)m*=.75;return m}}
// baba pępowa: urząd, który rodzi się z potrzeby
OFFS.push({id:'baba',n:['Baba pępowa','Baba pępowa'],when:()=>S.people.some(p=>p.ciaza)||(S.demo&&Object.values(S.demo.y).some(y=>y.b>0)),why:'Kobiety rodzą, ktoś musi umieć przyjąć poród i przeciąć pępowinę.',d:'Przyjmuje porody i doradza matkom. Rzadziej umierają matki i niemowlęta.',fit:p=>p.sex!=='k'?-80:(p.age>=34?10:p.age>=26?3:-12)+Math.min(4,p.dz||0)*3+(p.sk.zbieracz||0)*2+(p.trait==='Cierpliwy'?6:p.trait==='Ostrożny'?4:0)-(p.ciaza?8:0)});
OFF_BY.baba=OFFS[OFFS.length-1];
// ---------- wskaźniki: dzietność, przeżywalność dzieci, zastępowalność ----------
function rodStats(){S.demo=S.demo||{y:{}};const cur=Math.floor(S.day/YEAR);const ys=Object.keys(S.demo.y).map(Number).filter(y=>y>=cur-5).sort((a,b)=>a-b);
 const A={b:0,cd:0,md:0,sb:0,wy:0,cy:0,bk:{},wa:[0,0,0,0,0],ba:[0,0,0,0,0]};ys.forEach(y=>{const o=S.demo.y[y];['b','cd','md','sb','wy','cy'].forEach(k=>A[k]+=o[k]||0);for(const k in o.bk)A.bk[k]=(A.bk[k]||0)+o.bk[k];for(let g=0;g<5;g++){A.wa[g]+=(o.wa||[])[g]||0;A.ba[g]+=(o.ba||[])[g]||0}});
 // dzietność z rozkładu wieku matek; w grupie z małą liczbą kobiet bierze się średnią osady ważoną wiekiem
 const ok=A.wy>=4;let tfr=null;if(ok){const sb=A.ba.reduce((a,b)=>a+b,0),gfr=(sb||A.b)/A.wy,rw=A.wa.reduce((a,w,g)=>a+w*RD_GREL[g],0)/A.wy||1;tfr=0;for(let g=0;g<5;g++)tfr+=RD_GW[g]*(A.wa[g]>=1.5?A.ba[g]/A.wa[g]:gfr*RD_GREL[g]/rw)}const m=A.cy>.5?A.cd/A.cy:0;const s12=A.cy>.5?Math.exp(-12*m):1;const nrr=ok?tfr*.49*s12*.97:null;
 return{A,tfr,s12,nrr,ok,yrs:ys.length}}
const RD_BK={pair:'kobiety bez męża',wait:'młode pary czekają na własny dom',house:'rodziny bez gotowego domu',full:'ciasno: w domach brak miejsca na kolejne dzieci'};
function rodHTML(){const R=rodStats();const preg=S.people.filter(p=>p.ciaza).sort((a,b)=>a.ciaza.d-b.ciaza.d);
 let h='<h3>Pokolenia</h3><div class="card">';
 h+=preg.length?`<p><b>Spodziewają się dzieci:</b> ${preg.map(w=>{const d=Math.max(0,Math.ceil(w.ciaza.d-S.day));return`${w.name} <span class="mut">(${d<1?'lada chwila':'za ok. '+d+' '+dniW(d)})</span>`}).join(', ')}.</p>`:'<p class="mut">Teraz żadna kobieta nie spodziewa się dziecka.</p>';
 const A=R.A;h+=`<p class="mut">W ostatnich latach ${A.b?'urodziło się '+dzieciN(A.b):'nie urodziło się żadne dziecko'}${A.cd?`, zmarło ${dzieciN(A.cd)}`:''}${A.md?`, przy porodzie ${A.md===1?'zmarła jedna matka':'zmarły '+A.md+' matki'}`:''}${A.sb?`, martwych urodzeń i poronień: ${A.sb}`:''}.</p>`;
 if(R.ok){const t=R.tfr,r=R.nrr;const tw=t<1.5?'mniej niż dwoje':t<2.5?'dwoje':t<3.5?'troje':t<4.5?'czworo':t<5.5?'pięcioro':t<6.5?'sześcioro':'siedmioro i więcej';
  h+=`<p>Na kobietę przypada dziś około <b>${t.toFixed(1).replace('.',',')}</b> dziecka (${tw}). Do dwunastu lat dożywa ${Math.round(R.s12*10)} na 10.</p>`;
  h+=`<p>Zastępowalność pokoleń: <b>${r.toFixed(2).replace('.',',')}</b>. ${r>=1.6?'Każde pokolenie jest wyraźnie liczniejsze od poprzedniego, jak na każdym pograniczu.':r>=1.15?'Pokolenie dzieci będzie liczniejsze od pokolenia rodziców.':r>=.9?'Pokolenia ledwo się zastępują: osada nie rośnie.':'Dzieci rodzi się za mało, by zastąpić rodziców. Bez zmian osada będzie maleć.'}</p>`;
  const tot=Object.values(A.bk).reduce((a,b)=>a+b,0)||1;const top=Object.entries(A.bk).filter(([k])=>RD_BK[k]).sort((a,b)=>b[1]-a[1])[0];
  if(top&&top[1]/tot>=.2)h+=`<p class="mut">Najbardziej hamuje narodziny: ${RD_BK[top[0]]} (${Math.round(100*top[1]/tot)}% czasu kobiet w wieku rodzenia).</p>`}
 else h+='<p class="mut">Za mało lat na wyspie, by policzyć, czy pokolenia się zastępują.</p>';
 h+=`<p class="mut">Dzieci rodzą się w domach, w których jest dla nich miejsce. Ciąża trwa dziewięć miesięcy, potem matka karmi niemowlę. Głód, zimno i choroby zabierają najpierw najmłodszych; zielarka, baba pępowa i studnia chronią dzieci.</p></div>`;return h}
{const _rh=rodyHTML;rodyHTML=function(){return(S?rodHTML():'')+_rh()}}
{const _lc=ludCard;ludCard=function(p){let h=_lc(p);let x='';
  if(p.ciaza){const d=Math.max(0,Math.ceil(p.ciaza.d-S.day));x+=p.ciaza.ann?`Spodziewa się dziecka, rozwiązanie ${d<1?'lada chwila':'za ok. '+d+' '+dniW(d)}.`:''}
  else if(p.polog&&S.day<p.polog&&S.people.some(c=>c.par&&c.par[0]===p.id&&c.age<1.2))x+='Karmi niemowlę.';
  if(p.sex==='k'&&(p.dz||0)>0){const al=S.people.filter(c=>c.par&&c.par[0]===p.id).length;x+=`${x?' ':''}Urodziła ${dzieciN(p.dz)}${al<p.dz?`, ${al?'żyje '+(al===1?'jedno':DZW[al]||al):'żadne nie żyje'}`:''}.`}
  return x?`<p class="mut">${x}</p>`+h:h}}
// krótko w podsumowaniu cichej wyspy
{const _cs=czSumHTML;czSumHTML=function(){const h=_cs();const n=S.people.filter(p=>p.ciaza&&p.ciaza.ann).length;if(!n)return h;const few=n%10>=2&&n%10<=4&&(n%100<10||n%100>=20);return h.replace('</p>',` ${n===1?'Jedna kobieta spodziewa się dziecka.':few?`${n} kobiety spodziewają się dzieci.`:`${n} kobiet spodziewa się dzieci.`}</p>`)}}
// ---------- ciało: brzuch ciężarnej (sukienka, fartuch i pasek wypychają się do przodu) ----------
function rodBodyGeo(g,a,win){const q=g.clone();const P=q.attributes.position;
 for(let i=0;i<P.count;i++){const z=P.getZ(i);if(z<=.01)continue;const y=P.getY(i)+.5;if(y<.3||y>.61)continue;const x=P.getX(i);const fx=1-Math.min(1,(x/.175)**2);if(fx<=0)continue;
  const t=(y-.3)/.31;const by=Math.pow(Math.sin(Math.PI*Math.pow(t,.85)),1.15);const r=Math.hypot(x,z)||1,fz=z/r;const k=win?clamp((r-.11)/.05,.45,1):1;P.setZ(i,z+a*k*by*fx*fz*fz);P.setY(i,P.getY(i)-a*.12*by*fx)}
 P.needsUpdate=true;q.computeBoundingSphere();return q}
function rodBelly(m,p){const u=m.userData;if(!u.p18||!u.gS)return;const c=p.ciaza;const pr=c?clamp((S.day-c.s)/Math.max(.1,c.d-c.s),0,1):0;
 const st=pr<.3?0:pr<.5?1:pr<.7?2:pr<.88?3:4;const key=st?(u.win?'w':'n')+st:'';if(u.bK===key)return;u.bK=key;
 if(!st){u.torso.geometry=u.win&&u.gW?u.gW.t:u.gS.t;if(u.bC)Object.values(u.bC).forEach(g=>g.dispose());u.bC=null;return}
 u.bC=u.bC||{};if(!u.bC[key]){const base=u.win&&u.gW?u.gW.t:u.gS.t;u.bC[key]=rodBodyGeo(base,[0,.035,.06,.08,.1][st],u.win&&!!u.gW)}u.torso.geometry=u.bC[key]}
{const _pw=personWinter;personWinter=function(m,on){_pw(m,on);const u=m.userData;if(u&&u.bK){u.bK=null;const p=u.pp;if(p)rodBelly(m,p)}}}
let rodT=0;
{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);if(!S)return;rodT+=rdt;if(rodT<1.2)return;rodT=0;for(const p of S.people){if(p.sex!=='k'||p.age<16)continue;const m=pMesh[p.id];if(m&&(p.ciaza||m.userData.bK))try{rodBelly(m,p)}catch(e){}}}}
// zapis z dawnych wersji: brak pól oznacza brak ciąży; dzieci, które już są, liczą się matkom
// nowa gra: część kobiet jest już przy nadziei (na statku i w gotowej wsi epok II i III)
function rodSeed(){const ws=S.people.filter(w=>w.sex==='k'&&w.age>=18&&w.age<=38&&w.pair!==null&&!w.waitHome&&pById(w.pair)&&pById(w.pair).fam===w.fam&&!w.ciaza);if(!ws.length)return;
 const e1=S.day<1;const n=e1?Math.min(2,ws.length):Math.max(1,Math.round(ws.length*.25));ws.sort(()=>Math.random()-.5);const pick=ws.slice(0,n);
 pick.forEach(w=>{const pr=e1?.4+Math.random()*.45:Math.random()*.9;w.ciaza={s:S.day-pr*RD_CIAZA,d:S.day+(1-pr)*RD_CIAZA,n:1};if(pr>=.3)w.ciaza.ann=1});
 if(e1)log(pick.length>1?`Na statku dwie kobiety były już przy nadziei: ${pick[0].name} i ${pick[1].name}. Ich dzieci urodzą się na wyspie.`:`${pick[0].name} była na statku przy nadziei. Jej dziecko urodzi się na wyspie.`)}
{const _b=boot;boot=function(fresh){_b(fresh);try{if(S&&!S.demo){S.demo={y:{}};S.people.forEach(c=>{const mo=c.par&&pById(c.par[0]);if(mo&&mo.sex==='k')mo.dz=(mo.dz||0)+1});if(fresh||S.day<1)rodSeed()}
  if(S)S.people.forEach(c=>{if(c.par&&!c.gp){const g=[];c.par.forEach(id=>{const q=pById(id);if(q&&q.par)g.push(...q.par)});c.gp=g}})}catch(e){console.warn(e)}}}
window.__rod={rodStats,rodConc,rodChildRisk,rodPorod,rodSpace,rodHTML,RD_CIAZA,RD_POLOG};
