
/* ================= 3.3.2 Bateria: tyle klatek, ile trzeba, i cisza w tle ================= */
// Wcześniej gra rysowała tyle klatek, ile ekran pozwalał (na ekranach 90–120 Hz nawet 120 na sekundę), także w pauzie,
// pod otwartą księgą i przy scenie. Dźwięk otoczenia (morze, wiatr, deszcz) grał dalej po schowaniu gry.
let batOn=false;try{batOn=localStorage.getItem('przystan-bat')==='1'}catch(e){}
let batAct=performance.now(),batLastR=0,batCam='',batCap=60;
const batPoke=()=>{batAct=performance.now()};
['pointerdown','pointermove','wheel','keydown','touchstart','touchmove'].forEach(ev=>addEventListener(ev,batPoke,{passive:true,capture:true}));
// ile klatek na sekundę w danej chwili
function batFps(){if(!S)return batOn?20:30;const now=performance.now();
 const k=camT.x.toFixed(2)+','+camT.z.toFixed(2)+','+yaw.toFixed(3)+','+zoom.toFixed(3);if(k!==batCam){batCam=k;batAct=now}
 if(now-batAct<1500||document.body.classList.contains('photo'))return batOn?30:60;
 const sh=$('sheet'),book=!sh.hidden&&!sh.classList.contains('min');
 if(book&&innerWidth<=760)return batOn?6:12;
 if(!$('ev').hidden)return batOn?8:20;
 if(!S.speed)return batOn?8:20;
 return batOn?24:30}
gfxSkip=function(now){batCap=batFps();if(now-batLastR<1000/batCap-2)return true;batLastR=now;return false};
// pomiar płynności (obniżanie grafiki) tylko wtedy, gdy klatki nie są celowo ograniczone
function batMeasure(){return batCap>=50}
// rozdzielczość w trybie oszczędnym
function batDpr(){if(!batOn)return;const cap=coarse?1.25:1.5;if(renderer.getPixelRatio()>cap){renderer.setPixelRatio(cap);resize()}}
{const _gl=gfxSetLevel;gfxSetLevel=function(l,q){const r=_gl(l,q);try{batDpr()}catch(e){}return r}}
try{batDpr()}catch(e){}
// schowana gra: dźwięk wstrzymany (bez tego przeglądarka uznaje kartę za grającą i nie usypia jej)
function batSound(){try{if(!AUD)return;if(document.hidden)AUD.suspend();else if(!muted&&AUD.state==='suspended')AUD.resume()}catch(e){}}
document.addEventListener('visibilitychange',batSound);
addEventListener('pagehide',()=>{try{if(AUD)AUD.suspend()}catch(e){}});
addEventListener('pageshow',batSound);
// pulsowanie przycisków (cień animowany w nieskończoność) zmuszało przeglądarkę do przemalowywania ekranu z pełną częstotliwością,
// także w pauzie: teraz pulsują kilka razy i zostają podświetlone bez ruchu
{const st=document.createElement('style');st.textContent=`.czc.bad,.cze.bad,#cz-tempo.stop{animation-iteration-count:3!important}
.hintp{animation-iteration-count:4!important;box-shadow:0 0 0 3px rgba(226,196,140,.55)}
@media (prefers-reduced-motion:reduce){.czc.bad,.cze.bad,#cz-tempo.stop,.hintp{animation:none!important}}`;document.head.appendChild(st)}
// przełącznik w menu tempa
if(!$('speed').querySelector('[data-bat]'))$('speed').insertAdjacentHTML('beforeend','<button data-bat="1" aria-label="Oszczędzanie baterii" style="width:auto;padding:0 10px">Bateria</button>');
function batBtn(){const b=$('speed').querySelector('[data-bat]');if(b){b.classList.toggle('on',batOn);b.textContent=batOn?'Oszczędnie':'Bateria'}}
{const _rc=renderCtl;renderCtl=function(){_rc();batBtn()}}
$('speed').addEventListener('click',e=>{if(!e.target.closest('[data-bat]'))return;batOn=!batOn;try{localStorage.setItem('przystan-bat',batOn?'1':'0')}catch(er){}
 if(batOn)batDpr();else gfxSetLevel(GFX.level,true);batBtn();document.body.classList.remove('czpop');
 toast(batOn?'Oszczędzanie baterii: mniej klatek i niższa rozdzielczość':'Oszczędzanie baterii wyłączone')});
batBtn();
window.__bat={batFps,get cap(){return batCap},get on(){return batOn}};
