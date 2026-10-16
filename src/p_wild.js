
/* ================= z Wilderness: przetwórstwo, co spowalnia, kłopoty osady, odmiany, kronika i zapis ================= */
const NEWRES=['maka','chleb','ser','kiszonki','naczynia'];
function wildFixRes(o){if(o&&o.res)NEWRES.forEach(k=>{if(typeof o.res[k]!=='number')o.res[k]=0})}
// ---- modele nowych budynków ----
function wildModel(kind,g){
 if(kind==='zarna'){shed(g,1.5,1.5,1.25,mThatch);g.add(cyl(.42,.22,matStone,0,.11,0,0,0,0,14),cyl(.38,.15,M(0x8c877c),0,.3,0,0,0,0,14),cyl(.07,.06,matDark,0,.4,0,0,0,0,8));
  g.add(cyl(.025,.42,matDark,.26,.55,0,0,0,0,5));const tr=tbox(.7,.12,.3,mPlankD,0,.06,.62);g.add(tr);sack(g,.95,.45);sack(g,1.0,-.15,.85);sack(g,.7,.9,.8);return 1}
 if(kind==='piekarnia'){g.add(tbox(1.35,.36,1.15,mStone,-.1,.18,-.05,0,.9));const dm=mesh(new THREE.SphereGeometry(.62,16,10,0,6.283,0,1.5708),M(0xa9744a),-.1,.36,-.05);dm.scale.y=.85;g.add(dm);
  g.add(tbox(.34,.26,.08,matDark,-.1,.52,.55));g.add(tbox(.24,.1,.04,mLantern,-.1,.45,.57));g.add(cyl(.08,.28,M(0x8a5a3a),.12,.95,-.25,0,0,0,8));
  woodpile(g,-1.05,.55,8,Math.PI/2);g.add(tbox(.8,.06,.32,mPlank,.85,.44,-.72),tbox(.06,.42,.06,matDark,.5,.21,-.72),tbox(.06,.42,.06,matDark,1.2,.21,-.72));
  for(let k=0;k<3;k++){const l=mesh(new THREE.SphereGeometry(.1,8,6),M(0x9a6232),.62+k*.24,.52,-.72);l.scale.set(1.2,.6,.9);g.add(l)}
  g.add(cyl(.02,1.1,matDark,.75,.3,.55,0,.4,1.25,4));return 1}
 if(kind==='serownia'){plankHut(g,1.5,1.2,.95,{win:true});const sh=new THREE.Group();sh.position.set(-1.2,0,.2);g.add(sh);
  for(const y of[.32,.68]){sh.add(tbox(.36,.04,.9,mPlank,0,y,0));for(let k=0;k<3;k++)sh.add(cyl(.12,.09,M(0xdcbf62),0,y+.065,-.28+k*.28,0,0,0,10))}
  sh.add(tbox(.04,.85,.04,matDark,-.16,.42,-.42),tbox(.04,.85,.04,matDark,-.16,.42,.42),tbox(.04,.85,.04,matDark,.16,.42,-.42),tbox(.04,.85,.04,matDark,.16,.42,.42));
  barrel(g,1.05,.75,.8);g.add(cyl(.12,.18,mPlank,.75,.09,.95,0,0,0,9));return 1}
 if(kind==='garncarnia'){shed(g,1.6,1.4,1.2,mShingle);g.add(cyl(.05,.4,matDark,-.25,.2,0,0,0,0,6),cyl(.24,.06,mPlank,-.25,.42,0,0,0,0,14));
  const pot=mesh(new THREE.SphereGeometry(.1,9,7),M(0xa9683c),-.25,.53,0);pot.scale.y=1.2;g.add(pot);g.add(tbox(.3,.3,.3,mPlankD,.25,.15,.2));
  g.add(tbox(.9,.05,.28,mPlank,.15,.6,-.55));for(let k=0;k<5;k++){const p=mesh(new THREE.SphereGeometry(.07+(k%2)*.03,8,6),M([0xa9683c,0x8a4a2a,0xb8805a][k%3]),-.2+k*.17,.7,-.55);p.scale.y=1.3;g.add(p)}
  const kl=mesh(new THREE.SphereGeometry(.4,12,8,0,6.283,0,1.5708),M(0x8a5a3a),1.05,0,.65);g.add(kl);g.add(tbox(.18,.16,.05,matDark,1.05,.12,1.03));return 1}
 if(kind==='kiszarnia'){const md=mesh(new THREE.SphereGeometry(.95,16,9,0,6.283,0,1.35),matMoss,0,-.3,-.15);md.scale.set(1,.78,1);g.add(md);
  g.add(tbox(1.0,.75,.16,mStone,0,.32,.66,0,.9));door(g,0,.76,0,.42,.6);
  barrel(g,-.95,.75,.85);barrel(g,.95,.7);barrel(g,1.2,.2,.8);g.add(cyl(.18,.03,mPlankD,.95,.43,.7,0,0,0,10));
  const cr=mesh(new THREE.SphereGeometry(.13,9,7),M(0x8a4a2a),-.6,.12,1.0);cr.scale.y=1.2;g.add(cr);return 1}
 return 0}
// ---- co spowalnia pracę ----
const SLOWTIP={Nadzieja:'Obrzędy, święty gaj, różnorodne jedzenie i ciepłe domy podnoszą nadzieję.',Wiek:'Starsi i najmłodsi pracują wolniej. Przydziel ludzi w sile wieku.',Zdrowie:'Chata zielarki, łaźnia i czysta woda szybciej stawiają ludzi na nogi.',
 'Narzędzia':'Warsztat robi kamienne narzędzia, kuźnia żelazne.',Pogoda:'Na pogodę nie ma rady. Kalendarz nieba zapowiada mrozy i sztormy.',Niezgoda:'Wiec, starszy osady i spełnione prośby łagodzą spory.',
 Fach:'Fach rośnie z pracą. Mistrz obok uczy dwa razy szybciej.',Obsada:'Brakuje wolnych rąk. Zwolnij kogoś z innej pracy.'};
function effParts(p){const tool=p.tool.t===2?1:p.tool.t===1?.8:.55;return[['Nadzieja',.65+.35*S.hope],['Wiek',p.age>=55?.75:p.age<16?.85:1],['Zdrowie',.6+.4*p.hp],['Narzędzia',tool],['Pogoda',WEATHER[S.weather.k][1]],['Niezgoda',1-Math.max(0,(S.dis||0)-.5)*.5]]}
function slowHTML(b){const d=BD[b.kind];if(!bDone(b)||!d.wk)return'';const ws=S.people.filter(p=>p.job==='wb'&&p.wb===b.id);const parts=[];
 if(!ws.length)parts.push(['Brak ludzi',0,'Dodaj pracowników przyciskiem +.']);
 else{const acc={};ws.forEach(p=>effParts(p).forEach(([n,v])=>{acc[n]=(acc[n]||0)+v/ws.length}));Object.entries(acc).forEach(([n,v])=>parts.push([n,v,SLOWTIP[n]]));
  if(d.c){const sk=ws.reduce((a,p)=>a+(p.sk[d.c]||0),0)/ws.length;parts.push(['Fach',Math.min(1,(1+.18*sk)/1.54),SLOWTIP.Fach])}
  if((b.want||0)>ws.length)parts.push(['Obsada',ws.length/(b.want||1),SLOWTIP.Obsada])}
 const cm=condMul(b);if(cm<1)parts.push(['Stan budynku',cm,'Remont przywróci pełną wydajność.']);
 if(d.prod){const list=[].concat(d.prod);if(!list.some(pr=>Object.entries(pr.in).every(([r,v])=>(S.res[r]||0)>=v))){const p0=list[0];parts.push(['Surowce',0,'Brakuje: '+Object.keys(p0.in).filter(r=>(S.res[r]||0)<p0.in[r]).map(r=>RN[r].toLowerCase()).join(', ')+'.'])}}
 const n=countInRange(b.kind,b.i,b.j);if(n!==null&&n<3)parts.push(['Zasoby w zasięgu',n/3,'W zasięgu prawie nic nie zostało. Postaw budynek gdzie indziej albo poczekaj, aż odrośnie.']);
 parts.sort((a,b)=>a[1]-b[1]);const worst=parts.filter(x=>x[1]<.92).slice(0,3);
 if(!worst.length)return'<p class="mut" style="margin-top:6px">Praca idzie pełną parą.</p>';
 return`<div class="slow"><b>Co spowalnia</b>${worst.map(([n,v,t])=>`<div class="sl"><span>${n}</span><i><u style="width:${Math.round(clamp(v,0,1)*100)}%;background:${v<.5?'var(--bad)':'var(--ember)'}"></u></i><em>${Math.round(clamp(v,0,1)*100)}%</em></div><small>${t||''}</small>`).join('')}</div>`}
// ---- największy kłopot osady ----
function troubles(){const T=[],n=S.people.length||1,sea=seasonIdx();
 const need=K*S.people.reduce((a,p)=>a+(p.age<3?.3:p.age<12?.6:p.age>55?.8:1),0)||1;const days=foodTotal()/need;
 T.push({n:'Mało jedzenia',sev:days<3?1:days<6?.65:days<10?.3:0,tip:`Zapasów starczy na ${Math.floor(days)} d. Więcej zbieraczy, rybaków i myśliwych; przetwórstwo i spiżarnia zmniejszają straty.`});
 const homes=Object.values(S.fams).map(f=>f.home?bById(f.home):null).filter(h=>h&&bDone(h));const burn=homes.reduce((a,h)=>a+BD[h.kind].fuel,0)*K*1.4||1;const fd=S.res.opal/burn;
 if(sea===1||sea===2)T.push({n:'Opał na zimę',sev:fd<4?.95:fd<9?.55:fd<15?.25:0,tip:`Opału starczy na około ${Math.floor(fd)} d mrozu. Drewutnia i drwale, zanim spadnie śnieg.`});
 const homeless=S.people.filter(p=>!homeOf(p)).length;T.push({n:'Brak dachu nad głową',sev:homeless?Math.min(1,.35+homeless/n):0,tip:`${homeless} osób śpi pod gołym niebem. Postaw szałasy albo chaty.`});
 {const sites=S.bld.filter(b=>!bDone(b)).length,free=S.people.filter(p=>p.job==='rob'||p.job==='bud').length;const un=S.bld.filter(b=>!bDone(b)&&(b.unrN||0)>=3);if(un.length)T.push({n:'Plac budowy bez dojścia',sev:.7,tip:`Nikt nie może dojść do: ${un.map(b=>BD[b.kind].n.toLowerCase()).join(', ')}. Otaczają go inne budynki albo woda. Rozbierz go i postaw w innym miejscu.`});if(sites)T.push({n:'Budowy stoją',sev:free===0?.9:free<2&&sites>2?.5:0,tip:`Placów budowy: ${sites}. Wolnych rąk do noszenia i budowania: ${free}. Zmniejsz obsadę jakiegoś budynku w zakładce Praca.`})}
 T.push({n:'Zimno',sev:S.warm<.5?.85:S.warm<.75?.45:0,tip:'Ciepła odzież ze skór, domy z piecem i opał.'});
 T.push({n:'Choroby i rany',sev:S.health<.5?.85:S.health<.75?.4:0,tip:'Chata zielarki, łaźnia, studnia i odpoczynek chorych.'});
 if(waterNeedOn()){const w=waterCap()/n;T.push({n:'Woda',sev:w<.6?.8:w<1?.4:0,tip:'Studnia (z żurawiem) daje czystą wodę latem i przy pożarze.'})}
 const ad=S.people.filter(isAdult),bad=ad.filter(p=>p.tool.t===0).length/(ad.length||1);T.push({n:'Zużyte narzędzia',sev:bad>.5?.6:bad>.25?.3:0,tip:'Warsztat robi kamienne narzędzia, kuźnia żelazne.'});
 T.push({n:'Brak nadziei',sev:S.hope<.3?.8:S.hope<.45?.4:0,tip:'Obrzędy, wspólne posiłki, różnorodne jedzenie i ciepłe domy.'});
 T.push({n:'Niezgoda',sev:(S.dis||0)>.7?.9:(S.dis||0)>.45?.5:0,tip:'Wiec, starszy osady, spełnione prośby i święty gaj.'});
 const rep=S.bld.filter(b=>bDone(b)&&condOf(b)<.5).length;T.push({n:'Budynki do remontu',sev:rep?Math.min(.8,.25+rep*.12):0,tip:`${rep} budynków pracuje słabiej. Remonty w zakładce Budowa.`});
 const wp=S.people.filter(p=>p.waitHome&&p.sex==='k').length;T.push({n:'Młode pary bez domu',sev:wp?Math.min(.7,.3+wp*.15):0,tip:`${wp} ${wp===1?'para czeka':'pary czekają'} na własny dom. Dopóki mieszkają u rodziców, nie będzie dzieci. Postaw szałas albo chatę.`});
 return T.sort((a,b)=>b.sev-a.sev)}
function troubleHTML(){const t=troubles().filter(x=>x.sev>.15);
 if(!t.length)return`<div class="card"><div class="eyebrow">Stan osady</div><h4>Nic pilnego</h4><p class="mut">Dobry czas na rozbudowę, naukę i zapasy na zimę.</p></div>`;
 const a=t[0];return`<div class="card" style="border-left:3px solid ${a.sev>.7?'var(--bad)':'var(--ember)'}"><div class="eyebrow">Największy kłopot</div><h4>${a.n}</h4><p>${a.tip}</p>${t.slice(1,3).map(x=>`<p class="mut">Zaraz potem: ${x.n.toLowerCase()}.</p>`).join('')}</div>`}
// ---- odmiany i oswajanie ----
function adaptHarvest(){const o=S.adapt||0;S.adapt=Math.min(1,o+.12);
 if(o<.5&&S.adapt>=.5)log('Ziarno z własnych pól przyjęło się na wyspie. Rolnicy mówią o „naszej” odmianie: kłosy pełniejsze, mniej pustych.');
 if(o<1&&S.adapt>=1)log('Odmiana wyspowa ustalona. Ziarno zna już tutejszą glebę, deszcze i wiatr.')}
function goatStage(b){const a=b.animals||0;return a===0?((b.tame||0)?'Dokarmianie i oswajanie':'Czeka na oswajanie'):a<4?'Pierwsze oswojone kozy':a<8?'Stado':'Hodowla'}
// ---- pełna kronika, zapis i wczytanie z pliku ----
{const _lg=log;log=function(t){_lg(t);if(!S)return;(S.kron=S.kron||[]).push([Math.floor(S.day)+1,t]);if(S.kron.length>3000)S.kron.splice(0,S.kron.length-3000)}}
function dayName(d){const y=Math.floor((d-1)/YEAR)+1,r=(d-1)%YEAR;return`rok ${y}, ${SEAS[Math.floor(r/SD)].toLowerCase()}, dzień ${r%SD+1}`}
function kronTools(){const n=(S.kron||S.log).length;return`<div class="card"><h4>Kronika i zapis</h4><p class="mut">Pełna kronika osady (${n} wpisów) do pobrania jako plik tekstowy. Gra zapisuje się co 15 sekund, również podczas pauzy.</p><p id="save-status" role="status" aria-live="polite">${saveStatusText()}</p>
 <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px"><button data-kron="now">Zapisz teraz</button><button data-kron="txt">Pobierz kronikę</button><button data-kron="save">Zapisz grę do pliku</button><button data-kron="load">Wczytaj z pliku</button></div></div>`}
async function dlFile(name,text,type){if(window.claude&&typeof claude.use==='function'){let d=null;try{d=await Promise.race([claude.use('downloads'),new Promise(r=>setTimeout(()=>r(null),4000))])}catch(e){}
 if(d){try{await d.save({filename:name,data:text});toast('Plik zapisany')}catch(e){if(!e||e.code!=='declined')toast('Nie udało się zapisać pliku')}return}}
 try{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500)}catch(e){toast('Ta przeglądarka nie pozwala pobrać pliku')}}
function kronText(){const L=S.kron&&S.kron.length?S.kron:S.log.slice().reverse().map(l=>[l.d,l.t]);const tt='KRONIKA OSADY '+(S.vname||'Przystań').toUpperCase();let out=tt+'\n'+'='.repeat(tt.length)+'\n\n';let last='';
 L.forEach(([d,t])=>{const h=dayName(d);const y=h.split(',')[0];if(y!==last){out+='\n'+y.toUpperCase()+'\n\n';last=y}out+='· '+h+': '+t+'\n'});
 out+='\n\nOsada: '+S.people.length+' osób, urodzeni na wyspie: '+(S.born||0)+', zmarli: '+(S.died||0)+'.\n';return out}
document.addEventListener('click',e=>{const t=e.target.closest('[data-kron]');if(!t||!S)return;const k=t.dataset.kron;const y=Math.floor(S.day/YEAR)+1;
 if(k==='now'){if(save())toast('Gra zapisana w przeglądarce.')}
 else if(k==='txt')dlFile(`kronika-przystani-rok${y}.txt`,kronText(),'text/plain;charset=utf-8');
 else if(k==='save'){try{const current=serializeSave();dlFile(`przystan-zapis-rok${y}.json`,current,'application/json')}catch(error){toast('Nie udało się przygotować aktualnego zapisu')}}
 else if(k==='load'){const inp=document.createElement('input');inp.type='file';inp.accept='.json,application/json';inp.onchange=()=>{const file=inp.files&&inp.files[0];if(!file)return;if(file.size>8*1024*1024){toast('Plik zapisu jest za duży.');return}const reader=new FileReader();
  reader.onload=()=>{const state=decodeSave(reader.result);if(!state){toast('Nieprawidłowy zapis lub zapis innej wyspy. Obecna osada została zachowana.');return}try{localStorage.setItem(SAVEKEY,JSON.stringify(state));toast('Wczytano zapis. Otwieram osadę…');setTimeout(()=>location.reload(),700)}catch(error){saveWarning(error)}};reader.onerror=()=>toast('Nie udało się odczytać pliku.');reader.readAsText(file)};inp.click()}});
// ---- style: co spowalnia, lżejszy ekran telefonu ----
{const st=document.createElement('style');st.textContent=`.slow{margin-top:8px}.slow>b{display:block;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:4px;font-weight:500}
.sl{display:flex;align-items:center;gap:7px;font-size:12px}.sl span{flex:0 0 104px;color:var(--fg)}.sl i{flex:1;height:4px;background:#2b3530;border-radius:3px;overflow:hidden}.sl u{display:block;height:100%;text-decoration:none}.sl em{font-style:normal;width:34px;text-align:right;color:var(--mut);font-variant-numeric:tabular-nums}
.slow small{display:block;color:var(--mut);font-size:11px;line-height:1.3;margin:2px 0 6px}
@media (max-width:760px) and (min-height:461px){#needs{grid-template-columns:repeat(6,1fr)!important;gap:2px 6px!important;padding:5px 8px!important}.need{min-width:0!important}.need span{font-size:9.5px!important;overflow:hidden;text-overflow:ellipsis}.need span b{display:none}#mini{display:none!important}}`;document.head.appendChild(st)}
IC.maka='<path d="M7 8c0-2 2-3 5-3s5 1 5 3l1.5 10c0 1.2-.8 2-2 2h-9c-1.2 0-2-.8-2-2z"/><path d="M9.5 5l1-2h3l1 2M10 13h4"/>';
IC.naczynia='<path d="M7.5 9h9l-.8 9c-.1 1.2-1 2-2.2 2h-3c-1.2 0-2.1-.8-2.2-2z"/><path d="M6 9h12M9.5 9V6.5h5V9"/>';
