import * as THREE from './vendor/three.module.js';
// Shared geometries and instancing keep the landscape inexpensive on phones.
export function createNature(scene,island){
 const world=new THREE.Group();island.add(world);
 const rockMat=new THREE.MeshStandardMaterial({color:0xb9c4ac,flatShading:true,roughness:1});
 const turfMat=new THREE.MeshStandardMaterial({color:0x8cae59,flatShading:true,roughness:1});
 const rockGeo=new THREE.IcosahedronGeometry(1,1);
 for(const [x,z,s,h] of [[-4.4,-4.8,1.3,1.8],[-2.8,-5.5,1.6,2.4],[-.7,-5.8,1.3,1.6],[2,-5.8,1.5,2.1],[6.7,-2.2,1.2,1.3]]){
  const rock=new THREE.Mesh(rockGeo,rockMat);rock.position.set(x,h*.3-.4,z);rock.scale.set(s,h,s*.75);rock.castShadow=true;rock.receiveShadow=true;world.add(rock);
  const cap=new THREE.Mesh(rockGeo,turfMat);cap.position.set(x,h*.9-.35,z);cap.scale.set(s*.9,.3,s*.67);world.add(cap);
 }
 const grassGeo=new THREE.BufferGeometry();
 grassGeo.setAttribute('position',new THREE.Float32BufferAttribute([-.045,0,0,.045,0,0,.025,.31,0, 0,0,-.045,0,0,.045,.02,.24,.015],3));grassGeo.computeVertexNormals();
 const grassMat=new THREE.MeshStandardMaterial({color:0x88aa53,side:THREE.DoubleSide,roughness:1});
 const wind={value:0};
 grassMat.onBeforeCompile=shader=>{shader.uniforms.uWind=wind;shader.vertexShader='uniform float uWind;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n transformed.x += sin(uWind*1.8 + instanceMatrix[3].x*2.0 + instanceMatrix[3].z)*position.y*.24;');};
 const blades=new THREE.InstancedMesh(grassGeo,grassMat,650),dummy=new THREE.Object3D();
 let seed=791;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<650;i++){
  const a=random()*Math.PI*2,r=.83+random()*.13;
  dummy.position.set(Math.cos(a)*4.2*r,.045,Math.sin(a)*3*r);
  dummy.rotation.y=random()*6.28;dummy.scale.setScalar(.55+random()*.7);dummy.updateMatrix();blades.setMatrixAt(i,dummy.matrix);
  blades.setColorAt(i,new THREE.Color().setHSL(.21+random()*.05,.36,.39+random()*.16));
 }world.add(blades);
 const clouds=new THREE.Group();world.add(clouds);
 const cloudGeo=new THREE.IcosahedronGeometry(1,2),cloudMat=new THREE.MeshStandardMaterial({color:0xfff9e9,roughness:1,flatShading:false});
 for(let i=0;i<7;i++){
  const cluster=new THREE.Group();cluster.position.set(-18+i*6,7+random()*2,-13-random()*6);clouds.add(cluster);
  for(let j=0;j<4;j++){const puff=new THREE.Mesh(cloudGeo,cloudMat);puff.position.set(j*.8,Math.sin(j)*.15,0);puff.scale.set(1.2,.32+random()*.3,.65);cluster.add(puff);}
 }
 const foam=new THREE.Group();world.add(foam);
 const foamMat=new THREE.MeshBasicMaterial({color:0xf1fff0,transparent:true,opacity:.55,depthWrite:false});
 for(let band=0;band<2;band++){
  const pts=[];for(let i=0;i<=100;i++){const a=i/100*Math.PI*2;pts.push(new THREE.Vector3(Math.cos(a)*(5.25+band*.32),-.055,Math.sin(a)*(3.98+band*.28)));}
  const ribbon=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),100,.025,3,false),foamMat.clone());foam.add(ribbon);
 }
 const motesGeo=new THREE.BufferGeometry(),motes=[];
 for(let i=0;i<40;i++)motes.push((random()-.5)*13,.6+random()*3,(random()-.5)*9);
 motesGeo.setAttribute('position',new THREE.Float32BufferAttribute(motes,3));
 const motesMat=new THREE.PointsMaterial({color:0xffefad,size:.035,transparent:true,opacity:.6,depthWrite:false});const pollen=new THREE.Points(motesGeo,motesMat);world.add(pollen);
 return {update(time,night){
  wind.value=time;clouds.position.x=Math.sin(time*.025)*1.3;
  foam.children.forEach((mesh,i)=>{const phase=(time*.16+i*.5)%1;mesh.scale.setScalar(1+phase*.055);mesh.material.opacity=Math.sin(phase*Math.PI)*.45;});
  pollen.rotation.y=time*.025;motesMat.color.set(night?0xa8ffc4:0xffefad);motesMat.opacity=night?.8:.45;
  cloudMat.color.set(night?0x555879:0xfff9e9);
 }};
}
