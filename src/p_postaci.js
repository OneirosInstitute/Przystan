
/* ================= 3.1: ludzie — brwi, zimowe kożuchy i czapy, narzędzia w ręku, laska starych ================= */
// sklejanie geometrii z zachowaniem kolorów wierzchołków
function geoCat(a,b){const n1=a.attributes.position.count,n2=b.attributes.position.count;const g=new THREE.BufferGeometry();
 ['position','normal','color'].forEach(k=>{const A=new Float32Array((n1+n2)*3);A.set(a.attributes[k].array,0);A.set(b.attributes[k].array,n1*3);g.setAttribute(k,new THREE.BufferAttribute(A,3))});g.computeBoundingSphere();return g}
function geoRecolor(g,from,to){const q=g.clone();const c=q.attributes.color.array;for(let i=0;i<c.length;i+=3){if(Math.abs(c[i]-from.r)<.012&&Math.abs(c[i+1]-from.g)<.012&&Math.abs(c[i+2]-from.b)<.012){c[i]=to.r;c[i+1]=to.g;c[i+2]=to.b}}q.attributes.color.needsUpdate=true;return q}
const H0P=.5,HYP=.935-H0P;
// twarz: brwi (dokładane do bryły tułowia przy tworzeniu postaci)
function faceExtra(p){const old=p.age>55;const bc=mdCol(old?0x9a9690:[0x3a2a1e,0x4a3424,0x2a1e16,0x6a5034][p.id%4]);const T=[];
 [-1,1].forEach(s=>T.push([new THREE.BoxGeometry(.034,.008,.012),bc,mdM(s*.035,HYP+.043,.084,-.25,0,s*-.12)]));return mdMerge(T)}
// zimowe okrycie: kożuch z futrzanym brzegiem, czapa albo ciepła chusta
const KOZ=[0x8a6a48,0x7a5a3c,0x9a7a52,0x6a5038],FUR=0xd8ccb4,FUR2=0x5a4632,SZAL=[0x8a3a2a,0x6a4a5a,0x7a5a2a,0x4a5a4a];
function winterExtra(p){const k=p.sex==='k',adult=p.age>=12,id=p.id;const koz=mdCol(KOZ[id%4]),fur=mdCol(id%3?FUR:FUR2);const T=[];const L=(pts)=>mdLathe(pts.map(([r,y])=>[r,y-H0P]),14);
 if(!k){T.push([L([[.0,.29],[.19,.29],[.19,.37],[.175,.45],[.155,.53],[.163,.6],[.176,.68],[.168,.75],[.12,.8],[.06,.83],[0,.835]]),koz]);
  T.push([new THREE.CylinderGeometry(.2,.2,.04,14,1,true),fur,mdM(0,.3-H0P,0)])}
 else{T.push([L([[0,.43],[.17,.43],[.156,.5],[.156,.58],[.162,.66],[.17,.72],[.162,.77],[.11,.81],[.06,.835],[0,.84]]),koz]);T.push([new THREE.CylinderGeometry(.172,.172,.035,14,1,true),fur,mdM(0,.44-H0P,0)])}
 T.push([new THREE.TorusGeometry(.075,.026,6,14),fur,mdM(0,.8-H0P,0,Math.PI/2)]);
 [-1,1].forEach(s=>T.push([new THREE.SphereGeometry(.064,10,8),koz,mdM(s*.15,.755-H0P,0,0,0,0,1,.9,1)]));
 if(!k){const cap=mdCol(id%2?0x4a3a2c:0x6a5440);T.push([new THREE.CylinderGeometry(.112,.108,.1,14),cap,mdM(0,HYP+.07,-.004)]);T.push([new THREE.SphereGeometry(.105,12,6,0,6.283,0,1.4),cap,mdM(0,HYP+.11,-.004,0,0,0,1,.6,1)]);
  T.push([new THREE.CylinderGeometry(.118,.118,.035,14,1,true),fur,mdM(0,HYP+.035,-.004)])}
 else{const sz=mdCol(SZAL[id%4]);T.push([new THREE.SphereGeometry(.12,14,10,0,6.283,0,1.6),sz,mdM(0,HYP+.012,-.016,-.42)]);T.push([new THREE.ConeGeometry(.12,.16,8,1,true),sz,mdM(0,.74-H0P,-.04,.2)])}
 return mdMerge(T)}
const isWinterNow=()=>!!S&&(seasonIdx()===2||['frost','snow','zamiec'].includes(S.weather.k));
// narzędzia w prawej ręce (w układzie ręki: dłoń w (0,−.355,.045), trzonek biegnie dalej w dół ramienia)
const TOOL={};
function toolGeo(t){if(TOOL[t])return TOOL[t];const T=[];const wood=mdCol(0x6a4a2c),iron=mdCol(0x5a5e64),lt=mdCol(0x9a7a50);const HX=0,HY=-.175,HZ=.05;
 const handle=(len,r)=>T.push([new THREE.CylinderGeometry(r||.011,r||.011,len,6),wood,mdM(HX,HY-len/2+.06,HZ)]);
 if(t==='siekiera'){handle(.38);T.push([new THREE.BoxGeometry(.016,.06,.08),iron,mdM(HX,HY-.28,HZ+.03)])}
 else if(t==='kilof'){handle(.38);T.push([new THREE.BoxGeometry(.016,.022,.22),iron,mdM(HX,HY-.29,HZ,.15)])}
 else if(t==='mlot'){handle(.28);T.push([new THREE.BoxGeometry(.05,.05,.1),t==='mlot'?mdCol(0x7a5a38):iron,mdM(HX,HY-.2,HZ+.01)])}
 else if(t==='sierp'){handle(.11,.012);T.push([new THREE.TorusGeometry(.07,.007,4,12,Math.PI*1.25),iron,mdM(HX,HY-.13,HZ+.06,0,Math.PI/2,0)])}
 else if(t==='lopata'){handle(.5);T.push([new THREE.BoxGeometry(.09,.12,.012),lt,mdM(HX,HY-.46,HZ)])}
 else if(t==='wedka'){T.push([new THREE.CylinderGeometry(.008,.005,.95,5),wood,mdM(HX,HY-.3,HZ+.25,-1.1)]);T.push([new THREE.CylinderGeometry(.002,.002,.5,3),mdCol(0xd8d0c0),mdM(HX,HY-.55,HZ+.62,-.2)])}
 else if(t==='luk'){T.push([new THREE.TorusGeometry(.26,.008,4,14,Math.PI*.8),wood,mdM(HX,HY,HZ+.02,0,Math.PI/2,Math.PI*.6)])}
 else if(t==='kosz'){T.push([mdLathe([[.0,0],[.07,0],[.09,.05],[.1,.11],[.0,.11]].map(([r,y])=>[r,y]),10),lt,mdM(HX,HY-.2,HZ+.04)]);T.push([new THREE.TorusGeometry(.07,.006,4,10,Math.PI),wood,mdM(HX,HY-.09,HZ+.04)])}
 else if(t==='laska'||t==='kij'){T.push([new THREE.CylinderGeometry(.013,.011,.62,6),wood,mdM(HX,HY-.2,HZ+.02,.12)])}
 TOOL[t]=mdMerge(T);return TOOL[t]}
const TOOL_B={drwal:'siekiera',lesnik:'lopata',kamien:'kilof',ruda:'kilof',sztolnia:'kilof',torfowisko:'lopata',glinianka:'lopata',zbieracz:'kosz',pomost:'wedka',mysliwy:'luk',ptasznik:'kosz',pasieka:'kosz',drewutnia:'siekiera',kuznia:'mlot',dymarka:'mlot',warsztat:'mlot',pracownia:'mlot',szkutnia:'mlot',zagroda:'kij'};
const TOOL_N={tree:'siekiera',rock:'kilof',ruda:'kilof',clay:'lopata',fish:'wedka',bush:'kosz',grzyb:'kosz',ziola:'kosz',zboze:'sierp',len:'sierp',ul:'kosz'};
function toolFor(p){if(S?.epoch===4&&p.e4Action?.phase==='doing')return {chop:'siekiera',mine:'kilof',gather:'kosz',field:'sierp',build:'mlot',forge:'mlot',care:'kij'}[p.e4Action.kind]||null;if(p.state==='work'){const wk=p.workKind;const b=p.wb?bById(p.wb):null;
  if(wk==='build'||wk==='wreck'||wk==='haul')return'mlot';if(wk==='field')return'sierp';if(wk==='plant')return'lopata';if(wk==='hunt')return'luk';if(wk==='care'||wk==='tame')return'kij';
  if(wk==='mark'&&p.tgt&&p.tgt.type)return TOOL_N[p.tgt.type]||null;if(wk==='chore')return'kosz';
  if((wk==='work'||wk==='prod')&&b)return TOOL_B[b.kind]||null;return null}
 if(p.state==='move'&&p.age>62)return'laska';return null}
{const _mk=makePerson18;makePerson18=function(p){const g=_mk(p);const u=g.userData;try{u.torso.geometry=geoCat(u.torso.geometry,faceExtra(p));u.gS={t:u.torso.geometry,aL:u.aL.geometry,aR:u.aR.geometry};u.win=false;u.pp=p}catch(e){}return g}}
function personWinter(m,on){const u=m.userData;if(!u.gS||u.win===on)return;const p=u.pp;
 if(on){if(!u.gW){const cloth=mdCol(p.cloth),koz=mdCol(KOZ[p.id%4]);u.gW={t:geoCat(u.gS.t,winterExtra(p)),aL:geoRecolor(u.gS.aL,cloth,koz),aR:geoRecolor(u.gS.aR,cloth,koz)}}u.torso.geometry=u.gW.t;u.aL.geometry=u.gW.aL;u.aR.geometry=u.gW.aR}
 else{u.torso.geometry=u.gS.t;u.aL.geometry=u.gS.aL;u.aR.geometry=u.gS.aR}u.win=on}
let postT=0;
{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);if(!S)return;postT+=rdt;const slow=postT>1;if(slow)postT=0;const W=slow?isWinterNow():null;
  for(const p of S.people){const m=pMesh[p.id];if(!m||!m.visible)continue;const u=m.userData;if(!u.p18)continue;if(slow&&u.win!==W)personWinter(m,W);
   const t=toolFor(p);if(t){if(!u.tool){u.tool=new THREE.Mesh(toolGeo(t),MD.mat);u.tool.castShadow=true;(u.elbowR||u.aR).add(u.tool)}if(u.toolK!==t){u.tool.geometry=toolGeo(t);u.toolK=t}u.tool.visible=true;
    if(t==='laska'){u.aR.rotation.x=-.35+Math.sin(clock*10+p.id)*.08}}else if(u.tool)u.tool.visible=false}}}
window.__post={toolGeo,winterExtra,personWinter,toolFor,makeP:p=>makePersonMesh(p)};
