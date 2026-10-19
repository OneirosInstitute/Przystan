// RC11: odtwarza release-manifest.json z plików śledzonych w git (sumy SHA-256), dla wersji z package.json
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const files=execFileSync('git',['ls-files'],{cwd:root,encoding:'utf8'}).split('\n').filter(f=>f&&f!=='release-manifest.json'&&fs.existsSync(path.join(root,f))).sort();
const build=(fs.readFileSync(path.join(root,'dist','sw.js'),'utf8').match(/const V=PREFIX\+'([0-9a-f]{10})'/)||[])[1]||null;
const prev=JSON.parse(fs.readFileSync(path.join(root,'release-manifest.json'),'utf8'));
const out={version:pkg.version,base_commit:process.argv[2]||prev.base_commit,build,package:'Przystan_'+pkg.version.replace('-rc.','_RC').replace(/^(\d)/,'$1'),deployment_revision:'RC'+pkg.version.split('rc.')[1],supersedes_zip:prev.package+'_TERMUX.zip',files:{}};
for(const f of files)out.files[f]=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,f))).digest('hex');
fs.writeFileSync(path.join(root,'release-manifest.json'),JSON.stringify(out,null,2)+'\n');console.log('manifest',out.version,Object.keys(out.files).length,'plików, build',build);
