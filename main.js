import * as THREE from 'three';
import { createStarfield } from '/Code/Stars.js';

document.addEventListener('DOMContentLoaded', () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

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
        sound.play();
    });

    function playMusic(bool) {
        audioLoader.load('/Music/NOTINTENSE_FINAL.ogg', function(buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.setVolume(0.5);

            if (bool) {
                sound.play();
            } else {
                sound.stop();
            }
        });
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
    } else {
        console.error('Button or Icon not found');
    }
});
