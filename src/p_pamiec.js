
/* ================= 0.17: pamięć osady — pieśni, pierwsze razy, groby z imionami, nazwa osady, znaki rodów ================= */
function pamAdd(v,k){S.pam=(S.pam||0)+v;if(k){S.pamK=S.pamK||{};S.pamK[k]=(S.pamK[k]||0)+1}}
function pamWord(){const p=S.pam||0;return p<25?'krótka':p<70?'żywa':p<130?'głęboka':'wielka'}
// ---- pieśni ----
function song(t,about){S.songs=S.songs||[];if(S.songs.some(s=>s.t===t))return;S.songs.push({t,d:Math.floor(S.day)+1,a:about||''});if(S.songs.length>60)S.songs.shift();pamAdd(3,'piesn');
 log(`Ktoś ułożył pieśń: „${t}”. Śpiewają ją przy pracy i wieczorem przy ogniu.`);toast('Nowa pieśń: '+t)}
// ---- pierwsze razy ----
const FIRSTS=[['dom','Pierwszy dom z bali',()=>S.bld.some(b=>bDone(b)&&(b.kind==='chata'||b.kind==='dom'))],['zniwa','Pierwsze żniwa z własnego pola',()=>!!S.seen.harvest],
 ['dziecko','Pierwsze dziecko urodzone na wyspie',()=>(S.born||0)>=1],['wesele','Pierwsze wesele na wyspie',()=>(S.weds||0)>=1],['wrak','Morze zabrało wrak',()=>!!(S.wreck&&S.wreck.gone)],
 ['zima','Pierwsza zima przetrwana',()=>S.day>=YEAR*.78&&S.people.length>0],['mistrz','Pierwszy mistrz najwyższego fachu',()=>!!offHolder('mistrz')],['przysiolek','Pierwszy przysiółek',()=>(S.hamlets||[]).length>=1],
 ['zelazo','Pierwsze żelazo z własnego pieca',()=>S.know&&S.know.kuznia==='tak'],['kraina','Pierwsza kraina nazwana przez osadę',()=>S.regs&&Object.keys(S.regs).length>=1]];
const FIRST_SONG={dziecko:'Kołysanka o pierwszym dziecku wyspy',wrak:'Pieśń o statku, który zabrało morze',zima:'Pieśń o pierwszej zimie',przysiolek:'Pieśń o tych, co poszli dalej'};
function pamDaily(){S.firsts=S.firsts||{};
 FIRSTS.forEach(([k,t,c])=>{if(S.firsts[k]||!c())return;S.firsts[k]={t,d:Math.floor(S.day)+1};pamAdd(3,'pierwszy');log(`Do pamięci osady: ${t.toLowerCase()}.`);if(FIRST_SONG[k])song(FIRST_SONG[k])});
 // krainy nazwane przez osadę
 const nk=S.regs?Object.keys(S.regs).length:0;if(nk>(S.pamReg||0)){pamAdd(nk-(S.pamReg||0),'kraina');S.pamReg=nk}
 // zimą śpiewa się pieśni
 if(seasonIdx()===2&&S.songs&&S.songs.length)S.wh=(S.wh||0)+.0015*Math.min(12,S.songs.length);
 if(seasonIdx()===2&&S.hungerDays>0)S.zimaGlod=Math.floor(S.day/YEAR);
 if(Math.floor(rday())===15&&S.zimaGlod===Math.floor(S.day/YEAR)&&!S.seen['pglod'+S.zimaGlod]){S.seen['pglod'+S.zimaGlod]=1;song('Pieśń o głodnej zimie '+(S.zimaGlod+1)+'. roku')}
 // nazwa osady i znaki rodów
 if(S.tier>=1&&!S.vname&&!S.vnameQ){S.vnameQ=1;gameLater(askVName,1500)}
 setVName()}
function setVName(){const sp=campLbl.querySelector('span');const n=S&&S.vname||'Przystań';if(sp&&sp.textContent!==n)sp.textContent=n}
const ZNAKI=['◆','▲','●','✚','✦','◐','■','✿','⬟','✶'];
function giveZnaki(){S.rody=S.rody||{};let i=0;Object.keys(S.rody).forEach(id=>{if(!S.rody[id].znak)S.rody[id].znak=ZNAKI[i%ZNAKI.length];i++})}
function askVName(){if(!S||S.vname)return;if(evOpen||placing){gameLater(askVName,4000);return}
 const st=offHolder('starszy')||S.people.filter(isAdult).sort((a,b)=>b.age-a.age)[0];const opts=[['Przystań','tak, jak mówimy od pierwszej nocy'],['Ostoja','miejsce, gdzie można się schronić'],['Zatocze','od zatoki, która nas przyjęła'],[st?placeName(st.name):'Nowa Wieś',st?'od '+gen(st.name)+', który nas tu prowadził':'nowa wieś na nowej ziemi']];
 openEvent({id:'village-name',ey:'Wiec',t:'Imię dla osady',text:()=>`Domów jest już kilka, a ludzi coraz więcej. Na wiecu ktoś mówi, że osada potrzebuje imienia, żeby wnuki wiedziały, skąd są. Rody przy okazji wyrzynają swoje znaki na słupach przy domach.`,
  opts:opts.map(([n,d])=>({n,d,f:()=>{S.vname=n;giveZnaki();pamAdd(5,'nazwa');setVName();return`Od dziś osada nazywa się ${n}. Każdy ród wyrzyna swój znak na słupie przy domu.`}}))},{})}
// ---- groby z imionami i Dziady ----
{const _kp=killPerson;killPerson=function(p,why){const nm=p.name;_kp(p,why);S.deadNames=S.deadNames||[];S.deadNames.push(nm);if(law('cmentarz'))pamAdd(1,'grob');
  if(Object.values(p.sk||{}).some(l=>l>=4))song('Pieśń pamięci: '+nm,'mistrz')}}
// ---- pieśni z wydarzeń ----
{const _w=wedding;wedding=function(k,m){_w(k,m);if(Math.random()<.35)song(`Pieśń o weselu: ${k.name} i ${m.name}`)}}
{const _ef=endFire;endFire=function(b){const hp=b.fire?b.fire.hp:1,n=BD[b.kind].n.toLowerCase();_ef(b);if(Math.random()<.4)song(hp>0?'Pieśń o ugaszonym ogniu':'Pieśń o pożarze: '+n)}}
{const _fx=finishExp;finishExp=function(e,out){const n0=S.people.length,r=REGIONS[e.r];_fx(e,out);if(S.people.length<n0)song('Pieśń o tych, co nie wrócili z wyprawy');else if(Math.random()<.15&&r&&r.known)song('Pieśń o drodze: '+r.name)}}
{const _fh=foundHamlet;foundHamlet=function(m,why,rid,o){const h=_fh(m,why,rid,o);   // 4.5: przekazuje krainę wybraną na wiecu (wcześniej ginęła i przysiółek szedł zawsze do najbliższej)
 if(h)song('Pieśń o odejściu: '+h.name);return h}}
// ---- panel ----
function pamHTML(){const K0=S.pamK||{},sg=(S.songs||[]).slice(-5).reverse(),fs=Object.values(S.firsts||{});
 return`<div class="card"><div class="eyebrow">Pamięć osady</div><h4>${S.vname||'Przystań'} · pamięć ${pamWord()}</h4>
 <p class="mut">Obrzędów: ${K0.obrzed||0} · pieśni: ${(S.songs||[]).length} · grobów z imionami: ${K0.grob||0} · pierwszych razy: ${fs.length} · nazwanych krain: ${S.pamReg||0}</p>
 ${sg.length?'<p>'+sg.map(s=>'„'+s.t+'”').join('<br>')+'</p>':'<p class="mut">Nikt jeszcze nie ułożył pieśni. Przyjdą z wielkimi chwilami.</p>'}
 <p class="mut">Pamięć rośnie z obrzędów, grobów, pieśni i pierwszych razy. Zimą pieśni podnoszą nadzieję. Na końcu epoki pamięć zdecyduje, z czym młodzi pójdą dalej.</p></div>`}
