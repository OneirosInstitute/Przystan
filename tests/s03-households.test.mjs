import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

test('S03 household preserves food only after real attendance and pays input cost once',()=>{
 const game=createGame();
 const output=game.evaluate(`(()=>{
   S=freshState();S.day=3.4;
   const family=Object.values(S.fams)[0];
   const home={id:888,kind:'chata',cmp:1,prog:1,work:1};S.bld.push(home);
   family.home=home.id;
   const adult=famMembers(family.id).find(person=>person.age>=16);
   adult.eveD=2;adult.eveK='dom';
   S.res.warzywa=9;S.res.kiszonki=0;
   const first=householdPreserveDaily();
   const second=householdPreserveDaily();
   return {first,second,vegetables:S.res.warzywa,pickles:S.res.kiszonki};
 })()`);
 assert.equal(output.first,1);
 assert.equal(output.second,0);
 assert.equal(output.vegetables,6);
 assert.equal(output.pickles,2);
});
