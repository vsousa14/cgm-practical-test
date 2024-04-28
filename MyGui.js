// MyGui.js
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { Box, Shelf, Warehouse } from './Models.js';
import * as THREE from 'three';

export class MyGui {
  constructor(webgl) {
    this.webgl = webgl;
    this.cameraTypeText = 'Perspective';
    this.orbitControlsAutoRotateEnabled = true;

    const gui = new GUI();
    this.setupGui(gui);
  }

  setupGui(gui) {
    const guiVars = {
      activeControls: null, // Variável para controlar qual conjunto de controles está ativo
      drawBox: () => this.drawBox(),
      drawShelf: () => this.drawShelf(),
      drawWarehouse: () => this.drawWarehouse(),
      cleanScene: () => this.cleanScene(),
      switchCamera: () => this.switchCamera(),
      toggleTrackballControls: this.webgl.trackballControls.enabled,
      toggleOrbitControlsAutoRotate: this.orbitControlsAutoRotateEnabled,
      toggleFirstPersonControls: this.webgl.firstPersonControls.enabled,
      toggleFlyControls: this.webgl.flyControls.enabled,
    };

    gui.add(guiVars, 'toggleTrackballControls').name('Trackball Controls').onChange(value => {
      if (value) {
        guiVars.activeControls = 'trackball';
        this.activateControls('trackball');
      } else {
        this.deactivateControls('trackball');
      }
    });

    gui.add(guiVars, 'toggleOrbitControlsAutoRotate').name('Orbit Auto Rotate').onChange(value => {
      this.orbitControlsAutoRotateEnabled = value;
      this.webgl.setOrbitControlsAutoRotate(value);
    });

    gui.add(guiVars, 'toggleFirstPersonControls').name('First Person Controls').onChange(value => {
      if (value) {
        guiVars.activeControls = 'firstPerson';
        this.activateControls('firstPerson');
      } else {
        this.deactivateControls('firstPerson');
      }
    });

    gui.add(guiVars, 'toggleFlyControls').name('Fly Controls').onChange(value => {
      if (value) {
        guiVars.activeControls = 'fly';
        this.activateControls('fly');
      } else {
        this.deactivateControls('fly');
      }
    });

    gui.add(guiVars, 'drawBox').name('Draw Box');
    gui.add(guiVars, 'drawShelf').name('Draw Shelf');
    gui.add(guiVars, 'drawWarehouse').name('Draw Warehouse');
    gui.add(guiVars, 'cleanScene').name('Clean Scene');
    gui.add(guiVars, 'switchCamera').name('Switch Camera');
    gui.add(this, 'cameraTypeText').name('Camera Type').listen();
  }

  cleanScene() {
    while (this.webgl.scene.children.length > 0) {
      this.webgl.scene.remove(this.webgl.scene.children[0]);
    }
  }

  drawBox() {
    this.cleanScene();
    const box = new Box(200, 150, 200, 5);
    this.webgl.scene.add(box);
    this.webgl.scene.add(new THREE.AxesHelper(50));
  }

  drawShelf() {
    this.cleanScene();
    const shelf = new Shelf(200, 150, 200, 5);
    this.webgl.scene.add(shelf);
    this.webgl.scene.add(new THREE.AxesHelper(50));
  }

  drawWarehouse() {
    this.cleanScene();
    const warehouse = new Warehouse(2000, 150, 2000, 5);
    this.webgl.scene.add(warehouse);
    this.webgl.scene.add(new THREE.AxesHelper(50));
  }

  switchCamera() {
    if (this.webgl.camera instanceof THREE.PerspectiveCamera) {
      this.webgl.camera = new THREE.OrthographicCamera(-300, 500, 400, -400, 0.1, 10000);
      const aspect = window.innerWidth / window.innerHeight;
      const frustumSize = 1000;
      this.webgl.camera.position.set(0, 0, 5000);
      this.webgl.camera.lookAt(this.webgl.scene.position);
      this.cameraTypeText = 'Orthographic';
      this.webgl.updateFirstPersonControls();
    } else {
      this.webgl.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 300, 10000);
      this.webgl.camera.position.set(0, 0, 2000);
      this.webgl.camera.lookAt(this.webgl.scene.position);
      this.cameraTypeText = 'Perspective';
      this.webgl.updateFirstPersonControls();
      this.webgl.updateFlyControls();
    }

    // Atualizar as referências dos controles da câmera
    this.webgl.trackballControls.object = this.webgl.camera;
    this.webgl.orbitControls.object = this.webgl.camera;
    this.webgl.firstPersonControls.object = this.webgl.camera;
    this.webgl.flyControls.object = this.webgl.camera;
  }

  // Método para ativar os controles específicos
  activateControls(type) {
    switch (type) {
      case 'trackball':
        this.webgl.trackballControls.enabled = true;
        this.webgl.orbitControls.enabled = false;
        this.webgl.firstPersonControls.enabled = false;
        this.webgl.flyControls.enabled = false;
        break;
      case 'orbit':
        this.webgl.orbitControls.enabled = true;
        this.webgl.trackballControls.enabled = false;
        this.webgl.firstPersonControls.enabled = false;
        this.webgl.flyControls.enabled = false;
        break;
      case 'firstPerson':
        this.webgl.firstPersonControls.enabled = true;
        this.webgl.orbitControls.enabled = false;
        this.webgl.trackballControls.enabled = false;
        this.webgl.flyControls.enabled = false;
        break;
      case 'fly':
        this.webgl.flyControls.enabled = true;
        this.webgl.orbitControls.enabled = false;
        this.webgl.trackballControls.enabled = false;
        this.webgl.firstPersonControls.enabled = false;
        break;
    }
  }

  // Método para desativar os controles específicos
  deactivateControls(type) {
    switch (type) {
      case 'trackball':
        this.webgl.trackballControls.enabled = false;
        break;
      case 'orbit':
        this.webgl.orbitControls.enabled = false;
        break;
      case 'firstPerson':
        this.webgl.firstPersonControls.enabled = false;
        break;
      case 'fly':
        this.webgl.flyControls.enabled = false;
        break;
    }
  }
}
