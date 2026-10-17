/* Zegar interfejsu odlicza tylko wtedy, gdy gra jest widoczna. */
let lifeAway=false,lifeFrozen=false,lifeFrame=null,lifeAutosave=null,lifeSaved=false;
const lifeTimers=new Map();let lifeTimerId=0;
function lifeCanRun(){return !document.hidden&&!lifeAway&&!lifeFrozen}
function lifeArm(timer){
 if(!lifeCanRun()||timer.native!==null)return;
 timer.started=performance.now();
 timer.native=setTimeout(()=>{
  timer.native=null;timer.left=0;
  if(!lifeCanRun())return;
  lifeTimers.delete(timer.id);timer.callback();
 },timer.left);
}
function gameLater(callback,delay=0){
 const timer={id:++lifeTimerId,callback,left:Math.max(0,delay),started:0,native:null};
 lifeTimers.set(timer.id,timer);lifeArm(timer);return timer.id;
}
function gameCancelLater(id){const timer=lifeTimers.get(id);if(!timer)return;if(timer.native!==null)clearTimeout(timer.native);lifeTimers.delete(id)}
function lifePauseTimers(){for(const timer of lifeTimers.values())if(timer.native!==null){clearTimeout(timer.native);timer.native=null;timer.left=Math.max(0,timer.left-(performance.now()-timer.started))}}
function lifeRequestFrame(){if(lifeCanRun()&&lifeFrame===null)lifeFrame=requestAnimationFrame(now=>{lifeFrame=null;frame(now)})}
function lifeSync(saveExit=false){
 const awake=lifeCanRun();document.documentElement.classList.toggle('game-asleep',!awake);
 if(awake){
  lifeSaved=false;last=performance.now();batLastR=0;fpsAcc=0;fpsN=0;
  lifeRequestFrame();for(const timer of lifeTimers.values())lifeArm(timer);
  if(lifeAutosave===null)lifeAutosave=setInterval(()=>{if(lifeCanRun()&&S&&!saveStatus.blocked)save()},autosaveIntervalMs);
 }else{
  if(lifeFrame!==null){cancelAnimationFrame(lifeFrame);lifeFrame=null}
  if(lifeAutosave!==null){clearInterval(lifeAutosave);lifeAutosave=null}
  lifePauseTimers();tydAbort();
  if(saveExit&&S&&!lifeSaved)lifeSaved=save();
 }
 batSound();
}
