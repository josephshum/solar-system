import { init as initScene, scene, camera, renderer, labelRenderer } from './scene.js';
import { initControls, controls } from './controls.js';
import { createPlanets, animatePlanets, planets } from './planets.js';
import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';

// Initialize the scene
initScene();

// Initialize controls
initControls(camera, renderer);

// Create planets
createPlanets(scene);

// Raycasting for planet selection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const infoPanel = document.getElementById('info-panel');
const planetName = document.getElementById('planet-name');
const planetRadius = document.getElementById('planet-radius');
const planetDistance = document.getElementById('planet-distance');
const planetSpeed = document.getElementById('planet-speed');
const closePanel = document.getElementById('close-panel');

function focusOnPlanet(planet) {
    const targetPosition = new THREE.Vector3();
    planet.mesh.getWorldPosition(targetPosition);

    const cameraOffset = new THREE.Vector3(0, planet.radius + 10, planet.radius * 2.5);
    const endPosition = targetPosition.clone().add(cameraOffset);

    new TWEEN.Tween(camera.position)
        .to(endPosition, 1500)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start();

    new TWEEN.Tween(controls.target)
        .to(targetPosition, 1500)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start();
}

window.addEventListener('click', (event) => {
    // a small optimization
    if (infoPanel.classList.contains('hidden') === false) {
        return;
    }
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planets.map(p => p.mesh));

    if (intersects.length > 0) {
        const selectedPlanet = intersects[0].object.userData;
        planetName.textContent = selectedPlanet.name;
        planetRadius.textContent = (selectedPlanet.radius * 6371).toLocaleString(); // Example scale
        planetDistance.textContent = (selectedPlanet.distance * 1.5).toLocaleString(); // Example scale
        planetSpeed.textContent = (selectedPlanet.speed * 100000).toLocaleString(); // Example scale
        infoPanel.classList.remove('hidden');
        focusOnPlanet(selectedPlanet);
    }
});

closePanel.addEventListener('click', () => {
    infoPanel.classList.add('hidden');
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  TWEEN.update();

  // Animate planets
  animatePlanets();

  // Update controls
  controls.update();

  // Render the scene and labels
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}); 