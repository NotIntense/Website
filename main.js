import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';




const statusEl = document.getElementById('site-status');

fetch('/api/status.txt')
  .then(res => res.text())
  .then(text => {
    const statusText = text.trim();

    if (statusText) {
      statusEl.textContent = statusText;
      statusEl.style.display = "block";

      requestAnimationFrame(() => {
        document.documentElement.style.setProperty(
          '--site-status-height',
          `${statusEl.offsetHeight}px`
        );
      });

    } else {
      statusEl.style.display = "none";
      document.documentElement.style.setProperty('--site-status-height', '0px');
    }
  });

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("content-container").appendChild(renderer.domElement);

scene.add(new THREE.DirectionalLight(0xffffff, 2));
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

let fbxModel = null;

const texLoader = new THREE.TextureLoader();

const base = texLoader.load('OneShot/Models/the-sun-from-oneshot/textures/Lightbulb_BaseColor.png');
const emission = texLoader.load('OneShot/Models/the-sun-from-oneshot/textures/Lightbulb_Emission.png');


const loader = new FBXLoader();
loader.load(
  'OneShot/Models/the-sun-from-oneshot/source/OneShotbulb.fbx',
  object => {
    
    object.scale.set(2, 2, 2);

    object.traverse((child) => {
        if (child.isMesh) {

            child.material = new THREE.MeshStandardMaterial({
                map: base,
                emissiveMap: emission,
                emissive: new THREE.Color(0xFFEA00),
                emissiveIntensity: 2
            });

            child.material.needsUpdate = true;
        }
    });

    fbxModel = object;
    scene.add(object);
  },
);

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true; 
controls.dampingFactor = 0.05;
controls.enableZoom = true; 
controls.enablePan = true; 
controls.target.set(0, 0, 0); 


function animate() {
  requestAnimationFrame(animate);

  if (fbxModel) {
    fbxModel.rotation.y += 0.003;
    fbxModel.rotation.x -= 0.003;
    fbxModel.rotation.z += 0.003;

    controls.update();
  }

  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
