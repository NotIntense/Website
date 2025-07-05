import * as THREE from './modules/three.module.js';

if (window.location.hostname === 'brebby.notintense.com') {
    fetch('/brebby/index.html')
      .then(response => response.text())
      .then(html => {
        document.open();
        document.write(html);
        document.close();
      })
      .catch(err => console.error('Failed to load brebby content:', err));
}
else{
  document.getElementById('content-container').classList.add('visible');
  document.getElementById('bg').style.opacity = 1;
  
  let cardList = document.getElementById('pfctnr').getElementsByClassName('card');

  for (let i = 0; i < cardList.length; i++) { 
      cardList[i].style.opacity = 1;
  }
}

document.getElementById('content-container').style.opacity='1';

const maxDis = 50;
const gridSize = 3;
const step = 0.3;

const scene = new THREE.Scene();
const noise = new Noise(Math.random());

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.lookAt(0, -10, 0);
camera.position.set(0, 25, 0);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const pointLight = new THREE.PointLight(0xffffff, 1000);
pointLight.position.set(10, 10, 10);

scene.add(pointLight);

//const controls = new OrbitControls(camera, renderer.domElement);

function getPerlinVec(x, y, z, frame = 0)
{
    let max = maxDis / gridSize;
    return [x, y ,z].map((c) => (noise.perlin2(c / max, frame) * step));
}

function getGridPosition(x, y, z) {
    return [x, y ,z].map((c) => (c / gridSize));
}

const sphereGeometry = new THREE.SphereGeometry(0.04, 24, 24);
const material = new THREE.MeshStandardMaterial({ color: 0xffffff });

const gridWidth = maxDis * 2;
const totalInstances = gridWidth * gridWidth;

const instancedMesh = new THREE.InstancedMesh(sphereGeometry, material, totalInstances);
scene.add(instancedMesh);


let particles = [];
let index = 0;
const dummy = new THREE.Object3D();

for (let x = -maxDis; x < maxDis; x++) {
    let pGroup = [];
    for (let z = -maxDis; z < maxDis; z++) {
        const pos = new THREE.Vector3(x, 0, z);
        dummy.position.copy(pos);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(index, dummy.matrix);

        pGroup.push({ index, position: pos.clone() });
        index++;
    }
    particles.push(pGroup);
}
instancedMesh.instanceMatrix.needsUpdate = true;


let frame = 0;
let originalCameraPos = camera.position.clone();
let targetOffset = new THREE.Vector3();

let mouse = { x: 0, y: 0 };

window.addEventListener('mousemove', (ev) => {
    mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
    requestAnimationFrame(animate);

    //controls.update();

    particles.forEach(pGroup => {
    pGroup.forEach(p => {
        const { index, position } = p;
        dummy.position.set(position.x, Math.sin(Math.sqrt((position.x + maxDis) ** 2 + (position.z + maxDis) ** 2) / 3 + frame) * 2, position.z);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(index, dummy.matrix);
      });
    });
    instancedMesh.instanceMatrix.needsUpdate = true;


    const maxSway = 0.5;
    const targetOffset = new THREE.Vector3(mouse.x * maxSway, mouse.y * maxSway, 0);
    const targetPos = originalCameraPos.clone().add(targetOffset);
    camera.position.lerp(targetPos, 0.1);

    frame += 0.01;
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});

const statusEl = document.getElementById('site-status');
fetch('/api/status.txt').then(res => res.text()).then(text => {

    const statusText = text;
    if (statusText && statusText.trim() !== "") {
    statusEl.textContent = statusText;
    statusEl.style.display = "block";
    requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--site-status-height', `${statusEl.offsetHeight}px`);
    });
    } 
    else {
      statusEl.style.display = "none";
      document.documentElement.style.setProperty('--site-status-height', `0px`);
    }
    
  });

const toggleBtn = document.getElementById("toggle-ui");
const uiContainer = document.querySelector(".profileContainer");
const icon = toggleBtn.querySelector("i");

let uiVisible = true;
toggleBtn.addEventListener("click", () => {
  uiVisible = !uiVisible;
  uiContainer.style.display = uiVisible ? "flex" : "none";
  if (uiVisible) {
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  } else {
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  }
});