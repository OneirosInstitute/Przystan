/* Zmiana wersji odświeża grę dopiero po bezpiecznym checkpointcie. */
let updatePending=false,updateReloading=false,updateController=null;
function gameApplyUpdate(){
 if(!updatePending||updateReloading||!lifeCanRun())return false;
 if(S&&!save()){
  let notice=document.getElementById('game-update');
  if(!notice){notice=document.createElement('button');notice.id='game-update';notice.textContent='Nowa wersja gotowa — zapisz i zaktualizuj';notice.addEventListener('click',gameApplyUpdate);document.body.appendChild(notice)}
  notice.hidden=false;return false;
 }
 updateReloading=true;location.reload();return true;
}
function gameControllerChanged(){
 const current=navigator.serviceWorker?.controller;
 if(!current||current===updateController)return;
 const previous=updateController;updateController=current;
 if(!previous)return; // Pierwsze przejęcie strony nie oznacza aktualizacji gry.
 // 4.6.0-rc.2: strona przyszła już z sieci w tej samej wersji co nowy pracownik, więc drugie ładowanie nic by nie dało
 if(typeof current.scriptURL==='string'&&current.scriptURL.includes('v='+encodeURIComponent(GAME_VER)))return;
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
