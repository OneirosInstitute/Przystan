
/* ================= 4.5 Wyspa 384: projekt lądu wokół dawnej wyspy (zaakceptowany 20.10.2026) ================= */
// Dawna wyspa (192×192) leży pośrodku mapy 384×384 i zostaje co do kafla: jej teren, drzewa, złoża i numery rzeczy.
// Wokół niej Cicha Zatoka, trzy przesmyki i nowy ląd z ręcznie ułożonymi krainami: Wronia Grań ze Szczytem Peruna,
// Czarne Zagłębie, Złote Stoki, Modre Łąki, Bure Bagna, Dolina Wierzby nad rzeką Wierzbną, Gliniska u Ujścia,
// Puszcza Wschodnia, Lipowa Dąbrowa z Jeziorem Lipowym, Wybrzeże i Wyspy Mew. Kształty poniżej to ten sam projekt,
// który powstał jako mapa do akceptacji; drobny szum daje im naturalne brzegi.
const N0=192,OFF=96,VW0=N0+1;
const WY={
 necks:[['Przesmyk Północny',172,80],['Przesmyk Zachodni',88,190],['Przesmyk Wschodni',300,196]],   // koniec na lądzie, początek szuka brzegu dawnej wyspy
 ridge:[[110,46],[150,34],[196,40],[236,32],[268,50]],
 eastRidge:[[352,110],[356,160],[344,230]],
 rivers:{'Wierzbna':[[172,50],[150,64],[118,72],[86,94],[68,130],[60,170],[50,210],[34,236],[14,250]],'Czarna Struga':[[282,62],[316,84],[342,104],[370,116]]},
 regions:[['Wronia Grań','gran',168,40],['Szczyt Peruna','gran',204,40],['Czarne Zagłębie','zaglebie',302,64],['Złote Stoki','stoki',210,70],['Modre Łąki','laki',92,66],
  ['Wrzosowy Płaskowyż','laki',130,92],['Bure Bagna','mokradla',50,70],['Dolina Wierzby','niziny',62,150],['Wierzbowe Łęgi','niziny',46,200],['Gliniska u Ujścia','gliniska',26,244],
  ['Puszcza Wschodnia','bory',336,160],['Sośniny Północne','bory',262,22],['Lipowa Dąbrowa','grad',326,240],['Zatoka Fok','wybrzeze',336,40],['Bursztynowy Cypel','wybrzeze',60,290],
  ['Kamienny Bród','grad',300,120],['Wyspy Mew','wybrzeze',200,354]],
 // złoża nowego lądu są duże: to one ciągną osadę dalej, gdy złoża dawnej wyspy się kończą
 deposits:[['wegiel',296,58,[4000,15000,40000]],['rudne',314,74,[3000,12000,30000]],['lom',176,52,[8000,25000,60000]],['glinisko',30,236,[4000,10000]],
  ['torf',52,72,[3000,8000]],['sol',340,40,null],['bursztyn',56,296,null],['rudne',300,124,[1500,5000,9000]]],
 forest:{gran:.12,zaglebie:.35,stoki:.15,laki:.08,mokradla:.3,niziny:.22,gliniska:.2,bory:.92,grad:.72,wybrzeze:.18}};
// odległość od zbioru (dwuprzebiegowa, przybliżenie euklidesowej z dokładnością do kilku procent)
function wyDist(src,W){const D=new Float32Array(W*W);for(let k=0;k<W*W;k++)D[k]=src[k]?0:1e9;return wyGrow(D,W)}
// dwa przebiegi po gotowych odległościach (rozszerza dokładne odległości z bliska na dalsze pola)
function wyGrow(D,W){const d1=1,d2=Math.SQRT2;
 for(let j=0;j<W;j++)for(let i=0;i<W;i++){const k=j*W+i;let v=D[k];if(!v)continue;if(i>0)v=Math.min(v,D[k-1]+d1);if(j>0){v=Math.min(v,D[k-W]+d1);if(i>0)v=Math.min(v,D[k-W-1]+d2);if(i<W-1)v=Math.min(v,D[k-W+1]+d2)}D[k]=v}
 for(let j=W-1;j>=0;j--)for(let i=W-1;i>=0;i--){const k=j*W+i;let v=D[k];if(!v)continue;if(i<W-1)v=Math.min(v,D[k+1]+d1);if(j<W-1){v=Math.min(v,D[k+W]+d1);if(i<W-1)v=Math.min(v,D[k+W+1]+d2);if(i>0)v=Math.min(v,D[k+W-1]+d2)}D[k]=v}
 return D}
function wySeg(x,y,P){let b=1e9;for(let q=0;q<P.length-1;q++){const[ax,ay]=P[q],[bx,by]=P[q+1],vx=bx-ax,vy=by-ay,L2=vx*vx+vy*vy||1;let t=((x-ax)*vx+(y-ay)*vy)/L2;t=t<0?0:t>1?1:t;const d=Math.hypot(x-ax-t*vx,y-ay-t*vy);if(d<b)b=d}return b}
function wyMeander(P,amp,wl,seed){const r=rng(seed),ph=r()*6.28,out=[];let acc=0;
 for(let q=0;q<P.length-1;q++){const[ax,ay]=P[q],[bx,by]=P[q+1],L=Math.hypot(bx-ax,by-ay),nx=-(by-ay)/L,ny=(bx-ax)/L;
  for(let s=0;s<L;s+=2){const o=amp*Math.sin((acc+s)/wl*6.283+ph)+amp*.4*Math.sin((acc+s)/(wl*.37)+ph*2);out.push([ax+(bx-ax)*s/L+nx*o,ay+(by-ay)*s/L+ny*o])}acc+=L}
 out.push(P[P.length-1]);return out}
// pole odległości od łamanej, stemplowane tylko w pasie wokół niej (szybko także na telefonie)
function wyStamp(P,R,W){const D=new Float32Array(W*W).fill(1e9);for(const[x,y]of P){const i0=Math.max(0,Math.floor(x-R)),i1=Math.min(W-1,Math.ceil(x+R)),j0=Math.max(0,Math.floor(y-R)),j1=Math.min(W-1,Math.ceil(y+R));
  for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const d=Math.hypot(i-x,j-y);const k=j*W+i;if(d<D[k])D[k]=d}}return D}
let WYD=null;   // wynik projektu: maski, rzeki, brody, przesmyki, krainy na kaflach, las
function wyBuild(HH,HH0,land0){const W=VW,S7=SEED*17;const nz=s=>makeNoise(S7+s),F=(nf,x,y,sc,o)=>fbm(nf,x/sc,y/sc,o||3);
 // dwa źródła szumu, każde pole z własnym przesunięciem; pola o dużej skali liczone co 4 kafle, średniej co 2, i wygładzane (szybko na telefonie)
 const n0=makeNoise(S7+3),n1b=makeNoise(S7+5);const off=s=>[(s*97.13)%251+300,(s*61.7)%241+500];
 const mk=(s,src)=>{const[ox,oy]=off(s),nf=src||n0;return(x,y)=>nf(x+ox,y+oy)};
 const coarse=(s,sc,o,src,st)=>{st=st||4;const nf=mk(s,src),G=Math.ceil(W/st)+2,A=new Float32Array(G*G);for(let b=0;b<G;b++)for(let a=0;a<G;a++)A[b*G+a]=fbm(nf,a*st/sc,b*st/sc,o||3);
  return(i,j)=>{const x=i/st,y=j/st,a=Math.floor(x),b=Math.floor(y),u=x-a,v=y-b,q=b*G+a;return A[q]*(1-u)*(1-v)+A[q+1]*u*(1-v)+A[q+G]*(1-u)*v+A[q+G+1]*u*v}};
 const cA=coarse(3,70,2),cB=coarse(5,70,2),cC=coarse(11,36),cF=coarse(17,44,2),cG=coarse(19,18,2),cJ=coarse(53,22),cK=coarse(51,30),cQ=coarse(101,40,2);
 const nE=mk(13),nH=mk(31,n1b),nI=mk(41),nO=mk(81),nP=mk(91,n1b),nR=mk(111);
 const fD=coarse(23,12,3,n1b,2),fL=coarse(61,12,3,n1b,2),fM=coarse(71,9,3,n0,2),fN=coarse(73,14,3,n1b,2),fX=coarse(131,9,2,n1b,2);
 const inCore=(i,j)=>i>=OFF&&i<=OFF+N0&&j>=OFF&&j<=OFF+N0;
 // dawny ląd na siatce wierzchołków
 const cl=new Uint8Array(W*W);for(let j=0;j<N0;j++)for(let i=0;i<N0;i++)if(land0[j*N0+i])cl[(j+OFF)*W+i+OFF]=1;
 const dCore=wyDist(cl,W);
 // zarys: zniekształcony owal, morze przy krawędziach, zatoka przed Przystanią, jezioro, wysepki
 const ring=new Uint8Array(W*W),moat=new Float32Array(W*W);
 for(let j=0;j<W;j++)for(let i=0;i<W;i++){const k=j*W+i,u=i/N,v=j/N;
  const wx=(cA(i,j)-.5)*.5,wy=(cB(i,j)-.5)*.5,dd=Math.hypot((u-.5)*1.9+wx,(v-.43)*2+wy);
  let sh=1-Math.pow(dd,1.7)*1.15+(cC(i,j)-.5)*.5;if(sh>-.2&&sh<.25)sh+=(fD(i,j)-.5)*.16;
  const bo=Math.min(i,W-1-i,j,W-1-j);sh-=clamp((12-bo)/8,0,1)*1.2;
  sh-=clamp((j-300)/40,0,1)*.9*(1-Math.exp(-((i-70)**2)/1800)*.8)*(1-Math.exp(-((i-330)**2)/1500)*.7);
  if(j>330&&i>170&&i<230)for(const[cx,cy,r]of[[196,352,9],[214,362,6],[182,344,5]])sh=Math.max(sh,.25-Math.hypot(i-cx,j-cy)/r*.25+(F(nE,i,j,6,2)-.5)*.12);
  const mw=11+24*cF(i,j);moat[k]=mw;
  const south=j<336&&j>220&&Math.hypot((i-194)/92,(j-318)/82)+(cG(i,j)-.5)*.35<1;
  const lake=Math.abs(i-334)<26&&Math.abs(j-200)<18&&Math.hypot((i-334)/16,(j-200)/11)<1+(F(nH,i,j,8,2)-.5)*.5;
  ring[k]=sh>.02&&dCore[k]>mw&&!south&&!lake&&!(inCore(i,j)&&dCore[k]<12)?1:0;
  if(lake)ring[k]|=2}
 // bez okruchów lądu (mniej niż 60 wierzchołków)
 {const lab=new Int32Array(W*W),st=[];let id=0;for(let k=0;k<W*W;k++){if(!(ring[k]&1)||lab[k])continue;id++;const comp=[k];lab[k]=id;st.push(k);while(st.length){const c=st.pop(),ci=c%W,cj=(c/W)|0;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const a=ci+dx,b=cj+dy;if(a<0||b<0||a>=W||b>=W)continue;const q=b*W+a;if(ring[q]&1&&!lab[q]){lab[q]=id;st.push(q);comp.push(q)}}}
  if(comp.length<60)for(const q of comp)ring[q]&=~1}}
 // przesmyki: od lądu w stronę środka, aż trafią na brzeg dawnej wyspy
 // na innych wyspach brzegi leżą gdzie indziej: przesmyk zaczyna się na brzegu dawnej wyspy i kończy na pierwszym lądzie nowym
 const necks=WY.necks.map(([n,x,y])=>{const dx=192-x,dy=192-y,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L;let px=x,py=y;
  for(let s=-60;s<200;s++){const qx=x+ux*s,qy=y+uy*s,k=Math.round(qy)*W+Math.round(qx);if(k>=0&&k<W*W&&cl[k]){px=qx;py=qy;break}}
  let ex=x,ey=y;for(let s=0;s<120;s++){const qx=px-ux*s,qy=py-uy*s,k=Math.round(qy)*W+Math.round(qx);if(k<0||k>=W*W)break;if(ring[k]&1){ex=qx-ux*2;ey=qy-uy*2;break}}
  return[n,[[px,py],[ex,ey]]]});
 // przesmyk: grobla o łagodnych zboczach (t=1 na koronie, t→0 do morza), żeby brzeg nie był pionową ścianą
 const neck=new Uint8Array(W*W),neckT=new Float32Array(W*W);for(const[,P]of necks){const x0=Math.floor(Math.min(P[0][0],P[1][0])-9),x1=Math.ceil(Math.max(P[0][0],P[1][0])+9),y0=Math.floor(Math.min(P[0][1],P[1][1])-9),y1=Math.ceil(Math.max(P[0][1],P[1][1])+9);
  for(let j=Math.max(0,y0);j<=Math.min(W-1,y1);j++)for(let i=Math.max(0,x0);i<=Math.min(W-1,x1);i++){const k=j*W+i,d=wySeg(i,j,P);if(d>8||cl[k])continue;const r=3.4+(F(nI,i,j,10)-.5)*1.6,t=clamp((r+5-d)/5,0,1);if(t>neckT[k])neckT[k]=t;if(d<r)neck[k]=1}}
 // rzeźba
 const coast=wyDist(Uint8Array.from(ring,v=>v&1?0:1),W),shelf=wyDist(Uint8Array.from(ring,(v,k)=>v&1||cl[k]?1:0),W);   // shelf: odległość od lądu, nowego i dawnego (łagodne zejście dna przy brzegu)
 const rivers={};for(const[k,P]of Object.entries(WY.rivers))rivers[k]=k==='Wierzbna'?wyMeander(P,5,46,SEED+7):wyMeander(P,3.5,30,SEED+9);
 const rW=wyGrow(wyStamp(rivers['Wierzbna'],5,W),W),rC=wyStamp(rivers['Czarna Struga'],6,W);
 const fords=[];for(const[k,P]of Object.entries(rivers)){let acc=0,last=-99;for(let q=1;q<P.length;q++){acc+=Math.hypot(P[q][0]-P[q-1][0],P[q][1]-P[q-1][1]);if(acc>8&&acc-last>=34){fords.push([k,P[q][0],P[q][1]]);last=acc}}}
 const isFord=(i,j)=>fords.some(([,x,y])=>Math.hypot(i-x,j-y)<2.2);
 const out=new Float32Array(W*W),rz=new Uint8Array(W*W);
 for(let j=0;j<W;j++)for(let i=0;i<W;i++){const k=j*W+i;let h;
  if(ring[k]&1){const c=coast[k],hl=1-Math.abs(cJ(i,j)*2-1);
   h=.06+.3*Math.pow(clamp(c/30,0,1),.8)+(cK(i,j)-.5)*.1+.16*hl*hl*clamp(c/12,0,1);
   const rd=wySeg(i,j,WY.ridge);if(rd<45){const rr=1-Math.abs(fL(i,j)*2-1);h+=.78*Math.exp(-((rd/14)**2))*(.7+.55*rr)}
   h+=.34*Math.exp(-((i-200)**2+(j-38)**2)/110);
   {const e=Math.exp(-((i-306)**2/900+(j-70)**2/500));if(e>.005)h+=.4*e*(.7+.6*fM(i,j))}
   {const e=Math.exp(-((wySeg(i,j,WY.eastRidge)/18)**2));if(e>.005)h+=.36*e*(.6+.8*fN(i,j))}
   const val=Math.exp(-((rW[k]/22)**2))*(j>80?1:0);h=h*(1-.6*val)+.1*val;
   const pl=Math.exp(-((i-88)**2/1200+(j-66)**2/500));h=h*(1-.6*pl)+.34*pl;
   const ma=Math.exp(-((i-50)**2/900+(j-70)**2/600));if(ma>.005)h=h*(1-.8*ma)+.06*ma+(F(nO,i,j,6)-.5)*.09*ma;
   h=Math.max(h,.045);
   const cc=c<8?c+(F(nR,i+71,j+13,4)-.5)*5:c;if(cc<5){const s=clamp((cc-1)/4,0,1);h=.05+(h-.05)*s*s*(3-2*s)}   // plaża: ostatnie kafle przed morzem schodzą łagodnie
   // koryto z łagodnymi brzegami: dno w środku, skarpa na 2,5–6,5 kafla (w górach szersza dolina, bez pionowych ścian), bród zostaje lądem
   {const rd=Math.min(rW[k]-1.25,rC[k]-.95);const bw=2.6+8*clamp(h-.14,0,.5);if(rd<bw){rz[k]=1;const t=Math.max(0,rd)/bw,s=t*t*(3-2*t);let hb=rd<0?-.12:-.12+(h+.12)*s;if(isFord(i,j))hb=Math.max(hb,.046);h=Math.min(h,hb)}}   // bród: niska, sucha przeprawa w poprzek koryta
   if(ma>.45&&F(nP,i,j,5)>.66)h=-.03}
  else{const sd=shelf[k],deep=-.62+(cQ(i,j)-.5)*.16;h=sd<14?-.025+(deep+.025)*Math.pow(clamp(sd/14,0,1),1.25):deep}
  if(ring[k]&2&&!inCore(i,j))h=Math.min(h,-.025-.1*clamp(shelf[k]/3,0,1));   // jezioro: płytko przy brzegu, głębiej dalej
  if(neckT[k]>0&&!inCore(i,j)){const t=neckT[k],c=.085+(F(nR,i,j,8)-.5)*.04;h=Math.max(h,c-(c+.24)*Math.pow(1-t,1.6))}
  out[k]=h}
 // brzegi z maski kafli wychodzą schodkami: przy samym brzegu (lądu i morza) wygładzenie 5×5, poza korytami rzek, brodami i przesmykami
 {const tmp=new Float32Array(W*W),bl=new Float32Array(W*W),w5=[1,4,6,4,1];
  for(let j=0;j<W;j++)for(let i=0;i<W;i++){let a=0,n=0;for(let d=-2;d<=2;d++){const x=i+d;if(x<0||x>=W)continue;a+=out[j*W+x]*w5[d+2];n+=w5[d+2]}tmp[j*W+i]=a/n}
  for(let j=0;j<W;j++)for(let i=0;i<W;i++){let a=0,n=0;for(let d=-2;d<=2;d++){const y=j+d;if(y<0||y>=W)continue;a+=tmp[y*W+i]*w5[d+2];n+=w5[d+2]}bl[j*W+i]=a/n}
  for(let k=0;k<W*W;k++){if(rz[k]||neckT[k]>0)continue;const d=ring[k]&1?coast[k]:shelf[k];if(d<4){const w=d<=2?1:(4-d)/2;out[k]=out[k]*(1-w)+bl[k]*w}}}
 // dawna wyspa i 12 kafli morza przy jej brzegu dokładnie jak dawniej; dalej dawne morze łagodnie przechodzi w nowe dno albo w nowy ląd
 for(let j=0;j<VW0;j++)for(let i=0;i<VW0;i++){const k=(j+OFF)*W+i+OFF,h0=HH0[j*VW0+i],dc=dCore[k];
  if(h0>.02||dc<12){const t=neckT[k];out[k]=t>0&&h0<=.02?Math.max(h0,.085-.325*Math.pow(1-t,1.6)):h0}else if(out[k]<=.02){const w=Math.max(clamp((dc-12)/12,0,1),clamp(1-Math.min(i,j,VW0-1-i,VW0-1-j)/8,0,1),clamp(1-(shelf[k]-1)/6,0,1)),t=neckT[k];out[k]=h0*(1-w)+out[k]*w;if(t>0)out[k]=Math.max(out[k],.085-.325*Math.pow(1-t,1.6))}}
 HH.set(out);
 // kafle: dawne (core) i nowe; krainy nowego lądu z zaprojektowanych środków, wyginane szumem; las i wilgoć z roli krainy
 const core=new Uint8Array(N*N),reg=new Int8Array(N*N).fill(-1),fr=new Float32Array(N*N),wt=new Float32Array(N*N);const cW=coarse(121,40,2);
 for(let j=0;j<N;j++)for(let i=0;i<N;i++){const k=j*N+i,v=j*W+i;
  if(i>=OFF&&i<OFF+N0&&j>=OFF&&j<OFF+N0){const l0=land0[(j-OFF)*N0+i-OFF];if(l0||dCore[v]<12){core[k]=1;continue}}
  const hh=(out[v]+out[v+1]+out[v+W]+out[v+W+1])/4;if(hh<=.02)continue;
  const w=(cW(i,j)-.5)*50;let best=-1,bd=1e9;WY.regions.forEach((r,q)=>{const d=Math.hypot(i-r[2]+w,j-r[3]-w*.7);if(d<bd){bd=d;best=q}});reg[k]=best;
  const role=WY.regions[best][1];fr[k]=clamp(WY.forest[role]+(fX(i,j)-.5)*.35,0,1);wt[k]=role==='mokradla'?.75:role==='niziny'||role==='gliniska'?.5:.3}
 WYD={necks,rivers,fords,dCore,ring,core,reg,fr,wt};return WYD}
// las i wilgoć: dawna wyspa z dawnego szumu (w jej współrzędnych), nowy ląd z roli krainy
function wyForest(x,y){const i=Math.floor(x),j=Math.floor(y);if(WYD&&i>=0&&j>=0&&i<N&&j<N&&!WYD.core[j*N+i]&&WYD.reg[j*N+i]>=0)return WYD.fr[j*N+i];return fbm(n3,(x-OFF)/N0*7+40,(y-OFF)/N0*7+9,3)}
function wyWet(x,y){const i=Math.floor(x),j=Math.floor(y);if(WYD&&i>=0&&j>=0&&i<N&&j<N&&!WYD.core[j*N+i]&&WYD.reg[j*N+i]>=0)return WYD.wt[j*N+i];return fbm(n2,(x-OFF)/N0*5+60,(y-OFF)/N0*5+3,3)}
// ---------- zapis sprzed wyspy 384: wszystko, co liczy się w kaflach, przesuwa się o 96 (świat w metrach się nie zmienia) ----------
function wyMigrate(st){if(!st||(st.mapN||N0)===N)return st;const sh=k=>{const i=k%N0,j=(k/N0)|0;return(j+OFF)*N+i+OFF};const P=a=>Array.isArray(a)&&a.length===2&&typeof a[0]==='number'?[a[0]+OFF,a[1]+OFF]:a;
 for(const b of st.bld||[]){if(typeof b.i==='number'){b.i+=OFF;b.j+=OFF}}
 for(const h of st.herds||[]){if(typeof h.i==='number'){h.i+=OFF;h.j+=OFF}}
 for(const h of st.hamlets||[]){if(typeof h.i==='number'){h.i+=OFF;h.j+=OFF}}
 for(const p of st.people||[]){if(p.routeGoal)p.routeGoal=P(p.routeGoal);if(typeof p.roadK==='number')p.roadK=sh(p.roadK)}
 if(st.lad){const o={};for(const[k,v]of Object.entries(st.lad))o[sh(+k)]=v;st.lad=o}
 for(const r of st.roads||[]){if(Array.isArray(r.tiles))r.tiles=r.tiles.map(sh);if(Array.isArray(r.skip))r.skip=r.skip.map(sh)}
 if(st.hiT)st.hiT=P(st.hiT);
 if(st.mq){for(const k of['cape','raft','boat'])if(st.mq[k])st.mq[k]=P(st.mq[k])}
 // mgła i wydeptane ścieżki: te same bity i znaki, w środku większej mapy
 if(typeof st.rev==='string'){try{const s=atob(st.rev),bits=new Uint8Array(N*N);for(let k=0;k<s.length;k++){const b=s.charCodeAt(k);for(let q=0;q<8;q++){const o=k*8+q;if(o<N0*N0&&(b>>q)&1)bits[sh(o)]=1}}
   let r='';for(let k=0;k<N*N;k+=8){let b=0;for(let q=0;q<8;q++)if(bits[k+q])b|=1<<q;r+=String.fromCharCode(b)}st.rev=btoa(r)}catch(e){delete st.rev}}
 if(typeof st.tread==='string'){const s=st.tread.replace(/~(\d+)~/g,(m,n)=>'A'.repeat(+n)),t=new Uint8Array(N*N).fill(65);for(let k=0;k<N0*N0&&k<s.length;k++)t[sh(k)]=s.charCodeAt(k);
  let r='';for(let k=0;k<N*N;k++)r+=String.fromCharCode(t[k]);st.tread=r.replace(/A{3,}/g,m=>'~'+m.length+'~')}
 try{wyMigrateE4(st)}catch(e){console.warn(e)}
 st.mapN=N;st.mapFrom=N0;return st}
// epoka IV sprzed wyspy 384: świat rodów miał dorysowany pierścień; teraz to prawdziwa mapa, więc folwarki spoza dawnej wyspy
// przenoszą się do najbliższej wolnej krainy nowego lądu (razem z mieszkańcami), a trwające przejazdy kończą się przy następnym kroku
function wyMigrateE4(st){const e=st.e4;if(!e||!e.world||!e.world.core||e.world.core.size!==N0)return;
 const heights=[];for(let row=0;row<=N;row+=2)for(let col=0;col<=N;col+=2)heights.push(Math.round(H[row*VW+col]*1e4)/1e4);
 const world=E4World.create({seed:e.world.seed,town:e.world.town,core:{size:N,step:2,heights},regions:e4RealRegions()}),used=new Set();
 const list=Object.values(e.settlements||{}).sort((a,b)=>(a.id==='przystan'?-1:0)-(b.id==='przystan'?-1:0));
 for(const s of list){const ox=s.x,oz=s.z;let reg=null;
  if(Math.abs(s.x)<N0/2&&Math.abs(s.z)<N0/2&&E4World.height(world,s.x,s.z)>.05)reg=E4World.regionAt(world,s.x,s.z);
  else{reg=world.regions.filter(r=>!used.has(r.id)).sort((a,b)=>Math.hypot(a.x-s.x,a.z-s.z)-Math.hypot(b.x-s.x,b.z-s.z))[0];if(reg){s.x=reg.x+1.5;s.z=reg.z+1.5}}
  if(reg){used.add(reg.id);s.regionId=reg.id}
  const dx=s.x-ox,dz=s.z-oz;if(dx||dz)for(const p of st.people||[])if(p.settlementId===s.id&&!p.e4Transport){p.x+=dx;p.z+=dz}}
 e.world=world;e.nature={};for(const t of e.transports||[])t.arrival=Math.min(t.arrival,(e.simTicks||0)+1)}
