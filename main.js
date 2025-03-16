import * as THREE from "https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js";
import { createStarfield } from '/Code/Stars.js';

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
    
    
    function playMusic(bool) {
        if (bool) {
            if (!sound.isPlaying) {
                sound.play();
            }
        } else {
            sound.stop();
        }
    }

    const button = document.getElementById('volumeMuteButton');
    const buttonIcon = document.getElementById('volumeIcon');

    if (button && buttonIcon) {
        button.addEventListener('click', () => {
            const isMuted = buttonIcon.classList.contains('fa-volume-xmark');
            if (isMuted) {
                playMusic(false);
            } else {
                playMusic(true);
            }
        });
    }

    const projectButton = document.getElementById('projectButton');
    projectButton.addEventListener("click", () => {
    if (gsap.isTweening(camera.position) || gsap.isTweening("#app")) return; // Prevent overlap

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

    let valravnVideo = document.getElementById('valravnVideo');
    let labratVideo = document.getElementById('labratVideo');

    const goBackButton = document.getElementById('goBackButton');

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

    const autobiographyButton = document.getElementById('autobiographyButton');

    autobiographyButton.addEventListener("click", () => {
    if (gsap.isTweening(camera.position) || gsap.isTweening("#app")) return;

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

    const goAutoBackButton = document.getElementById('goAutoBackButton');
    
    goAutoBackButton.addEventListener("click", () => {
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
});
});