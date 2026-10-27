/* Zmiana wersji odświeża grę dopiero po bezpiecznym checkpointcie. */
let updatePending=false,updateReloading=false,updateController=null;
function gameApplyUpdate(){
 if(!updatePending||updateReloading||!lifeCanRun())return false;
 if(S&&!save()){
  let notice=document.getElementById('game-update');
  if(!notice){notice=document.createElement('button');notice.id='game-update';notice.textContent='Nowa wersja gotowa — zapisz i zaktualizuj';notice.addEventListener('click',gameApplyUpdate);document.body.appendChild(notice)}
  notice.hidden=false;return false;
 }
 updateReloading=true;
 // 4.9.0-rc.15: gracz był w osadzie, więc po przeładowaniu wraca do niej sam, bez ekranu startowego i bez „Wróć do osady”
 try{if(S&&$('intro').style.display==='none')sessionStorage.setItem('przystan-resume','1')}catch(e){}
 location.reload();return true;
}
var updateResumed=false; // var: odczytywana w p_szlif.js, który stoi w paczce wcześniej
function gameResumeAfterUpdate(){let resume=false;try{resume=sessionStorage.getItem('przystan-resume')==='1';sessionStorage.removeItem('przystan-resume')}catch(e){}
 if(!resume)return false;let has=false;try{has=!!localStorage.getItem(SAVEKEY)}catch(e){}if(!has)return false;updateResumed=true;try{startGame(false)}finally{updateResumed=false}return true}
// dźwięk utworzony bez dotknięcia (powrót po aktualizacji) przeglądarka trzyma wstrzymany; pierwsze dotknięcie go budzi
addEventListener('pointerdown',()=>{try{if(typeof AUD!=='undefined'&&AUD&&AUD.state==='suspended')batSound()}catch(e){}},{passive:true,capture:true});
function gameControllerChanged(){
 const current=navigator.serviceWorker?.controller;
 if(!current||current===updateController)return;
 const previous=updateController;updateController=current;
 if(!previous)return; // Pierwsze przejęcie strony nie oznacza aktualizacji gry.
 // 4.6.0-rc.2: strona przyszła już z sieci w tej samej wersji co nowy pracownik, więc drugie ładowanie nic by nie dało
 // 4.9.0-rc.13: pomijamy tylko pracownika, którego zarejestrowała ta strona (zmiana adresu na jej wersję). Nowa treść pod tym samym adresem
 // to wydanie wgrane w czasie gry: bez przeładowania stara strona grałaby dalej z pamięcią podręczną nowej wersji.
 const mine=url=>typeof url==='string'&&url.includes('v='+encodeURIComponent(GAME_VER));
 if(mine(current.scriptURL)&&!mine(previous.scriptURL))return;
 updatePending=true;gameApplyUpdate();
}
function gameRegisterWorker(){
 if(!('serviceWorker' in navigator)||!document.querySelector('link[rel=manifest]')||!/^https?:/.test(location.protocol))return;
 updateController=navigator.serviceWorker.controller;
 navigator.serviceWorker.addEventListener('controllerchange',gameControllerChanged);
 navigator.serviceWorker.register('sw.js?v='+encodeURIComponent(GAME_VER),{updateViaCache:'none'}).catch(error=>console.warn('Aktualizacja gry',error));
}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&updatePending)gameApplyUpdate()});
{const style=document.createElement('style');style.textContent='#game-update{position:fixed;bottom:calc(16px + var(--safe-bottom));left:16px;right:16px;z-index:20001;padding:14px;border:1px solid var(--gold);background:var(--panel);color:var(--hi)}';document.head.appendChild(style)}
