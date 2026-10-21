
/* ================= 4.8.0-rc.4 Faktury odporne na reset GPU ================= */
// Chrome na Androidzie trzyma płótna 2D na GPU. Gdy GPU się zresetuje (przełączenie aplikacji, blokada ekranu, mało pamięci),
// takie płótna tracą zawartość, a faktury budynków wracają do WebGL puste: ściany i dachy robią się czarne.
// Płótna poza dokumentem (faktury, znaki, dymki) trzymamy więc w zwykłej pamięci, której reset GPU nie rusza.
if(typeof HTMLCanvasElement!=='undefined'){const _gc=HTMLCanvasElement.prototype.getContext;
 HTMLCanvasElement.prototype.getContext=function(type,opt){if(type==='2d'&&!this.isConnected&&!(opt&&'willReadFrequently' in opt))opt=Object.assign({},opt||{},{willReadFrequently:true});return _gc.call(this,type,opt)}}
const GPU={lost:0,restored:0,at:0};
{const c=document.getElementById('c');if(c&&c.addEventListener){c.addEventListener('webglcontextlost',()=>{GPU.lost++;GPU.at=Date.now()});c.addEventListener('webglcontextrestored',()=>{GPU.restored++;try{gpuRestored()}catch(e){console.warn('gpu',e)}})}}
// po odzyskaniu kontekstu wszystkie faktury wysyłamy jeszcze raz
function gpuRestored(){if(typeof scene==='undefined')return;const seen=new Set();scene.traverse(o=>{for(const m of [].concat(o.material||[]))for(const v of Object.values(m))if(v&&v.isTexture&&!v.isRenderTargetTexture&&!seen.has(v)&&v.image){seen.add(v);v.needsUpdate=true}});}
