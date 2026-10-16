
/* Zwalnia wycofane zasoby; obiekty nadal używane w scenie pozostają aktywne. */
function retireObjects(...roots){
 const objects=new Set(),geometries=new Set(),materials=new Set(),textures=new Set();
 const collect=(object,geometrySet,materialSet,textureSet)=>{
  if(object.geometry)geometrySet.add(object.geometry);
  for(const material of [].concat(object.material||[])){
   materialSet.add(material);
   for(const value of Object.values(material))if(value&&value.isTexture)textureSet.add(value);
  }
 };
 for(const root of roots.flat().filter(Boolean)){
  root.removeFromParent();root.traverse(object=>{objects.add(object);collect(object,geometries,materials,textures)});
 }
 const activeGeometry=new Set(),activeMaterial=new Set(),activeTexture=new Set();
 scene.traverse(object=>collect(object,activeGeometry,activeMaterial,activeTexture));
 for(const geometry of geometries)if(!activeGeometry.has(geometry))geometry.dispose();
 for(const material of materials)if(!activeMaterial.has(material))material.dispose();
 for(const texture of textures)if(!activeTexture.has(texture))texture.dispose();
 for(let index=fires.length-1;index>=0;index--)if(objects.has(fires[index].g))fires.splice(index,1);
}
