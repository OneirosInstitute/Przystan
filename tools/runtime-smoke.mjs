// Pełna orkiestracja gry na syntetycznej osi czasu. DOM/canvas/GPU są atrapami.
import assert from 'node:assert/strict';
import {createGame} from '../tests/runtime.mjs';

function answer(runtime){
 for(let attempt=0;attempt<5;attempt++){
  const phase=runtime.evaluate('evOpen?.phase');if(!phase)return;
  const dataset=phase==='result'?{close:'1'}:{o:'0'};
  for(const listener of runtime.elements.get('ev').listeners.click)listener({target:{closest:()=>({dataset})}});
 }
}
const results=[];
for(const epoch of [1,3]){
 const runtime=createGame();
 if(epoch===3)runtime.evaluate('E2START=true;E3START=true');
 runtime.game.startGame(true);runtime.game.closeSheet();answer(runtime);runtime.evaluate('setSpeed(8)');
 const beginning=runtime.game.S.day;let restarts=0,automaticSaves=0;
 const write=runtime.sandbox.localStorage.setItem;runtime.sandbox.localStorage.setItem=(key,value)=>{if(key==='przystan-v7')automaticSaves++;return write(key,value)};
 const frames=epoch===1?2400:4800;
 for(let frame=1;frame<=frames;frame++){
  answer(runtime);runtime.advanceTime(1000/30);runtime.evaluate(`frame(${frame*1000/30})`);
  for(const [resource,quantity]of Object.entries(runtime.game.S.res))assert.ok(Number.isFinite(quantity)&&quantity>=-1e-8,`${resource}: ${quantity}`);
  if(frame%1200===0){
   answer(runtime);assert.ok(runtime.evaluate('decodeSave(serializeSave())'),'Current state must remain valid');
   const saved=JSON.parse(runtime.memory.get('przystan-v7')),population=saved.people.length;
   runtime.game.startGame(false);runtime.game.closeSheet();answer(runtime);runtime.evaluate('setSpeed(8)');
   assert.equal(runtime.game.S.people.length,population);assert.equal(runtime.game.S.day,saved.day);restarts++;
   console.log(`epoch ${epoch}: ${frame}/${frames} frames; day ${runtime.game.S.day.toFixed(3)}; restart ${restarts}`);
  }
 }
 assert.ok(automaticSaves>=Math.floor(frames/30/15),'Real-time autosave must run during the frame loop');
 const warnings=runtime.warnings.filter(warning=>!/Path2D|szyld/.test(warning));
 assert.deepEqual(warnings,[],'Unexpected engine warnings');
 results.push({epoch,frames,syntheticWallSeconds:frames/30,elapsedGameDays:runtime.game.S.day-beginning,restarts,automaticSaves,population:runtime.game.S.people.length,tradeDeliveries:runtime.game.S.hanN||0,unverified:['real DOM','WebGL','touch','device performance']});
}
console.log(JSON.stringify({status:'PASS',scenarios:results},null,2));
