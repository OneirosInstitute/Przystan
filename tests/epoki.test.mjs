import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

// 4.9.0-rc.9: budynek zmienia styl epoki dopiero po remoncie albo rozbudowie
test('old buildings keep their look when the epoch changes and take the new style after a repair or an upgrade',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);E('E2START=true');runtime.game.startGame(true);
 const r=JSON.parse(E(`(()=>{const b=S.bld.find(x=>bDone(x)&&BD[x.kind].wk&&x.kind!=='pole');const out={start:b.ep===undefined};S.epoch=2;out.now=__ep.epS();
  b.ep=1;b.proj={t:'rep',prog:1,work:1};finishProj(b);out.afterRep=b.ep;
  b.ep=1;b.proj={t:'ext',id:(EXT[b.kind]||[{id:'x'}])[0].id,prog:1,work:1};try{finishProj(b)}catch(e){}out.afterExt=b.ep;
  b.proj={t:'lv',prog:1,work:1};finishProj(b);out.afterLv=b.ep;out.html=bldPanelHTML(b);return JSON.stringify(out)})()`));
 assert.equal(r.start,true,'buildings from before this version have no epoch style and look as before');
 assert.equal(r.now,2);
 assert.equal(r.afterRep,2,'a repair brings the building into the style of the current epoch');
 assert.equal(r.afterExt,1,'an extension alone does not change the style');
 assert.equal(r.afterLv,2,'an upgrade does too');
 assert.match(r.html,/Styl: epoka II · wieś/);
});
test('a new building takes the style of the epoch it was built in',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);E('E2START=true');runtime.game.startGame(true);
 const ep=E(`(()=>{S.epoch=2;EP_NEW=true;try{const b={id:S.nid++,kind:'drwal',i:20,j:20,prog:0,work:10,workers:0};addBuildingMesh(b);return b.ep}finally{EP_NEW=false}})()`);
 assert.equal(ep,2);
 const look=JSON.parse(E(`(()=>{const res={};for(const e of [1,3]){const T=styFor('chata',{id:4242,kind:'chata',ep:e,ext:[]});res[e]={roof:[mThatchOld,mSod,mThatch,mShingle,mBoards].indexOf(T.roof),sh:T.sh,koniki:T.koniki}}return JSON.stringify(res)})()`));
 assert.ok([0,1,2].includes(look[1].roof),'epoch I: sod or straw roofs');assert.equal(look[1].sh,0);assert.equal(look[1].koniki,false);
 assert.ok(look[3].sh>0,'epoch III: painted shutters');assert.equal(look[3].koniki,true);
});
