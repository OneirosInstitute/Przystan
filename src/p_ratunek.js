// ================= 1.7.2 Ratunek: nikt nie stoi bez powodu, czas stoi widać =================
function foodEmerg(){return czNeedDays()<3||(S.hungerDays||0)>0}
// odpoczywają naprawdę chorzy; gdy brakuje jedzenia, słabsi też idą zbierać
function restNow(p){if(!S||!law('odpoczynek')||p.job==='wyp')return false;if(p.hp<.28)return true;if(p.ill&&p.hp<.45)return true;return p.hp<.5&&!foodEmerg()}
function restSpot(p){const h=homeOf(p);let t;if(h&&bDone(h)){t=entryOf(h.kind,h.i,h.j);p.act='leży w domu, wraca do zdrowia'}else{t=nearestWalk(camp.i+(p.id%3)-1,camp.j+1+(p.id%2));p.act='leży przy ognisku, wraca do zdrowia'}
 const[pi,pj]=tileOf(p.x,p.z);if(!t||Math.hypot(t[0]-pi,t[1]-pj)<=1.5){p.state='idle';p.wait=6;return}if(!go(p,t,'idle',null)){p.state='idle';p.wait=6}}

// prace we wsi: najpierw jedzenie, opiekunów nie więcej niż trzeba
{const _cc=choreCands;choreCands=function(p){let C=_cc(p);const emerg=foodEmerg();
  if(emerg){C=C.filter(c=>c[0]!=='opieka'||S.people.some(q=>q!==p&&q.fam===p.fam&&q.hp<.3));C.forEach(c=>{if(c[0]==='zbior'||c[0]==='ryby')c[1]*=2.5})}
  const sick=S.people.filter(q=>q.hp<.6&&q.job!=='wyp').length,car=S.people.filter(q=>q!==p&&q.chK==='opieka'&&q.state!=='sleep').length;
  if(car>=Math.ceil(sick/3)&&p.chK!=='opieka')C=C.filter(c=>c[0]!=='opieka');
  return C.sort((a,b)=>b[1]-a[1])}}
// gdy nic pilnego nie wyszło: zawsze jest co zbierać albo nosić
{const _cj=choreJob;choreJob=function(p){if(_cj(p))return true;if(!S||!isWorker(p)||!isFree(p)||!isWork())return false;
  for(const k of ['zbior','chrust','ryby'])if(choreDo(p,k))return true;p.act='odpoczywa, nic pilnego';return false}}
// pracownicy warsztatu bez roboty (brak zasobów, pole czeka) też idą do prac we wsi
{const _pj=planJob;planJob=function(p){const r=_pj(p);if(r||!S||p.job!=='wb'||!isAdult(p)||!isWork()||p.fireB||restNow(p))return r;
  const why=p.act||'';if(!/brak zasobów|czeka na siew|brak ziarna|w ruinie|ugór/.test(why))return r;
  const C=choreCands(p);for(const k of C.map(c=>c[0]).concat(['zbior','chrust','ryby'])){p.limC=true;if(choreDo(p,k)){p.act=why.split(',')[0]+': '+p.act;return true}}p.limC=false;return r}}

// karta człowieka: dlaczego słabnie
function weakWhy(p){const W=[];if(p.ill)W.push('choroba');if(fedOf(p)<.999)W.push('głód');if(p.warm!==undefined&&p.warm<.6)W.push('zimno');if((S.thirst||0)>0)W.push('brak czystej wody');if(p.hurt)W.push('rana');if((S.variety||0)<=1)W.push('jednostajne jedzenie');return W}
{const _lc=ludCard;ludCard=function(p){let h=_lc(p);if(p.hp<.6){const w=weakWhy(p);h=`<p class="no">Słabnie (zdrowie ${Math.round(p.hp*100)}%)${w.length?': '+w.join(', '):''}.${restNow(p)?' Leży, bo chorzy odpoczywają.':''}</p>`+h}return h}}
// górna linia: zamiast ogólnych „chorób” liczba słabych
{const _ct=czThreats;czThreats=function(){return _ct().map(x=>x[0]==='choroby'?[`słabi: ${S.people.filter(p=>p.hp<.45).length}`,x[1],x[2]]:x)}}
// Ludzie: karta słabych z przyczynami
{const _th=troubleHTML;troubleHTML=function(){const weak=S?S.people.filter(p=>p.hp<.45&&p.job!=='wyp'):[];if(weak.length<2)return _th();
  const cnt={};weak.forEach(p=>weakWhy(p).forEach(w=>cnt[w]=(cnt[w]||0)+1));const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1]);const lying=weak.filter(restNow).length;
  const tip={'głód':'więcej zbieraczy, rybaków i myśliwych','choroba':'zioła, zielarka, studnia, świeże jagody','zimno':'opał i dachy','brak czystej wody':'studnia','rana':'zioła i odpoczynek','jednostajne jedzenie':'różne rodzaje jedzenia'};
  return`<div class="card" style="border-color:var(--bad)"><div class="cz-ey">Słabi ludzie</div><h4>${weak.length} ${weak.length<5?'osoby słabną':'osób słabnie'}</h4><p>${top.length?'Przyczyny: '+top.map(([w,n])=>`${w} (${n})`).join(', ')+'.':''}${lying?` Leży i nie pracuje: ${lying}.`:''}</p>${top.length?`<p class="mut">Pomoże: ${top.slice(0,2).map(([w])=>tip[w]).join('; ')}.</p>`:''}</div>`+_th()}}

// czas stoi: wyraźnie i jednym dotknięciem w ruch
{const st=document.createElement('style');st.textContent=`#cz-tempo.stop{border-color:var(--gold);color:var(--gold);animation:czp2 2s ease-out infinite}@keyframes czp2{0%{box-shadow:0 0 0 0 #c9a66b88}80%{box-shadow:0 0 0 10px #c9a66b00}}`;document.head.appendChild(st)}
let czLastSp=1;
{const _ss=setSpeed;setSpeed=function(v){if(S&&S.speed>0)czLastSp=S.speed;_ss(v)}}
$('cz-tempo').addEventListener('click',e=>{if(!S||S.speed!==0||!$('sheet').hidden||!$('ev').hidden)return;e.stopImmediatePropagation();document.body.classList.remove('czpop');czPaused=null;setSpeed(czLastSp||1);renderTop()},true);
{const _rt=renderTop;renderTop=function(){_rt();if(!S)return;const t=$('cz-tempo');if(!t)return;const stop=S.speed===0&&$('sheet').hidden;t.classList.toggle('stop',stop);
  if(stop)setH(t,`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5l12 7-12 7z"/></svg>czas stoi`)}}
window.__rat={restNow,foodEmerg,weakWhy};

// ---------- wrak: dojście z innej strony, gdy stanowisko zastawione; pierwszeństwo przed oznaczeniami ----------
let wreckAlt=null;
function goWreck(p){if(go(p,wreck.stand,'wreck',null))return true;
 if(wreckAlt&&walk[wreckAlt[1]*N+wreckAlt[0]]&&go(p,wreckAlt,'wreck',null))return true;
 const c=[];for(let r=1;r<=7;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=wreck.stand[0]+dx,y=wreck.stand[1]+dy;if(x<0||y<0||x>=N||y>=N||!walk[y*N+x])continue;c.push([x,y,Math.hypot(x-wreck.i,y-wreck.j)])}
 c.sort((a,b)=>a[2]-b[2]);for(const t of c.slice(0,10)){if(go(p,[t[0],t[1]],'wreck',null)){wreckAlt=[t[0],t[1]];return true}}return false}
function wreckCrew(){return S.people.filter(q=>(q.state==='work'&&q.workKind==='wreck')||(q.state==='move'&&q.after==='wreck')).length}
{const _pj=planJob;planJob=function(p){
  if(S&&S.wreck&&!p.fireB&&p.state!=='away'&&isAdult(p)&&isWorker(p)&&(p.job==='rob'||p.job==='bud'||!p.job)&&isWork()&&!restNow(p)&&wreckTodo()){
   const t=tod(),meal=t>=.49&&t<.52,W=S.wreck,left=YEAR-5-S.day;
   const pri=W.target>=0||(S.wreckRush&&S.day<S.wreckRush)||left<3;
   const marks=S.mark&&Object.keys(S.mark).length>0;
   if(!meal&&(pri?wreckCrew()<10:(marks&&wreckCrew()<4))&&goWreck(p)){p.act='przy wraku';return true}}
  return _pj(p)}}
