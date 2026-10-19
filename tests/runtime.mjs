import fs from 'node:fs';
import vm from 'node:vm';
import * as RealThree from '../assets/three.module.js';

export function createGame(options={}) {
const elementMap=new Map(), memory=new Map(), timers=[],frames=[], intervals=[], warnings=[],pendingFrames=new Map();let realTime=0,nextFrame=0;
const noop=()=>{};
function element(tag='div',id='') {
 const classes=new Set(); const node={tagName:tag.toUpperCase(),id,style:{display:''},dataset:{},children:[],hidden:false,innerHTML:'',textContent:'',value:'',width:800,height:600,clientWidth:800,clientHeight:600,offsetWidth:800,offsetHeight:600,scrollTop:0,scrollHeight:1000,isConnected:true};
 let identifier=id;Object.defineProperty(node,'id',{get:()=>identifier,set:value=>{identifier=String(value);if(identifier)elementMap.set(identifier,node)}});
 node.classList={add:(...values)=>values.forEach(value=>classes.add(value)),remove:(...values)=>values.forEach(value=>classes.delete(value)),contains:value=>classes.has(value),toggle:(value,force)=>{const flag=force??!classes.has(value);if(flag)classes.add(value);else classes.delete(value);return flag}};
 Object.assign(node,{listeners:{},addEventListener:(name,callback)=>{(node.listeners[name]??=[]).push(callback)},removeEventListener:noop,appendChild:child=>{child.parentNode=node;node.children.push(child);return child},append:(...children)=>children.forEach(child=>node.appendChild(child)),remove:noop,setAttribute:(key,value)=>node[key]=value,getAttribute:key=>node[key],removeAttribute:key=>delete node[key],querySelector:selector=>get(selector),querySelectorAll:()=>[],insertAdjacentHTML:noop,insertBefore:child=>node.appendChild(child),getBoundingClientRect:()=>({x:0,y:0,left:0,top:0,right:800,bottom:600,width:800,height:600}),closest:()=>null,contains:()=>false,focus:noop,blur:noop,click:noop,setPointerCapture:noop,releasePointerCapture:noop,scrollIntoView:noop,toDataURL:()=>'',getContext:()=>context2d(node)});
 node.parentNode={insertBefore:noop,appendChild:noop};
 Object.assign(node,{insertAdjacentElement:(where,child)=>node.appendChild(child),after:noop,before:noop,hasAttribute:key=>node[key]!==undefined,removeChild:child=>{node.children=node.children.filter(item=>item!==child);return child},replaceChildren:(...children)=>{node.children=[];node.append(...children)}});
 Object.defineProperty(node,'firstChild',{get:()=>node.children[0]||null});
 let markup='';Object.defineProperty(node,'innerHTML',{get:()=>markup,set:value=>{markup=String(value);node.children=[];const stack=[node];for(const match of markup.matchAll(/<(\/?)([a-z][a-z0-9-]*)([^>]*)>/gi)){if(match[1]){if(stack.length>1)stack.pop();continue}const child=element(match[2]);for(const attr of match[3].matchAll(/([\w-]+)=(?:"([^"]*)"|'([^']*)')/g)){const value=attr[2]??attr[3];if(attr[1]==='id'){child.id=value;elementMap.set(value,child)}else if(attr[1]==='class')child.classList.add(...value.split(/\s+/));else if(attr[1].startsWith('data-'))child.dataset[attr[1].slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=value;else child[attr[1]]=value}stack.at(-1).appendChild(child);if(!['input','br','hr','img','meta','link'].includes(match[2].toLowerCase())&&!match[3].endsWith('/'))stack.push(child)}}});return node;
}
function get(selector){if(!elementMap.has(selector))elementMap.set(selector,element('div',selector));return elementMap.get(selector)}
function context2d(canvas){return new Proxy({canvas,createRadialGradient:()=>({addColorStop:noop}),createLinearGradient:()=>({addColorStop:noop}),measureText:text=>({width:String(text).length*8}),createImageData:(width,height)=>({data:new Uint8ClampedArray(width*height*4),width,height}),getImageData:(x,y,width,height)=>({data:new Uint8ClampedArray(width*height*4),width,height}),getLineDash:()=>[]},{get:(target,key)=>key in target?target[key]:noop,set:(target,key,value)=>{target[key]=value;return true}})}
class Renderer {
 constructor(options){this.domElement=options.canvas;this.shadowMap={};this.info={render:{calls:0,triangles:0},memory:{geometries:0,textures:0}};this.capabilities={maxTextureSize:4096,isWebGL2:true};this.extensions={has:()=>false,get:()=>null};}
 setRenderTarget=noop;getRenderTarget=()=>null;clear=noop;clearDepth=noop;getClearAlpha=()=>1;getClearColor=target=>target.set(0);setClearAlpha=noop;setViewport=noop;setScissor=noop;setScissorTest=noop;setPixelRatio= noop;setSize=noop;render=noop;setClearColor=noop;dispose=noop;getPixelRatio=()=>1;getDrawingBufferSize=target=>target.set(800,600);getSize=target=>target.set(800,600);getContext=()=>({getParameter:()=>4096});
}
const math=Object.create(Math);let seed=82731;math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
const documentListeners={},windowListeners={};
const record=(target,name,callback)=>{(target[name]??=[]).push(callback)};
const document={getElementById:get,createElement:element,createElementNS:(ns,tag)=>element(tag),querySelector:get,querySelectorAll:()=>[],addEventListener:(name,callback)=>record(documentListeners,name,callback),removeEventListener:noop,body:element('body'),head:element('head'),documentElement:element('html'),hidden:!!options.hidden,fullscreenEnabled:false};
for(const [key,value] of Object.entries(options.storage||{}))memory.set(key,String(value));
const localStorage={getItem:key=>memory.get(key)??null,setItem:(key,value)=>memory.set(key,String(value)),removeItem:key=>memory.delete(key)};
const sandbox={THREE:{...RealThree,WebGLRenderer:Renderer},document,localStorage,navigator:{userAgent:'audit-node',hardwareConcurrency:4,deviceMemory:4,maxTouchPoints:1},location:{search:options.search||'',protocol:'http:',href:'http://localhost:3000/',origin:'http://localhost:3000'},innerWidth:800,innerHeight:600,devicePixelRatio:1,performance:{now:()=>realTime},console:{log:noop,warn:(...args)=>warnings.push(args.map(String).join(' ')),error:(...args)=>warnings.push(args.map(String).join(' '))},addEventListener:(name,callback)=>record(windowListeners,name,callback),removeEventListener:noop,matchMedia:query=>({matches:!!(options.pointerCoarse&&query.includes('pointer:coarse')||options.standalone&&query.includes('display-mode: standalone')),addEventListener:noop}),requestAnimationFrame:callback=>{frames.push(callback);pendingFrames.set(++nextFrame,callback);return nextFrame},cancelAnimationFrame:id=>pendingFrames.delete(id),setTimeout:(callback,ms=0)=>{timers.push({callback,next:realTime+Math.max(0,ms),active:true});return timers.length},clearTimeout:id=>{if(timers[id-1])timers[id-1].active=false},setInterval:(callback,ms)=>{intervals.push({callback,ms,next:realTime+ms,active:true});return intervals.length},clearInterval:id=>{if(intervals[id-1])intervals[id-1].active=false},URL,URLSearchParams,AbortController,AbortSignal,Path2D:class{constructor(){}},Blob,TextEncoder,TextDecoder,structuredClone,atob:value=>Buffer.from(value,'base64').toString('binary'),btoa:value=>Buffer.from(value,'binary').toString('base64'),Math:math,fetch:async()=>({ok:true,text:async()=>'',json:async()=>({})}),confirm:()=>false};sandbox.window=sandbox;sandbox.self=sandbox;document.defaultView=sandbox;
const context=vm.createContext(sandbox);
const html=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
let script=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)][1][1];
// Test-only observation seam; product source and algorithms are unchanged.
script=script.replace(/\n\}\);\s*$/, '\nwindow.__testEvaluate=expression=>eval(expression);\n});');
for(const match of fs.readFileSync(new URL('../src/p_head.html',import.meta.url),'utf8').matchAll(/<[^>]+id="([^"]+)"[^>]*>/g)){get(match[1]).hidden=/\bhidden\b/.test(match[0])}
vm.runInContext(script,context,{filename:'assembled-game.js'});
sandbox.__przystan();

function advanceTime(ms,{timeouts=false}={}){const end=realTime+ms;let due;while((due=[...intervals,...(timeouts?timers:[])].filter(timer=>timer.active&&timer.next<=end).sort((a,b)=>a.next-b.next)[0])){realTime=due.next;if(due.ms)due.next+=due.ms;else due.active=false;due.callback()}realTime=end}
function runFrame(ms=1000/30){realTime+=ms;for(const [id,callback]of [...pendingFrames]){pendingFrames.delete(id);callback(realTime)}}
return {advanceTime,runFrame,pendingFrames,intervals,evaluate:expression=>sandbox.__testEvaluate(expression),sandbox,context,memory,timers,frames,warnings,elements:elementMap,game:sandbox.__g,documentListeners,windowListeners};
}
