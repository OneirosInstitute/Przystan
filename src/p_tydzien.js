
/* ================= 2.8: Wyspa tygodnia — ta sama wyspa i wyzwanie dla wszystkich, wyniki na serwerze ================= */
const TYD_API=p=>new URL('api/'+p,location.href.replace(/[^/]*$/,'')).href;
let TYD=null,tydName='';try{tydName=localStorage.getItem('przystan-name')||''}catch(e){}
const tydRequests=new Set();
function tydAbort(){for(const controller of tydRequests)controller.abort()}
function tydFetch(p,opt){
 if(location.protocol==='file:'||!lifeCanRun())return Promise.reject(new Error('gra nieaktywna'));
 const controller=new AbortController();tydRequests.add(controller);
 const timeout=setTimeout(()=>controller.abort(),4000);
 return fetch(TYD_API(p),Object.assign({},opt||{},{signal:controller.signal,cache:'no-store'}))
  .then(response=>{if(!response.ok)throw new Error(response.status);return response.json()})
  .finally(()=>{clearTimeout(timeout);tydRequests.delete(controller)});
}
const tydScore=()=>!S?0:Math.min(200000,Math.round(S.day*10+S.people.length*25+(S.pam||0)*3+(S.hamlets||[]).reduce((a,h)=>a+h.pop,0)*10+(S.epoch===2?500:0)));
function tydWhen(d){const y=Math.floor(d/YEAR)+1,s=Math.floor((d%YEAR)/SD);return`rok ${y}, ${SEAS[s].toLowerCase()}`}
function tydRow(e,k){return`<li><b>${k+1}.</b> ${escapeHtml(e.name)}${e.vil?` <small>(${escapeHtml(e.vil)})</small>`:''}<span>${e.score} · ${tydWhen(e.day)} · ${e.pop} ${osb(e.pop)}</span></li>`}
// ekran startowy: karta wyspy tygodnia (pokazuje się tylko, gdy serwer odpowiada)
{const box=document.createElement('div');box.className='tydbox';box.hidden=true;const acts=document.querySelector('#intro .acts');if(acts)acts.parentNode.insertBefore(box,acts);
 const st=document.createElement('style');st.textContent=`.tydbox{margin:10px 0 6px;padding:10px 12px;border:1px solid #c9a66b66;border-radius:12px;background:#1e241f}.tydbox h4{margin:0 0 4px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold)}
 .tydbox p{margin:2px 0 6px;font-size:13.5px;color:var(--mut)}.tydbox b{color:var(--hi)}.tydbox .row{display:flex;gap:6px;align-items:center;margin:6px 0}.tydbox input{flex:1;min-width:0;padding:7px 9px;border-radius:8px;border:1px solid var(--line);background:#141915;color:var(--hi);font:14px var(--sans)}
 .tydbox ol{list-style:none;margin:6px 0 0;padding:0;font-size:13px}.tydbox li{display:flex;gap:6px;align-items:baseline;padding:2px 0;color:var(--hi)}.tydbox li span{margin-left:auto;color:var(--mut);font-size:12px;text-align:right}.tydbox li small{color:var(--mut)}`;document.head.appendChild(st);
 tydFetch('tydzien').then(w=>{TYD=w;return tydFetch('wyniki?week='+encodeURIComponent(w.week)).catch(()=>({list:[]}))}).then(r=>{if(!TYD)return;const w=TYD;const ch=CHAL[w.chal]||CHAL[0];
  box.innerHTML=`<h4>Wyspa tygodnia · ${w.week}</h4><p class="mut">Tabela deklarowanych wyników. Serwer nie weryfikuje lokalnej rozgrywki.</p><p>Wszyscy grają tę samą wyspę nr <b>${w.seed}</b>. Wyzwanie: <b>${ch[0]}</b>. ${ch[1]} Nowa wyspa w poniedziałek.</p>
   <div class="row"><input id="tydName" maxlength="24" placeholder="Twoje imię w tabeli" value="${escapeHtml(tydName)}"><button class="pri" id="tydGo">Zagraj</button></div>
   ${r.list&&r.list.length?`<ol>${r.list.slice(0,8).map(tydRow).join('')}</ol>`:'<p>Nikt jeszcze nie zagrał tej wyspy. Możesz być pierwszy.</p>'}`;box.hidden=false;
  box.querySelector('#tydGo').addEventListener('click',e=>{e.preventDefault();const nm=box.querySelector('#tydName').value.trim();try{localStorage.setItem('przystan-name',nm);localStorage.setItem('przystan-seed',String(w.seed));localStorage.setItem('przystan-chal',String(w.chal));localStorage.setItem('przystan-diff',String(w.diff||1));localStorage.setItem('przystan-fresh','1');localStorage.setItem('przystan-week',JSON.stringify({week:w.week,seed:w.seed}))}catch(er){}location.reload()})}).catch(()=>{})}
// nowa gra z wyspy tygodnia dostaje znacznik tygodnia
{const _fs=freshState;freshState=function(){const st=_fs();try{const o=JSON.parse(localStorage.getItem('przystan-week')||'null');if(o&&+o.seed===SEED){st.week=o.week;st.weekSeed=o.seed}localStorage.removeItem('przystan-week')}catch(e){}return st}}
// wynik wysyła się sam co porę roku; serwer trzyma najlepszy wynik każdego gracza
let tydSending=false;
async function tydSend(){if(!S||!S.week||tydSending)return;const state=S;tydSending=true;
 try{
  tydName=localStorage.getItem('przystan-name')||tydName;
  if(!state.weekRun){const run=await tydFetch('proba',{method:'POST'});if(S!==state)return;state.weekRun=run.token}
  const body={week:state.week,seed:state.weekSeed||SEED,token:state.weekRun,name:tydName||'Bezimienni',vil:state.vname||'',day:state.day,pop:state.people.length,pam:state.pam||0,hamPop:(state.hamlets||[]).reduce((sum,hamlet)=>sum+hamlet.pop,0),epoch:state.epoch||1,score:tydScore(),ver:GAME_VER};
  const response=await tydFetch('wynik',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(S===state&&response&&response.ok)state.weekRes={best:response.best,place:response.place,of:response.of,at:Math.floor(state.day)};
 }catch(error){if(S===state)state.weekS=-1}finally{tydSending=false}
}

let tydT=0;
{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);if(!S||!S.week)return;tydT+=rdt;if(tydT<5)return;tydT=0;const s=Math.floor(S.day/SD);if(S.weekS!==s){S.weekS=s;tydSend()}}}
{const _th=troubleHTML;troubleHTML=function(){const h=_th();if(!S||!S.week)return h;const r=S.weekRes;
  return`<div class="card"><h4>Wyspa tygodnia · ${S.week}</h4><p>Twój wynik teraz: <b>${tydScore()}</b>${r?` · najlepszy wysłany: ${r.best}, miejsce ${r.place} z ${r.of}`:''}.</p><p class="mut">Tabela deklaracji bez serwerowej weryfikacji rozgrywki. Wynik liczy dni na wyspie, ludzi, pamięć osady i przysiółki. Wysyła się sam na początku każdej pory roku.</p></div>`+h}}
window.__tyd={tydScore,tydSend,get TYD(){return TYD}};
