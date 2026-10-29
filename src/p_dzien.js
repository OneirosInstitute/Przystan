
/* ================= 4.9.0-rc.21 Jedno okno na koniec dnia, jedno po nocy ================= */
// Decyzja z 29.10.2026: zamiast trzech kart wieczorem (rozmowy, „Dziś w osadzie”, „Nocą”) i czwartej rano jest jedno okno
// na koniec dnia: od 1 do 5 rzeczy z przebiegu dnia, więcej, gdy działo się coś ważnego, mniej w zwyczajny dzień.
// Rano okno pokazuje się tylko wtedy, gdy w nocy coś się wydarzyło albo ktoś chce opowiedzieć sen. Sny prorocze są rzadkie.
const DZ_MAX=5,SEN_GAP=8,SEN_P=.07,NOC_P=.1;
// ważne wpisy kroniki, które mogą trafić do porannego okna
// narodziny i śmierć trafiają do wieczornego podsumowania, rano tylko to, co dzieje się nocą
const NOC_RX=/wilk|wilki|dziki (?:w|zryły)|lisy? |pożar|płonie|sztorm|zagryzły|ukradł|złodziej|uciekła z/i;
// wieczór: najpierw ważne wydarzenia dnia, potem jedna lub dwie wypowiedzi przy ogniu, potem drobne sceny, razem najwyżej 5
function dzItems(L,imp,scenes){const out=[];
 for(const t of imp){if(out.length>=3)break;out.push({n:t})}
 // rozmowy: najwyżej dwie wypowiedzi (wymiana dwóch osób zostaje cała)
 const maxTalk=2;let q=0;for(const x of L){if(q>=maxTalk||out.length>=DZ_MAX)break;out.push({q:x});q++}
 const room=imp.length?DZ_MAX:Math.min(DZ_MAX,out.length+1);for(const t of scenes){if(out.length>=room)break;if(out.some(o=>o.n&&o.n.slice(0,28)===t.slice(0,28)))continue;out.push({n:t})}
 return out}
// ważne wydarzenia dnia; to samo zdanie (np. codzienny połów tej samej osoby) wraca najwcześniej po 3 dniach, ślub tylko raz
function dzImportant(){const keep=S.day,d=Math.floor(keep);let W=[];try{S.day=keep+1;W=wczorajLines()}catch(e){W=[]}finally{S.day=keep}
 S.dzSeen=(S.dzSeen||[]).filter(x=>d-x[0]<3);const out=[],pairs=new Set();
 for(const t of W){const m=/^(.+) i (.+) są po ślubie\.$/.exec(t)||/^(\S+) (?:pokłócił|pokłóciła|pogodził|pogodziła) się z: (\S+)\.$/.exec(t);if(m){const k=(/ślub/.test(t)?'s':/pokłóci/.test(t)?'k':'z')+[m[1],m[2]].sort().join('|');if(pairs.has(k))continue;pairs.add(k)}
  if(S.dzSeen.some(x=>x[1]===t&&x[0]<d))continue;out.push(t)}
 for(const t of out)if(!S.dzSeen.some(x=>x[1]===t))S.dzSeen.push([d,t]);if(S.dzSeen.length>30)S.dzSeen.splice(0,S.dzSeen.length-30);return out}
function dzScenes(){const d=Math.floor(S.day);return S.dzD&&S.dzD.d===d?S.dzD.L.slice(-3):[]}
// rano: sen (rzadko), sen, który się sprawdził, i to, co wydarzyło się w nocy
function ranoItems(){const out=[];const s=senCheck();if(s)out.push({n:s});
 if(S.nocSen){out.push({n:S.nocSen});S.nocSen=null}
 const mark=S.nocMark;if(mark!==undefined){let k=0;for(const l of S.log){if(l===mark||k++>40)break;const t=l.t.split('. ')[0].replace(/\.$/,'')+'.';if(NOC_RX.test(t)&&!/^Wspomnienie/.test(t)&&!out.some(o=>o.n===t))out.push({n:t,ev:1});if(out.length>=3)break}}
 const night=out.filter(o=>o.ev);if(night.length>1){const rest=out.filter(o=>!o.ev);out.length=0;out.push(...rest,...night.reverse())}
 const d=Math.floor(S.day);S.dzSeen=S.dzSeen||[];for(const o of night)S.dzSeen.push([d-1,o.n]);// jakby z wczoraj: wieczór już tego nie powtórzy
 if(!out.length&&S.nocLine&&Math.random()<NOC_P)out.push({n:S.nocLine});S.nocLine=null;S.nocMark=undefined;return out}
// sen prorocy: najwyżej raz na kilka dni i rzadko
// nocne zdanie zostaje tekstem; sen poznaje się po tym, że S.senLast to dzisiejszy dzień
{const _nl=nocLine;nocLine=function(){const d=Math.floor(S.day);
  if(!S.sen&&d-(S.senLast??-99)>=SEN_GAP&&Math.random()<SEN_P){const s=senPick();if(s){S.sen={d,a:s.A.id,k:s.k,v:s.v};S.senLast=d;return s.txt}}
  const old=S.sen;if(!old)S.sen={d:-1,a:-1,k:'blok'};try{return _nl()}finally{if(!old)S.sen=null}}}
const nocIsSen=()=>S.senLast===Math.floor(S.day)&&!!S.sen&&S.sen.d===Math.floor(S.day);
function rdShow(){const p=rdPages[rdI];if(!p){rdClose();return}
 const items=p.items||(p.L||[]).map(x=>Array.isArray(x)?{q:x}:{n:x});
 const body=items.map(x=>x.q?`<p class="rq">„${escapeHtml(x.q[0])}”<span>${escapeHtml(x.q[1])}</span></p>`:`<p class="rn">${escapeHtml(x.n)}</p>`).join('');
 rdEl.innerHTML=`<div class="rh"><b>${escapeHtml(p.h)}</b>${p.sub?`<small>${escapeHtml(p.sub)}</small>`:''}</div><div class="rb">${body}</div><div class="rf"><span class="rt">Dotknij, by zamknąć</span></div>`;
 rdEl.classList.remove('in');void rdEl.offsetWidth;rdEl.classList.add('in')}
wTick=function(){if(!S||!S.people.length)return;const t=tod(),d=Math.floor(S.day);
 if(t>=T1-.01&&S.czTalkD!==d&&!evOpen){S.czTalkD=d;S.nocD=d;const L=wieczorLines(),h=wieczorPlace(),imp=dzImportant(),sc=dzScenes();
  const n=nocLine(),sen=!!n&&nocIsSen();S.nocMark=S.log[0];S.nocLine=sen?null:n;S.nocSen=sen?n:null;
  const items=dzItems(L,imp,sc);if(L.length||n)wArchive({d,h,L,n});
  if(rdOn()&&items.length)rdQueue([{h:'Wieczór',sub:h,items}]);return}
 if(t>=T0&&t<T0+.12&&S.ranoD!==d&&d>0){S.ranoD=d;const items=ranoItems();if(items.length&&rdOn())rdQueue([{h:'Ranek',items}])}};
window.__dzien={dzItems,ranoItems,nocIsSen,DZ_MAX};
