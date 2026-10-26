
/* ================= 4.9.0-rc.11 Urozmaicenie: budynki w lustrzanym odbiciu ================= */
// Mniej więcej co drugi budynek danego rodzaju stoi w lustrzanym odbiciu: komin, przybudówka, podwórze, stosy i drzwi boczne
// są po drugiej stronie. Rząd takich samych warsztatów albo chat nie wygląda już jak kopia jednej.
// Wybór zależy od numeru budynku, więc po wczytaniu zapisu każdy stoi tak samo jak wcześniej.
// Bez odbicia zostają: serce osady, pola, wielkie budynki z placem i dziedzińcem, wiatrak oraz budynki na brzegu (pomost, przystań).
const MIR_SKIP={serce:1,pole:1,dwor:1,cech:1,zajazd:1,szpital:1,domwsp:1,browar:1,wiatrak:1,pomost:1,przystan:1,szkutnia:1};
function bMir(b){if(!b||b.id===undefined||b.id===null||/nomir/.test(location.search))return false;const d=BD[b.kind];if(!d||MIR_SKIP[b.kind]||d.shore)return false;
 const n=typeof b.id==='number'?b.id:String(b.id).split('').reduce((a,c)=>a*31+c.charCodeAt(0)|0,7);return ((Math.imul(n|0,2654435761)>>>0)>>>9)%2===1}
{const _mb=makeBuildingModel;makeBuildingModel=function(kind,bb){const g=_mb(kind,bb);try{if(bb&&bMir(bb)){g.scale.x=-Math.abs(g.scale.x||1);g.userData.mir=1}}catch(e){}return g}}
// sprężyste „wyskoczenie” po ukończeniu budowy ustawia skalę od nowa; odbicie musi zostać
{const _bf=budFrame;budFrame=function(rdt){const pop=[];for(const id in bMesh){const g=bMesh[id];if(g&&g.userData.mir&&g.userData.popT!==undefined)pop.push(g)}_bf(rdt);for(const g of pop)if(g.scale.x>0)g.scale.x=-g.scale.x}}
window.__mir={bMir};
