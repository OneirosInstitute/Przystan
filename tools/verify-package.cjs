const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
function verifyPackage(root=path.join(__dirname,'..'),manifest=JSON.parse(fs.readFileSync(path.join(root,'release-manifest.json'),'utf8'))){
 const directory=fs.realpathSync(path.resolve(root));
 if(!manifest||manifest.version!=='4.0.0-rc.1'||!manifest.files||typeof manifest.files!=='object'||Array.isArray(manifest.files))throw new Error('Nieprawidłowy manifest paczki');
 const files=Object.entries(manifest.files);if(!files.length)throw new Error('Pusty manifest');
 for(const [name,checksum]of files){
  const resolved=path.resolve(directory,name);
  if(!resolved.startsWith(directory+path.sep)||!fs.realpathSync(resolved).startsWith(directory+path.sep)||!fs.lstatSync(resolved).isFile()||!/^[a-f0-9]{64}$/.test(checksum))throw new Error('Nieprawidłowa ścieżka w paczce: '+name);
  const actual=crypto.createHash('sha256').update(fs.readFileSync(resolved)).digest('hex');
  if(actual!==checksum)throw new Error('Plik różni się od paczki: '+name);
 }
 return files.length;
}
if(require.main===module){try{console.log('Integralność paczki: PASS ('+verifyPackage()+' plików)')}catch(error){console.error(error.message);process.exitCode=1}}
module.exports={verifyPackage};
