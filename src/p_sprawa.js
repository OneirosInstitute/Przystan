
/* ================= 4.9.0-rc.6 Sprawa nad głową: po wybraniu osoby widać, o co chodzi ================= */
// Znak nad człowiekiem (wykrzyknik, ogień, serce, kłos, płomyk zimna, kropla, niezgoda) ma teraz opis na karcie osoby:
// co się dzieje, co ta osoba mówi i co trzeba zrobić. Prośby mają też termin i przycisk do listy wszystkich spraw.
function sprawaHTML(p){if(!S||!p)return'';const out=[];const left=d=>{const n=Math.max(0,Math.ceil(d));return n+' '+(typeof dniW==='function'?dniW(n):'dni')};
 for(const r of S.reqs||[]){if(r.pid!==p.id)continue;const R=REQS[r.k];if(!R)continue;let say='';try{say=typeof reqSay==='function'?reqSay(R,r,p):''}catch(e){}
  out.push(`<h4>Prośba: ${escapeHtml(R.t(r,p))}</h4>${say?`<p class="sq">„${escapeHtml(say)}”</p>`:''}<p><b>Co zrobić:</b> ${escapeHtml(R.d)}</p><p class="mut">Zostało ${left(r.until-S.day)}. Spełniona prośba dodaje nadziei i zmniejsza niezgodę, a zapomniana ją zwiększa.</p>`)}
 try{const R=S.spr&&S.spr.a||[];for(const s of R){if(s.pid!==p.id)continue;const d=CHAIN[s.chain];if(!d)continue;let say='',how='';try{say=d.say?d.say(s,p):''}catch(e){}try{how=d.how?d.how(s,p):''}catch(e){}
  out.push(`<h4>Sprawa: ${escapeHtml(d.t)}</h4>${say?`<p class="sq">„${escapeHtml(say)}”</p>`:''}${how?`<p><b>Co zrobić:</b> ${escapeHtml(how)}</p>`:''}`)}}catch(e){}
 let n=null;try{n=needOf(p)}catch(e){}
 if(n&&n[0]!=='!'){const k=n[0];let t='',d='';
  if(k==='fire'){const b=bById(p.fireB);t='Gasi pożar';d=`Biegnie z wodą do ${b?BD[b.kind].n.toLowerCase():'płonącego budynku'}. Im więcej rąk, tym szybciej ogień zgaśnie.`}
  else if(k==='zdrowie'){t='Słabnie';d='Pomoże jedzenie, ciepły dom, odpoczynek i zielarka. Przyczyny są niżej, przy zdrowiu.'}
  else if(k==='zywnosc'){t='Głód';d='W osadzie brakuje jedzenia. Więcej ludzi przy jedzeniu (zbieracze, rybacy, myśliwi) albo zapasy z pól i spiżarni.'}
  else if(k==='cieplo'){t='Marznie';const h=homeOf(p);d=h?'Dom nie trzyma ciepła albo brakuje opału. Drewno na opał, lepszy dom albo piec.':'Nie ma dachu nad głową. Postaw szałas albo chatę.'}
  else if(k==='woda'){t='Brakuje czystej wody';d='Ludzi jest więcej, niż daje woda. Postaw studnię albo kolejną.'}
  else if(k==='niezgoda'){t='Niezgoda w osadzie';d='Ludzie są niezadowoleni. Pomagają spełnione prośby, święta, opowieści przy ogniu i sprawiedliwe prawa.'}
  if(t)out.push(`<h4>${escapeHtml(t)}</h4><p>${escapeHtml(d)}</p>`)}
 if(!out.length)return'';return`<div class="card sprawa">${out.join('<hr>')}<button data-sprawy="1" class="sprb">Wszystkie potrzeby i sprawy</button></div>`}
{const _lc=ludCard;ludCard=function(p){const h=_lc(p);let s='';try{s=sprawaHTML(p)}catch(e){console.warn('sprawa',e)}return s+h}}
document.addEventListener('click',e=>{if(!e.target.closest('[data-sprawy]')||!S)return;e.stopPropagation();try{select(null)}catch(er){}openSheet('osada')});
{const st=document.createElement('style');st.textContent=`.card.sprawa{border-color:#c9a66b99;background:#211f17}.card.sprawa h4{color:var(--gold2,#e0c080);margin:0 0 4px}
.card.sprawa .sq{font-family:var(--serif);font-size:16px;line-height:1.4;color:#ece4d0;margin:4px 0 6px}.card.sprawa p{margin:4px 0}.card.sprawa hr{border:0;border-top:1px solid #c9a66b33;margin:10px 0}
.card.sprawa .sprb{margin-top:8px;width:100%}`;document.head.appendChild(st)}
window.__sprawa={sprawaHTML};
