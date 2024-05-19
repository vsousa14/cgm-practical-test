// Webgl.js
import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';

export class Webgl {
  constructor() {
    this.clock = new THREE.Clock();

    const canvas = document.querySelector('#WebGL-canvas');
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    this.renderer.useLegacyLights = true;
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x555555);

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 300, 5000);
    this.camera.position.set(0, 0, 2000);
    this.camera.lookAt(this.scene.position);

    this.trackballControls = null;
    this.orbitControls = null;
    this.firstPersonControls = null;
    this.flyControls = null;
  }

  setupControl(controlName) {
    switch (controlName) {
      case 'trackballControls':
        this.setupTrackballControls();
        break;
      case 'orbitControls':
        this.setupOrbitControls();
        break;
      case 'firstPersonControls':
        this.setupFirstPersonControls();
        break;
      case 'flyControls':
        this.setupFlyControls();
        break;
      default:
        break;
    }
  }

  disposeControl(controlName) {
    switch (controlName) {
      case 'trackballControls':
        this.disposeTrackballControls();
        break;
      case 'orbitControls':
        this.disposeOrbitControls();
        break;
      case 'firstPersonControls':
        this.disposeFirstPersonControls();
        break;
      case 'flyControls':
        this.disposeFlyControls();
        break;
      default:
        break;
    }
  }

  setupTrackballControls() {
    this.trackballControls = new TrackballControls(this.camera, this.renderer.domElement);
    this.trackballControls.rotateSpeed = 5.0;
    this.trackballControls.zoomSpeed = 1.0;
    this.trackballControls.panSpeed = 1.0;
    this.trackballControls.staticMoving = true;
  }

  setupOrbitControls() {
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbitControls.autoRotate = true;
  }

  setupFirstPersonControls() {
    this.firstPersonControls = new FirstPersonControls(this.camera, this.renderer.domElement);
    this.firstPersonControls.lookAt(new THREE.Vector3(0, 0, 0));
    this.firstPersonControls.lookSpeed = 0.1;
    this.firstPersonControls.movementSpeed = 100;
    this.firstPersonControls.noFly = true;
    this.firstPersonControls.lookVertical = true;
    this.firstPersonControls.constrainVertical = true;
    this.firstPersonControls.verticalMin = 1.0;
    this.firstPersonControls.verticalMax = 2.0;
    this.firstPersonControls.lon = 150;
    this.firstPersonControls.lat = -120;
  }

  setupFlyControls() {
    this.flyControls = new FlyControls(this.camera, this.renderer.domElement);
    this.flyControls.movementSpeed = 250;
    this.flyControls.rollSpeed = Math.PI / 24;
    this.flyControls.autoForward = false;
    this.flyControls.dragToLook = true;
  }

  disposeTrackballControls() {
    if (this.trackballControls) {
      this.trackballControls.dispose();
      this.trackballControls = null;
    }
  }

  disposeFirstPersonControls() {
    if (this.firstPersonControls) {
      this.firstPersonControls.dispose();
      this.firstPersonControls = null;
    }
  }

  disposeOrbitControls() {
    if (this.orbitControls) {
      this.orbitControls.dispose();
      this.orbitControls = null;
    }
  }

  disposeFlyControls() {
    if (this.flyControls) {
      this.flyControls.dispose();
      this.flyControls = null;
    }
  }

  onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;

    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    if (this.firstPersonControls) {
      this.firstPersonControls.handleResize();
    }
    if (this.flyControls) {
      this.flyControls.handleResize();
    }
  }

  render() {
    const delta = this.clock.getDelta();
    if (this.trackballControls) {
      this.trackballControls.update(delta);
    } else if (this.orbitControls) {
      this.orbitControls.update(delta);
    } else if (this.firstPersonControls) {
      this.firstPersonControls.update(delta);
    } else if (this.flyControls) {
      this.flyControls.update(delta);
    }
    this.renderer.render(this.scene, this.camera);
  }
}
