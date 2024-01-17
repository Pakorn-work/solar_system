import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
/*
import { GLTFLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/RGBELoader.js';
import { EffectComposer } from 'https://unpkg.com/three@0.126.1/examples/js/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.126.1/examples/js/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://unpkg.com/three@0.126.1/examples/js/postprocessing/ShaderPass.js';
import { OutlinePass } from 'https://unpkg.com/three@0.126.1/examples/js/postprocessing/OutlinePass.js';
import { OutputPass } from 'https://unpkg.com/three@0.126.1/examples/js/postprocessing/OutputPass.js';
import { FXAAShader } from 'https://unpkg.com/three@0.126.1/examples/js/shaders/FXAAShader.js';
*/

// nigger
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
camera.position.z = 700;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

//loading part
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = function (url, item, total) {
  console.log(`Started loading: ${url}`);
};

const progressBar = document.getElementById("progress-bar");
const progressBarLabel = document.getElementById("progress-bar-label");

progressBar.addEventListener("change", (e) => console.log("change", e));

loadingManager.onProgress = function (url, loaded, total) {
  progressBar.value = (loaded / total) * 100;
  progressBarLabel.textContent = "Loading... " + url;
};

const progressBarContainer = document.querySelector(".progress-bar-container");

loadingManager.onLoad = function () {
  progressBarContainer.style.display = "none";
  document.getElementById("myButton").style.display = "block";
};

// const gltfLoader = new GLTFLoader(loadingManager);
// const rgbeLoader = new RGBELoader(loadingManager);
const textureLoader = new THREE.TextureLoader(loadingManager);

// load textures
const sunTexture = textureLoader.load("./sun_texture.jpg");
const mercuryTexture = textureLoader.load("./8k_mercury.jpg");
const venusTexture = textureLoader.load("./8k_venus_surface.jpg");
const earthTexture = textureLoader.load("./8k_earth_daymap.jpg");
const earthmoonTexture = textureLoader.load("./moon_txt1k.jpg");
const marsTexture = textureLoader.load("./8k_mars.jpg");
const jupiterTexture = textureLoader.load("./8k_jupiter.jpg");
const saturnTexture = textureLoader.load("./8k_saturn.jpg");
const saturnringTexture = textureLoader.load("./8k_saturn_ring_alpha.png");
const uranusTexture = textureLoader.load("./2k_uranus.jpg");
const uranusringTexture = textureLoader.load(
  "./uo9itldpunvan06ikts54j783e.png"
);
const neptuneTextuer = textureLoader.load("./2k_neptune.jpg");
const backgroundTexture = textureLoader.load(
  "./pexels-philippe-donn-1169754.jpg"
);

// Add a background
scene.background = backgroundTexture;

var onAnimate = true;

// Create a button element
var button = document.createElement("myButton");

// onclick event
document.getElementById("myButton").onclick = function () {
  onAnimate = !onAnimate;
  animate();
};

// Append the button to the container element
document.getElementById("buttonContainer").appendChild(button);

/*
//mouse hover
composer = new EffectComposer( renderer );

const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );

outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
composer.addPass( outlinePass );

textureLoader.load( 'textures/tri_pattern.jpg', function ( texture ) {

  outlinePass.patternTexture = texture;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

} );

const outputPass = new OutputPass();
composer.addPass( outputPass );

effectFXAA = new ShaderPass( FXAAShader );
effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
composer.addPass( effectFXAA );

window.addEventListener( 'resize', onWindowResize );

renderer.domElement.style.touchAction = 'none';
renderer.domElement.addEventListener( 'pointermove', onPointerMove );

function onPointerMove( event ) {

  if ( event.isPrimary === false ) return;

  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  checkIntersection();

}

function addSelectedObject( object ) {

  selectedObjects = [];
  selectedObjects.push( object );

}

function checkIntersection() {

  raycaster.setFromCamera( mouse, camera );

  const intersects = raycaster.intersectObject( scene, true );

  if ( intersects.length > 0 ) {

    const selectedObject = intersects[ 0 ].object;
    addSelectedObject( selectedObject );
    outlinePass.selectedObjects = selectedObjects;

  } else {

    // outlinePass.selectedObjects = [];

  }
}
*/

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// Create a sun
const sunGeometry = new THREE.SphereGeometry(30, 64, 64);
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

var pointLight = new THREE.PointLight(0xffffff, 1, 1000);
scene.add(pointLight);

// create mecury
const mercuryGeometry = new THREE.SphereGeometry(2.5, 32, 32);
const mercuryMaterial = new THREE.MeshStandardMaterial({
  map: mercuryTexture,
  emissiveMap: mercuryTexture,
});
const mecuryOrbit = new THREE.Object3D();
const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
mercury.position.set(50, 0, 0);
scene.add(mecuryOrbit);
mecuryOrbit.add(mercury);

const mercuryOrbitSpeed = 0.0414; // ค่านี้กุหาร 100 ทุกดาวเลยนะ มันจะได้หมุนช้าๆ
const mecuryspinspeed = 0.0149; // ตัวนี้ด้วย หาร100 จากค่าจริง

// create venus
const venusGeometry = new THREE.SphereGeometry(3.5, 32, 32);
const venusMaterial = new THREE.MeshStandardMaterial({
  map: venusTexture,
  emissiveMap: venusTexture,
});
const venusOrbit = new THREE.Object3D();
const venus = new THREE.Mesh(venusGeometry, venusMaterial);
venus.position.set(100, 0, 0);
venus.rotation.set(3.09, 0, 0); // radian
scene.add(venusOrbit);
venusOrbit.add(venus);

const venusOrbitSpeed = 0.0162;
const venusspinspeed = -0.00931;

// Create the Earth
const earthGeometry = new THREE.SphereGeometry(5, 32, 32);
const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture,
  emissiveMap: earthTexture,
});
const earthOrbit = new THREE.Object3D();
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.position.set(150, 0, 0);
earth.rotation.set(0.39, 0, 0);
scene.add(earthOrbit);
earthOrbit.add(earth);

const earthOrbitSpeed = 0.01;
const earthspinspeed = 0.0365;

//make earth moon
const earthmoonGeometry = new THREE.SphereGeometry(1, 16, 32);
const earthmoonMaterial = new THREE.MeshStandardMaterial({
  map: earthmoonTexture,
});
const earthmoonOrbit = new THREE.Object3D();
const earthmoon = new THREE.Mesh(earthmoonGeometry, earthmoonMaterial);
earthmoon.position.set(15, 0, 0);
earth.add(earthmoonOrbit);
earthmoonOrbit.add(earthmoon);

const earthmoonOrbitSpeed = 0.01336;

// create mars
const marsGeometry = new THREE.SphereGeometry(4, 32, 32);
const marsMaterial = new THREE.MeshStandardMaterial({
  map: marsTexture,
  emissiveMap: marsTexture,
});
const marsOrbit = new THREE.Object3D();
const mars = new THREE.Mesh(marsGeometry, marsMaterial);
mars.position.set(200, 0, 0);
scene.add(marsOrbit);
marsOrbit.add(mars);

const marsOrbitSpeed = 0.0053;
const marsspinspeed = 0.0673;

// create jupiter
const jupiterGeometry = new THREE.SphereGeometry(10, 32, 32);
const jupiterMaterial = new THREE.MeshStandardMaterial({
  map: jupiterTexture,
  emissiveMap: jupiterTexture,
});
const jupiterOrbit = new THREE.Object3D();
const jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
jupiter.position.set(300, 0, 0);
scene.add(jupiterOrbit);
jupiterOrbit.add(jupiter);

const jupiterOrbitSpeed = 0.0084;
const jupiterspinspeed = 0.01;

// create saturn
const saturnGeometry = new THREE.SphereGeometry(8, 32, 32);
const saturnMaterial = new THREE.MeshStandardMaterial({
  map: saturnTexture,
  emissiveMap: saturnTexture,
});
const saturnOrbit = new THREE.Object3D();
const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
saturn.position.set(400, 0, 0);
scene.add(saturnOrbit);
saturnOrbit.add(saturn);

const saturnOrbitSpeed = 0.00338;
const saturnspinspeed = 0.01;

//make saturn ring
const saturnringGeometry = new THREE.RingGeometry(10, 16, 64);
const saturnringMaterial = new THREE.MeshBasicMaterial({
  map: saturnringTexture,
  side: THREE.DoubleSide,
  transparent: true,
});
const saturnrings = new THREE.Mesh(saturnringGeometry, saturnringMaterial);
saturnrings.rotation.set(1, 0, 0);
saturn.add(saturnrings);

// create uranus
const uranusGeometry = new THREE.SphereGeometry(7, 32, 32);
const uranusMaterial = new THREE.MeshStandardMaterial({
  map: uranusTexture,
  emissiveMap: uranusTexture,
});
const uranusOrbit = new THREE.Object3D();
const uranus = new THREE.Mesh(uranusGeometry, uranusMaterial);
uranus.position.set(500, 0, 0);
scene.add(uranusOrbit);
uranusOrbit.add(uranus);

const uranusOrbitSpeed = 0.00119;
const uranusspinspeed = 0.01;

//make uranus ring
const uranusringGeometry = new THREE.RingGeometry(9, 16, 64);
const uranusringMaterial = new THREE.MeshBasicMaterial({
  map: uranusringTexture,
  side: THREE.DoubleSide,
  transparent: true,
});
const uranusrings = new THREE.Mesh(uranusringGeometry, uranusringMaterial);
uranusrings.rotation.set(0.2, 0, 0);
uranus.add(uranusrings);

// create neptune
const neptuneGeometry = new THREE.SphereGeometry(8, 32, 32);
const neptuneMaterial = new THREE.MeshStandardMaterial({
  map: neptuneTextuer,
  emissiveMap: neptuneTextuer,
});

const neptuneOrbit = new THREE.Object3D();
const neptune = new THREE.Mesh(neptuneGeometry, neptuneMaterial);
neptune.position.set(600, 0, 0);
scene.add(neptuneOrbit);
neptuneOrbit.add(neptune);

const neptuneOrbitSpeed = 0.0006;
const neptunespinspeed = 0.01;

function renderScene() {
  renderer.render(scene, camera);
  requestAnimationFrame(renderScene);
}

function animate() {
  // Rotate the sun
  sun.rotation.x += 0.0005;
  sun.rotation.y += 0.005;

  // Rotate each planet
  mercury.rotation.y += mecuryspinspeed;
  venus.rotation.y += venusspinspeed;
  earth.rotation.y += earthspinspeed;
  mars.rotation.y += marsspinspeed;
  jupiter.rotation.y += jupiterspinspeed;
  saturn.rotation.y += saturnspinspeed;
  uranus.rotation.y += uranusspinspeed;
  neptune.rotation.y += neptunespinspeed;

  // star orbit
  mecuryOrbit.rotation.y += mercuryOrbitSpeed;
  venusOrbit.rotation.y += venusOrbitSpeed;
  earthOrbit.rotation.y += earthOrbitSpeed;
  marsOrbit.rotation.y += marsOrbitSpeed;
  jupiterOrbit.rotation.y += jupiterOrbitSpeed;
  saturnOrbit.rotation.y += saturnOrbitSpeed;
  uranusOrbit.rotation.y += uranusOrbitSpeed;
  neptuneOrbit.rotation.y += neptuneOrbitSpeed;

  // moon orbit
  earthmoonOrbit.rotation.y += earthmoonOrbitSpeed;

  if (onAnimate) {
    requestAnimationFrame(animate);
  }
}

// Start animation loop
animate();
renderScene();
