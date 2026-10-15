
/* ================= atlas natury ================= */
const BIOME=new Uint8Array(N*N);const BCODE={sea:0,coast:1,high:2,wet:3,conif:4,decid:5,meadow:6};
for(let j=0;j<N;j++)for(let i=0;i<N;i++)BIOME[j*N+i]=BCODE[biomeOf(i,j)];
const seenTree=sp=>nodeBy.tree.some(n=>n.sp===sp&&rev[n.j*N+n.i]);
const seenNode=t=>nodeBy[t].some(n=>rev[n.stand[1]*N+n.stand[0]]);
function seenBiome(b){const c=BCODE[b];let n=0;for(let k=0;k<N*N;k++)if(BIOME[k]===c&&rev[k]&&++n>12)return true;return false}
const seenHerd=t=>S.herds.some(h=>{if(h.type!==t||h.n<=0)return false;const ti=tileOf(h.x,h.z);return revAt(ti[0],ti[1])});
const ATLAS=[
 ['Drzewa','sosna','Sosna','Rośnie wszędzie, gdzie sucho. Prosty pień na bale, żywica na pochodnie.',()=>seenTree('pine')],
 ['Drzewa','swierk','Świerk','Ciemne bory na stokach i w górach. Lekkie drewno i gęsty cień.',()=>seenTree('spruce')],
 ['Drzewa','dab','Dąb','Las liściasty w dolinach. Twarde drewno, kora do garbowania, żołędzie dla dzików.',()=>seenTree('oak')],
 ['Drzewa','brzoza','Brzoza','Na skraju lasu i przy mokradłach. Kora na rozpałkę i do pisania.',()=>seenTree('birch')],
 ['Rośliny','borowka','Borówka','Krzewinki pełne jagód od lata do jesieni.',()=>seenNode('bush')],
 ['Rośliny','borowik','Borowik','Grzyby w cieniu lasu, najwięcej jesienią.',()=>seenNode('grzyb')],
 ['Rośliny','zboze','Dzika trawa zbożowa','Kłosy z ciężkim ziarnem. Może da się ją siać.',()=>seenNode('zboze')],
 ['Rośliny','len','Dziki len','Niebieskie kwiaty. Z łodyg da się wyczesać włókno.',()=>seenNode('len')],
 ['Rośliny','ziola','Krwawnik i dziurawiec','Zioła na rany i gorączkę. Trzeba je umieć rozpoznać.',()=>seenNode('ziola')],
 ['Rośliny','paproc','Paproć','Dywan liści w cieniu lasu. Stare liście na posłanie.',()=>seenBiome('decid')||seenBiome('conif')],
 ['Rośliny','trzcina','Trzcina','Mokradła i brzegi. Maty, strzechy i maty do suszenia.',()=>seenBiome('wet')],
 ['Rośliny','wrzos','Wrzos','Fioletowe hale pod szczytami. Pszczoły za nim przepadają.',()=>seenBiome('high')],
 ['Zwierzęta','sarna','Sarna','Płochliwa, w lasach i na polanach. Mięso i skóra.',()=>seenHerd('sarna')],
 ['Zwierzęta','koza','Dzika koza','Stada na otwartych stokach. Da się ją oswoić.',()=>seenHerd('koza')],
 ['Zwierzęta','dzik','Dzik','W liściastych lasach. Dużo mięsa, ale potrafi zranić.',()=>seenHerd('dzik')],
 ['Zwierzęta','wilk','Wilk','Wataha w głębi boru. Napada na zagrody bez opieki.',()=>seenHerd('wilk')],
 ['Zwierzęta','zajac','Zając','Na łąkach. Mało mięsa, ale łatwo go złapać.',()=>seenHerd('zajac')],
 ['Zwierzęta','lis','Lis','Na skraju lasu. Ciepłe futro.',()=>seenHerd('lis')],
 ['Zwierzęta','foka','Foka','Wylegują się na plażach. Tłuste mięso i gruba skóra.',()=>seenHerd('foka')],
 ['Zwierzęta','niedzwiedz','Niedźwiedź','Samotnik z gór i borów. Polować może tylko doświadczony myśliwy.',()=>seenHerd('niedzwiedz')],
 ['Zwierzęta','pszczoly','Dzikie pszczoły','Barcie w dziuplach starych drzew. Miód i wosk.',()=>seenNode('ul')],
 ['Zwierzęta','ryby','Dorsz i śledź','Ławice przy brzegu, tam gdzie woda się marszczy.',()=>seenNode('fish')],
 ['Zwierzęta','mewa','Mewa srebrzysta','Krąży nad zatoką. Gdzie mewy, tam ryby.',()=>true],
 ['Zwierzęta','kruk','Kruk','Para kruków pilnuje boru. Podobno pamiętają ludzi.',()=>seenBiome('conif')],
 ['Zwierzęta','orzel','Bielik','Krąży nad halami i nad morzem.',()=>seenBiome('high')]];
function atlasScan(quiet){if(!S)return;S.atlas=S.atlas||{};ATLAS.forEach(a=>{if(S.atlas[a[1]])return;if(a[4]()){S.atlas[a[1]]=1;if(!quiet){log('Nowy gatunek w atlasie: '+a[2].toLowerCase()+'. '+a[3]);techXp('nauka',3)}}})}
function natureHTML(){const n=ATLAS.filter(a=>S.atlas[a[1]]).length;let h=`<p class="lead">Atlas przyrody wyspy. Odkryto ${n} z ${ATLAS.length} gatunków. Nowe gatunki pojawiają się, gdy zwiadowcy i wyprawy odsłaniają wyspę.</p>`;
 ['Drzewa','Rośliny','Zwierzęta'].forEach(g=>{const l=ATLAS.filter(a=>a[0]===g);h+=`<h3>${g} <span class="mut" style="font-size:13px">${l.filter(a=>S.atlas[a[1]]).length}/${l.length}</span></h3><div class="atlas">`;
  l.forEach(a=>{h+=S.atlas[a[1]]?`<div class="card"><h4>${a[2]}</h4><p>${a[3]}</p></div>`:`<div class="card unk"><h4>Nieznany gatunek</h4><p class="mut">Jeszcze go nie widziano.</p></div>`});h+='</div>'});
 return h}

/* ================= wyprawy ================= */
const RTYPE={high:'hale i skały',coast:'wybrzeże',forest:'las',meadow:'łąki'};
const LOOT={forest:[['skory',1],['ziola',1.2],['grzyby',3],['miod',1]],high:[['ruda',1.4],['narzk',.35],['skory',.8],['ziola',.6]],coast:[['ryby',4],['skory',.8],['mieso',2]],meadow:[['ziarno',2],['ziola',1.6],['wlokna',2],['jagody',3]]};
const ERISK={high:.24,forest:.15,coast:.1,meadow:.07};
const EFLAV={forest:['W gęstym borze trzeba było nocować pod wykrotem.','Słyszeli wilki, ale stado trzymało się z daleka.','Ścieżka zwierząt prowadziła przez mokradło do suchego grądu.'],
 high:['Wiatr na grani nie ustawał ani na chwilę.','Ze szczytu widać było całą wyspę i morze dookoła.','Kozy patrzyły na nich z półek skalnych.'],
 coast:['Na kamienistej plaży wylegiwały się foki.','Przypływ odciął drogę na pół dnia.','Morze wyrzuciło na piasek deski. Nie z naszego statku.'],
 meadow:['Trawy sięgały do pasa.','Nad łąką krążył bielik.','Zające uciekały spod nóg co kilka kroków.']};
const DIRS=['północ','północny wschód','wschód','południowy wschód','południe','południowy zachód','zachód','północny zachód'];
function regDir(r){const a=Math.atan2(r.i-camp.i,-(r.j-camp.j));return DIRS[((Math.round(a/(Math.PI/4))%8)+8)%8]}
const regDist=r=>Math.hypot(r.i-camp.i,r.j-camp.j);
function expDays(r,type){return Math.max(2,Math.round((regDist(r)/22+(type==='zbior'?3:2))*(tech('n_mapa')?.7:1)))}
const perDay=()=>K*1;
function expFood(r,type,n){return Math.ceil(perDay()*n*expDays(r,type))}
function expRisk(r,n){const s=seasonIdx();let k=ERISK[r.type]*[1,1.2,2,1.1][s]*wxRisk()*(tech('n_mapa')?.7:1)*(r.type==='coast'&&tech('n_gwiazd')?.7:1);return clamp(k*(1+regDist(r)/120),.02,.6)}
function expCandidates(n){return adultsPool().filter(p=>(p.job==='rob'||!p.job)&&p.hp>.55&&p.age<60).sort((a,b)=>(b.sk.mysliwy+b.sk.zbieracz)-(a.sk.mysliwy+a.sk.zbieracz)).slice(0,n)}
function canSend(r,type){const n=S.expSize;if(S.exps.some(e=>e.r===r.id))return'Tam już ktoś idzie.';if(expCandidates(n).length<n)return'Za mało wolnych, zdrowych ludzi ('+n+'). Zwolnij kogoś w zakładce Praca.';if(foodTotal()<expFood(r,type,n))return'Za mało jedzenia na drogę.';if(type==='zbior'&&!r.known)return'Najpierw trzeba poznać ten teren.';return''}
function exitTile(r){const dx=r.i-camp.i,dy=r.j-camp.j,l=Math.hypot(dx,dy)||1;for(let d=12;d>=3;d--){const t=nearestWalk(clamp(Math.round(camp.i+dx/l*d),1,N-2),clamp(Math.round(camp.j+dy/l*d),1,N-2));if(t&&reach[t[1]*N+t[0]])return t}return[camp.i,camp.j+1]}
function sendExp(rid,type){const r=REGIONS[rid];const why=canSend(r,type);if(why){toast(why);return}
 const n=S.expSize,ppl=expCandidates(n),food=expFood(r,type,n);
 const tot=foodTotal();FOOD.forEach(k=>{S.res[k]-=food*(S.res[k]/tot)});
 const days=expDays(r,type);const ex=exitTile(r);
 const e={id:(S.expN=(S.expN||0)+1),r:rid,type,ppl:ppl.map(p=>p.id),days,left:days,exit:ex,risk:expRisk(r,n)};S.exps.push(e);
 ppl.forEach(p=>{release(p);p.path=null;p.state='idle';p.wait=0;p.job='wyp';p.wb=null;p.exp=e.id;p.act='wyrusza: '+r.name.toLowerCase()});
 log(`Wyprawa (${type==='zwiad'?'zwiad':'zbiór'}) rusza na ${regDir(r)}: ${r.known?r.name:'nieznany teren'}. Idą: ${ppl.map(p=>p.name).join(', ')}. Wrócą za ${days} dni.`);toast('Wyprawa wyruszyła');assign();renderPanel()}
function expTick(){if(!S.exps||!S.exps.length)return;
 for(const e of [...S.exps]){const out=S.people.filter(p=>p.exp===e.id);if(!out.length){S.exps=S.exps.filter(x=>x!==e);continue}
  if(out.some(p=>p.state!=='away'))continue;e.left--;if(e.left<=0)finishExp(e,out)}}
function finishExp(e,out){const r=REGIONS[e.r];S.exps=S.exps.filter(x=>x!==e);const lines=[];const fl=EFLAV[r.type];lines.push(fl[(Math.random()*fl.length)|0]);
 out.forEach(p=>{const tool=p.tool.t===2?.85:p.tool.t===1?1:1.25,coat=seasonIdx()===2&&p.coat<=0?1.5:1,sk=1-.05*Math.max(p.sk.mysliwy,p.sk.zbieracz),ost=p.trait==='Ostrożny'?.6:1;
  const rk=e.risk*tool*coat*sk*ost*(1-Math.min(.5,.06*offLv('lowczy')));const x=Math.random();
  if(x<rk*.12&&seasonIdx()===2&&p.hp<.7){lines.push(p.name+' nie wraca. Zamarzł w zawiei na '+(r.known?r.name:'nieznanym terenie')+'.');killPerson(p,'na wyprawie');return}
  if(x<rk*.3){p.hp=Math.max(.15,p.hp-.45);p.hurt=1;lines.push(p.name+' wraca ciężko ranny.')}
  else if(x<rk){p.hp=Math.max(.3,p.hp-.18);p.hurt=1;lines.push(p.name+' skręcił nogę w drodze.')}
  gainXp(p,r.type==='coast'?'rybak':r.type==='high'?'kamieniarz':'zbieracz',40);gainXp(p,'mysliwy',30)});
 const alive=out.filter(p=>S.people.includes(p));
 if(e.type==='zwiad'){for(let j=0;j<N;j+=4)for(let i=0;i<N;i+=4)if(REGION[j*N+i]===e.r)reveal(i,j,4);regionScan(true);S.regs[e.r]=1;r.known=true;techXp('nauka',20);
  lines.push('Poznano teren: '+r.name+' ('+RTYPE[r.type]+').');S.hope=clamp(S.hope+.02,0,1)}
 else{const got=[];LOOT[r.type].forEach(([k,v])=>{if(k==='miod'&&!tech('u_bart'))return;const q=Math.round(v*alive.length*(e.days-1)*(.7+Math.random()*.6)*(law('lup')?1.25:1));if(q>0){S.res[k]=(S.res[k]||0)+q;got.push(RN[k].toLowerCase()+' '+q)}});
  techXp(r.type==='coast'?'hodowla':'uprawa',15);S.seen.zbior1=1;techXp('nauka',8);lines.push(got.length?'Przynieśli: '+got.join(', ')+'.':'Wrócili z pustymi rękami.')}
 alive.forEach(p=>{p.job='rob';p.exp=null;p.state='idle';const st=e.exit;p.x=tcx(st[0]);p.z=tcx(st[1]);p.wait=.2});
 S.expLog=S.expLog||[];S.expLog.unshift({d:Math.floor(S.day)+1,r:r.name,t:lines.join(' ')});if(S.expLog.length>8)S.expLog.pop();
 log('Wyprawa wraca: '+r.name+'. '+lines.join(' '));toast('Wyprawa wróciła: '+r.name);assign();renderPanel()}
function expHTML(){let h=`<p class="lead">Wyprawy zabierają ludzi z osady na kilka dni. Biorą jedzenie na drogę. Ryzyko rośnie z odległością, zimą i na halach. Pomagają narzędzia, ciepła odzież i doświadczenie.</p>`;
 h+=`<div class="row"><div class="n">Ludzi na wyprawę<small>Wolnych i zdrowych: ${expCandidates(9).length}</small></div><button class="mini" data-xs="-1">−</button><span class="cnt">${S.expSize}</span><button class="mini" data-xs="1">+</button></div>`;
 if(S.exps.length){h+='<h3>W drodze</h3>';S.exps.forEach(e=>{const r=REGIONS[e.r];const ppl=S.people.filter(p=>p.exp===e.id);const pc=Math.round(100*(e.days-e.left)/e.days);
  h+=`<div class="card"><h4>${r.known?r.name:'Nieznany teren'} <span class="mut" style="font-size:13px">${e.type==='zwiad'?'zwiad':'zbiór'}</span></h4><p>${ppl.map(p=>p.name).join(', ')} · ${ppl.some(p=>p.state!=='away')?'wychodzą z osady':'powrót za '+e.left+' dni'}</p><div class="pbar"><div style="width:${pc}%"></div></div></div>`})}
 h+='<h3>Regiony wyspy</h3>';
 REGIONS.filter(r=>r&&r.id!==0).sort((a,b)=>regDist(a)-regDist(b)).forEach(r=>{const on=S.exps.some(e=>e.r===r.id);const d1=expDays(r,'zwiad'),rk=Math.round(expRisk(r,S.expSize)*100);
  h+=`<div class="card"><h4>${r.known?r.name:'Nieznany teren'}</h4><p class="mut">${regDir(r)} · ${Math.round(regDist(r))} kroków · ${r.known?RTYPE[r.type]+' · poznano '+Math.round(r.seen*100)+'%':'nikt tam nie był'}</p>`;
  if(r.known)h+=`<p>Można przynieść: ${LOOT[r.type].filter(([k])=>k!=='miod'||tech('u_bart')).map(([k])=>RN[k].toLowerCase()).join(', ')}.</p>`;
  h+=`<p class="mut">Zwiad: ${d1} dni, jedzenie ${expFood(r,'zwiad',S.expSize)}${r.known?` · zbiór: ${expDays(r,'zbior')} dni, jedzenie ${expFood(r,'zbior',S.expSize)}`:''} · ryzyko ${rk<10?'małe':rk<22?'średnie':'duże'}</p>`;
  h+=on?'<p class="ok">Wyprawa w drodze.</p>':`<div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap">${r.seen<.9?`<button class="pri" data-ex="${r.id}" data-et="zwiad">Zwiad</button>`:''}${r.known?`<button ${r.seen>=.9?'class="pri"':''} data-ex="${r.id}" data-et="zbior">Zbiór</button>`:''}<button data-rg="${r.id}">Pokaż</button></div>`;
  h+='</div>'});
 if(S.expLog&&S.expLog.length){h+='<h3>Powroty</h3><div class="log">'+S.expLog.map(l=>`<p><small>doba ${l.d}</small><b style="color:var(--hi)">${l.r}.</b> ${l.t}</p>`).join('')+'</div>'}
 return h}
