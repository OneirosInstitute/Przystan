
/* ================= ludzie: rody, więzi, swaty i wesela, nastrój, mir, przysiółki ================= */
// Wszystko dzieje się samo, w rytmie dawnej wsi. Gracz nie dobiera par: widzi to w kronice i na kartach ludzi.
let ludReady=false;
function ludInit(){S.rel=S.rel||{};S.hamlets=S.hamlets||[];S.rody=S.rody||{};
 S.people.forEach(p=>{if(p.rod===undefined)p.rod=p.fam;if(p.mirX===undefined)p.mirX=0});
 Object.values(S.fams).forEach(f=>{const m=famMembers(f.id);if(S.rody[f.id]||!m.length)return;
  const head=m.filter(isAdult).sort((a,b)=>(b.sex==='m')-(a.sex==='m')||b.age-a.age)[0]||m[0];S.rody[f.id]={name:head.name}});
 // dzieci założycieli: rodzice z tej samej rodziny
 S.people.forEach(p=>{if(!p.par&&!p.born&&p.age<18){const par=famMembers(p.fam).filter(q=>q.age>=25&&q.pair!==null);if(par.length)p.par=par.map(q=>q.id)}});
 ludReady=true}
const lpick=a=>a.length?a[(Math.random()*a.length)|0]:null;
function gen(n){if(/ek$/.test(n))return n.slice(0,-2)+'ka';if(/ś$/.test(n))return n.slice(0,-1)+'sia';if(/o$/.test(n))return n.slice(0,-1)+'a';if(/(s|z|c|n|dz)ia$/.test(n))return n.slice(0,-1);if(/ia$/.test(n))return n.slice(0,-1)+'i';if(/[kgl]a$/.test(n))return n.slice(0,-1)+'i';if(/a$/.test(n))return n.slice(0,-1)+'y';return n+'a'}
function rodName(id){if(!ludReady&&S)ludInit();const r=S.rody&&S.rody[id];return r?'ród '+gen(r.name):'ród nieznany'}
function placeName(n){if(/sław$/.test(n))return n+'ice';if(/ek$/.test(n))return n.slice(0,-2)+'kowo';if(/[ao]$/.test(n))return n.slice(0,-1)+'owo';if(/ś$/.test(n))return n.slice(0,-1)+'siowo';return n+'owice'}
// ---- więzi ----
const rk=(a,b)=>a.id<b.id?a.id+'_'+b.id:b.id+'_'+a.id;
function relGet(a,b){return(S.rel&&S.rel[rk(a,b)])||0}
function relAdd(a,b,v){if(a===b)return;S.rel=S.rel||{};const k=rk(a,b);S.rel[k]=clamp((S.rel[k]||0)+v,-100,100)}
function relsOf(p){const out=[];if(!S.rel)return out;const pre=p.id+'_',suf='_'+p.id;for(const k in S.rel){let o=null;if(k.startsWith(pre))o=+k.slice(pre.length);else if(k.endsWith(suf))o=+k.slice(0,-suf.length);if(o===null)continue;const q=pById(o);if(q)out.push([q,S.rel[k]])}return out}
function friendsOf(p){return relsOf(p).filter(x=>x[1]>=30).sort((a,b)=>b[1]-a[1]).slice(0,3).map(x=>x[0])}
function rivalsOf(p){return relsOf(p).filter(x=>x[1]<=-30).sort((a,b)=>a[1]-b[1]).slice(0,1).map(x=>x[0])}
function compat(a,b){if(a.fam===b.fam)return .3;let c=1;if(a.trait==='Pogodny'||b.trait==='Pogodny')c+=.4;if(a.trait==='Cierpliwy'||b.trait==='Cierpliwy')c+=.2;if(a.trait==='Uparty'&&b.trait==='Uparty')c=-1.2;if(Math.abs(a.age-b.age)>30)c*=.6;return c}
// ---- nastrój, mir ----
function jobCraft(p){if(p.job==='wb'){const b=bById(p.wb);return b?BD[b.kind].c||null:null}return p.job==='rob'||p.job==='bud'?'ciesla':null}
function zadOf(p){const r=[];let s=0,w=0;const add=(v,wt,why)=>{s+=v*wt;w+=wt;if(v<.6&&why)r.push([v,why])};const h=homeOf(p);
 add(S.fedR>=.999?1:S.fedR*.8,2,'głód');add(p.warm===undefined?1:p.warm,1.5,'zimno');add(h&&bDone(h)?(p.waitHome?.55:1):.15,1.5,p.waitHome?'czeka na własny dom':'brak dachu nad głową');
 add(p.hp,1,'choroba albo rana');const fr=friendsOf(p).length,fam=famMembers(p.fam).length>1;add(fam||fr?Math.min(1,.55+.22*fr+(fam?.25:0)):.3,1,'samotność');
 if(isAdult(p)&&p.job!=='wyp'){const best=Math.max(...Object.values(p.sk)),cur=jobCraft(p);if(best>=3&&cur!==null&&(p.sk[cur]||0)<best-1)add(.45,.8,'praca nie po fachu')}
 if(p.trait==='Uparty'&&law('u_starsi'))add(.3,.6,'nie znosi, że rządzą starsi');if(p.trait==='Dociekliwy'&&law('nauka'))add(1,.4);
 const rv=rivalsOf(p);if(rv.length)add(.5,.5,'zatarg: '+rv[0].name);add(S.hope,1,S.hope<.45?'brak nadziei':null);
 p.zad=s/w;p.zr=r.sort((a,b)=>a[0]-b[0]).slice(0,2).map(x=>x[1]);return p.zad}
function zadWord(p){const z=p.zad===undefined?.65:p.zad,k=p.sex==='k';return z>=.8?(k?'zadowolona':'zadowolony'):z>=.62?(k?'spokojna':'spokojny'):z>=.45?(k?'markotna':'markotny'):(k?'rozgoryczona':'rozgoryczony')}
function mirOf(p){let m=p.mirX||0;Object.values(p.sk).forEach(l=>{if(l>1)m+=(l-1)*4});if(p.age>45)m+=Math.min(10,(p.age-45)*.6);if(S.offices&&S.offices.starszy===p.id)m+=10;return m}
function mirWord(p){if(!isAdult(p))return'dziecko';const m=mirOf(p);return m<8?'jeszcze bez znaczenia':m<18?'znan'+(p.sex==='k'?'a':'y')+' w osadzie':m<32?'ceniony'.replace(/y$/,p.sex==='k'?'a':'y'):m<50?'szanowan'+(p.sex==='k'?'a':'y'):'poważan'+(p.sex==='k'?'a':'y')+' przez wszystkich'}
function avgZad(m){return m.length?m.reduce((a,p)=>a+(p.zad===undefined?.65:p.zad),0)/m.length:.65}
function ludDis(){if(!S||!S.people.length)return 0;return(.62-avgZad(S.people))*.03}
{const _e=eff;eff=function(p){return _e(p)*(p._se||1)*(.94+.1*(p.zad===undefined?.6:p.zad))}}
// ---- przysiółki: rody, które odeszły dalej, wciąż są częścią wspólnoty ----
function hamletSpot(r){let ci=r.i,cj=r.j,best=null,bs=1e9;for(let rr=0;rr<16;rr++)for(let a=0;a<20;a++){const i=Math.round(ci+Math.cos(a/20*6.28)*rr),j=Math.round(cj+Math.sin(a/20*6.28)*rr);if(i<3||j<3||i>N-4||j>N-4)continue;const k=j*N+i;if(!land[k]||beach[k]||occ[k]>=0)continue;
  const sc=forestF(i+.5,j+.5)*20+rr*.6+(tileH(i,j)>6?8:0);if(sc<bs){bs=sc;best=[i,j]}}return best||[ci,cj]}
function hamClear(h){const x0=tcx(h.i),z0=tcx(h.j);nodeBy.tree.forEach(n=>{if(n.amt>0&&Math.hypot(n.x-x0,n.z-z0)<3.2){n.amt=0;const k=nodes.indexOf(n);if(k>=0)S.nodeAmt[k]=0;nodeVis(n)}})}
function foundHamlet(m,why,rid,o){if(!m.length)return null;o=o||{};ludInit();const fid=m[0].fam,nm=famName(fid),head=m.filter(isAdult).sort((a,b)=>(b.sex==='m')-(a.sex==='m')||b.age-a.age)[0]||m[0];
 const used=new Set(S.hamlets.map(h=>h.rid));let cands=REGIONS.filter(r=>r&&r.id!==0&&!used.has(r.id)&&S.regs&&S.regs[r.id]);
 if(!cands.length)cands=REGIONS.filter(r=>r&&r.id!==0&&!used.has(r.id));const dist=r=>Math.hypot(r.i-camp.i,r.j-camp.j);cands.sort((a,b)=>dist(a)-dist(b));const r=rid!==undefined&&REGIONS[rid]?REGIONS[rid]:cands[0];if(!r)return null;
 const[i,j]=hamletSpot(r);reveal(i,j,6);const h={id:(S.hid=(S.hid||0)+1),rid:r.id,i,j,name:placeName(head.name),rod:head.rod,pop:m.length,wiez:o.wiez!==undefined?o.wiez:why==='spor'?.25:.5,zap:o.zap!==undefined?o.zap:.45,day:S.day,ppl:m.map(p=>p.name),head:head.name,why:why||''};
 const stay=famMembers(fid).filter(p=>!m.includes(p));m.forEach(p=>{p.waitHome=0;leavePerson(p)});if(S.fams[fid]&&!stay.length){S.fams[fid].home=null;delete S.fams[fid]}S.hamlets.push(h);hamVis();
 if(!o.quiet)log(`Rodzina ${nm} odchodzi w głąb wyspy, ale nie znika: ${r.known?'w krainie '+r.name:'daleko od brzegu'} stawia szałasy. Tak powstaje ${h.name}. To wciąż nasi ludzie, tylko dalej.`);toast('Nowy przysiółek: '+h.name);return h}
const hamM={};
function hamVis(){if(!S||!S.hamlets)return;S.hamlets.forEach(h=>{if(!hamM[h.id]){hamClear(h);const g=new THREE.Group();const a=makeBuildingModel('szalas',null);a.position.set(-1.4,0,.2);a.rotation.y=.4;g.add(a);
  if(h.pop>=5){const b=makeBuildingModel('chata',null);b.position.set(1.5,0,-.3);b.rotation.y=-.5;g.add(b)}const x=tcx(h.i),z=tcx(h.j);g.position.set(x,Hy(x,z),z);g.scale.setScalar(.9);scene.add(g);hamM[h.id]=g;hamM[h.id].pop5=h.pop>=5}
  else if(h.pop>=5&&!hamM[h.id].pop5){retireObjects(hamM[h.id]);delete hamM[h.id];return hamVis()}
  hamM[h.id].visible=revAt(h.i,h.j)})}
{const _rs=regionScan;regionScan=function(q){_rs(q);if(S&&S.hamlets&&S.hamlets.length)hamVis()}}
function wiezWord(h){return h.wiez>=.6?'bliska':h.wiez>=.4?'dobra':h.wiez>=.2?'chłodna':'prawie zerwana'}
function hamletHTML(){if(!S.hamlets||!S.hamlets.length)return'';const tot=S.hamlets.reduce((a,h)=>a+h.pop,0);
 return`<h3>Przysiółki</h3><p class="lead">Wspólnota: ${S.people.length} osób w osadzie i ${tot} w przysiółkach. Rody, które odeszły dalej, wciąż są nasze: przysyłają dary, a ich młodzi wracają do nas na swaty.</p>`+
  S.hamlets.map(h=>{const r=REGIONS[h.rid];return`<div class="card"><h4>${h.name}</h4><p>${r&&r.known?r.name+' · ':''}${h.pop} osób · więź ${wiezWord(h)} · ${rodName(h.rod)}</p><p class="mut">Założyli: ${h.ppl.join(', ')}.</p><button data-ham="${h.id}" style="margin-top:6px">Wyślij dary (20 jedzenia, 6 opału)</button></div>`}).join('')}
document.addEventListener('click',e=>{const t=e.target.closest('[data-ham]');if(!t||!S)return;const h=S.hamlets.find(x=>x.id===+t.dataset.ham);if(!h)return;
 if(foodTotal()<40||S.res.opal<6){toast('Za mało zapasów, żeby się dzielić.');return}const tot=foodTotal();FOOD.forEach(k=>S.res[k]=Math.max(0,S.res[k]-20*(S.res[k]/tot)));S.res.opal-=6;
 h.wiez=Math.min(1,h.wiez+.15);log(`Do ${h.name} poszły dary: jedzenie i opał. Więź jest ${wiezWord(h)}.`);toast('Dary wysłane');renderPanel()});
// ---- drzewo rodów ----
function rodyHTML(){const ids=Object.keys(S.rody||{});if(!ids.length)return'';let h='<h3>Rody</h3>';
 ids.forEach(id=>{const mem=S.people.filter(p=>String(p.rod)===id),hm=S.hamlets.filter(x=>String(x.rod)===id);if(!mem.length&&!hm.length)return;const shown=new Set(),lines=[];
  mem.filter(p=>p.pair!==null&&pById(p.pair)).sort((a,b)=>b.age-a.age).forEach(p=>{const q=pById(p.pair);if(shown.has(p.id))return;shown.add(p.id);shown.add(q.id);
   const kids=S.people.filter(c=>c.par&&(c.par.includes(p.id)||c.par.includes(q.id))&&c.pair===null);kids.forEach(c=>shown.add(c.id));
   lines.push(`<b>${p.name}</b> ⚭ <b>${q.name}</b>${kids.length?'<br><span class="mut">dzieci: '+kids.map(c=>c.name+' '+Math.floor(c.age)).join(', ')+'</span>':''}${p.waitHome?'<br><span class="mut">czekają na własny dom</span>':''}`)});
  const rest=mem.filter(p=>!shown.has(p.id));if(rest.length)lines.push('<span class="mut">'+rest.map(p=>p.name+(p.widowT&&S.day<p.widowT+YEAR?(p.sex==='k'?' (wdowa)':' (wdowiec)'):'')).join(', ')+'</span>');
  hm.forEach(x=>lines.push(`<span class="mut">przysiółek ${x.name}: ${x.pop} osób</span>`));
  h+=`<div class="card"><h4>${S.rody[id]&&S.rody[id].znak?S.rody[id].znak+' ':''}${rodName(id).replace(/^r/,'R')}</h4>${lines.map(l=>`<p style="margin:4px 0">${l}</p>`).join('')}</div>`});return h}
function ludCard(p){const q=p.pair!==null?pById(p.pair):null;const fr=friendsOf(p),rv=rivalsOf(p);
 return`<p class="mut">${S.rody&&S.rody[p.rod]&&S.rody[p.rod].znak?S.rody[p.rod].znak+' ':''}${escapeHtml(rodName(p.rod))}${q?` · ${p.sex==='k'?'mąż':'żona'}: ${escapeHtml(q.name)}`:''}${p.waitHome?' · czekają na własny dom':''}</p>`+
  (p.age>=14?`<p>Nastrój: <b>${zadWord(p)}</b>${p.zr&&p.zr.length?' · '+p.zr.join(', '):''}</p><p class="mut">Mir: ${mirWord(p)}${fr.length?' · przyjaciele: '+fr.map(x=>x.name).join(', '):' · bez bliskich przyjaciół'}${rv.length?' · zatarg: '+rv[0].name:''}</p>`:'')}
// ---- rytm dnia ----
function single(p){return p.pair===null&&p.age>=(p.sex==='m'?18:17)&&p.age<=46&&!p.waitHome&&!(p.widowT&&S.day<p.widowT)}
// 3.3: zakaz ślubu w bliskim pokrewieństwie (rodzeństwo, kuzynostwo, wuj i bratanica), a nie w całym rodzie: ród po kilku pokoleniach to pół wsi
const kinX=(a,b)=>!!a&&!!b&&a.some(x=>b.includes(x));
function kinClose(a,b){const pa=a.par,pb=b.par;if(!pa&&!pb)return a.rod===b.rod;const ga=a.gp||[],gb=b.gp||[];
 return(pa||[]).includes(b.id)||(pb||[]).includes(a.id)||ga.includes(b.id)||gb.includes(a.id)||kinX(pa,pb)||kinX(ga,gb)||kinX(pa,gb)||kinX(pb,ga)}
function wedOk(a,b){return a.sex!==b.sex&&!kinClose(a,b)}
function freeHouse(){return S.bld.find(b=>bDone(b)&&BD[b.kind].house&&!Object.values(S.fams).some(f=>f.home===b.id))}
function ludDaily(){if(!ludReady)ludInit();const ad=S.people.filter(p=>p.age>=14),yr=Math.floor(S.day/YEAR),rd=Math.floor(rday());
 for(const k in S.rel){S.rel[k]*=.993;if(Math.abs(S.rel[k])<2)delete S.rel[k]}
 const groups={};ad.forEach(p=>{const g=p.job==='wb'?'b'+p.wb:p.job==='wyp'?'e'+p.exp:p.job==='rob'||p.job==='bud'?'r':null;if(g)(groups[g]=groups[g]||[]).push(p)});
 Object.entries(groups).forEach(([g,arr])=>{for(let i=0;i<arr.length;i++)for(let j=i+1;j<arr.length;j++){if(g==='r'&&Math.random()>.3)continue;relAdd(arr[i],arr[j],K*(g[0]==='e'?2.4:1.1)*compat(arr[i],arr[j]))}});
 if(seasonIdx()===2&&(law('opowiesci')||wspOn()))for(let q=0;q<5;q++){const a=lpick(ad),b=lpick(ad);if(a&&b&&a!==b)relAdd(a,b,2)}
 if((S.dis||0)>.4&&Math.random()<(S.dis-.3)*K*.6){const a=lpick(ad),b=lpick(ad);if(a&&b&&a!==b&&a.fam!==b.fam){relAdd(a,b,-14);if(Math.random()<.5)log(`${a.name} i ${b.name} kłócą się o ${['drewno','jedzenie','pracę','miejsce przy ogniu'][(Math.random()*4)|0]}. Od tej pory omijają się szerokim łukiem.`)}}
 // spotkania przy studni, przy ogniu, w drodze: wieś się poznaje
 for(let q=0;q<6;q++){const a=lpick(ad),b=lpick(ad);if(a&&b&&a!==b)relAdd(a,b,2*compat(a,b))}
 {const sg=S.people.filter(single);for(let q=0;q<2;q++){const a=lpick(sg),b=lpick(sg);if(a&&b&&wedOk(a,b)&&Math.abs(a.age-b.age)<12)relAdd(a,b,2.2*K*(seasonIdx()===0?1.4:1))}}
 if(law('u_swoje')&&Math.random()<.2*K){const a=lpick(ad),b=lpick(ad);if(a&&b&&a!==b)relAdd(a,b,-4)}
 // noc Kupały: wianki i paproć
 if(rd===0&&yr>=1&&!S.seen['kupL'+yr]){S.seen['kupL'+yr]=1;let n=0;const sg=S.people.filter(single);sg.forEach(a=>sg.forEach(b=>{if(a.id<b.id&&wedOk(a,b)&&relGet(a,b)>12){relAdd(a,b,14);n++}}));
  if(n)log('W noc Kupały dziewczęta puszczają wianki na wodę, a chłopcy wyławiają je z zatoki. Niejeden wianek trafia w ręce, w które miał trafić.')}
 // nastrój i wydajność
 S.people.forEach(p=>{zadOf(p);const g=p.job==='wb'?'b'+p.wb:null;let se=1;if(g&&groups[g]){const fr=friendsOf(p).filter(q=>q.job==='wb'&&q.wb===p.wb).length,rv=rivalsOf(p).filter(q=>q.job==='wb'&&q.wb===p.wb).length;se=1+.04*Math.min(2,fr)-.06*Math.min(1,rv)}p._se=se});
 // wesele
 if(S.wed&&S.day>=S.wed.day){const k=pById(S.wed.k),m=pById(S.wed.m);S.wed=null;if(k&&m&&k.pair===null&&m.pair===null)wedding(k,m)}
 // swaty
 if(!S.wed&&Math.random()<.3*K){const c=S.people.filter(single);let best=null,bv=offHolder('swat')?36:44;c.filter(p=>p.sex==='k').forEach(k=>c.filter(m=>m.sex==='m'&&wedOk(k,m)&&Math.abs(k.age-m.age)<16).forEach(m=>{const v=relGet(k,m);if(v>bv){bv=v;best=[k,m]}}));
  if(best){const[k,m]=best;S.wed={k:k.id,m:m.id,day:Math.floor(S.day)+2+((Math.random()*3)|0)};log(`Swaty. Do chaty, w której mieszka ${k.name}, przychodzą swaci od ${gen(m.name)} z chlebem i solą. Chleb zostaje przyjęty: za kilka dni wesele.`);toast('Swaty: '+k.name+' i '+m.name)}
  else if(S.hamlets.length&&Math.random()<.08){const h=S.hamlets.filter(x=>x.pop>=4&&x.wiez>=.45)[0];const lone=c.filter(p=>p.age>=19&&p.age<=36&&!relsOf(p).some(x=>x[1]>=30&&x[0].sex!==p.sex))[0];
   if(h&&lone){const sex=lone.sex==='k'?'m':'k',age=18+Math.random()*8;const np=newPerson(S.pid++,newName(sex),age,sex,lone.fam,{zbieracz:1,[sex==='m'?'drwal':'krawiec']:1},TKEYS[(Math.random()*TKEYS.length)|0]);np.rod=h.rod;np.par=[];np.mirX=0;np.fromHam=h.id;
    const hc=homeOf(lone);const c0=hc?bCenter(hc):{x:tcx(camp.i),z:tcx(camp.j)};np.x=c0.x+.8;np.z=c0.z+.6;S.people.push(np);addPersonMesh(np);h.pop--;relAdd(np,lone,52);
    log(`Z przysiółka ${h.name} przychodzi ${np.name}, ${Math.floor(age)} lat. W przysiółku za ciasno, a tu ${lone.name} od dawna nie ma z kim tańczyć.`);assign()}}}
 // młodzi czekający na dom
 S.people.filter(p=>p.waitHome&&p.sex==='k').forEach(k=>{const m=pById(k.pair);if(!m){k.waitHome=0;return}const fh=freeHouse();if(!fh)return;const fid=S.fid++;S.fams[fid]={id:fid,home:fh.id};k.fam=fid;m.fam=fid;k.waitHome=0;m.waitHome=0;
  log(`${k.name} i ${m.name} wprowadzają się do własnego domu (${BD[fh.kind].n.toLowerCase()}). Nowe gospodarstwo w osadzie.`);toast('Nowe gospodarstwo: '+k.name+' i '+m.name)});
 // sieroty
 Object.values(S.fams).forEach(f=>{const mem=famMembers(f.id);if(!mem.length||mem.some(p=>p.age>=16))return;const tg=Object.values(S.fams).filter(g=>g.id!==f.id&&g.home&&famMembers(g.id).some(p=>p.age>=18)).sort((a,b)=>(famMembers(a.id)[0].rod===mem[0].rod?-1:0)-(famMembers(b.id)[0].rod===mem[0].rod?-1:0)||famMembers(a.id).length-famMembers(b.id).length)[0];
  if(!tg)return;mem.forEach(c=>c.fam=tg.id);f.home=null;delete S.fams[f.id];log(`${mem.map(c=>c.name).join(' i ')} ${mem.length>1?'zostają':'zostaje'} bez rodziców. Pod swój dach ${mem.length>1?'biorą ich':'bierze'} rodzina ${famName(tg.id)}.`)});
 // przysiółki żyją
 S.hamlets.forEach(h=>{if(Math.random()<K*.0022*h.pop*(.5+S.hope)*(h.zap===undefined?1:h.zap>.3?1.15:.25)*Math.max(0,1-h.pop/38)){h.pop++;if(Math.random()<.3)log(`W przysiółku ${h.name} urodziło się dziecko. Wieść przynosi ktoś, kto szedł tamtędy po żywicę.`)}
  h.wiez+=((h.road===2?.55:.4)-h.wiez)*.004*K;if(rd%SD===3&&!S.seen['hamg'+h.id+'_'+Math.floor(S.day/SD)]&&h.wiez>=.3){S.seen['hamg'+h.id+'_'+Math.floor(S.day/SD)]=1;const G=(typeof hamGifts==='function'&&hamGifts(h))||[['mieso',2],['skory',1],['miod',1],['drewno',3],['ryby',2],['grzyby',2]];const g=G[(Math.random()*G.length)|0];const q=Math.max(2,Math.round(g[1]*(h.zap===undefined?h.pop:2+Math.sqrt(h.pop)*2)*(.6+h.wiez)*(h.road===2?1.5:1)*(h.zap!==undefined&&h.zap<.25?.4:1)));if(typeof walkGift==='function')walkGift(h,g[0]);S.res[g[0]]=(S.res[g[0]]||0)+q;log(`Z przysiółka ${h.name} przyszli z darami: ${RN[g[0]].toLowerCase()} ${q}.`)}});
 hamVis()}
function wedding(k,m){const ob=law('obrzedy');const n=S.people.length;if(ob){const tot=foodTotal(),c=K*n*.4;if(tot>c*3)FOOD.forEach(x=>S.res[x]=Math.max(0,S.res[x]-c*(S.res[x]/tot)))}
 k.pair=m.id;m.pair=k.id;k.wedDay=m.wedDay=S.day;k.rodB=k.rod;k.rod=m.rod;S.weds=(S.weds||0)+1;S.wh=(S.wh||0)+(ob?.06:.03);S.wd=(S.wd||0)-.02;
 const fa=famMembers(k.fam).filter(isAdult),fb=famMembers(m.fam).filter(isAdult);fa.forEach(a=>fb.forEach(b=>relAdd(a,b,6)));
 const fh=freeHouse();if(fh){const fid=S.fid++;S.fams[fid]={id:fid,home:fh.id};k.fam=fid;m.fam=fid}else{k.fam=m.fam;k.waitHome=1;m.waitHome=1}
 log(ob?`Wesele: ${k.name} i ${m.name}. Cała osada przy jednym ogniu, grają fujarki. Po północy oczepiny: druhny zdejmują pannie młodej wianek i zakładają jej czepiec.${fh?' Młodzi idą do własnego domu.':' Na razie zamieszkają u '+gen(famName(m.fam))+', dopóki nie stanie dla nich dom.'}`:`${k.name} i ${m.name} zostają mężem i żoną. Skromnie, bez uczty.${fh?' Mają już własny dom.':' Na razie mieszkają u '+gen(famName(m.fam))+'.'}`);
 toast('Wesele: '+k.name+' i '+m.name);if(ob&&typeof fujarka==='function')fujarka();assignHomes()}
// mir za czyny
{const _ef=endFire;endFire=function(b){const ff=S.people.filter(p=>p.fireB===b.id),saved=b.fire&&b.fire.hp>0;_ef(b);if(saved)ff.forEach(p=>p.mirX=(p.mirX||0)+4)}}
{const _fx=finishExp;finishExp=function(e,out){_fx(e,out);out.filter(p=>S.people.includes(p)).forEach(p=>p.mirX=(p.mirX||0)+3)}}
{const _kp=killPerson;killPerson=function(p,why){const q=p.pair!==null?pById(p.pair):null;_kp(p,why);if(q){q.widowT=S.day+YEAR*.5;q.waitHome=0}if(S.wed&&(S.wed.k===p.id||S.wed.m===p.id))S.wed=null}}
