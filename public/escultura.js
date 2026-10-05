import * as THREE from './vendor/three.module.min.js';

// A single low-poly sculpture; no downloaded 3D scenes or postprocessing.
export function createSculpture(canvas) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true, powerPreference:'low-power'});
  } catch {
    canvas.hidden = true;
    return {update(){}, resize(){}, dispose(){}};
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, .1, 60);
  camera.position.z = 11;
  const group = new THREE.Group();
  scene.add(group);

  // Small procedural studio environment provides chrome reflections.
  const width = 128, height = 64;
  const pixels = new Uint8Array(width * height * 4);
  for(let y=0;y<height;y++) for(let x=0;x<width;x++) {
    const i=(y*width+x)*4;
    const strip = x > 25 && x < 37 || x > 88 && x < 96;
    const violet = x > 46 && x < 72;
    const light = strip ? 240 : violet ? 130 : 22;
    pixels[i]=violet ? 130 : light;
    pixels[i+1]=violet ? 32 : light;
    pixels[i+2]=violet ? 255 : Math.min(255,light+20);
    pixels[i+3]=255;
  }
  const environment = new THREE.DataTexture(pixels,width,height);
  environment.mapping = THREE.EquirectangularReflectionMapping;
  environment.colorSpace = THREE.SRGBColorSpace;
  environment.needsUpdate = true;
  scene.environment = environment;
  scene.add(new THREE.HemisphereLight(0xd9b9ff,0x14071d,2));
  const cyan = new THREE.DirectionalLight(0x51eaff,4);
  cyan.position.set(-3,2,4); scene.add(cyan);
  const white = new THREE.DirectionalLight(0xffffff,3);
  white.position.set(4,3,1); scene.add(white);

  class ThoughtCurve extends THREE.Curve {
    getPoint(t,target=new THREE.Vector3()) {
      const a=t*Math.PI*2;
      return target.set(Math.sin(a)*2.3, Math.sin(a*2)*.8, Math.cos(a)*.58);
    }
  }
  const geometry = new THREE.TubeGeometry(new ThoughtCurve(),144,.13,8,true);
  const material = new THREE.MeshPhysicalMaterial({color:0xc7a4ff,metalness:.92,roughness:.18,clearcoat:1,envMapIntensity:1.7});
  group.add(new THREE.Mesh(geometry,material));
  const accentGeometry = new THREE.TorusGeometry(.15,.035,6,18);
  const accentMaterial = new THREE.MeshBasicMaterial({color:0x5afff0});
  const accents = [];
  for(let i=0;i<3;i++) {
    const ring=new THREE.Mesh(accentGeometry,accentMaterial);
    ring.position.set((i-1)*1.4,(i%2 ? -.85 : .85),.6);
    accents.push(ring);group.add(ring);
  }
  let lost=false;
  canvas.addEventListener('webglcontextlost', event=>{event.preventDefault();lost=true;canvas.hidden=true;});
  function resize(){
    const w=canvas.clientWidth || innerWidth, h=canvas.clientHeight || innerHeight;
    renderer.setSize(w,h,false); camera.aspect=w/h;camera.updateProjectionMatrix();
  }
  function update(state,time,pointer={x:0,y:0}) {
    if(lost)return;
    const visible=state.sculptureAlpha > .01;
    canvas.style.opacity=String(state.sculptureAlpha);
    if(!visible)return;
    const distance=camera.position.z;
    const screenHeight=2*distance*Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
    const screenWidth=screenHeight*camera.aspect;
    group.position.set((state.sculptureX/100-.5)*screenWidth,(.5-state.sculptureY/100)*screenHeight,0);
    group.rotation.set(.15+pointer.y*.1, state.turn+pointer.x*.12, state.roll);
    group.scale.setScalar(state.sculptureScale);
    accents.forEach((ring,i)=>{ring.rotation.z=time*.15+i*.3;});
    renderer.render(scene,camera);
  }
  resize();
  return {update,resize,dispose(){geometry.dispose();material.dispose();accentGeometry.dispose();accentMaterial.dispose();environment.dispose();renderer.dispose();}};
}
