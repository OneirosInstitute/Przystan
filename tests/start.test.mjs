import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// 4.9.0-rc.4: ekran startowy — żywa wyspa w tle, herb z wycinanki, jeden przycisk, reszta w „Inne początki”
const html=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
test('the start screen module is built before the end of the game script and keeps every start option',()=>{
 const a=html.indexOf('Ekran startowy: żywa wyspa i wycinanka'),b=html.indexOf('return{','\n'.length+html.lastIndexOf('function startGame'));
 assert.ok(a>0,'module is in the build');assert.ok(a<html.lastIndexOf('function startGame'),'runs before the game script returns');
 for(const s of["class=\"st-emb\"","st-title","Inne początki","'.diffsel,.newset,.tydbox'","goInstall","introPic"])assert.ok(html.includes(s),s);
 assert.match(html,/@media \(prefers-reduced-motion:no-preference\)\{\s*#intro\.st2 \.st-emb|\.st-emb\{animation:stFold/);
 assert.match(html,/#intro\.st2 \.st-more\[hidden\]\{display:none\}/);
});
test('a saved game shows the village, season and a line from the last evening by the fire',()=>{
 assert.match(html,/function stSaveInfo\(\)/);assert.match(html,/wArch/);assert.match(html,/przy ogniu<\/span>/);
});
