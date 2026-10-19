// File name retained for existing npm/CI commands. Each suite has its own process.
const {spawn}=require('node:child_process');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const GiB=2**30;

function parseOptions(arguments_){
 let installMode=false,requestedWorkers;
 for(const option of arguments_){
  if(option==='--install'&&!installMode)installMode=true;
  else if(/^--workers=[12]$/.test(option)&&requestedWorkers===undefined)requestedWorkers=Number(option.at(-1));
  else throw new Error('Unknown test option: '+option);
 }
 if(requestedWorkers!==undefined&&!installMode)throw new Error('--workers requires --install; release tests remain serial');
 return {installMode,requestedWorkers};
}
function resources(){
 let cpus=typeof os.availableParallelism==='function'?os.availableParallelism():os.cpus().length;
 let freeBytes=os.freemem(),totalBytes=os.totalmem();
 try{const [quota,period]=fs.readFileSync('/sys/fs/cgroup/cpu.max','utf8').trim().split(/\s+/);if(quota!=='max'&&Number(quota)>0&&Number(period)>0)cpus=Math.min(cpus,Math.max(1,Math.floor(Number(quota)/Number(period))))}catch{}
 try{const limit=Number(fs.readFileSync('/sys/fs/cgroup/memory.max','utf8')),used=Number(fs.readFileSync('/sys/fs/cgroup/memory.current','utf8'));if(Number.isFinite(limit)&&limit>0&&Number.isFinite(used)){totalBytes=Math.min(totalBytes,limit);freeBytes=Math.min(freeBytes,Math.max(0,limit-used))}}catch{}
 return {cpus,freeBytes,totalBytes};
}
function selectWorkers(options,capacity=resources()){
 if(!options.installMode||options.requestedWorkers===1)return 1;
 return process.platform!=='win32'&&capacity.cpus>=2&&capacity.totalBytes>=3*GiB&&capacity.freeBytes>=1.5*GiB?2:1;
}
function planSuites(root){
 const directory=path.join(root,'tests');
 const suites=fs.readdirSync(directory).filter(name=>name.endsWith('.test.mjs')).sort();
 if(!suites.length)throw new Error('No test suites found');
 for(const filename of suites)if(!fs.lstatSync(path.join(directory,filename)).isFile())throw new Error('Test suite must be a regular file: '+filename);
 return suites;
}
function startSuite(root,filename,options,timeout,output){
 let cancel;
 const promise=new Promise(resolve=>{
  let stdout='',failure,child,closed=false,closeStatus,closeSignal,grace;
  const prefixed=options.workers>1;
  const buffers={stdout:'',stderr:''};
  const write=(stream,chunk,flush=false)=>{
   if(!prefixed){output[stream](String(chunk));return;}
   buffers[stream]+=String(chunk);
   const lines=buffers[stream].split('\n');buffers[stream]=lines.pop();
   for(const line of lines)output[stream]('['+filename+'] '+line+'\n');
   if(flush&&buffers[stream]){output[stream]('['+filename+'] '+buffers[stream]+'\n');buffers[stream]=''}
  };
  const signalChild=signal=>{if(!child?.pid)return;try{if(process.platform==='win32')child.kill(signal);else process.kill(-child.pid,signal)}catch(error){if(error.code!=='ESRCH')failure??=error.message}};
  const finish=()=>{
   if(!closed||grace)return;
   clearTimeout(timer);write('stdout','',true);write('stderr','',true);
   resolve({stdout,error:failure,status:closeStatus,signal:closeSignal});
  };
  cancel=reason=>{
   if(failure)return;
   failure=reason;signalChild('SIGTERM');
   grace=setTimeout(()=>{signalChild('SIGKILL');grace=null;finish()},300);
  };
  const timer=setTimeout(()=>cancel('timeout after '+timeout/1000+'s'),timeout);
  const arguments_=['--test'];
  if(options.installMode&&filename==='e4-population.test.mjs')arguments_.push('--test-name-pattern=legacy twins');
  arguments_.push(path.join(root,'tests',filename));
  try{
   const childEnvironment={...process.env,NO_COLOR:'1',FORCE_COLOR:'0'};
   // A suite started by another node:test process still needs its own reporter.
   delete childEnvironment.NODE_TEST_CONTEXT;
   child=spawn(process.execPath,arguments_,{cwd:root,detached:process.platform!=='win32',stdio:['ignore','pipe','pipe'],env:childEnvironment});
   child.stdout.on('data',chunk=>{stdout+=chunk;write('stdout',chunk);if(Buffer.byteLength(stdout)>8*1024*1024)cancel('output exceeds 8 MiB')});
   child.stderr.on('data',chunk=>write('stderr',chunk));
   child.on('error',error=>{failure??=error.message});
   child.on('close',(status,signal)=>{closed=true;closeStatus=status;closeSignal=signal;finish()});
  }catch(error){closed=true;failure=error.message;finish()}
 });
 return {promise,cancel:reason=>cancel(reason)};
}
function passedCases(filename,result){
 if(result.error||result.status!==0)throw new Error(filename+': '+(result.error||'exit='+result.status+', signal='+result.signal));
 const passes=[...result.stdout.matchAll(/^(?:#|ℹ)\s*pass\s+(\d+)\s*$/gm)];
 const failures=[...result.stdout.matchAll(/^(?:#|ℹ)\s*fail\s+(\d+)\s*$/gm)];
 if(!passes.length||!failures.length||Number(failures.at(-1)[1])!==0||Number(passes.at(-1)[1])<1)throw new Error('malformed or incomplete test summary: '+filename);
 return Number(passes.at(-1)[1]);
}
async function runTests({root=path.resolve(__dirname,'..'),installMode=false,requestedWorkers,capacity,timeoutForSuite,output={stdout:text=>process.stdout.write(text),stderr:text=>process.stderr.write(text)}}={}){
 const suites=planSuites(root),workers=selectWorkers({installMode,requestedWorkers},capacity);
 const options={installMode,workers};let cursor=0,passed=0,completed=0,failure;
 const active=new Set();
 const abort=reason=>{failure??=new Error(reason);for(const job of active)job.cancel(reason)};
 const interrupt=()=>abort('interrupted; no following test suite will start');
 process.once('SIGINT',interrupt);process.once('SIGTERM',interrupt);
 output.stdout('TEST PLAN: '+suites.length+' suites, '+workers+' worker(s), '+(installMode?'install':'full release')+'\n');
 async function worker(){
  while(!failure&&cursor<suites.length){
   const filename=suites[cursor++];
   const timeout=timeoutForSuite?timeoutForSuite(filename):filename==='e4-population.test.mjs'?1800000:filename==='ai-specialties.test.mjs'?1200000:300000;
   output.stdout('TEST SUITE: '+filename+'\n');
   const job=startSuite(root,filename,options,timeout,output);active.add(job);
   const result=await job.promise;active.delete(job);
   try{passed+=passedCases(filename,result);completed++;output.stdout('TEST SUITE PASS: '+filename+' ('+completed+'/'+suites.length+')\n')}
   catch(error){if(!failure){failure=error;for(const other of active)other.cancel('cancelled after '+filename+' failed')}}
  }
 }
 try{await Promise.all(Array.from({length:workers},()=>worker()))}
 finally{process.removeListener('SIGINT',interrupt);process.removeListener('SIGTERM',interrupt)}
 if(failure)throw failure;
 if(completed!==suites.length)throw new Error('Incomplete test plan');
 output.stdout('TEST GATE PASS: '+completed+' suites, '+passed+' cases\n');
 if(installMode)output.stdout('INSTALL MODE: 2 extended 1500-day generation scenarios are release gates; see docs/weryfikacja10/results.json.\n');
 return {suites:completed,cases:passed,workers};
}
if(require.main===module){let options;try{options=parseOptions(process.argv.slice(2))}catch(error){console.error('TEST GATE FAILED:',error.message);process.exitCode=1}
 if(options)runTests(options).catch(error=>{console.error('TEST GATE FAILED:',error.message);process.exitCode=1});
}
module.exports={parseOptions,selectWorkers,runTests,passedCases};
