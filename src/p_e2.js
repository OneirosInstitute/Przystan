// ================= 2.0 Epoka II: start od gotowej wsi (po siedmiu latach na wyspie) =================
let E2START=false;
const E2_NAME='Przystań';
function e2Quiet(fn){const _l=log,_t=toast;log=()=>{};toast=()=>{};try{return fn()}finally{log=_l;toast=_t}}
// wolne miejsce z odstępem jednego pola od innych budowli
function e2Gap(kind,i,j){const d=BD[kind];for(let a=-1;a<=d.w;a++)for(let b=-1;b<=d.h;b++){const x=i+a,y=j+b;if(x<0||y<0||x>=N||y>=N)return false;const o=occ[y*N+x];if(o>=0)return false}
 const e=entryOf(kind,i,j);return !!e}
function e2Put(kind,i,j,o){o=o||{};const d=BD[kind];const b={id:S.nid++,kind,i,j,prog:d.work,work:d.work,workers:0,want:0,mat:0,del:0,haul:0,inTr:0,cmp:1,bd:S.day-(o.age||YEAR*2),cond:o.cond||(.72+Math.random()*.22)};
 if(o.lv)b.lv=o.lv;if(o.ext)b.ext=o.ext.slice();Object.assign(b,o.x||{});S.bld.push(b);
 for(let a=0;a<d.w;a++)for(let q=0;q<d.h;q++)occ[(j+q)*N+i+a]=b.id;
 nodes.forEach((n,k)=>{if(n.type!=='fish'&&n.i>=i&&n.i<i+d.w&&n.j>=j&&n.j<j+d.h){n.gone=1;n.amt=0;S.nodeAmt[k]=0}});return b}
function e2Find(kind,mode,rnd){const d=BD[kind],R={core:[2,7],house:[3,11],mid:[5,15],outer:[9,21],field:[7,19],res:[4,26],shore:[2,24],far:[14,30]}[mode]||[3,20];
 const cands=[];const a0=rnd()*6.28;
 for(let r=R[0];r<=R[1];r++){const n=Math.max(12,Math.round(r*5));for(let q=0;q<n;q++){const a=a0+q/n*6.28;const ci=Math.round(camp.i+Math.cos(a)*r),cj=Math.round(camp.j+Math.sin(a)*r);
  const i=ci-((d.w-1)>>1),j=cj-((d.h-1)>>1);if(!checkPlace(kind,i,j)||!e2Gap(kind,i,j))continue;
  let s=-r;if(mode==='res'){const c=countInRange(kind,i,j)||0;s=c*1.2-r*.35}else if(mode==='house')s=-Math.abs(r-6)*1.3+rnd()*2;else if(mode==='mid'||mode==='outer'||mode==='field')s=-r+rnd()*3;
  cands.push([s,i,j]);if(mode!=='res'&&cands.length>40)break}if(mode!=='res'&&cands.length>40)break}
 cands.sort((a,b)=>b[0]-a[0]);return cands[0]?[cands[0][1],cands[0][2]]:null}
const E2_PLAN=[['studnia',1,'core'],['serce',1,'core',{x:{st:3}}],['dom',4,'house',{ext:['ogrod','piwnica','ganek']}],['chata',3,'house',{ext:['ogrod','ganek']}],['chata',3,'house',{ext:['ogrod']}],
 ['spizarnia',1,'core',{ext:['lodownia']}],['sklad',2,'mid',{ext:['dobud']}],['studnia',2,'house',{ext:['zuraw']}],
 ['zbieracz',2,'res',{lv:2,ext:['kosze','suszarnia']}],['pomost',1,'shore',{lv:2,ext:['lodz']}],['pomost',1,'shore',{lv:1}],['mysliwy',1,'res',{lv:2,ext:['wnyki']}],['drwal',2,'res',{lv:2,ext:['pila']}],['lesnik',1,'res',{ext:['szkolka']}],
 ['kamien',1,'res',{ext:['kliny']}],['glinianka',1,'res'],['ruda',1,'res'],
 ['laznia',1,'mid'],['izbanauki',1,'mid'],['izbachorych',1,'mid'],
 ['pole',3,'field',{ext:['strach']}],['zagroda',1,'field',{ext:['obora'],x:{animals:9}}],
 ['drewutnia',2,'mid',{ext:['wiata']}],['pracownia',1,'mid',{lv:2}],['warsztat',1,'mid'],['szwalnia',1,'mid',{lv:2}],['kuznia',1,'mid',{lv:2,ext:['miech']}],['garncarnia',1,'mid'],
 ['zarna',1,'mid'],['piekarnia',1,'mid'],['serownia',1,'mid'],['kiszarnia',1,'mid'],['ogrodziol',1,'mid'],['pasieka',1,'outer'],
 ['mielerz',1,'outer'],['cegielnia',1,'outer'],['cmentarz',1,'outer'],['gaj',1,'outer'],['wieza',1,'outer']];
// ludzie: założyciele po siedmiu latach (wiek rośnie dwa lata na rok) i dzieci wyspy
const E2_KIDS=[[1,'Sławomir',15,'m',{drwal:2,zbieracz:1}],[1,'Bogna',11,'k',{}],[1,'Dobrosław',4,'m',{}],[1,'Wit',7,'m',{}],
 [2,'Zbysław',15,'m',{rybak:2}],[2,'Wanda',12,'k',{rolnik:1}],
 [3,'Świętosława',14,'k',{zbieracz:1,krawiec:1}],[3,'Ziemowit',9,'m',{}],[3,'Mścisława',6,'k',{}],
 [4,'Dobromiła',15,'k',{zbieracz:2}],[4,'Gniewko',14,'m',{mysliwy:1}],[4,'Ostoja',12,'m',{rolnik:1}],[4,'Jarosława',8,'k',{}],[4,'Sobiesław',3,'m',{}],
 [7,'Lubomira',12,'k',{krawiec:1}],[7,'Bogdan',10,'m',{}],[7,'Siemowit',6,'m',{}],[7,'Bożena',2,'k',{}],
 [8,'Przemysł',5,'m',{}],[8,'Danuta',3,'k',{}],[8,'Racibor',.5,'m',{}],
 [9,'Mieszko',2,'m',{}],[9,'Sławomira',.5,'k',{}]];
const E2_SK={'Bożydar':{drwal:5,ciesla:3,zbieracz:2},'Dobrawa':{zbieracz:4,rybak:2},'Wiesia':{zbieracz:4,krawiec:2},'Mirek':{rybak:4,drwal:2},'Radosław':{kamieniarz:4,mysliwy:2},'Bogumiła':{rolnik:4,zbieracz:3},
 'Sława':{krawiec:3,zbieracz:2},'Mila':{hodowca:3,rolnik:1},'Wojsław':{kowal:4,murarz:2},'Ludmiła':{ciesla:4,krawiec:2},'Staś':{drwal:4,ciesla:2},'Bolko':{murarz:3,kamieniarz:2},'Mira':{rolnik:3,zbieracz:1},
 'Dobromir':{mysliwy:4,ciesla:3},'Radomira':{rybak:4,mysliwy:1},'Wszebora':{zbieracz:5,hodowca:3},'Jagna':{krawiec:3,hodowca:3}};
function e2SetSk(p,sk){Object.keys(CN).forEach(c=>{const l=sk[c]||0;p.sk[c]=l;p.xp[c]=lvXp(l)+(l?20:0)})}
function e2People(){const P=S.people,by=n=>P.find(p=>p.name===n);
 P.forEach(p=>{p.age+=16;if(E2_SK[p.name])e2SetSk(p,E2_SK[p.name]);p.fachChosen=p.age>=12?1:0;p.hp=1;p.tool={t:2,d:80+Math.random()*100};p.coat=120+Math.random()*80});
 // Lubomir odszedł w czwartej zimie
 const lub=by('Lubomir');if(lub){S.people=S.people.filter(p=>p!==lub);S.deadNames=['Lubomir'];S.died=1;const w=by('Wszebora');if(w)w.pair=null}
 const pair=(a,b,f)=>{const m=by(a),k=by(b);if(!m||!k)return;m.pair=k.id;k.pair=m.id;k.rodB=k.rod!==undefined?k.rod:k.fam;m.fam=f;k.fam=f;k.wedDay=m.wedDay=S.day-YEAR*(2+Math.random()*3);S.fams[f]={id:f,home:null}};
 S.people.forEach(p=>{p.rod=p.fam});
 pair('Staś','Jagna',7);pair('Mirek','Sława',8);pair('Bolko','Wiesia',9);
 ['Staś','Jagna','Bolko','Wiesia'].forEach(n=>{const p=by(n);if(p)p.rod=3});['Mirek','Sława'].forEach(n=>{const p=by(n);if(p)p.rod=1});
 S.fid=10;S.weds=3;Object.keys(S.fams).forEach(f=>{if(!S.people.some(p=>String(p.fam)===String(f)))delete S.fams[f]});
 const par={};S.people.forEach(p=>{if(p.pair!==null&&p.pair!==undefined){par[p.fam]=par[p.fam]||[];par[p.fam].push(p.id)}});
 E2_KIDS.forEach(([f,n,a,s,sk])=>{const p=newPerson(S.pid++,n,a,s,f,sk);p.born=1;p.par=(par[f]||[]).slice();const fa=S.people.find(q=>p.par.includes(q.id)&&q.sex==='m');p.rod=fa?fa.rod:f;p.fachChosen=a>=12?1:0;p.hp=1;
  if(a>=6&&!Object.values(sk).some(v=>v>0)){const pp=S.people.filter(q=>p.par.includes(q.id));const c=Object.keys(CN).sort((x,y)=>Math.max(0,...pp.map(q=>q.sk[y]))-Math.max(0,...pp.map(q=>q.sk[x])))[0];p.sk[c]=1;p.xp[c]=LVL[0]+5}S.people.push(p)});
 S.born=E2_KIDS.length+2;S.rody={1:{name:'Bożydar'},2:{name:'Radosław'},3:{name:'Wojsław'},4:{name:'Dobromir'},5:{name:'Lubomir'},6:{name:'Jagna'}};
 const znaki=['ᛟ','ᚦ','ᛉ','ᚱ','ᛞ','ᚹ'];Object.keys(S.rody).forEach((k,i)=>S.rody[k].znak=znaki[i])}
function e2Hamlet(){// rodzina Dobromira odeszła na wybrzeże i łowi ryby
 const fam=S.people.filter(p=>p.fam===4);if(!fam.length)return;const used=new Set();
 const regs=REGIONS.filter(r=>r&&r.id!==0&&S.regs&&S.regs[r.id]).sort((a,b)=>Math.hypot(a.i-camp.i,a.j-camp.j)-Math.hypot(b.i-camp.i,b.j-camp.j));
 const r=regs.find(r=>r.type==='coast'&&Math.hypot(r.i-camp.i,r.j-camp.j)>22)||regs.find(r=>Math.hypot(r.i-camp.i,r.j-camp.j)>22)||regs[0];if(!r)return;
 const[i,j]=hamletSpot(r);reveal(i,j,7);const head=fam.find(p=>p.name==='Dobromir')||fam[0];
 const h={id:(S.hid=(S.hid||0)+1),rid:r.id,i,j,name:placeName(head.name),rod:4,pop:fam.length,wiez:.68,zap:.62,day:S.day-YEAR*2.4,ppl:fam.map(p=>p.name),head:head.name,why:'',road:1};
 S.people=S.people.filter(p=>p.fam!==4);delete S.fams[4];S.hamlets=[h]}
function e2Build(){const rnd=rng(SEED*31+7);
 const Y=7;S.day=Y*YEAR+1.32;S.t=S.day*DAY;S.diff=S.diff===undefined?1:S.diff;
 // wrak, księgi, wiedza
 S.wreck.gone=1;S.wreck.parts.forEach(p=>{p.open=1;Object.keys(p.items).forEach(k=>p.items[k]=0)});S.wreck.target=-1;S.books={ciesla:2,zdun:2,dziennik:2,kowal:2,siew:2};
 S.know=Object.assign(S.know,{cegla:'tak',piec:'tak',kuznia:'tak',pole:'tak',active:null});S.logbook=typeof LOGBOOK!=='undefined'?LOGBOOK.length:6;
 S.tech=S.tech||{};TECH.forEach(t=>{S.tech[t.id]=1});S.zbozeTot=200;
 // wyspa poznana
 reveal(camp.i,camp.j,34);REGIONS.forEach(r=>{if(r)reveal(r.i,r.j,15)});S.regs={};REGIONS.forEach(r=>{if(r)S.regs[r.id]=1});
 S.found=TRIBE.map((t,i)=>i);S.foundD={};S.found.forEach(k=>S.foundD[k]=YEAR*(1+k*.7));S.slady={};S.sladClr={};if(typeof SLAD!=='undefined')SLAD.forEach((s,i)=>{if(s&&s.k){S.slady[s.k]=1;S.sladClr[i]=1}});S.sladQ=null;
 // ludzie
 e2People();
 // budowle
 S.bld=[];S.nid=1;occ.fill(-1);occ[camp.j*N+camp.i]=999;
 for(const[k,n,mode,o]of E2_PLAN)for(let q=0;q<n;q++){let at=e2Find(k,mode,rnd);if(!at&&mode!=='shore')at=e2Find(k,'mid',rnd)||e2Find(k,'outer',rnd)||e2Find(k,'far',rnd);if(!at)continue;const b=e2Put(k,at[0],at[1],Object.assign({age:YEAR*(1+rnd()*5)},o||{}));
  if(k==='pole')b.field={st:'rosnie',g:.18+rnd()*.25,fert:.85+rnd()*.1,q:.8,left:0,rot:q%3,weed:0,mode:'trzy',mono:0,frostHit:0}}
 // las przerzedzony wokół wsi, pniaki odrastają
 nodes.forEach((n,k)=>{if(n.type==='tree'&&!n.gone&&Math.hypot(n.i-camp.i,n.j-camp.j)<14&&rnd()<.45){S.nodeAmt[k]=0}});
 e2Hamlet();
 // zapasy na początek lata
 Object.assign(S.res,{suchary:0,jagody:90,grzyby:60,ryby:140,mieso:80,ziarno:190,mleko:24,miod:30,warzywa:50,chleb:70,ser:44,kiszonki:110,maka:30,
  drewno:240,opal:200,kamien:130,glina:60,deski:110,gwozdzie:170,plotno:22,skory:28,odziez:34,narz:14,narzk:6,cegla:60,ruda:16,wegiel:18,wlokna:30,ziola:40,naczynia:30});
 // obyczaje: dawne i nowsze
 S.cust={};S.custSince={};S.custPrev={};S.custStage={};CUSTOMS.forEach((c,i)=>{const pick={umowa:'u_wspolne',glod:'g_dzieci',smierc:'cmentarz',ogien:'straz',dzieci:'nauka',chorzy:'odpoczynek'}[c.k]||c.o[0].id;if(!c.o.some(o=>o.id===pick))return;S.cust[c.k]=pick;S.custPrev[c.k]=pick;S.custSince[c.k]=S.day-YEAR*Math.max(.5,6.5-i*.8);S.custStage[c.k]=obyStage(c.k)});
 if(typeof custRebuild==='function')try{custRebuild()}catch(e){}
 // pamięć, pieśni, pierwsze razy
 S.pam=58;S.songs=[['Pieśń o przysiędze przy ogniu',12],['Pieśń o pierwszej zimie',22],['Kołysanka o pierwszym dziecku wyspy',14],['Pieśń o zorzy nad morzem',40],['Pieśń o ugaszonym ogniu',61],['Pieśń o Lubomirze, który postawił pierwszy piec',78],['Pieśń o rybakach z Zatoki',104]].map(([t,d])=>({t,d,a:''}));
 S.firsts={};const FD={kraina:2,dom:9,dziecko:12,wrak:15,zima:16,zniwa:31,wesele:47,zelazo:58,mistrz:70,przysiolek:96};FIRSTS.forEach(([k,t])=>{S.firsts[k]={t,d:FD[k]||40}});S.pamK={pierwszy:10,kraina:20,piesn:7,akt:4,slad:8,obrzed:20};
 S.vname=E2_NAME;S.vnameQ=1;S.tier=2;
 // akty epoki I spełnione, wiec pokoleń czeka
 S.act=5;S.agoals={};ACTS.forEach((A,a)=>{if(A)A.g.forEach((g,i)=>S.agoals[a+'_'+i]=1)});S.actDone=1;S.finQ=1;S.actQ=0;
 // jednorazowe sceny i rocznice już były
 S.seen=S.seen||{};['niktnas','sztorm5','harvest','fire1','zbior1','hunt','miod','tool','evjaskinia','evswiatla','czHelp'].forEach(k=>S.seen[k]=1);
 for(let y=0;y<=Y+1;y++)['rok','kupala','kupL','woda','dziady','swieto','licho','leszy','poludnica'].forEach(k=>S.seen[k+y]=1);
 S.people.forEach(p=>{if(p.age>=7)S.seen['postr'+p.id]=1});S.evT=S.day+2.5;S.reqNext=S.day+6;S.sporNext=S.day+8;
 S.hope=.72;S.dis=.12;S.health=1;S.warm=1;S.crew0=18;S.fedR=1;S.variety=8;S.e2start=1;
 S.kron=[[1,'Wyszliśmy na brzeg. Wrak leży na płyciźnie, w obozie płonie ognisko.'],[15,'Morze zabrało wrak.'],[47,'Pierwsze wesele na wyspie.'],[78,'Odszedł Lubomir, mistrz murarski, który postawił pierwszy piec.'],[96,'Rodzina Dobromira odchodzi na wybrzeże. Tak powstaje pierwszy przysiółek.'],[Math.floor(S.day),'Siódmy rok na wyspie. Starsi mówią, że czas zwołać wiec pokoleń.']];
 S.log=[];log('Siedem lat po rozbiciu. '+E2_NAME+' to wieś z domami z bali i piecami, polami, kuźnią i przysiółkiem na wybrzeżu.');log('Najstarsi zwołują wiec pokoleń. Osada musi zdecydować, czym będzie dalej.');
 // wydeptane ścieżki od domów do ogniska
 S.tread=null;tread.fill(0);S.bld.forEach(b=>{const e=entryOf(b.kind,b.i,b.j);if(!e)return;const tl=kolAstar(e[0],e[1],camp.i,camp.j);if(!tl)return;tl.forEach(t=>{const k=Array.isArray(t)?t[1]*N+t[0]:t;if(k>=0&&k<N*N)tread[k]=Math.min(1,tread[k]+(BD[b.kind].house?.28:.18))})});
 S.tread=packTread();S.rev=packRev();
 e2Quiet(()=>{rebuildWorldFromState();wreckG.visible=false;buildPeopleMeshes();
  S.people.forEach(p=>{const h=null;p.x=tcx(camp.i)+(Math.random()-.5)*6;p.z=tcx(camp.j)+(Math.random()-.5)*6});
  assignHomes();S.people.forEach(p=>{const h=homeOf(p);if(h){const c=bCenter(h);p.x=c.x+(Math.random()-.5)*1.5;p.z=c.z+1.6}});
  e2Wants();assign();
  try{kolInit();hamVis()}catch(e){console.warn(e)}
  // ławy i kwiaty przed domami
  try{ladInit();S.bld.filter(b=>BD[b.kind].house).forEach((b,i)=>{const e=entryOf(b.kind,b.i,b.j);if(!e)return;if(i%2===0)ladPut('lawa',e[0]+(i%4?1:-1),e[1],true);ladPut('kwiaty',b.i-1,b.j+(i%3),true)});if(typeof ladBuild==='function')ladBuild()}catch(e){console.warn(e)}
  regionScan(true);minimapBase();paintBase(curYd=yday());fogPass(true)});
 S.ysnap=yearSnap();save()}
function e2Wants(){const ad=S.people.filter(p=>isWorker(p)).length;let budget=Math.max(4,ad-2);
 const pri=[['zbieracz',2],['pomost',2],['pole',1],['drwal',2],['drewutnia',1],['mysliwy',1],['zagroda',1],['kuznia',1],['pracownia',1],['szwalnia',1],['piekarnia',1],['kamien',1],['serownia',1],['zarna',1]];
 for(const[k,n]of pri){S.bld.filter(b=>b.kind===k).forEach(b=>{if(budget<=0)return;const w=Math.min(n,budget,wkOf(b));b.want=w;budget-=w})}}
{const _bt=boot;boot=function(fresh){_bt(fresh);if(fresh&&E2START){E2START=false;e2Build();camT.x=tcx(camp.i)+1;camT.z=tcx(camp.j)+2;zoom=zoomT=1.25;setCam();renderTop();renderPanel()}}}
// przycisk na ekranie startowym
{const acts=document.querySelector('#intro .acts');if(acts){const b=document.createElement('button');b.id='goE2';b.textContent='Zacznij od epoki II';b.title='Gotowa wieś po siedmiu latach na wyspie, tuż przed wiecem pokoleń';
 acts.insertBefore(b,$('goInstall'));const sm=document.createElement('small');sm.className='e2note';sm.textContent='Gotowa wieś po siedmiu latach na wyspie, tuż przed wiecem pokoleń.';acts.insertBefore(sm,$('goInstall'));
 b.addEventListener('click',()=>{let has=false;try{has=!!localStorage.getItem(SAVEKEY)}catch(e){}if(has&&!confirm('Zacząć od epoki II? Obecna osada zostanie zastąpiona.'))return;try{localStorage.removeItem(SAVEKEY);localStorage.removeItem('przystan-fresh')}catch(e){}freshFlag=false;E2START=true;startGame(true)});
 const st=document.createElement('style');st.textContent='#goE2{border-color:var(--gold)}.e2note{display:block;color:var(--mut);font-size:12px;margin:-2px 0 4px;text-align:center}';document.head.appendChild(st)}}
