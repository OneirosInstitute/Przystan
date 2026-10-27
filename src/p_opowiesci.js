
/* ================= 4.9.0-rc.5 Wieczorna karta: opowieści czyta się w swoim tempie ================= */
// Gdy zapada noc (razem z przyciskiem „Przewiń noc”), czas staje i pokazuje się karta: rozmowy przy ogniu,
// to, co działo się dziś w osadzie, i nocne zdanie. Dotknięcie pokazuje następną stronę, ostatnie zamyka i czas rusza.
// Rano, jeśli komuś coś się przyśniło, sen pokazuje się tak samo. Wszystko zostaje też w Kronice („Wieczory przy ogniu”).
let rdPages=[],rdOpen=false,rdI=0,rdPrev=null,rdWant=false;
const rdEl=document.createElement('div');rdEl.id='rdCard';rdEl.hidden=true;rdEl.setAttribute('role','dialog');rdEl.setAttribute('aria-live','polite');document.body.appendChild(rdEl);
function rdOn(){try{const v=localStorage.getItem('przystan-wieczory');return v!=='0'}catch(e){return true}}
// sceny dnia: zapis, żeby wieczorem dało się je przeczytać w całości
{const _sb=scBubble;scBubble=function(p,txt){try{const d=Math.floor(S.day);if(!S.dzD||S.dzD.d!==d)S.dzD={d,L:[]};if(!S.dzD.L.includes(txt)){S.dzD.L.push(txt);if(S.dzD.L.length>6)S.dzD.L.shift()}}catch(e){}return _sb(p,txt)}}
function dzisLines(){const L=[];const d=Math.floor(S.day);if(S.dzD&&S.dzD.d===d)L.push(...S.dzD.L.slice(-3));
 try{const keep=S.day;S.day=keep+1;let W=[];try{W=wczorajLines()}finally{S.day=keep}for(const t of W){if(L.length>=5)break;if(!L.some(x=>x.slice(0,30)===t.slice(0,30)))L.push(t)}}catch(e){}return L}
function rdQueue(pages){if(!pages.length)return;rdPages.push(...pages);rdWant=true}
function rdShow(){const p=rdPages[rdI];if(!p){rdClose();return}const last=rdI>=rdPages.length-1;
 const body=p.talk?p.L.map(x=>`<p class="rq">„${escapeHtml(x[0])}”<span>${escapeHtml(x[1])}</span></p>`).join(''):p.L.map(x=>`<p class="rn">${escapeHtml(x)}</p>`).join('');
 const dots=rdPages.length>1?`<span class="rdots">${rdPages.map((_,k)=>`<i class="${k===rdI?'on':''}"></i>`).join('')}</span>`:'';
 rdEl.innerHTML=`<div class="rh"><b>${escapeHtml(p.h)}</b>${p.sub?`<small>${escapeHtml(p.sub)}</small>`:''}</div><div class="rb">${body}</div><div class="rf">${dots}<span class="rt">${last?'Dotknij, by zamknąć':'Dotknij, by czytać dalej'}</span></div>`;
 rdEl.classList.remove('in');void rdEl.offsetWidth;rdEl.classList.add('in')}
function rdStart(){if(rdOpen||!rdPages.length||!S)return;rdOpen=true;rdWant=false;rdI=0;rdPrev=S.speed;if(S.speed>0){setSpeed(0);try{renderTop()}catch(e){}}document.body.classList.add('reading');rdEl.hidden=false;rdShow()}
function rdClose(){rdOpen=false;rdPages=[];rdI=0;rdEl.hidden=true;document.body.classList.remove('reading');if(S&&S.speed===0&&rdPrev&&!evOpen){setSpeed(rdPrev);try{renderTop()}catch(e){}}rdPrev=null}
// 4.9.0-rc.13: zapis w chwili, gdy karta wieczoru wstrzymała czas, zapamiętuje tempo sprzed karty (po wczytaniu gra nie stoi bez powodu)
{const _ss=serializeSave;serializeSave=function(){if(rdOpen&&rdPrev&&S&&S.speed===0){S.speed=rdPrev;try{return _ss()}finally{S.speed=0}}return _ss()}}
rdEl.addEventListener('click',e=>{e.stopPropagation();if(!rdOpen)return;rdI++;if(rdI>=rdPages.length)rdClose();else rdShow()});
rdEl.addEventListener('pointerdown',e=>e.stopPropagation());
// składanie wieczoru: wszystko naraz, gdy zapada noc
wTick=function(){if(!S||!S.people.length)return;const t=tod(),d=Math.floor(S.day);
 if(t>=T1-.01&&S.czTalkD!==d&&!evOpen){S.czTalkD=d;S.nocD=d;const L=wieczorLines(),h=wieczorPlace(),n=nocLine(),dz=dzisLines();if(L.length||n)wArchive({d,h,L,n});
  if(rdOn()){const P=[];if(L.length)P.push({h:'Wieczór',sub:h,L,talk:1});if(dz.length)P.push({h:'Dziś w osadzie',L:dz});if(n)P.push({h:'Nocą',L:[n]});rdQueue(P)}return}
 if(t>=T0&&t<T0+.12&&S.ranoD!==d&&d>0){S.ranoD=d;const s=senCheck();if(s&&rdOn())rdQueue([{h:'Sen',L:[s]}])}};
// stare, krótkie dymki u dołu ekranu już nie są potrzebne
czTalkTick=function(){if(typeof czTalk!=='undefined'&&czTalk)czTalk.classList.remove('on');wQ=null;if(rdWant&&!rdOpen&&S&&!evOpen&&$('sheet').hidden)rdStart()};
// przewijanie nocy nie gasi się, gdy czas stoi dla czytania
{const _ne=nocEnd;nocEnd=function(){if(rdOpen&&nocSkip)return;return _ne()}}
// przełącznik w Kronice
{const _kt=kronTools;kronTools=function(){const on=rdOn();return`<p class="mut" style="margin:6px 0 10px">Wieczorne opowieści na ekranie: <button data-rdtog="1" style="padding:4px 10px">${on?'pokazuj (włączone)':'nie pokazuj (wyłączone)'}</button></p>`+_kt()}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-rdtog]');if(!b)return;const on=rdOn();try{localStorage.setItem('przystan-wieczory',on?'0':'1')}catch(er){}b.textContent=!on?'pokazuj (włączone)':'nie pokazuj (wyłączone)';toast(!on?'Wieczorne opowieści będą się pokazywać, gdy zapada noc.':'Wieczorne opowieści zostaną tylko w Kronice.')});
{const st=document.createElement('style');st.textContent=`
#rdCard{position:absolute;left:12px;right:12px;bottom:calc(96px + var(--safe-bottom));z-index:6;max-width:560px;margin:0 auto;max-height:min(62vh,560px);overflow:auto;
 background:#141c18f2;border:1px solid #c9a66b88;border-radius:16px;padding:14px 16px 12px;box-shadow:0 10px 34px #000b;cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:pan-y}
#rdCard[hidden]{display:none}
#rdCard .rh{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;border-bottom:1px solid #c9a66b33;padding-bottom:8px;margin-bottom:8px}
#rdCard .rh b{font-family:var(--serif);font-size:21px;color:var(--gold2,#e0c080)}#rdCard .rh small{font-size:13.5px;color:var(--mut)}
#rdCard .rq{font-family:var(--serif);font-size:17px;line-height:1.42;color:#ece4d0;margin:8px 0}#rdCard .rq span{display:block;font-family:var(--sans);font-size:13px;color:#b9b09a;margin-top:2px}
#rdCard .rn{font-family:var(--serif);font-size:17px;line-height:1.45;color:#ece4d0;margin:8px 0}
#rdCard .rf{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:10px;color:var(--mut);font-size:12.5px}
#rdCard .rdots{display:flex;gap:6px}#rdCard .rdots i{width:7px;height:7px;border-radius:50%;background:#c9a66b44}#rdCard .rdots i.on{background:var(--gold)}
#rdCard .rt{margin-left:auto}
@media (prefers-reduced-motion:no-preference){#rdCard.in{animation:rdIn .35s ease-out}}
@keyframes rdIn{from{transform:translateY(6px)}to{transform:none}}
body.reading #scBub{display:none}`;document.head.appendChild(st)}
window.__rd={rdQueue,rdStart,rdClose,dzisLines,get open(){return rdOpen},get pages(){return rdPages}};
