import * as THREE from 'three';

export function createStarfield(scene, renderer, camera) {
    const numStars = 10500;
    const starGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(numStars * 3);

    const radius = 1000; 

    for (let i = 0; i < numStars; i++) {

    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius  * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff, // White stars
        size: 0.01, // Size of stars
        transparent: true,
        opacity: 0.7,
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    /*const scrollAmount = 0;
    const smoothFactor = 0.2;

    window.addEventListener('wheel', (event) => {
        scrollAmount += event.deltaY * 0.2;
        event.preventDefault();
    });*/

    function animate() {
        //camera.position.y += (scrollAmount - camera.position.y) * smoothFactor;

        stars.rotation.x += 0.0005;
        stars.rotation.y += 0.0005;

        renderer.render(scene, camera);
    }

    return animate;
}
