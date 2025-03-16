export function createStarfield(scene, renderer, camera) {
    const numStars = 10000; 
    const starGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(numStars * 3);
    const timeOffsets = new Float32Array(numStars); 

    const radius = 1000;

    for (let i = 0; i < numStars; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        timeOffsets[i] = Math.random() * 10.0; 
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('timeOffset', new THREE.BufferAttribute(timeOffsets, 1));

    const starMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 }
        },
        vertexShader: `
            attribute float timeOffset;
            varying float vTimeOffset;
            void main() {
                vTimeOffset = timeOffset;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = 1.5;
            }
        `,
        fragmentShader: `
            uniform float time;
            varying float vTimeOffset;
            void main() {
                float flicker = smoothstep(0.3, 0.8, sin(time * 0.2 + vTimeOffset) * 0.5 + 0.5); 
                gl_FragColor = vec4(1.0, 1.0, 1.0, flicker);
            }
        `,
        transparent: true // ^^ 0.2 above is what controls the blink speed
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    function animate() {
        starMaterial.uniforms.time.value += 0.02;

        stars.rotation.x += 0.0005;
        stars.rotation.y += 0.0005;

        renderer.render(scene, camera);
    }

    return animate;
}
