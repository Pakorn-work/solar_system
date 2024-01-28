import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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

const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  1,10000
);
camera.position.z = 700;



// Create a renderer

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let INTERSECTED;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.saveState();
controls.update();
let FitCam = false;

function updateRaycaster() {
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const intersectedObject = intersects[0].object;

    if (INTERSECTED !== intersectedObject) {
      // Remove highlight from the previously intersected object
      if (
        INTERSECTED &&
        INTERSECTED.material &&
        INTERSECTED.material.emissive
      ) {
        INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
      }

      // Highlight the current intersected object
      INTERSECTED = intersectedObject;
      if (
        INTERSECTED.material &&
        INTERSECTED.material.emissive &&
        FitCam === false
      ) {
        INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
        INTERSECTED.material.emissive.setHex(0xFF6E6E);

        window.addEventListener("click", function (e) {
          if (INTERSECTED && FitCam === false) {
            
            fitCameraToObject(INTERSECTED);
          }
        });
      }
    }
  } else {
    // Remove highlight when no intersection
    if (INTERSECTED && INTERSECTED.material && INTERSECTED.material.emissive) {
      INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
      INTERSECTED = null;
    }
  }
}

var onAnimate = true;

function fitCameraToObject(object) {
    onAnimate = false;
    FitCam = true;
    controls.enableZoom = false;
    controls.enablePan = false;
    INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
    document.body.classList.add('disable-input');
    document.getElementById("HomeButton").style.display = "block";
    document.getElementById("myButton").style.display = "none";


    const boundingBox = new THREE.Box3().setFromObject(object);

    const objectSize = boundingBox.getSize(new THREE.Vector3());
    

    // Ensure the camera looks at the calculated center
    var target = new THREE.Vector3(); // create once an reuse it
    object.getWorldPosition(target);

    // Camera zoom animation
    const startPosition = camera.position.clone();
    const CamTraget = target.clone(); 
    CamTraget.multiplyScalar(0.8);
    const duration = 1000;

    let startTime;

      function animateCamera(time) {
        if (!startTime) startTime = time;

        const progress = Math.min((time - startTime) / duration, 1);
        camera.position.lerpVectors(startPosition, CamTraget, progress);
        controls.target.set(target.x, target.y, target.z);
        if (progress < 1) {
          requestAnimationFrame(animateCamera);
        } else {
          controls.target.set(target.x, target.y, target.z);
          document.body.classList.remove('disable-input');
        }

        controls.update();
    }

    console.log(
      "After fitCameraToObject - Camera Position:",camera.position.clone(),
      "LookAt:",target
    );

    requestAnimationFrame(animateCamera);
    Mainmenu();
  
}


function Mainmenu() {
    document.getElementById("HomeButton").onclick = function () {
        document.body.classList.add('disable-input');
        document.getElementById("HomeButton").style.display = "none";

        const targetPosition = new THREE.Vector3(0, 0, 700);
        const startPosition = camera.position.clone();
        const duration = 1000; // Animation duration in milliseconds

        let startTime;

        function animateCamera(time) {
          if (!startTime) startTime = time;

          const progress = Math.min((time - startTime) / duration, 1);
          camera.position.lerpVectors(startPosition, targetPosition, progress);

          if (progress < 1) {
            requestAnimationFrame(animateCamera);
          } else {
            camera.lookAt(0, 0, 0);
            document.getElementById("myButton").style.display = "block";
            document.getElementById("HomeButton").style.display = "none";
            document.body.classList.remove('disable-input');
            FitCam = false;
            controls.enableZoom = true;
            controls.enablePan = true;
          }

          // Ensure that controls are updated during the animation
          controls.update();
        }

        requestAnimationFrame(animateCamera);
  };
}



function onPointerMove(event) {
  // Update the mouse pointer position
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Call the raycaster update function
  updateRaycaster();
}

document.addEventListener("mousemove", onPointerMove);



// Function to handle window resize
function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', handleResize);



// Add a background
scene.background = backgroundTexture;

// Create a button element

var button = document.createElement("myButton");

// onclick event
document.getElementById("myButton").onclick = function () {
  onAnimate = !onAnimate;
  animate();
};

// Append the button to the container element
document.getElementById("buttonContainer").appendChild(button);

// add light
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// Create a sun
const sunGeometry = new THREE.SphereGeometry(30, 64, 64);
const sunMaterial = new THREE.MeshStandardMaterial({ map: sunTexture, emissive:0xffffff ,emissiveMap:sunTexture, emissiveIntensity: 1  });

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
const saturnringMaterial = new THREE.MeshStandardMaterial({
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
const uranusringMaterial = new THREE.MeshStandardMaterial({
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

// Animation zone
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
