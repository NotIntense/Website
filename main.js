import * as THREE from "https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js";
import { createStarfield } from '/Code/Stars.js';

//bwabwbawbawbabwabwabwabwabawb :3

document.addEventListener('DOMContentLoaded', () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const animate = createStarfield(scene, renderer, camera);
    renderer.setAnimationLoop(animate);

    const listener = new THREE.AudioListener();
    camera.add(listener);
    
    const sound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();
    
    audioLoader.load('/Music/NOTINTENSE_FINAL.ogg', function(buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.5);
    }); 

    const button = document.getElementById('volumeMuteButton');
    const buttonIcon = document.getElementById('volumeIcon');

    button.addEventListener('click', async () => {
    const audioContext = THREE.AudioContext.getContext();

    if (audioContext.state === 'suspended') {
        await audioContext.resume(); 
    }

    if (sound.isPlaying) {
        sound.stop();
        buttonIcon.classList.remove("fa-volume-high");
        buttonIcon.classList.add("fa-volume-xmark");
    } else {
        sound.play().then(() => {
            buttonIcon.classList.remove("fa-volume-xmark");
            buttonIcon.classList.add("fa-volume-high");
        }).catch((error) => {
            console.error("Audio failed to play:", error);
        });
    }});

    const projectButton = document.getElementById('projectButton');
    const autobiographyButton = document.getElementById('autobiographyButton');
    const goBackButton = document.getElementById('goBackButton');
    const goAutoBackButton = document.getElementById('goAutoBackButton');

    let valravnVideo = document.getElementById('valravnVideo');
    let labratVideo = document.getElementById('labratVideo');

    projectButton.addEventListener("click", () => {
        if (gsap.isTweening(camera.position) || gsap.isTweening("#app")) return;

        gsap.to(camera.position, {
            y: camera.position.y - 40,
            duration: 4,
            ease: "power2.out"
        });

        gsap.to("#app", {
            y: "-=2000",
            duration: 4,
            ease: "power2.out"
        });
    });

    autobiographyButton.addEventListener("click", () => {
        if (gsap.isTweening(camera.position) || gsap.isTweening("#app")) return;

        gsap.to(camera.position, {
            y: camera.position.y - 40,
            duration: 4,
            ease: "power2.out"
        });

        gsap.to("#app", {
            y: "+=2000",
            duration: 4,
            ease: "power2.out"
        });
    });

    goBackButton.addEventListener("click", () => {
        if (gsap.isTweening(camera.position) || gsap.isTweening("#app")) return;

        labratVideo.pause();
        valravnVideo.pause();

        gsap.to(camera.position, {
            y: camera.position.y + 40,
            duration: 4,
            ease: "power2.out"
        });

        gsap.to("#app", {
            y: "+=2000",
            duration: 4,
            ease: "power2.out"
        });
    });

    goAutoBackButton.addEventListener("click", () => {
        if (gsap.isTweening(camera.position) || gsap.isTweening("#app")) return;

        gsap.to(camera.position, {
            y: camera.position.y + 40,
            duration: 4,
            ease: "power2.out"
        });

        gsap.to("#app", {
            y: "-=2000",
            duration: 4,
            ease: "power2.out"
        });
    });
});
