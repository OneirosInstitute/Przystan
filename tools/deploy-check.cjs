const {execFileSync}=require('node:child_process');
const path=require('node:path');
const BASE='116a3ef78166fb6f7b164db67b3bb0794724523c';
const PACKAGE='Przystan_4.9.0_RC16';
function checkDeployment(readGit=(...arguments_)=>execFileSync('git',arguments_,{encoding:'utf8'}).trim(),{beforePull=false}={}){
 const root=readGit('rev-parse','--show-toplevel');
 if(path.resolve(root)!==process.cwd())throw new Error('Uruchom komendy w głównym katalogu repozytorium.');
 const remote=readGit('remote','get-url','origin');
 if(!/^(?:git@github\.com:|https:\/\/github\.com\/)oneirosinstitute\/przystan(?:\.git)?$/i.test(remote))throw new Error('To nie jest repozytorium oneirosinstitute/Przystan.');
 if(readGit('branch','--show-current')!=='main')throw new Error('Wymagana gałąź main.');
 const head=readGit('rev-parse','HEAD');
 if(!beforePull&&head!==BASE)throw new Error('Main ma inną bazę niż paczka. Nie nadpisano plików gry.');
 const changes=readGit('status','--porcelain=v1','--untracked-files=all').split('\n').filter(Boolean);
 if(changes.some(entry=>!entry.slice(3).startsWith(PACKAGE+'/')))throw new Error('Repozytorium zawiera własne zmiany. Nie nadpisano plików gry.');
 return true;
}
if(require.main===module){try{const arguments_=process.argv.slice(2);if(arguments_.length>1||arguments_.length===1&&arguments_[0]!=='--before-pull')throw new Error('Nieznany argument');checkDeployment(undefined,{beforePull:arguments_[0]==='--before-pull'});console.log('Kontrola repozytorium: PASS')}catch(error){console.error(error.message);process.exitCode=1}}
module.exports={checkDeployment,BASE,PACKAGE};
