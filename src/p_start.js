
/* ================= 4.9.0-rc.4 Ekran startowy: żywa wyspa i wycinanka ================= */
// Tłem jest prawdziwa wyspa (kamera krąży nad wrakiem). Na górze herb jak dwuwarstwowa wycinanka:
// łódź, z której zamiast masztu wyrasta drzewo, i dwa ptaki. Na dole jeden przycisk, a reszta w „Inne początki”.
function wycSVG(){const R=(r,n,a0)=>{let d='';for(let k=0;k<n;k++){const a=a0+k/n*6.2832,b=a0+(k+.5)/n*6.2832,c=a0+(k+1)/n*6.2832;
  const p=(ang,rad)=>`${(Math.cos(ang)*rad).toFixed(2)},${(Math.sin(ang)*rad).toFixed(2)}`;d+=(k?'':'M'+p(a,r))+` Q${p(b,r*1.09)} ${p(c,r)}`}return d+'Z'};
 let holes='';for(let k=0;k<24;k++){const a=k/24*6.2832,x=Math.cos(a)*79,y=Math.sin(a)*79;holes+=`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="2.6" ry="5.4" transform="rotate(${(a*57.3+90).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`}
 let dots='';for(let k=0;k<12;k++){const a=(k+.5)/12*6.2832;dots+=`<circle cx="${(Math.cos(a)*86).toFixed(1)}" cy="${(Math.sin(a)*86).toFixed(1)}" r="2"/>`}
 const leaf=(x,y,r,s)=>`<ellipse cx="${x}" cy="${y}" rx="${s*4.2}" ry="${s*10}" transform="rotate(${r} ${x} ${y})"/>`;
 const bird=`<path d="M-16,2 C-10,-8 4,-9 9,-3 L15,-5 L11,-1 C12,4 6,9 -4,8 C-10,8 -14,6 -16,2 Z"/><path d="M-15,1 L-27,-9 L-24,0 L-28,7 Z"/>`;
 return`<svg class="st-emb" viewBox="-104 -104 208 208" aria-hidden="true">
 <defs><filter id="stPaper" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="3" stdDeviation="3.5" flood-color="#000" flood-opacity=".45"/></filter></defs>
 <g filter="url(#stPaper)"><path d="${R(97,24,0)}" fill="#3f6a49"/><path d="${R(90,24,.13)}" fill="#efe5cf"/></g>
 <g fill="#3f6a49">${holes}${dots}</g><circle r="70" fill="none" stroke="#3f6a49" stroke-width="2.4"/><circle r="64" fill="none" stroke="#3f6a49" stroke-width="1" stroke-dasharray="2 3.2"/>
 <g fill="#3f6a49">
  <path d="M-40,26 L40,26 L31,39 Q0,44 -31,39 Z"/><path d="M-46,48 q6,-5 12,0 t12,0 t12,0 t12,0 t12,0 t12,0 t12,0" fill="none" stroke="#3f6a49" stroke-width="2.6"/>
  <path d="M-38,55 q6,-4 12,0 t12,0 t12,0 t12,0 t12,0 t12,0" fill="none" stroke="#3f6a49" stroke-width="1.6" opacity=".7"/>
  <rect x="-2.4" y="-40" width="4.8" height="67" rx="1.5"/>
  ${leaf(-11,14,-52,1)}${leaf(11,14,52,1)}${leaf(-10,-4,-40,.95)}${leaf(10,-4,40,.95)}${leaf(-8,-21,-30,.8)}${leaf(8,-21,30,.8)}
  <path d="M0,-58 C-9,-52 -11,-44 -6,-38 C-3,-42 -1,-43 0,-38 C1,-43 3,-42 6,-38 C11,-44 9,-52 0,-58 Z"/>
  <g transform="translate(-34,-9) scale(-.95,.95)">${bird}</g><g transform="translate(34,-9) scale(.95)">${bird}</g>
 </g>
 <g fill="#b23b2e"><path d="M0,-55 C-4,-51 -5,-47 -3,-43 C-1,-45 1,-45 3,-43 C5,-47 4,-51 0,-55 Z"/><circle cx="-38.5" cy="-11.3" r="1.7"/><circle cx="38.5" cy="-11.3" r="1.7"/>
  <circle cy="33" r="3"/><circle cx="-18" cy="33" r="2.2"/><circle cx="18" cy="33" r="2.2"/></g>
 <g fill="#efe5cf"><circle cx="-40.2" cy="-12" r=".8"/><circle cx="40.2" cy="-12" r=".8"/></g></svg>`}
function stSaveInfo(){try{const raw=localStorage.getItem(SAVEKEY);if(!raw)return null;const s=JSON.parse(raw);const d=Math.max(1,Math.floor(s.day||1)),y=Math.floor((d-1)/YEAR)+1,r=(d-1)%YEAR;
  const n=(s.people||[]).length,hs=(s.hamlets||[]).reduce((a,h)=>a+(h.pop||0),0);const q=(s.wArch||[]).slice().reverse().find(o=>o&&o.L&&o.L.length);const line=q?q.L[(d*7)%q.L.length]:null;
  return{y,sea:SEAS[Math.floor(r/SD)].toLowerCase(),n,hs,name:s.vname||'Przystań',ep:s.epoch||1,line}}catch(e){return null}}
{const intro=$('intro');if(intro){const has=(()=>{try{return!!localStorage.getItem(SAVEKEY)}catch(e){return false}})();const info=has?stSaveInfo():null;
 const old=intro.querySelector('.box'),acts=intro.querySelector('.acts');const keep=id=>$(id);
 const top=document.createElement('div');top.className='st-top';top.innerHTML=wycSVG()+`<h1 class="st-title">Przystań</h1><p class="st-sub">Ocalić to, co umiemy. Zbudować dom.</p>`;
 const bot=document.createElement('div');bot.className='st-bot';
 if(info){const ep=['','','epoka II','epoka III','epoka IV'][info.ep]||'';bot.insertAdjacentHTML('beforeend',`<div class="st-save"><div class="st-when">${escapeHtml(info.name)} · rok ${info.y}, ${info.sea}${ep?' · '+ep:''}</div><div class="st-who">${info.n} ${osb(info.n)}${info.hs?` · w przysiółkach ${info.hs}`:''}</div>${info.line?`<p class="st-q">„${escapeHtml(info.line[0])}”<span>${escapeHtml(info.line[1])}, przy ogniu</span></p>`:''}</div>`)}
 else bot.insertAdjacentHTML('beforeend',`<p class="st-story">Statek rozbił się o skały u brzegu nieznanej wyspy. Osiemnaście osób wyszło na piasek. Wrak da deski i gwoździe, ale tylko raz. Resztę trzeba umieć.</p>`);
 const go=keep('go'),goNew=keep('goNew'),goInst=keep('goInstall');bot.appendChild(go);
 const row=document.createElement('div');row.className='st-row';if(goNew)row.appendChild(goNew);const mb=document.createElement('button');mb.className='st-mb';mb.type='button';mb.textContent='Inne początki';row.appendChild(mb);bot.appendChild(row);
 const more=document.createElement('div');more.className='st-more';more.hidden=true;
 // wszystko, co inne moduły dołożyły przy przyciskach, idzie do „Inne początki”
 const box=old&&old.querySelector('.txt');if(box){box.querySelectorAll('.diffsel,.newset,.tydbox').forEach(n=>more.appendChild(n))}
 if(acts){[...acts.children].forEach(n=>{if(n!==go&&n!==goNew)more.appendChild(n)})}if(goInst)more.appendChild(goInst);
 bot.appendChild(more);const foot=document.createElement('small');foot.className='st-foot';foot.textContent='Wersja '+GAME_VER+' · spokojna gra o rozbitkach i słowiańskiej wsi';bot.appendChild(foot);
 mb.addEventListener('click',()=>{more.hidden=!more.hidden;mb.classList.toggle('on',!more.hidden);if(!more.hidden)setTimeout(()=>more.scrollIntoView({block:'nearest',behavior:'smooth'}),30)});
 if(more.querySelector('details[open]')||(typeof freshFlag!=='undefined'&&freshFlag)){more.hidden=false;mb.classList.add('on')}
 const pic=document.createElement('div');pic.id='introPic';pic.hidden=true;
 if(old)old.remove();intro.classList.add('st2');intro.append(top,bot,pic);
 // kamera: bliżej wraku i wolniej, z lekkim kołysaniem wysokości
 setTimeout(()=>{try{if(!S){const w=wreck&&wreck.i?wreck:camp;camT.x=(tcx(w.i)*2+tcx(camp.i))/3;camT.z=(tcx(w.j)*2+tcx(camp.j))/3;zoom=zoomT=1.35;setCam()}}catch(e){}},0)}}
{const st=document.createElement('style');st.textContent=`
#intro.st2{display:flex;flex-direction:column;justify-content:space-between;align-items:center;padding:calc(18px + env(safe-area-inset-top)) 18px calc(14px + env(safe-area-inset-bottom));
 background:linear-gradient(to bottom,#0a1210d9 0%,#0a121066 22%,#0a121000 40%,#0a121000 52%,#0a1210b3 70%,#0a1210f2 100%);overflow:auto}
#intro.st2 .st-top{display:flex;flex-direction:column;align-items:center;text-align:center;max-width:460px;width:100%}
#intro.st2 .st-emb{width:min(46vw,190px);height:auto;margin-top:2px}
#intro.st2 .st-title{font-family:var(--serif);font-weight:700;font-size:clamp(50px,14vw,82px);line-height:.95;margin:6px 0 0;color:#f3ead6;letter-spacing:.01em;text-shadow:0 2px 22px #000b,0 1px 2px #0008}
#intro.st2 .st-sub{font-family:var(--serif);font-weight:500;font-size:clamp(17px,4.6vw,21px);color:#e9dfc8;margin:8px 0 0;text-shadow:0 1px 10px #000c}
#intro.st2 .st-bot{width:100%;max-width:420px;display:flex;flex-direction:column;gap:10px;align-items:stretch}
#intro.st2 .st-story{font-family:var(--serif);font-size:16.5px;line-height:1.4;color:#e4dccb;margin:0 0 4px;text-align:center;text-shadow:0 1px 8px #000d}
#intro.st2 .st-save{text-align:center;color:#e4dccb;text-shadow:0 1px 8px #000d}
#intro.st2 .st-when{font-family:var(--serif);font-weight:700;font-size:20px;color:#f3ead6}
#intro.st2 .st-who{font-size:14px;color:#c9c1ae;margin-top:2px}
#intro.st2 .st-q{font-family:var(--serif);font-size:15.5px;line-height:1.38;color:#e9e0cb;margin:10px 4px 2px}#intro.st2 .st-q span{display:block;font-family:var(--sans);font-size:12.5px;color:#b7ae98;margin-top:3px}
#intro.st2 #go{background:#efe5cf;color:#18211c;border:0;border-radius:12px;padding:15px 12px;font-family:var(--serif);font-weight:700;font-size:21px;box-shadow:0 6px 24px #0008}
#intro.st2 #go:active{transform:translateY(1px)}
.st-row{display:flex;justify-content:center;gap:8px;flex-wrap:wrap}
.st-row button{background:#0e1613b3;border:1px solid #efe5cf55;color:#efe5cf;border-radius:10px;padding:9px 14px;font-size:15px}
.st-row .st-mb.on{border-color:#efe5cf;background:#1c2621e6}
#intro.st2 .st-more[hidden]{display:none}
#intro.st2 .st-more{background:#0d1512eb;border:1px solid #efe5cf33;border-radius:14px;padding:12px 14px;display:flex;flex-direction:column;gap:8px}
.st-more button{width:100%}.st-more .diffsel>div button,.st-more .newset button{width:auto}
.st-more .e2note{color:var(--mut);text-align:center;margin-top:-4px}
.st-foot{text-align:center;color:#a39b88;font-size:12px;text-shadow:0 1px 6px #000}
@media (prefers-reduced-motion:no-preference){
 .st-emb{animation:stFold 1.15s cubic-bezier(.2,.8,.2,1) both}
 .st-title,.st-sub{animation:stRise .9s .55s ease-out both}.st-sub{animation-delay:.75s}
 .st-bot{animation:stRise .8s .95s ease-out both}}
@keyframes stFold{0%{clip-path:inset(0 50% 0 50%);transform:rotate(-6deg) scale(.92);opacity:.2}60%{opacity:1}100%{clip-path:inset(0 0 0 0);transform:none;opacity:1}}
@keyframes stRise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@media (min-width:900px){#intro.st2 .st-emb{width:200px}#intro.st2 .st-title{font-size:88px}}
@media (max-height:640px){#intro.st2 .st-emb{width:110px}#intro.st2 .st-title{font-size:46px}#intro.st2 .st-story{display:none}}
#intro.st2 .st-more .diffsel>span,#intro.st2 .st-more .newset summary{font-family:var(--serif);font-size:16px;letter-spacing:0;text-transform:none;color:#efe5cf}`;document.head.appendChild(st)}
