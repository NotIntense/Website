import * as THREE from '../modules/three.module.js';
import { OrbitControls } from '../modules/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

const loader = new THREE.TextureLoader();
const texture = loader.load('/spaceTextures/Earth/earthmap1k.jpg');

const geometry = new THREE.IcosahedronGeometry(1, 2);
const material = new THREE.MeshStandardMaterial({ 
  //map: texture 
});

const earthMesh = new THREE.Mesh(geometry, material);
scene.add(earthMesh);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 15);
scene.add(hemiLight);

function animate() {

  requestAnimationFrame(animate);
  earthMesh.rotation.x += 0.001;
  earthMesh.rotation.y += 0.002;
  renderer.render(scene, camera);
}
