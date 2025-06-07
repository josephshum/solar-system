// This file will handle planet creation and management. 

import * as THREE from 'three';
import { planetData } from './planetData.js';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

let sun;
const planets = [];
const textureLoader = new THREE.TextureLoader();
let asteroidBelt;

function createAsteroidBelt(scene) {
    asteroidBelt = new THREE.Group();
    const asteroidCount = 2000;
    const mars = planetData.find(p => p.name === 'Mars');
    const jupiter = planetData.find(p => p.name === 'Jupiter');
    const beltMin = mars.distance + 10;
    const beltMax = jupiter.distance - 10;

    for (let i = 0; i < asteroidCount; i++) {
        const size = Math.random() * 0.5 + 0.1;
        const asteroidGeometry = new THREE.DodecahedronGeometry(size, 0);
        const asteroidMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, flatShading: true });
        const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);

        const angle = Math.random() * Math.PI * 2;
        const distance = beltMin + Math.random() * (beltMax - beltMin);
        const y = (Math.random() - 0.5) * 5;

        asteroid.position.set(Math.cos(angle) * distance, y, Math.sin(angle) * distance);
        asteroid.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        asteroidBelt.add(asteroid);
    }
    scene.add(asteroidBelt);
}

function createPlanets(scene) {
    // Correct base path for textures
    const basePath = import.meta.env.BASE_URL;

    // Sun
    const sunTexture = textureLoader.load(`${basePath}textures/2k_sun.jpg`);
    const sunGeometry = new THREE.SphereGeometry(15, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Add Label to Sun
    const sunLabelDiv = document.createElement('div');
    sunLabelDiv.className = 'label';
    sunLabelDiv.textContent = 'Sun';
    const sunLabel = new CSS2DObject(sunLabelDiv);
    sunLabel.position.set(0, 17, 0); // Position above the sun
    sun.add(sunLabel);

    // Asteroid Belt
    createAsteroidBelt(scene);

    // Planets
    planetData.forEach(data => {
        const planetTexture = textureLoader.load(`${basePath}${data.texture}`);
        const planetGeometry = new THREE.SphereGeometry(data.radius, 32, 32);
        const planetMaterial = new THREE.MeshStandardMaterial({ map: planetTexture });
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        planet.position.x = data.distance;

        // Draw the orbit
        const orbitGeometry = new THREE.RingGeometry(data.distance - 0.2, data.distance + 0.2, 128);
        const orbitMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.25
        });
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        scene.add(orbit);

        // Add rings to Saturn
        if (data.name === 'Saturn') {
            const ringTexture = textureLoader.load(`${basePath}${data.ringTexture}`);
            const ringGeometry = new THREE.RingGeometry(data.radius + 2, data.radius + 6, 32);
            const ringMaterial = new THREE.MeshStandardMaterial({ map: ringTexture, side: THREE.DoubleSide, transparent: true });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            planet.add(ring);
        }

        // Add Label
        const labelDiv = document.createElement('div');
        labelDiv.className = 'label';
        labelDiv.textContent = data.name;
        const label = new CSS2DObject(labelDiv);
        label.position.set(0, data.radius + 2, 0);
        planet.add(label);

        const planetObject = { mesh: planet, ...data };
        planets.push(planetObject);
        planet.userData = planetObject; // Link the mesh back to its data object
        scene.add(planet);
    });
}

function animatePlanets() {
    if (sun) {
        sun.rotation.y += 0.001;
    }

    if (asteroidBelt) {
        asteroidBelt.rotation.y += 0.0001;
    }
    
    const timeFactor = Date.now() * 0.02; // Increased speed by another 10x

    planets.forEach(planet => {
        planet.mesh.rotation.y += planet.rotationSpeed;
        planet.mesh.position.x = planet.distance * Math.cos(timeFactor * planet.speed);
        planet.mesh.position.z = planet.distance * Math.sin(timeFactor * planet.speed);
    });
}

export { createPlanets, animatePlanets, planets }; 