import * as THREE from "./External/three.module.js";

export function createStarfield(scene, renderer, camera) {
    const numStars = 15000;
    const radius = 2000;

    const positions = new Float32Array(numStars * 3);
    const sizes = new Float32Array(numStars);
    const colors = new Float32Array(numStars * 3);

    const colorOptions = [
        new THREE.Color(1.0, 1.0, 1.0), // white
        new THREE.Color(1.0, 0.9, 0.8), // warm
        new THREE.Color(0.8, 0.9, 1.0), // cool
    ];

    for (let i = 0; i < numStars; i++) {
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = radius * Math.pow(Math.random(), 0.5); 
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        sizes[i] = Math.random() * 0.3 + 0.1; 
        const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const starTexture = generateStarTexture();

    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            map: { value: starTexture }
        },
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: `
            attribute float size;
            varying vec3 vColor;
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * 1.5;
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform float time;
            varying vec3 vColor;
            void main() {
                float dist = distance(gl_PointCoord, vec2(0.5));
                float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
                
                float flicker = 0.9 + 0.1 * sin(time + gl_FragCoord.x * 0.1 + gl_FragCoord.y * 0.1);
                alpha *= flicker;  // Applying flicker to alpha
                
                gl_FragColor = vec4(vColor, alpha); // Smooth fade effect
            }
        `
    });

    const stars = new THREE.Points(geometry, material);
    scene.add(stars);

    function animate() {
        material.uniforms.time.value += 0.02;
        stars.rotation.y += 0.0005;
        stars.rotation.x += 0.0003;
        renderer.render(scene, camera);
    }

    function generateStarTexture() {
        const size = 64;
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext("2d");

        const gradient = ctx.createRadialGradient(
            size / 2, size / 2, 0,
            size / 2, size / 2, size / 2
        );
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.4)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        return texture;
    }

    return animate;
}
