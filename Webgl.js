import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

export class Webgl {
  constructor() {
    this.clock = new THREE.Clock();

    const canvas = document.querySelector('#WebGL-canvas');
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    this.renderer.useLegacyLights = true;
    this.renderer.shadowMap.enabled = true; 
    this.renderer.setSize(window.innerWidth, window.innerHeight); 

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x555555);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    this.camera.position.set(10, 500, 10); 
    this.camera.lookAt(this.scene.position); 

    this.trackballControls = new TrackballControls(this.camera, this.renderer.domElement);
    this.trackballControls.rotateSpeed = 5.0; 
    this.trackballControls.zoomSpeed = 1.0; 
    this.trackballControls.panSpeed = 1.0;
    this.trackballControls.staticMoving = true;

    document.body.appendChild(this.renderer.domElement);

  }

  render() {
    let delta = this.clock.getDelta();
    this.trackballControls.update(delta);

    this.renderer.render(this.scene, this.camera);
  }
}