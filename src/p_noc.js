
/* ================= 2.6: przewiń noc ================= */
const nocB=document.createElement('button');nocB.id='skipN';nocB.type='button';nocB.hidden=true;document.body.appendChild(nocB);
{const st=document.createElement('style');st.textContent=`#skipN{position:absolute;right:12px;top:calc(60px + env(safe-area-inset-top,0px));z-index:4;height:38px;padding:0 14px;border-radius:19px;border:1px solid #c9a66b88;background:#18201cd9;color:var(--hi);font:600 14px var(--sans);display:flex;align-items:center;gap:7px;box-shadow:0 2px 10px #0006}
#skipN svg{width:16px;height:16px}#skipN.on{border-color:var(--gold);color:var(--gold)}#skipN[hidden]{display:none}
body:not(.cz) #skipN{top:auto;bottom:calc(84px + env(safe-area-inset-bottom,0px))}body.placing #skipN{display:none}`;document.head.appendChild(st)}
const isNight=()=>{const t=tod();return t>=T1-.01||t<T0-.015};
let nocSkip=null;
function nocStart(){if(!S||nocSkip||!isNight())return;nocSkip={prev:S.speed>0?S.speed:1,d0:Math.floor(S.day+(tod()>=T1-.01?1:0))};setSpeed(40);nocUI()}
function nocEnd(){if(!nocSkip)return;const p=nocSkip.prev;nocSkip=null;if(typeof czPaused!=='undefined'&&czPaused===40)czPaused=p;if(evOpen&&evOpen.prev===40)evOpen.prev=p;if(S&&S.speed>0)setSpeed(p);nocUI()}
function nocUI(){if(!S){nocB.hidden=true;return}const show=!!nocSkip||(isNight()&&$('sheet').hidden&&!evOpen&&!placing);nocB.hidden=!show;if(!show)return;
 const h=nocSkip?`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/></svg>Świta…`
  :`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>Przewiń noc`;
 if(nocB._h!==h){nocB._h=h;nocB.innerHTML=h}nocB.classList.toggle('on',!!nocSkip)}
nocB.addEventListener('click',e=>{e.stopPropagation();if(nocSkip)nocEnd();else nocStart()});
let nocT=0;
{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);nocT+=rdt;if(nocT<.25)return;nocT=0;if(!S)return;
  if(nocSkip){const t=tod();if((Math.floor(S.day)>=nocSkip.d0&&t>=T0&&t<T1-.05)||S.speed===0&&!evOpen)nocEnd()}nocUI()}}
window.__noc={nocStart,nocEnd,isNight};
// ---------- 3.0.1: po wyjściu z menu gra zawsze rusza ----------
{const _cs=closeSheet;closeSheet=function(){const want=(typeof czPaused!=='undefined'&&czPaused)||(typeof czLastSp!=='undefined'&&czLastSp)||1;_cs();
  if(S&&S.speed===0&&!evOpen&&!placing){setSpeed(want);if(typeof czPaused!=='undefined')czPaused=null;renderTop()}}}
// zwinięty panel: patrzymy na wyspę, więc czas płynie; rozwinięty znów zatrzymuje
$('smin').addEventListener('click',()=>{if(!S||$('sheet').hidden)return;const min=$('sheet').classList.contains('min');
 if(min){if(S.speed===0&&!evOpen){setSpeed((typeof czPaused!=='undefined'&&czPaused)||(typeof czLastSp!=='undefined'&&czLastSp)||1);if(typeof czPaused!=='undefined')czPaused=null}}
 else if(czOn&&S.speed>0){czPaused=S.speed;setSpeed(0)}renderTop()});
// przycisk zamknięcia był podpięty do pierwotnej funkcji, z pominięciem wznowienia czasu
$('sclose').addEventListener('click',e=>{e.stopImmediatePropagation();closeSheet()},true);
