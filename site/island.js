import * as THREE from './vendor/three.module.js';
import {createNature} from './nature.js';
const dialog = document.querySelector('#detail');
const content = document.querySelector('#content');
const canvas = document.querySelector('#island');

const pins = [];
const pinWorld = [[-3.1,2.24,1.1],[1.1,4.15,-2.5],[-3.05,1.37,-2.15],[2.75,2.46,1.35]];
const number = i => String(i+1).padStart(2,'0');

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

profile.forEach((section,i) => {
  const pin = element('button', '', 'pin');
  pin.append(element('small',number(i)),section.name);
  pin.dataset.open = i;
  document.querySelector('#pins').append(pin);
  pins.push(pin);
  const stop = element('button','','stop');
  stop.dataset.open = i;
  stop.style.setProperty('--badge',section.color);
  const labels = element('span');
  labels.append(element('strong',section.name),element('small',number(i)+' / '+section.en));
  stop.append(element('span',section.icon,'icon'),labels,element('span','↗','arrow'));
  document.querySelector('#index').append(stop);
});

document.addEventListener('click',event => {
  const button = event.target.closest('[data-open], [data-project], [data-item]');
  if (!button) return;
  if(arrivalActive)return;
  if(button.dataset.open !== undefined){enterRoom(Number(button.dataset.open));return;}
  const i = currentRoom;
  const section = button.dataset.project !== undefined ? projects[Number(button.dataset.project)] : {
    name:profile[i].items[Number(button.dataset.item)].title,
    en:profile[i].en,intro:'',items:[profile[i].items[Number(button.dataset.item)]]
  };
  const heading = element('h2',section.name);
  heading.id = 'section-title';
  dialog.setAttribute('aria-labelledby',heading.id);
  content.replaceChildren(element('div',(button.dataset.project === undefined ? number(i) : 'PROJECT')+' / '+section.en,'kicker'),heading,element('p',section.intro));
  for (const item of section.items) {
    const entry = element('article','','entry');
    if (item.image) {
      const image = element('img');
      image.src = item.image;
      image.alt = item.title;
      image.decoding = 'async';
      entry.append(image);
    }
    entry.append(element('div',item.label,'kicker'),element('h3',item.title),element('p',item.text));
    if (item.project !== undefined) {
      const explore = element('button','探索作品 ↗','project-link');
      explore.dataset.project = item.project;entry.append(explore);
    }
    if (item.url) {
      const link = element('a',item.linkLabel || '打开链接 ↗');
      link.href = item.url;
      entry.append(link);
    }
    content.append(entry);
  }
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
});
dialog.querySelector('.close').onclick = () => dialog.close();
dialog.addEventListener('click',event => {
  if (event.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
});

const faces = [];
const TAU = Math.PI*2;
function face(points,color) { faces.push({points,color}); }
function ring(x,z,y,rx,rz,n,rough=0) {
  return Array.from({length:n},(_,i) => {
    const a=i*TAU/n;
    const r=1+rough*(Math.sin(3*a+.6)+.45*Math.cos(7*a));
    return [x+Math.cos(a)*rx*r,y,z+Math.sin(a)*rz*r];
  });
}
function join(low,high,colors) {
  low.forEach((p,i) => {
    const j=(i+1)%low.length;
    face([p,low[j],high[j],high[i]],colors[i%colors.length]);
  });
}
function cylinder(x,z,y,h,bottom,top,colors,n=12) {
  const a=ring(x,z,y,bottom,bottom,n), b=ring(x,z,y+h,top,top,n);
  join(a,b,colors);
  face(b,colors[0]);
}
function box(x,z,y,w,d,h,colors) {
  const a=[[x-w/2,y,z-d/2],[x+w/2,y,z-d/2],[x+w/2,y,z+d/2],[x-w/2,y,z+d/2]];
  const b=a.map(([px,py,pz])=>[px,py+h,pz]);
  join(a,b,colors.slice(1));
  face(b,colors[0]);
}

const seabed=ring(0,0,-.44,6.15,4.8,42,.045);
const shelf=ring(0,0,-.12,6.15,4.8,42,.045);
join(seabed,shelf,['#448e88','#478f89','#539e96','#4b9790']);
face(shelf,'#66bcb0');
face(ring(0,0,-.11,5.86,4.5,42,.065),'#8ed0bf');
face(ring(0,0,-.10,5.38,4.12,42,.075),'#b7e0ca');
face(ring(0,0,-.09,5.02,3.79,42,.08),'#f2f2d8');
const beach=ring(0,0,.02,4.85,3.61,42,.08);
join(ring(0,0,-.08,5.00,3.78,42,.08),beach,['#eac58d','#e4ba82','#f0cf98']);
face(beach,'#f4dbab');
face(ring(.28,-.18,.026,3.62,2.65,38,.09),'#c1cd8e');
let seed=415;
function rand(){ seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296; }
for(let i=0;i<190;i++){
  const a=rand()*TAU, r=Math.sqrt(rand()), x=Math.cos(a)*4.4*r, z=Math.sin(a)*3.2*r;
  face(ring(x,z,.034,.013+rand()*.025,.013,4),i%3?'#dfbd8d':'#fff1cd');
}
for(let i=0;i<31;i++){
  const a=rand()*TAU, r=.84+rand()*.13;
  const x=Math.cos(a)*5.9*r,z=Math.sin(a)*4.55*r;
  if(Math.hypot(x/4.94,z/3.68)<1)continue;
  face(ring(x,z,-.075,.12+rand()*.25,.021,6),'#d4f0dc');
}
const groundCount = faces.length;
const wood=['#edbc84','#ae7951','#d29b66','#bd8558','#e0a574'];
const red=['#c08b56','#83532e','#a87142','#966034','#d09a65'];
const green=['#a2c1a5','#548f7d','#6da590','#44826f','#74ad99'];
function roof(x,z,y,w,d,h,colors) {
  const a=[x-w/2,y,z-d/2],b=[x+w/2,y,z-d/2],c=[x+w/2,y,z+d/2],e=[x-w/2,y,z+d/2];
  const f=[x-w/2,y+h,z],g=[x+w/2,y+h,z];
  face([a,b,g,f],colors[0]); face([e,f,g,c],colors[1]);
  face([a,f,e],colors[2]); face([b,c,g],colors[2]);
}
// Workshop with a raised boardwalk and striped awning.
box(-2.9,1.02,.045,2.12,1.64,.19,wood);
box(-2.98,.82,.23,1.62,1.2,1.12,red);
roof(-2.98,.82,1.34,1.91,1.47,.61,['#209bc0','#37b1ca','#217b96']);
box(-3.19,1.43,.24,.34,.03,.77,['#355b52','#355b52']);
box(-2.61,1.45,.65,.36,.035,.37,['#fce5ae','#fce5ae']);
for(let i=0;i<8;i++){
  const x=-3.78+i*.22;
  face([[x,1.2,1.43],[x+.22,1.2,1.43],[x+.22,1.05,1.9],[x,1.05,1.9]],i%2?'#f9e8c2':'#d66e50');
}
box(-2.88,2.05,.04,1.07,.33,.11,wood);
// Lighthouse.
cylinder(1.1,-2.36,.035,.23,.87,.72,['#d4ba8d','#b59b76','#d9c198']);
cylinder(1.1,-2.36,.26,.75,.53,.47,['#f9edd1','#dfcfad','#eee1c2']);
cylinder(1.1,-2.36,1.01,.58,.47,.41,['#ca6149','#a74735','#df7656']);
cylinder(1.1,-2.36,1.59,.62,.41,.34,['#faf1d4','#e7d7b5','#fff4d9']);
cylinder(1.1,-2.36,2.21,.13,.56,.55,['#305e54','#274d48','#3d7467']);
cylinder(1.1,-2.36,2.34,.52,.34,.34,['#fbd881','#c7ab61','#fff0b1']);
for(let i=0;i<8;i++){
  const a=i*TAU/8;
  cylinder(1.1+Math.cos(a)*.34,-2.36+Math.sin(a)*.34,2.34,.53,.025,.025,['#305e54'],5);
}
cylinder(1.1,-2.36,2.86,.12,.47,.48,['#375e53','#264d48','#487064']);
cylinder(1.1,-2.36,2.98,.59,.49,.045,['#d0654b','#ad493b','#e37d5a']);
cylinder(1.1,-2.36,3.57,.14,.055,.038,['#264d48'],6);
// Jetty and signal flag.
for(let i=0;i<10;i++) box(-3.38,-1.67-i*.25,.035,1.13,.224,.13,wood);
for(const x of [-3.87,-2.89]) for(const z of [-2.3,-3.72]) cylinder(x,z,-.11,.47,.075,.075,['#b48458','#a46f48']);
cylinder(-3.23,-2.17,.16,1.02,.035,.03,['#355f53']);
face([[-3.23,1.15,-2.17],[-2.62,1.05,-2.17],[-3.23,.8,-2.17]],'#e88362');
// Photo cabana.
box(2.67,1.3,.04,1.83,1.51,.16,wood);
box(2.67,1.26,.2,1.38,1.02,1.05,green);
roof(2.67,1.26,1.25,1.75,1.39,.53,['#249ab5','#45bac8','#237b8c']);
box(2.66,1.79,.55,.79,.04,.46,['#335c56','#335c56']);
box(2.66,1.82,.66,.5,.04,.24,['#f6dda1','#f6dda1']);
for(let i=0;i<5;i++) box(2.68,2.04+i*.075,.043,1.18,.066,.08,wood);

function palm(x,z,height,lean) {
  const trunk=['#b99366','#9c764e','#caa575'];
  let low=ring(x,z,.04,.13,.13,7);
  for(let j=1;j<=7;j++){
    const t=j/7;
    const high=ring(x+lean*t*t,z+.14*t,.04+height*t,.13-.06*t,.13-.06*t,7);
    join(low,high,trunk); low=high;
  }
  const px=x+lean,pz=z+.14,py=height+.04;
  for(let j=0;j<8;j++){
    const a=j*TAU/8+.14, dx=Math.cos(a),dz=Math.sin(a), l=.7+rand()*.48;
    const start=[px,py,pz], crest=[px+dx*l*.48,py+.26,pz+dz*l*.48], tip=[px+dx*l,py-.16,pz+dz*l];
    const left=[crest[0]-dz*.18,py+.06,crest[2]+dx*.18], right=[crest[0]+dz*.18,py+.08,crest[2]-dx*.18];
    face([start,left,tip,crest],j%2?'#3f8066':'#5c9a76');
    face([start,crest,tip,right],j%2?'#659e71':'#80aa74');
  }
}
palm(-1.72,-1.65,2.09,-.26);
palm(-2.2,-1.09,1.55,.16);
palm(3.68,-.87,2.24,.31);
palm(3.01,-1.5,1.61,-.18);
palm(-.15,2.81,1.67,.29);
for(let i=0;i<22;i++){
  const a=rand()*TAU,r=3.1+rand()*.45;
  const x=Math.cos(a)*r,z=Math.sin(a)*r*.76;
  cylinder(x,z,.032,.035+rand()*.17,.07+rand()*.16,.034,['#bbb09a','#a89e86','#cec1a5'],6);
}
// Striped beach umbrella.
cylinder(.25,1.37,.035,1.05,.026,.026,['#996f48'],6);
const umbrella=ring(.25,1.37,1.0,.59,.59,12);
umbrella.forEach((p,i)=>face([p,umbrella[(i+1)%12],[.25,1.37,1.28]],i%2?'#c7644e':'#fff0c7'));



// A social clubhouse sits at the head of the jetty.
box(-3.25,-2.0,.17,1.3,1.0,.85,green);
roof(-3.25,-2.0,1.02,1.5,1.2,.42,['#28a5bc','#207e9a','#58bfca']);
pinWorld[2]=[-3.25,1.75,-2.0];

// Roof shingles, raised decks and nautical details give the island a miniature feel.
for(const [x,z,y,w] of [[-2.98,.82,1.34,1.91],[2.67,1.26,1.25,1.75],[-3.25,-2,1.02,1.5]]){
  for(let row=0;row<4;row++)for(let col=0;col<7;col++){
    const px=x-w/2+.13+col*w/7;
    const pz=z+.08+row*.15;
    const py=y+.52-row*.125;
    box(px,pz,py,w/8,.18,.045,['#42b6ca','#217c9b','#2795b0']);
  }
}
box(-2.95,1.95,.1,2.1,.7,.12,wood);
for(const x of [-3.85,-2.05])cylinder(x,2.2,.22,.46,.045,.045,['#a07449'],6);
for(const [x,z] of [[-4.1,.15],[3.8,1.8],[.8,-3.1]]){
  cylinder(x,z,.04,.15,.24,.18,['#8e9a9d','#677f8c','#b4bdba'],7);
  cylinder(x+.25,z+.13,.04,.12,.18,.12,['#99a9aa','#798e96'],6);
}

// Terraced garden islets frame the main village without blocking its walking route.
function gardenIsland(x,z,size,height){
  const bottom=ring(x,z,-.46,size,size*.77,18,.075);
  const shore=ring(x,z,-.04,size,size*.77,18,.075);
  join(bottom,shore,['#cfbe98','#ead8ae','#d5c49d']);face(shore,'#f8e6b9');
  const base=ring(x,z,-.025,size*.78,size*.58,14,.07);
  const top=ring(x,z,height,size*.71,size*.53,14,.07);
  join(base,top,['#cfdbbc','#a6b59b','#dee4c9','#b5c5a5']);face(top,'#9ac66b');
  const upper=ring(x-.1,z-.12,height+.3,size*.42,size*.32,12,.06);
  join(ring(x-.1,z-.12,height,size*.46,size*.36,12,.06),upper,['#c4d3b0','#e0e6c8','#afc49c']);
  face(upper,'#b3d67b');
}
gardenIsland(-5.8,-3.7,1.75,.48);
gardenIsland(4.9,-4.0,2.0,.7);
gardenIsland(5.7,3.2,1.25,.3);
// Elevated rear garden.
const gardenLow=ring(.1,-2.8,.04,1.25,.6,16,.08);
const gardenTop=ring(.1,-2.8,.32,1.18,.55,16,.08);
join(gardenLow,gardenTop,['#c3b48e','#e1cfaa']);face(gardenTop,'#a8c76f');
function blossomTree(x,z,y,size){
  cylinder(x,z,y,size*.9,.095,.065,['#94664d','#6f4e40'],7);
  for(let i=0;i<5;i++){
    const a=i*TAU/5;
    cylinder(x+Math.cos(a)*size*.24,z+Math.sin(a)*size*.2,y+size*.65,size*.4,size*.42,size*.28,['#f1b7bc','#e89eae','#ffd0ce'],7);
  }
  cylinder(x,z,y+size*.9,size*.27,size*.35,.15,['#ffd5d1','#edb1bf'],7);
}
blossomTree(-5.8,-3.7,.8,1.2);
blossomTree(4.7,-4.1,1,1.25);
blossomTree(5.7,3.2,.6,.9);
function pine(x,z,y,h){
  cylinder(x,z,y,.35,.055,.05,['#8d7250'],6);
  cylinder(x,z,y+.15,h*.65,h*.28,0,['#478a6c','#3a775e','#68a783'],7);
  cylinder(x,z,y+h*.43,h*.57,h*.21,0,['#77ad7a','#4e9669','#5f9f73'],7);
}
pine(4,-3.7,1,.8);pine(5.5,-4.1,1,1);pine(-6.5,-3.8,.8,.8);
// Curved stepping-stone trails connect all four destinations.
for(const [ax,az,bx,bz] of [[-2.5,1.8,.3,.1],[.3,.1,2.5,1.9],[.3,.1,1.1,-1.7],[.3,.1,-2.8,-1.3]]){
  for(let j=0;j<9;j++){
    const t=j/8,x=ax+(bx-ax)*t,z=az+(bz-az)*t;
    cylinder(x,z,.045,.035,.13+(j%3)*.015,.13,['#d8cbb1','#c2b69e','#e9dcc3'],6);
  }
}
// Flowers and grass in small clusters around the coast.
for(let i=0;i<75;i++){
  const a=i*2.39996,x=Math.cos(a)*(3.5+rand()*.7),z=Math.sin(a)*(2.55+rand()*.32);
  cylinder(x,z,.04,.13,.016,.012,['#79a665'],4);
  const color=['#fff1ce','#f3acb8','#e5c86d','#c5a8d9'][i%4];
  cylinder(x,z,.17,.035,.045,.025,[color],5);
}
for(let i=0;i<15;i++){
  const a=i*TAU/15;
  cylinder(Math.cos(a)*4.5,Math.sin(a)*3.2,.04,.15,.16,.11,['#8a9c91','#b4bdb0','#778b84'],6);
}
// A small wooden footbridge to the western garden.
for(let i=0;i<10;i++)box(-4.35-i*.16,-2.8-i*.07,.04,.22,.58,.09,wood);
for(const x of [-4.4,-5.7]){
  cylinder(x,-3.12,.02,.46,.04,.04,['#ab8156'],6);
  cylinder(x,-2.53,.02,.46,.04,.04,['#ab8156'],6);
}
// Beach towels, loungers and a second striped parasol.
for(const [x,z,color] of [[1.25,2.7,'#8ec9c7'],[2.2,2.65,'#e9a8ac']]){
  box(x,z,.045,.42,.77,.025,[color,color]);
  for(let i=0;i<4;i++)box(x,z-.29+i*.18,.073,.42,.06,.008,['#fff0d1','#fff0d1']);
}
cylinder(1.7,2.95,.04,.9,.026,.026,['#af875c'],6);
const beachParasol=ring(1.7,2.95,.9,.48,.48,12);
beachParasol.forEach((p,i)=>face([p,beachParasol[(i+1)%12],[1.7,1.16,2.95]],i%2?'#fff2c9':'#82c4c7'));
// Low picket fence along the rear flower garden.
for(let i=0;i<13;i++)box(-.9+i*.14,-3.17,.3,.045,.045,.32,['#fff0d4','#e2d5b8']);
box(-.06,-3.17,.43,1.85,.035,.035,['#fff0d4','#e2d5b8']);

const renderer = new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.12;
const scene=new THREE.Scene();
scene.background=new THREE.Color(0xa7d4db);
scene.fog=new THREE.FogExp2(0xa7d4db,.018);
const camera=new THREE.PerspectiveCamera(38,1,.1,120);
const island=new THREE.Group();
scene.add(island);
const nature=createNature(scene,island);
// Batch static faces by material while preserving flat triangle normals.
const verticesByColor=new Map();
for(const {points,color} of faces){
  if(!verticesByColor.has(color))verticesByColor.set(color,[]);
  const vertices=verticesByColor.get(color);
  for(let i=1;i<points.length-1;i++)vertices.push(...points[0],...points[i],...points[i+1]);
}
for(const [color,vertices] of verticesByColor){
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  geometry.computeVertexNormals();
  const mesh=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color,roughness:.82,side:THREE.DoubleSide,flatShading:true}));
  mesh.castShadow=true;mesh.receiveShadow=true;island.add(mesh);
}
scene.add(new THREE.HemisphereLight(0xd8edee,0xa09068,1.8));
const moon=new THREE.DirectionalLight(0xffe3ae,3.1);
moon.position.set(-5,10,4);moon.castShadow=true;
moon.shadow.mapSize.set(2048,2048);
Object.assign(moon.shadow.camera,{left:-9,right:9,top:9,bottom:-9,near:.5,far:35});
moon.shadow.bias=-.001;
scene.add(moon);
const sunset=new THREE.DirectionalLight(0x9edfff,1.4);
sunset.position.set(5,4,-6);scene.add(sunset);
const glowMaterial=new THREE.MeshStandardMaterial({color:0xffdc9b,emissive:0xffa637,emissiveIntensity:3});
for(const [x,y,z] of [[1.1,2.6,-2.36],[-2.61,.84,1.49],[2.66,.8,1.86]]){
  const bulb=new THREE.Mesh(new THREE.BoxGeometry(.16,.22,.12),glowMaterial);
  bulb.position.set(x,y,z);island.add(bulb);
  const light=new THREE.PointLight(0xffa84c,5,4,1.3);
  light.position.set(x,y,z+.25);island.add(light);
}
const waterGeometry=new THREE.PlaneGeometry(160,160,48,48);
waterGeometry.rotateX(-Math.PI/2);
const water=new THREE.Mesh(waterGeometry,new THREE.MeshStandardMaterial({color:0x429fae,metalness:.12,roughness:.36,flatShading:true}));
water.position.y=-.52;water.receiveShadow=true;scene.add(water);
const starsGeometry=new THREE.BufferGeometry();
const starPositions=[];
for(let i=0;i<180;i++)starPositions.push((rand()-.5)*85,10+rand()*35,(rand()-.5)*85);
starsGeometry.setAttribute('position',new THREE.Float32BufferAttribute(starPositions,3));
starsGeometry.dispose();
// A small articulated beach avatar. Coordinates are local to her feet.
const girl = new THREE.Group();
island.add(girl);
const skin = new THREE.MeshStandardMaterial({color:0xf3bb91,roughness:.85});
const hair = new THREE.MeshStandardMaterial({color:0x352235,roughness:.85});
const dress = new THREE.MeshStandardMaterial({color:0xf18d73,roughness:.8});
const glasses = new THREE.MeshStandardMaterial({color:0x10182c,roughness:.24,metalness:.35});
const cream = new THREE.MeshStandardMaterial({color:0xffe6bb,roughness:.75});
function avatarPart(parent,geometry,material,x,y,z){
  const part=new THREE.Mesh(geometry,material);
  part.position.set(x,y,z);part.castShadow=true;part.receiveShadow=true;
  parent.add(part);return part;
}
const body = new THREE.Group();
girl.add(body);
avatarPart(body,new THREE.CylinderGeometry(.15,.29,.44,12),dress,0,.52,0);
avatarPart(body,new THREE.SphereGeometry(.12,12,8),skin,0,.79,0);
const head = new THREE.Group();
head.position.y=1.06;body.add(head);
avatarPart(head,new THREE.SphereGeometry(.32,18,14),hair,0,.025,-.055);
avatarPart(head,new THREE.SphereGeometry(.285,18,14),skin,0,0,.055);
const bangs=avatarPart(head,new THREE.SphereGeometry(.29,16,10),hair,0,.17,.025);
bangs.scale.set(1,.53,1);
for(const side of [-1,1]){
  const tail=avatarPart(head,new THREE.SphereGeometry(.16,12,10),hair,side*.3,-.13,-.1);
  tail.scale.set(.7,1.7,.85);
  avatarPart(head,new THREE.SphereGeometry(.045,10,8),dress,side*.3,-.015,-.05);
  const lens=avatarPart(head,new THREE.SphereGeometry(.115,14,10),glasses,side*.126,.025,.303);
  lens.scale.set(1,.77,.28);
  avatarPart(head,new THREE.BoxGeometry(.035,.035,.19),glasses,side*.25,.03,.24);
  avatarPart(head,new THREE.SphereGeometry(.039,10,8),dress,side*.19,-.10,.27);
}
avatarPart(head,new THREE.BoxGeometry(.09,.035,.035),glasses,0,.025,.32);
avatarPart(head,new THREE.SphereGeometry(.045,10,8),skin,0,-.055,.335);
const smile=avatarPart(head,new THREE.TorusGeometry(.055,.012,6,12,Math.PI),hair,0,-.12,.306);
smile.rotation.z=Math.PI;
const legs=[],arms=[];
for(const side of [-1,1]){
  const leg=new THREE.Group();leg.position.set(side*.105,.34,0);body.add(leg);legs.push(leg);
  avatarPart(leg,new THREE.CylinderGeometry(.065,.055,.24,10),skin,0,-.12,0);
  avatarPart(leg,new THREE.BoxGeometry(.15,.07,.23),cream,0,-.26,.04);
  const arm=new THREE.Group();arm.position.set(side*.19,.69,0);body.add(arm);arms.push(arm);
  const sleeve=avatarPart(arm,new THREE.SphereGeometry(.10,12,8),dress,side*.025,-.035,0);
  sleeve.scale.y=.8;
  avatarPart(arm,new THREE.CylinderGeometry(.055,.045,.23,10),skin,side*.045,-.17,0);
  avatarPart(arm,new THREE.SphereGeometry(.06,10,8),skin,side*.045,-.29,0);
}
// A clear route through the open middle of the beach, away from buildings and palms.
const strollPoints=[
  new THREE.Vector3(-1.2,.05,.6),
  new THREE.Vector3(.1,.05,-.55),
  new THREE.Vector3(1.65,.05,.05),
  new THREE.Vector3(1.3,.05,1.8)
];
const strollDurations=strollPoints.map((p,i)=>p.distanceTo(strollPoints[(i+1)%strollPoints.length])/.34);
const pauseDuration=2.8;
const strollPeriod=strollDurations.reduce((sum,d)=>sum+d+pauseDuration,0);
function updateGirl(time){
  let phase=time%strollPeriod,index=0;
  while(phase>=strollDurations[index]+pauseDuration){
    phase-=strollDurations[index]+pauseDuration;index++;
  }
  const from=strollPoints[index],to=strollPoints[(index+1)%strollPoints.length];
  const duration=strollDurations[index],walking=phase<duration;
  girl.position.lerpVectors(from,to,Math.min(phase/duration,1));
  girl.rotation.y=Math.atan2(to.x-from.x,to.z-from.z);
  const step=walking?Math.sin(phase*9):0;
  body.position.y=walking?Math.abs(step)*.028:Math.sin((phase-duration)*2)*.008;
  legs[0].rotation.x=step*.38;legs[1].rotation.x=-step*.38;
  arms[0].rotation.x=-step*.3;arms[1].rotation.x=step*.3;
  head.rotation.y=walking?0:Math.sin((phase-duration)/pauseDuration*Math.PI*2)*.38;
}


let currentRoom = null;
const room = new THREE.Group();
room.visible=false;scene.add(room);
const photoTextures=profile[3].items.map(item=>{const texture=new THREE.TextureLoader().load(item.image);texture.colorSpace=THREE.SRGBColorSpace;return texture;});
let galleryPage=0;
const roomPins=[];
const roomPoints=[];
const roomBar=element('div','','room-bar');
const returnButton=element('button','← 返回海岛');
const roomTitle=element('span');
const previousPage=element('button','← 上一展区');
const nextPage=element('button','下一展区 →');
previousPage.onclick=()=>enterRoom(currentRoom,galleryPage-1);
nextPage.onclick=()=>enterRoom(currentRoom,galleryPage+1);
roomBar.append(returnButton,roomTitle,previousPage,nextPage);
document.querySelector('.scene').append(roomBar);roomBar.hidden=true;
const roomNames=['作品馆','经历档案馆','社交会客厅','照片画廊'];
const furnitureNames=[
  ['观测仪 · GEO Lens','唱片台 · AirMixer','判官桌 · 恋爱判官','玻璃装置 · Breath Glass','创业书桌 · FounderOS'],
  ['AI 办公桌','Binance 展柜','电影放映机','NTU 毕业书架'],
  ['X · 聊天沙发','LinkedIn · 书桌名片','TikTok · 床边电视'],
  ["CAS 晚宴", "WTCC 闭门会", "与 CZ 合影", "外滩 · 现场", "外滩 · 圆桌"]
];
function clearRoom(){
  for(const child of [...room.children]){
    child.traverse(object=>{object.geometry?.dispose();if(object.material)object.material.dispose();});
    room.remove(child);
  }
  roomPins.forEach(pin=>pin.remove());roomPins.length=0;roomPoints.length=0;
}
function roomBox(x,y,z,w,h,d,color){
  return avatarPart(room,new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color,roughness:.8}),x,y,z);
}

function roomRound(x,y,z,w,h,d,color){
  const shape=new THREE.Shape(),r=.09;
  shape.moveTo(-w/2+r,-h/2);shape.lineTo(w/2-r,-h/2);
  shape.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);shape.lineTo(w/2,h/2-r);
  shape.quadraticCurveTo(w/2,h/2,w/2-r,h/2);shape.lineTo(-w/2+r,h/2);
  shape.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);shape.lineTo(-w/2,-h/2+r);
  shape.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
  const geometry=new THREE.ExtrudeGeometry(shape,{depth:d,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.035,bevelThickness:.035,curveSegments:5});
  return avatarPart(room,geometry,new THREE.MeshStandardMaterial({color,roughness:.92}),x,y,z-d/2);
}
function sofa(x,z){
  roomBox(x,.19,z,1.8,.22,.86,0x795a40);
  roomRound(x,.43,z,1.85,.33,.9,0x548e87);
  roomRound(x,.84,z-.37,1.85,.65,.23,0x417c79);
  for(const side of [-1,1]){
    roomRound(x+side*.88,.65,z,.2,.45,.93,0x477f7a);
    roomRound(x+side*.42,.61,z+.07,.75,.14,.63,0x79aaa0);
  }
  const pillow=roomRound(x-.5,.84,z-.13,.42,.4,.14,0xe9c78f);
  pillow.rotation.z=.18;
}
function tableLamp(x,z,base=.7){
  avatarPart(room,new THREE.CylinderGeometry(.16,.2,.07,16),new THREE.MeshStandardMaterial({color:0xc29555}),x,base,z);
  avatarPart(room,new THREE.CylinderGeometry(.035,.05,.4,12),new THREE.MeshStandardMaterial({color:0xb08249}),x,base+.23,z);
  avatarPart(room,new THREE.CylinderGeometry(.19,.31,.35,20),new THREE.MeshStandardMaterial({color:0xffe9ac,emissive:0xffc566,emissiveIntensity:.55}),x,base+.57,z);
  const light=new THREE.PointLight(0xffd28c,1.8,3,2);light.position.set(x,base+.47,z);room.add(light);
}
function bed(x,z){
  roomBox(x,.2,z,1.5,.3,2,0x7c5844);
  roomRound(x,.44,z,1.5,.24,2,0xf6ead5);
  roomRound(x,.61,z+.32,1.53,.15,1.35,0xcd8d83);
  roomRound(x,.92,z-.95,1.65,1.1,.16,0x53616d);
  for(const side of [-.38,.38])roomRound(x+side,.63,z-.64,.6,.17,.42,0xfff4dc);
  roomBox(x+.98,.36,z-.64,.48,.7,.48,0xa47c54);tableLamp(x+.98,z-.64,.74);
}
function decorateRoom(index){
  roomBox(0,.027,.4,5.1,.025,3.4,0xa3b694);
  roomBox(0,.043,.4,4.8,.012,3.1,0xc7d1ac);
  roomBox(0,.13,-2.86,7.9,.22,.08,0xcba576);
  roomBox(-3.87,.13,0,.08,.22,5.8,0xcba576);
  roomBox(.1,2.12,-2.8,3.1,.13,.42,0x9c714e);
  for(let k=0;k<8;k++)roomBox(-1.15+k*.17,2.44,-2.78,.12,.48+(k%3)*.06,.25,[0x9e675b,0x698f8a,0xd9bd87][k%3]);
  roomBox(2.75,1.8,-2.86,1.35,1.35,.1,0xe6c58f);
  roomBox(2.75,1.8,-2.79,1.12,1.12,.04,0xb6dfea);
  roomBox(2.75,1.8,-2.75,.05,1.15,.04,0xfff0d5);
  roomBox(2.75,1.8,-2.75,1.15,.05,.04,0xfff0d5);
  if(index!==2){sofa(-2.5,2.3);roomBox(3.25,.35,2.3,.65,.7,.65,0xad845b);tableLamp(3.25,2.3,.73);}
}
function enterRoom(index,page=0){
  const paginated=index===1 || index===3;
  galleryPage=paginated?Math.max(0,Math.min(page,Math.ceil(profile[index].items.length/5)-1)):0;
  clearRoom();currentRoom=index;
  journeyIndex=index;visited.add(index);updateJourney();journey.hidden=true;
  cameraFocus.set(0,.65,0);
  followButton.hidden=true;
  island.visible=false;water.visible=false;room.visible=true;
  pins.forEach(pin=>pin.hidden=true);roomBar.hidden=false;
  roomTitle.textContent=roomNames[index]+(paginated?' · '+(galleryPage+1)+' / '+Math.ceil(profile[index].items.length/5):' / 点击家具探索');
  previousPage.hidden=nextPage.hidden=!paginated;
  previousPage.disabled=galleryPage===0;
  nextPage.disabled=galleryPage>=Math.ceil(profile[index].items.length/5)-1;
  roomBox(0,-.12,0,8,.25,6,0xc5a784);
  roomBox(0,1.3,-3,8,2.8,.18,0x497f87);
  roomBox(-4,1.3,0,.18,2.8,6,0x86a69d);
  for(let x=-3.6;x<4;x+=.55)roomBox(x,.015,0,.025,.01,5.8,0x9a7959);
  decorateRoom(index);
  const start=paginated?galleryPage*5:0;
  const count=index===0?projects.length:Math.min(paginated?5:Infinity,profile[index].items.length-start);
  const positions=count>3?[[-2.4,-1.6],[0,-1.6],[2.4,-1.6],[-1.5,1.25],[1.5,1.25]]:[[-2.4,0],[0,0],[2.4,0]];
  for(let j=0;j<count;j++){
    const itemIndex=start+j;
    const [x,z]=index===2?[[-2.3,.3],[.1,-1.7],[2,1.1]][j]:positions[j];
    const color=new THREE.Color(index===0?projects[j].color:profile[index].color);
    if(index!==2){
      roomBox(x,.55,z,1.35,.16,.9,0xc99d70);
      for(const side of [-.5,.5])roomBox(x+side,.26,z,.08,.5,.65,0x765b4a);
    }
    if(index===2){
      if(j===0){
        sofa(x,z);roomBox(x,.27,z+1.05,1.15,.15,.6,0xb88c61);
        roomBox(x-.18,.37,z+1.05,.35,.08,.28,0xe5c495);
      }else if(j===1){
        roomBox(x,.74,z,1.7,.14,.85,0xb98a5d);
        for(const side of [-.67,.67])roomBox(x+side,.35,z,.1,.7,.65,0x79583e);
        tableLamp(x-.48,z,.84);
        roomBox(x+.35,.84,z+.12,.45,.04,.3,0xf9edce);
        roomRound(x,.4,z+.9,.6,.16,.6,0x9fb29c);
        roomRound(x,.72,z+1.15,.6,.55,.12,0x78968b);
      }else{
        bed(x,z);
        roomBox(x,.95,z+1.15,.86,.6,.12,0x364653);
        roomBox(x,.95,z+1.22,.71,.43,.025,0xb9d8ce);
      }
    }else if(index===3){
      const aspect=profile[3].items[itemIndex].aspect;
      const h=Math.min(1.13,1.25/aspect),w=h*aspect;
      roomBox(x,1.17,z,w+.14,h+.14,.13,0xd2a365);
      const photo=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:photoTextures[itemIndex],side:THREE.DoubleSide}));
      photo.position.set(x,1.17,z+.075);room.add(photo);
    }else if(index===0 && j===1){
      const disc=avatarPart(room,new THREE.CylinderGeometry(.37,.37,.08,24),new THREE.MeshStandardMaterial({color:0x1b243d}),x,.7,z);
      avatarPart(room,new THREE.CylinderGeometry(.10,.10,.09,16),new THREE.MeshStandardMaterial({color}),x,.71,z);
    }else if(index===0 && j===3){
      const pane=roomBox(x,1.05,z,1.05,.9,.09,0x9ee7e3);
      pane.material.transparent=true;pane.material.opacity=.55;
      roomBox(x,.64,z,1.16,.08,.18,0xf2d3a8);
    }else if(index===1 && itemIndex===2){
      roomBox(x,.91,z,.62,.5,.44,0x293243);
      for(const offset of [-.22,.22])avatarPart(room,new THREE.TorusGeometry(.19,.045,8,16),new THREE.MeshStandardMaterial({color:0xc8b7a1}),x+offset,1.3,z);
    }else if(index===1 && itemIndex===7){
      for(let k=0;k<6;k++)roomBox(x-.45+k*.17,.94,z,.12,.55,.35,k%2?0x91bcae:0xdfaa83);
    }else{
      roomBox(x,1.02,z,1.05,.74,.13,0x273047);
      roomBox(x,1.04,z+.08,.88,.55,.025,color);
      roomBox(x,.68,z,.12,.2,.12,0x273047);
    }
    const pin=element('button',(index===3 || index===1)?profile[index].items[itemIndex].title:furnitureNames[index][j],'pin room-pin');
    if(index===0)pin.dataset.project=j;else pin.dataset.item=itemIndex;
    document.querySelector('#pins').append(pin);roomPins.push(pin);roomPoints.push([x,1.75,z]);
  }
  yaw=.25;pitch=.8;distance=13;returnButton.focus();
}
function leaveRoom(){
  currentRoom=null;journey.hidden=false;updateJourney();cameraFocus.set(0,.65,0);followButton.hidden=false;room.visible=false;island.visible=true;water.visible=true;
  clearRoom();roomBar.hidden=true;pins.forEach(pin=>pin.hidden=false);
  yaw=.35;pitch=.74;distance=23;
}
returnButton.onclick=leaveRoom;
document.addEventListener('keydown',event=>{if(event.key==='Escape' && !dialog.open && currentRoom!==null)leaveRoom();});

let yaw=.35,pitch=.74,distance=23;
const target=new THREE.Vector3(0,.65,0);
const cameraFocus=new THREE.Vector3(0,.65,0),desiredCamera=new THREE.Vector3();
let cameraReady=false,lastCameraTime=performance.now();
function cameraUpdate(){
  const fittedDistance=distance*Math.max(1,1/camera.aspect);
  const now=performance.now(),dt=Math.min(.1,(now-lastCameraTime)/1000);lastCameraTime=now;
  const blend=reducedMotion||!cameraReady?1:1-Math.exp(-6*dt);
  target.lerp(cameraFocus,blend);
  desiredCamera.set(Math.sin(yaw)*Math.cos(pitch)*fittedDistance,Math.sin(pitch)*fittedDistance,Math.cos(yaw)*Math.cos(pitch)*fittedDistance).add(cameraFocus);
  camera.position.lerp(desiredCamera,blend);cameraReady=true;
  camera.lookAt(target);
}
new ResizeObserver(()=>{
  const {width,height}=canvas.getBoundingClientRect();
  renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();
}).observe(canvas);
let drag=null;
canvas.addEventListener('pointerdown',e=>{
  if(e.button!==0||arrivalActive)return;
  if(followMode && currentRoom===null){guidePointer(e);canvas.setPointerCapture(e.pointerId);return;}
  drag={id:e.pointerId,x:e.clientX,y:e.clientY,yaw,pitch};
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove',e=>{
  if(drag?.id!==e.pointerId)return;
  yaw=drag.yaw-(e.clientX-drag.x)*.007;
  pitch=THREE.MathUtils.clamp(drag.pitch+(e.clientY-drag.y)*.005,.3,1.25);
});
canvas.addEventListener('lostpointercapture',()=>drag=null);
canvas.addEventListener('wheel',e=>{
  e.preventDefault();if(arrivalActive)return;distance=THREE.MathUtils.clamp(distance+e.deltaY*.012,currentRoom===null?15:9,36);
},{passive:false});
document.querySelector('#reset').onclick=()=>{cameraFocus.set(0,.65,0);yaw=.35;pitch=.74;distance=currentRoom===null?23:13;};

let partyMode=false,followMode=false,followTarget=null,lastWalkTime=0;
const modeButton=element('button',english?'☀ Sunny day':'☀ 阳光白天','music-button');
const followButton=element('button',english?'♡ Guide Anita':'♡ 牵着 Anita 走','music-button');
modeButton.setAttribute('aria-pressed','false');followButton.setAttribute('aria-pressed','false');
document.querySelector('header').append(modeButton,followButton);
const partyLights=new THREE.Group();scene.add(partyLights);partyLights.visible=false;
for(let i=0;i<6;i++){
 const light=new THREE.PointLight([0xff4eab,0x6c77ff,0x2beed8][i%3],12,10,2);
 light.position.set(Math.cos(i*TAU/6)*3,2,Math.sin(i*TAU/6)*2.5);partyLights.add(light);
}
modeButton.onclick=()=>{
 partyMode=!partyMode;partyLights.visible=partyMode;
 scene.background.set(partyMode?0x151333:0xa7d4db);scene.fog.color.copy(scene.background);
 moon.intensity=partyMode?.55:3.1;sunset.intensity=partyMode?.4:1.4;
 scene.children.find(object=>object.isHemisphereLight).intensity=partyMode?.45:1.8;
 water.material.color.set(partyMode?0x20255c:0x429fae);
 document.body.classList.toggle('party',partyMode);
 document.documentElement.dataset.party=String(partyMode);
 modeButton.textContent=partyMode?(english?'✦ Night party':'✦ 夜间派对'):(english?'☀ Sunny day':'☀ 阳光白天');
 modeButton.setAttribute('aria-pressed',String(partyMode));
};
followButton.onclick=()=>{
 followMode=!followMode;followTarget=null;
 followButton.setAttribute('aria-pressed',String(followMode));
 followButton.textContent=followMode?(english?'♡ Following pointer · Stop':'♡ 鼠标牵引中 · 停止'):(english?'♡ Guide Anita':'♡ 牵着 Anita 走');
};
const guideRay=new THREE.Raycaster(),guidePlane=new THREE.Plane(new THREE.Vector3(0,1,0),-.05);
const guideMarker=new THREE.Mesh(new THREE.RingGeometry(.16,.21,32),new THREE.MeshBasicMaterial({color:0xffb680,side:THREE.DoubleSide,transparent:true,opacity:.8}));
guideMarker.rotation.x=-Math.PI/2;guideMarker.visible=false;island.add(guideMarker);
function guidePointer(event){
 if(!followMode||currentRoom!==null||drag)return;
 const rect=canvas.getBoundingClientRect();
 guideRay.setFromCamera(new THREE.Vector2((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1),camera);
 const hit=new THREE.Vector3();
 if(!guideRay.ray.intersectPlane(guidePlane,hit))return;
 // Keep the guided route in the clear central beach, between the buildings.
 hit.x=THREE.MathUtils.clamp(hit.x,-1.45,1.65);hit.z=THREE.MathUtils.clamp(hit.z,-.65,1.9);
 followTarget=hit;
}
canvas.addEventListener('pointermove',guidePointer);
function animateAvatar(time){
 const delta=Math.min(.05,Math.max(0,time-lastWalkTime));lastWalkTime=time;
 if(!followMode||currentRoom!==null){guideMarker.visible=false;updateGirl(time);return;}
 guideMarker.visible=!!followTarget;
 if(!followTarget)return;
 guideMarker.position.copy(followTarget);guideMarker.position.y=.09;
 const direction=followTarget.clone().sub(girl.position);direction.y=0;
 const moving=direction.length()>.06;
 if(moving){girl.rotation.y=Math.atan2(direction.x,direction.z);girl.position.addScaledVector(direction.normalize(),Math.min(delta*.85,girl.position.distanceTo(followTarget)));}
 const step=moving?Math.sin(time*10):0;
 legs[0].rotation.x=step*.38;legs[1].rotation.x=-step*.38;
 arms[0].rotation.x=-step*.3;arms[1].rotation.x=step*.3;body.position.y=Math.abs(step)*.025;
 head.rotation.y=0;
}

// A lightweight guided itinerary keeps the full-screen world as the main interface.
let journeyIndex=0;
const visited=new Set();
const journey=element('aside','','journey');
journey.setAttribute('aria-label',english?'Island itinerary':'海岛探索路线');
const journeyEyebrow=element('div',"ANITA’S HOME · ISLAND STORIES",'journey-eyebrow');
const journeyHeading=element('h1');
const journeyDescription=element('p');
const journeyStatus=element('div','','journey-status');
journeyStatus.setAttribute('aria-live','polite');
const journeyStops=element('div','','journey-stops');
const journeyDescriptions=english?
 ['Ideas turned into products. Explore five independent projects.','From film and storytelling to Web3 and AI. Discover my journey.','A little living room for new conversations. Let’s connect.','Talks, gatherings and people along the way. Open the photo album.']:
 ['把想法做成产品，探索我的五个独立作品。','从电影与内容，到 Web3 与 AI，认识我的多面经历。','在海边客厅坐一坐，从这里找到我。','演讲、相聚与同行的人，翻开我的活动相册。'];
const stopButtons=profile.map((section,i)=>{
 const button=element('button',number(i),'journey-stop');
 button.setAttribute('aria-label',section.name);
 button.onclick=()=>selectJourney(i);
 journeyStops.append(button);return button;
});
const journeyActions=element('div','','journey-actions');
const journeyEnter=element('button',english?'Explore this stop ↗':'进入这一站 ↗','journey-enter');
journeyEnter.onclick=()=>enterRoom(journeyIndex);
const journeyNext=element('button',english?'Next →':'下一站 →','journey-next');
journeyNext.onclick=()=>selectJourney((journeyIndex+1)%profile.length);
journeyActions.append(journeyEnter,journeyNext);
journey.append(journeyEyebrow,journeyHeading,journeyDescription,journeyStops,journeyActions,journeyStatus);
document.querySelector('.scene').append(journey);
function updateJourney(){
 journeyHeading.textContent=number(journeyIndex)+' / '+profile[journeyIndex].name;
 journeyDescription.textContent=journeyDescriptions[journeyIndex];
 journeyStatus.textContent=english?`${visited.size} of 4 places explored · Your own pace`:`已探索 ${visited.size} / 4 站 · 慢慢逛，不赶时间`;
 stopButtons.forEach((button,i)=>{
  button.setAttribute('aria-current',i===journeyIndex?'step':'false');
  button.classList.toggle('visited',visited.has(i));
 });
 pins.forEach((pin,i)=>pin.classList.toggle('destination',i===journeyIndex));
}
function selectJourney(index){
 journeyIndex=index;updateJourney();
 const [x,,z]=pinWorld[index];cameraFocus.set(x*.45,.8,z*.45);
 yaw=.35;pitch=.68;distance=19;
}
updateJourney();

const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
// A seaplane arrival lands beside the island, keeping the beach pedestrian-only.
const plane=new THREE.Group();scene.add(plane);
const planeCream=new THREE.MeshStandardMaterial({color:0xffedca,roughness:.55});
const coral=new THREE.MeshStandardMaterial({color:0xe87961,roughness:.5});
const glass=new THREE.MeshStandardMaterial({color:0x317783,metalness:.25,roughness:.2});
function planePart(geometry,material,x,y,z){return avatarPart(plane,geometry,material,x,y,z);}
const fuselage=planePart(new THREE.SphereGeometry(1,24,16),planeCream,0,0,0);fuselage.scale.set(.27,.3,1.05);
const cockpit=planePart(new THREE.SphereGeometry(1,16,12),glass,0,.24,.1);cockpit.scale.set(.23,.22,.42);
planePart(new THREE.BoxGeometry(2.65,.07,.45),coral,0,.12,-.05);
planePart(new THREE.BoxGeometry(1.05,.06,.3),coral,0,.12,-.83);
planePart(new THREE.BoxGeometry(.07,.5,.38),coral,0,.32,-.8);
for(const x of [-.4,.4]){
 const float=planePart(new THREE.SphereGeometry(1,16,10),planeCream,x,-.5,0);float.scale.set(.13,.13,1.05);
 planePart(new THREE.BoxGeometry(.045,.38,.045),coral,x,-.26,.35);
 planePart(new THREE.BoxGeometry(.045,.38,.045),coral,x,-.26,-.4);
}
const propeller=planePart(new THREE.BoxGeometry(.075,1,.045),coral,0,0,1.03);
plane.rotation.y=Math.PI/2;
// Small arrival pier on the near shore.
const landingDock=new THREE.Group();island.add(landingDock);
for(let i=0;i<9;i++)avatarPart(landingDock,new THREE.BoxGeometry(1.15,.12,.23),new THREE.MeshStandardMaterial({color:0xba9569}),0,-.03,3.1+i*.25);
for(const x of [-.5,.5])for(const z of [3.3,4.8])avatarPart(landingDock,new THREE.CylinderGeometry(.06,.07,.8,8),new THREE.MeshStandardMaterial({color:0x8c694a}),x,-.25,z);
let arrivalActive=true,arrivalPhase='flight',arrivalTime=0,arrivalLast=null,dialogueStep=0;
const arrival=element('section','','arrival');
arrival.setAttribute('aria-label',english?'Arrival at Anita’s island':'抵达 Anita 的小岛');
const arrivalCaption=element('div',english?'NEXT STOP · ANITA’S ISLAND':'下一站 · ANITA 的小岛','arrival-caption');
const skipArrival=element('button',english?'Skip arrival ↗':'跳过开场 ↗','arrival-skip');
const welcome=element('div','','arrival-dialogue');welcome.hidden=true;
welcome.setAttribute('role','dialog');welcome.setAttribute('aria-labelledby','welcome-title');
const speaker=element('div','ANITA · YOUR ISLAND HOST','arrival-speaker');
const welcomeTitle=element('h2',english?'You made it!':'你终于来啦！');welcomeTitle.id='welcome-title';
const welcomeText=element('p');
const welcomeNext=element('button','','arrival-next');
welcome.append(speaker,welcomeTitle,welcomeText,welcomeNext);
arrival.append(arrivalCaption,skipArrival,welcome);document.querySelector('.scene').append(arrival);
document.body.classList.add('arriving');
function showWelcome(){
 arrivalPhase='welcome';welcome.hidden=false;arrivalCaption.hidden=true;
 welcomeText.textContent=english?'Welcome to my little island. I’m Anita — from filmmaking to AI, every house here holds a part of my story.':'欢迎来到我的小岛。我是 Anita，从电影到 AI，这里的每一座房子，都藏着我的一段故事。';
 welcomeNext.textContent=english?'Show me around →':'我想逛逛 →';welcomeNext.focus();
}
function beginExploration(){
 arrivalActive=false;arrivalPhase='done';arrival.remove();document.body.classList.remove('arriving');
 cameraFocus.set(0,.65,0);yaw=.35;pitch=.74;distance=23;
 girl.visible=true;if(!followMode)followButton.click();followTarget=new THREE.Vector3(0,.05,1.5);journeyEnter.focus();
}
welcomeNext.onclick=()=>{
 if(dialogueStep++){beginExploration();return;}
 welcomeTitle.textContent=english?'Ready to explore?':'准备好探索 Anita 的小岛了吗？';
 welcomeText.textContent=english?'Visit a house to discover my projects, journey, photos or social links. Drag to look around, or use “Guide Anita” to walk with me. Take your time.':'走进小屋，看看我的作品、经历、照片和社交空间。拖动画面可以环顾小岛，也可以点“牵着 Anita 走”和我一起散步。慢慢来，今天的时间属于你。';
 welcomeNext.textContent=english?'Let’s explore the island ↗':'开始探索小岛 ↗';
};
skipArrival.onclick=()=>{plane.position.set(0,.12,5.65);beginExploration();};
function animateArrival(elapsed){
 if(!arrivalActive)return;
 const dt=arrivalLast===null?0:Math.min(.05,elapsed-arrivalLast);arrivalLast=elapsed;
 arrivalTime+=dt;
 if(arrivalPhase==='flight'){
  const t=reducedMotion?1:Math.min(1,arrivalTime/8),ease=t*t*(3-2*t);
  plane.position.set(-11*(1-ease),.12+5.2*Math.pow(1-t,2),5.65);
  plane.rotation.z=(1-t)*-.1;propeller.rotation.z+=dt*32;
  cameraFocus.set(plane.position.x*.45,.7,2.4);yaw=.16;pitch=.52;distance=20;
  arrivalCaption.textContent=t<.65?(english?'NEXT STOP · ANITA’S ISLAND':'下一站 · ANITA 的小岛'):(english?'WELCOME HOME · TOUCHING DOWN':'欢迎抵达 · 正在降落');
  if(t===1){girl.position.set(0,.05,2.85);girl.rotation.y=0;showWelcome();}
 }else{
  cameraFocus.set(0,.6,2.3);distance=17;pitch=.6;
  plane.position.y=.12+(reducedMotion?0:Math.sin(elapsed*1.6)*.025);
 }
}
const clock=new THREE.Clock();
function animate(){
  requestAnimationFrame(animate);
  if(document.hidden)return;
  const elapsed=clock.getElapsedTime();
  const time=reducedMotion?0:elapsed;
  const position=waterGeometry.attributes.position;
  if(currentRoom===null && !reducedMotion){
  for(let i=0;i<position.count;i++){
    const x=position.getX(i),z=position.getZ(i);
    position.setY(i,Math.sin(x*.7+time*.8)*.065+Math.cos(z*.6+time*.65)*.045);
  }
  position.needsUpdate=true;waterGeometry.computeVertexNormals();
  }
  plane.visible=currentRoom===null;
  if(!arrivalActive)animateAvatar(followMode?elapsed:time);
  animateArrival(elapsed);
  if(partyMode)partyLights.children.forEach((light,i)=>{light.intensity=8+Math.sin(time*4+i)*4;});
  nature.update(time,partyMode);
  cameraUpdate();renderer.render(scene,camera);
  const {width,height}=canvas.getBoundingClientRect();
  const activePins=currentRoom===null?pins:roomPins;
  const activePoints=currentRoom===null?pinWorld:roomPoints;
  const labels=activePoints.map((point,i)=>{
    const p=new THREE.Vector3(...point).project(camera);
    return {i,x:(p.x*.5+.5)*width,y:(-.5*p.y+.5)*height,half:activePins[i].offsetWidth/2+5,h:activePins[i].offsetHeight};
  }).sort((a,b)=>b.y-a.y);
  labels.forEach((p,index)=>{
    p.x=THREE.MathUtils.clamp(p.x,p.half,width-p.half);
    for(let j=index-1;j>=0;j--){
      const other=labels[j];
      if(Math.abs(p.x-other.x)<p.half+other.half && Math.abs(p.y-other.y)<p.h+8)p.y=other.y-other.h-9;
    }
    activePins[p.i].style.left=p.x+'px';activePins[p.i].style.top=Math.max(p.h+6,Math.min(height-25,p.y))+'px';
  });
}
animate();
