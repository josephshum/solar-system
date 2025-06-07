// This file will handle user interaction handling. 

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let controls;

function initControls(camera, renderer) {
    controls = new OrbitControls(camera, renderer.domElement);
    return controls;
}

export { initControls, controls }; 