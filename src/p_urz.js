
/* ================= 0.16: urzędy, spory rodów, dojrzewanie obyczajów ================= */
// ---- urzędy rodzą się z potrzeb; wiec obsadza je sam, a gracz może zmienić wybór na wiecu ----
function bestCraftOf(p){return Object.keys(CN).sort((a,b)=>p.sk[b]-p.sk[a])[0]}
const OFFS=[
 {id:'starszy',n:['Starszy osady','Starsza osady'],when:()=>true,d:'Prowadzi wiec i łagodzi spory. Jego mir sprawia, że wyroki łatwiej przyjąć.',fit:p=>(p.age>40?8:0)+(p.trait==='Pogodny'||p.trait==='Nauczyciel'?8:0)+(p.trait==='Uparty'?-6:0)},
 {id:'straznik',n:['Strażnik ognia','Strażniczka ognia'],when:()=>!!S.seen.fire1||law('straz'),why:'Po pierwszym pożarze ktoś musi pilnować ognia.',d:'Pilnuje palenisk: pożary wybuchają rzadziej i szybciej gasną.',fit:p=>(p.trait==='Ostrożny'?12:p.trait==='Wytrwały'?6:0)+(p.age>=20&&p.age<=55?6:-6)},
 {id:'zielarka',n:['Zielarz','Zielarka'],when:()=>hasB('izbachorych')||tech('u_ziel'),why:'Gdy osada poznała zioła, ktoś musi umieć je dawać.',d:'Chorzy zdrowieją szybciej, a lęki z wierzeń słabną.',fit:p=>p.sk.zbieracz*4+(p.sex==='k'?4:0)+(p.trait==='Cierpliwy'?6:0)},
 {id:'gospodyni',n:['Gospodarz zapasów','Gospodyni zapasów'],when:()=>hasB('spizarnia'),why:'Spiżarnia potrzebuje kogoś, kto liczy worki i beczki.',d:'Jedzenie psuje się wolniej, a gdy zapasów ubywa, ostrzega przed głodem.',fit:p=>(p.trait==='Cierpliwy'?10:0)+(p.sex==='k'?4:0)+(p.age>30?4:0)},
 {id:'swat',n:['Swat','Swatka'],when:()=>(S.weds||0)>=1,why:'Po pierwszym weselu ktoś zaczął kojarzyć młodych.',d:'Młodzi szybciej się dobierają, a rody rzadziej się kłócą.',fit:p=>(p.trait==='Pogodny'?14:0)+(p.age>40?8:0)},
 {id:'mistrz',n:['Mistrz fachu','Mistrzyni fachu'],when:()=>S.people.some(p=>isAdult(p)&&Math.max(...Object.values(p.sk))>=5),why:'Ktoś osiągnął najwyższy poziom fachu.',d:'Wszyscy uczący się jego fachu robią postępy szybciej.',fit:p=>Math.max(...Object.values(p.sk))>=5?40:-50}];
const OFF_BY={};OFFS.forEach(o=>OFF_BY[o.id]=o);
const offTitle=(id,p)=>OFF_BY[id].n[p&&p.sex==='k'?1:0];
offLv=function(id){id={zielarz:'zielarka',spizarnia:'gospodyni'}[id]||id;if(!OFF_BY[id])return 0;const p=offHolder(id);if(!p)return 0;
 if(id==='starszy')return 2+(p.trait==='Nauczyciel'||p.trait==='Pogodny'?2:0);return 2+(mirOf(p)>=32?1:0)};
setOffice=function(id,pid){S.offices=S.offices||{};if(S.offices[id]!==undefined&&S.offices[id]!==null&&!wiecOpen()){toast('Urzędy obsadza wiec, raz na porę roku.');renderPanel();return}
 S.offices[id]=pid===''?null:+pid;const p=pById(+pid);if(p){log(`Wiec powierza urząd: ${offTitle(id,p).toLowerCase()} — ${p.name}.`);if(S.day>3)S.wiecUsedSt=seasonKey()}renderPanel()};
function offCands(o){return S.people.filter(p=>isAdult(p)&&p.state!=='away'&&!Object.entries(S.offices||{}).some(([k,v])=>k!==o.id&&v===p.id)).map(p=>[p,mirOf(p)+o.fit(p)]).sort((a,b)=>b[1]-a[1])}
function urzDaily(){S.offices=S.offices||{};S.offSeen=S.offSeen||{};const wk=seasonKey();
 OFFS.forEach(o=>{if(!o.when())return;const first=!S.offSeen[o.id];if(first){S.offSeen[o.id]=1;if(o.id!=='starszy')log(`Pojawia się nowy urząd: ${o.n[0].toLowerCase()}. ${o.why||''}`)}
  if(offHolder(o.id))return;if(!first&&S.offAuto===wk+'_'+o.id)return;
  if(o.id==='starszy'&&S.day<SD)return;
  const c=offCands(o)[0];if(!c||c[1]<-10)return;S.offAuto=wk+'_'+o.id;S.offices[o.id]=c[0].id;
  log(`Wiec ${first?'':'na nowo '}powierza urząd: ${offTitle(o.id,c[0]).toLowerCase()} — ${c[0].name} (${mirWord(c[0])}).`)});
 const ms=offHolder('mistrz');S.offCraft=ms?bestCraftOf(ms):null;
 // ostrzeżenie gospodyni
 const gd=offHolder('gospodyni');if(gd){const need=K*S.people.reduce((a,p)=>a+(p.age<3?.3:p.age<12?.6:p.age>55?.8:1),0)||1;const days=foodTotal()/need;const key='gosp'+Math.floor(S.day/SD);if(days<5&&!S.seen[key]){S.seen[key]=1;log(`${gd.name} ostrzega: jedzenia starczy na ${Math.max(0,Math.floor(days))} dni. Trzeba więcej rąk przy zbieraniu i łowach.`);toast('Gospodyni ostrzega przed głodem')}}
 // zły wybór psuje zgodę
 OFFS.forEach(o=>{const p=offHolder(o.id);if(p&&mirOf(p)<8)S.wd=(S.wd||0)+.002});
 sporDaily();obyDaily()}
function officesHTML(){const w=wiecOpen();let h=`<div class="card"><h4>Urzędy</h4><p class="mut">Urzędy rodzą się z potrzeb osady. Wiec obsadza je sam, wybierając ludzi z mirem. Na wiecu możesz zmienić wybór.</p>`;
 OFFS.filter(o=>o.when()).forEach(o=>{const p=offHolder(o.id),cs=offCands(o).slice(0,6).map(x=>x[0]);if(p&&!cs.includes(p))cs.unshift(p);
  h+=`<div style="margin-top:9px"><b>${offTitle(o.id,p)}</b><p class="mut" style="margin:2px 0 4px">${o.d}${o.id==='mistrz'&&p?' Fach: '+CN[bestCraftOf(p)]+'.':''}</p><select data-off="${o.id}"${p&&!w?' disabled':''}><option value="">nikt</option>${cs.map(q=>`<option value="${q.id}"${p&&p.id===q.id?' selected':''}>${q.name} · ${Math.floor(q.age)} l. · ${mirWord(q)}</option>`).join('')}</select></div>`});
 return h+'</div>'}
// ---- spory rodów i sąd pod dębem ----
const SPOR_T={
 lup:(a,b)=>`${a.name} mówi, że ${b.name} ${b.sex==='k'?'wzięła':'wziął'} z wyprawy więcej, niż mu się należało.`,
 kradziez:(a,b)=>`Ze spiżarni zginęło jedzenie. ${a.name} ${a.sex==='k'?'widziała':'widział'} w nocy kogoś z domu, gdzie mieszka ${b.name}.`,
 miedza:(a,b)=>`${a.name} twierdzi, że ${b.name} ${b.sex==='k'?'przesunęła':'przesunął'} miedzę i orze kawałek jego pola.`,
 krzywda:(a,b)=>`${a.name} wini ${gen(b.name)} za ranę odniesioną przy wspólnej pracy.`,
 slowo:(a,b)=>`${a.name} i ${b.name} od dawna się nie znoszą. Wczoraj przy ogniu padły słowa, których nie da się cofnąć.`,
 swaty:(a,b)=>`Ród ${gen(S.rody[a.rod]?S.rody[a.rod].name:a.name)} czuje się urażony: swaty z ${b.name} zostały odprawione bez chleba.`};
function judge(){const st=offHolder('starszy');return hasB('gaj')?'pod starym dębem, w świętym gaju':st?'przed '+(st.sex==='k'?'starszą':'starszym')+' osady, '+st.name:'przed całym wiecem'}
function sporDaily(){S.feuds=S.feuds||[];
 // waśnie: psują więzi, gasną z czasem albo przez wesele
 S.feuds=S.feuds.filter(f=>{const A=S.people.filter(p=>p.fam===f.a||p.rod===f.ra),B=S.people.filter(p=>p.fam===f.b||p.rod===f.rb);if(!A.length||!B.length)return false;
  if(S.people.some(p=>p.pair!==null&&((p.rod===f.ra&&pById(p.pair)&&pById(p.pair).rod===f.rb)||(p.rod===f.rb&&pById(p.pair)&&pById(p.pair).rod===f.ra))&&p.wedDay>f.since)){log(`Wesele połączyło zwaśnione rody. Waśń gaśnie: kto by się kłócił z własnymi wnukami.`);return false}
  S.wd=(S.wd||0)+.003;if(Math.random()<.3){const a=lpick(A),b=lpick(B);if(a&&b)relAdd(a,b,-3)}
  const rd=Math.floor(rday());if((rd===9||rd===12)&&!S.seen['feudR'+f.id+'_'+Math.floor(S.day/YEAR)+rd]){S.seen['feudR'+f.id+'_'+Math.floor(S.day/YEAR)+rd]=1;
   if(Math.random()<.35+(hasB('gaj')?.25:0)+(offHolder('swat')?.15:0)){log(`${rd===9?'Na Dziady':'W Szczodre Gody'} zwaśnione rody siadają przy jednym stole. Ktoś łamie chleb na pół. Waśń się kończy.`);A.forEach(a=>B.forEach(b=>relAdd(a,b,8)));return false}}
  return true});
 if(S.spor||S.day<12)return;if(S.sporNext&&S.day<S.sporNext)return;
 const ad=S.people.filter(isAdult);let pair=null,why='slowo';
 const riv=[];ad.forEach(a=>relsOf(a).forEach(([b,v])=>{if(v<=-30&&a.fam!==b.fam&&a.id<b.id&&isAdult(b))riv.push([a,b])}));
 const p0=Math.min(.5,K*(.005+.012*riv.length+.01*Math.max(0,(S.dis||0)-.3)+(S.hungerDays>0?.02:0)+(law('lup')?.006:0)+(S.bld.filter(b=>b.field).length>=2?.004:0))*(offHolder('swat')?.8:1));
 if(Math.random()>p0)return;
 if(riv.length){pair=lpick(riv);why='slowo'}
 else{const a=lpick(ad),b=lpick(ad.filter(q=>a&&q.fam!==a.fam));if(!a||!b)return;pair=[a,b];why=S.hungerDays>0?'kradziez':law('lup')&&S.seen.zbior1&&Math.random()<.5?'lup':S.bld.filter(x=>x.field).length>=2&&Math.random()<.5?'miedza':Math.random()<.5?'krzywda':'slowo'}
 const[a,b]=pair;S.spor={a:a.id,b:b.id,why,day:S.day};S.sporNext=S.day+8+Math.random()*6;openSpor()}
function openSpor(){if(!ludReady)ludInit();if(evOpen||placing){gameLater(openSpor,4000);return}const s=S.spor;if(!s)return;const a=pById(s.a),b=pById(s.b);if(!a||!b){S.spor=null;return}
 const accBase=.5+(offHolder('starszy')?Math.min(.25,mirOf(offHolder('starszy'))/200):0)+(hasB('gaj')?.15:0)+(law('sad')?.1:law('s_wiec')?.05:0);
 const verdict=(win,lose,txt)=>{const acc=clamp(accBase+(win&&lose?(mirOf(win)-mirOf(lose))/250:.08),.15,.95);S.spor=null;
  if(Math.random()<acc){if(lose){famMembers(lose.fam).filter(isAdult).forEach(x=>famMembers(win.fam).filter(isAdult).forEach(y=>relAdd(x,y,-3)));lose.mirX=(lose.mirX||0)-2}
   if(!win){relAdd(a,b,6);S.wd=(S.wd||0)-.01}return txt+' Wyrok zapada '+judge()+' i obie strony go przyjmują.'}
  const f={id:(S.fid2=(S.fid2||0)+1),a:a.fam,b:b.fam,ra:a.rod,rb:b.rod,since:S.day};S.feuds.push(f);S.wd=(S.wd||0)+.03;
  log(`Waśń rodów: ${rodName(a.rod)} i ${rodName(b.rod)} nie odzywają się do siebie.`);return txt+' Ale strona, która przegrała, nie przyjmuje wyroku. Zaczyna się waśń rodów.'};
 openEvent({ey:'Spór rodów',t:SPOR_T[s.why]?{lup:'Podział łupu',kradziez:'Kradzież ze spiżarni',miedza:'Miedza',krzywda:'Krzywda',slowo:'Słowo za słowo',swaty:'Odprawione swaty'}[s.why]:'Spór',
  text:()=>`${SPOR_T[s.why](a,b)} Sprawa staje ${judge()}.\n\n${a.name}: ${mirWord(a)}, ${rodName(a.rod)}. ${b.name}: ${mirWord(b)}, ${rodName(b.rod)}.`,
  opts:[{n:'Racja po stronie: '+a.name,d:'druga strona może się obrazić',f:()=>verdict(a,b,`Wiec przyznaje rację: ${a.name}.`)},
   {n:'Racja po stronie: '+b.name,d:'druga strona może się obrazić',f:()=>verdict(b,a,`Wiec przyznaje rację: ${b.name}.`)},
   {n:'Wina po połowie',d:'nikt nie wygrywa, ale łatwiej o zgodę',f:()=>verdict(null,null,'Wiec dzieli winę po połowie: każdy coś oddaje.')},
   {n:'Odłożyć do wiecu',d:'spór wróci, a złość rośnie',f:()=>{S.spor=null;S.sporNext=S.day+SD;relAdd(a,b,-6);S.wd=(S.wd||0)+.01;return'Spór zostaje odłożony. Obie rodziny patrzą na siebie spode łba.'}}]},{})}
// ---- dojrzewanie obyczajów: ustalenie, obyczaj, dawny obyczaj ----
const OBY=[[0,'ustalenie'],[2*YEAR,'obyczaj'],[4*YEAR,'dawny obyczaj']];
function obyStage(k){const s=S.custSince&&S.custSince[k];if(s===undefined)return 0;const age=S.day-s;return age>=OBY[2][0]?2:age>=OBY[1][0]?1:0}
function obyDaily(){S.custSince=S.custSince||{};S.custPrev=S.custPrev||{};S.custStage=S.custStage||{};
 Object.entries(S.cust||{}).forEach(([k,v])=>{if(!v)return;if(S.custPrev[k]!==v){S.custPrev[k]=v;S.custSince[k]=S.day;S.custStage[k]=0}
  const st=obyStage(k);if(st>(S.custStage[k]||0)){S.custStage[k]=st;const c=CUST_BY[k],o=c&&c.o.find(x=>x.id===v);if(o)log(st===1?`„${o.n}” to już nie zwykłe ustalenie, tylko obyczaj. Dzieci nie pamiętają, że kiedyś było inaczej.`:`„${o.n}” staje się dawnym obyczajem. Zmienić go mogą już tylko młodzi na wiecu pokoleń.`)}});
 const m=Object.keys(S.cust||{}).reduce((a,k)=>a+obyStage(k),0);S.wd=(S.wd||0)-.0006*m}
{const _cc=custChange;custChange=function(k,id){const st=obyStage(k);if(st===2&&!youngVoice()){toast('To dawny obyczaj. Zmienić go mogą tylko młodzi urodzeni na wyspie.');return}
 const before=S.cust[k],d0=S.dis||0;_cc(k,id);if(S.cust[k]!==before){S.dis=clamp(d0+(S.dis-d0)*(st===2?2.5:st===1?1.5:1),0,1);S.custSince=S.custSince||{};S.custSince[k]=S.day;S.custPrev[k]=S.cust[k];S.custStage[k]=0}}}
{const _ch=custHTML;custHTML=function(){let h=_ch();CUSTOMS.forEach(c=>{if(!S.cust[c.k])return;const st=obyStage(c.k);h=h.replace(`<div class="eyebrow">${c.n}</div>`,`<div class="eyebrow">${c.n} · ${OBY[st][1]}</div>`)});return h}}
