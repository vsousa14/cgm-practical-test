// MyGui.js
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { Box, Shelf, Warehouse, Robot } from './Models.js';
import * as THREE from 'three';

export class MyGui {
  constructor(webgl) {
    this.webgl = webgl;
    this.activeControl = null;
    this.cameraTypeText = '';
    this.robotInstance = null;
    const gui = new GUI();
    this.setupGui(gui);
  }

  setupGui(gui) {
    const guiVars = {
      drawBox: () => this.drawBox(),
      drawEstante: () => this.drawEstante(),
      drawWarehouse: () => this.drawWarehouse(),
      drawRobot: () => this.drawRobot(),
      animateRobot: () => this.animateRobot(),
      cleanScene: () => this.cleanScene(),
      switchCamera: () => this.switchCamera(),
      trackballControls: false,
      orbitControls: false,
      firstPersonControls: false,
      flyControls: false,
    };

    const activateControl = (controlName) => {
      if (this.activeControl !== controlName) {
        if (this.activeControl) {
          this.deactivateControl(this.activeControl);
        }
        this.activeControl = controlName;
        this.webgl.setupControl(controlName);
      }
    };

    gui.add(guiVars, 'trackballControls').name('Trackball Controls').onChange(value => {
      if (value) {
        activateControl('trackballControls');
      } else {
        this.deactivateControl('trackballControls');
      }
    });

    gui.add(guiVars, 'orbitControls').name('Orbit Auto Rotate').onChange(value => {
      if (value) {
        activateControl('orbitControls');
      } else {
        this.deactivateControl('orbitControls');
      }
    });

    gui.add(guiVars, 'firstPersonControls').name('First Person Controls').onChange(value => {
      if (value) {
        activateControl('firstPersonControls');
      } else {
        this.deactivateControl('firstPersonControls');
      }
    });

    gui.add(guiVars, 'flyControls').name('Fly Controls').onChange(value => {
      if (value) {
        activateControl('flyControls');
      } else {
        this.deactivateControl('flyControls');
      }
    });

    gui.add(guiVars, 'drawBox').name('Draw Box');
    gui.add(guiVars, 'drawEstante').name('Draw Estante');
    gui.add(guiVars, 'drawWarehouse').name('Draw Warehouse');
    gui.add(guiVars, 'drawRobot').name('Draw Robot');
    gui.add(guiVars, 'animateRobot').name('Animate Robot');
    gui.add(guiVars, 'cleanScene').name('Clean Scene');
    gui.add(guiVars, 'switchCamera').name('Switch Camera');
    gui.add(this, 'cameraTypeText').name('Camera Type').listen();
  }

  deactivateControl(controlName) {
    if (this.activeControl === controlName) {
      this.webgl.disposeControl(controlName);
      this.activeControl = null;
    }
  }

  cleanScene() {
    while (this.webgl.scene.children.length > 0) {
      this.webgl.scene.remove(this.webgl.scene.children[0]);
    }
  }

  drawBox() {
    this.cleanScene();
    const box = new Box(600, 500, 600, 30);
    this.webgl.scene.add(box);
    this.webgl.scene.add(new THREE.AxesHelper(50));
  }

  drawEstante() {
    this.cleanScene();
    const estante = new Shelf(200, 150, 200, 5);
    this.webgl.scene.add(estante);
    this.webgl.scene.add(new THREE.AxesHelper(50));
  }

  drawWarehouse() {
    this.cleanScene();
    const warehouse = new Warehouse(2000, 150, 2000, 5);
    this.webgl.scene.add(warehouse);
    this.robotInstance = warehouse.getRobot();
  }

  drawRobot() {
    this.cleanScene();
    const robot = new Robot(200, 300, 200);
    this.webgl.scene.add(robot);
  }

  animateRobot() {
    const robot = this.robotInstance;
    if (robot) {
        const initialPosition = robot.position.clone();
        const forwardEndPosition = initialPosition.clone().add(new THREE.Vector3(1000, 0, 0)); // Mudança de 200 para 100
        const backwardEndPosition = initialPosition.clone().add(new THREE.Vector3(-1000, 0, 0)); // Mudança de 200 para 100

        const duration = 2500; // Duração total de cada ida e volta

        const rotate180 = (callback) => {
            const startRotation = robot.rotation.clone();
            const targetRotation = new THREE.Euler(0, startRotation.y + Math.PI, 0); // Rotação de 180 graus
            const startTime = Date.now();
            const endTime = startTime + duration / 2; // Duração de 180 graus de rotação
            const animateRotation = () => {
                const now = Date.now();
                const t = Math.min(1, (now - startTime) / (duration / 2));
                robot.rotation.y = startRotation.y + Math.PI * t; // Calcula a rotação intermediária manualmente
                if (now < endTime) {
                    requestAnimationFrame(animateRotation);
                } else {
                    callback(); // Chama a função de callback após a rotação de 180 graus
                }
            };
            animateRotation();
        };

        const animateForward = () => {
            const startTime = Date.now();
            const endTime = startTime + duration;
            const startPosition = robot.position.clone();
            const animate = () => {
                const now = Date.now();
                const t = Math.min(1, (now - startTime) / duration);
                robot.position.copy(startPosition.clone().lerp(forwardEndPosition, t));
                if (now < endTime) {
                    requestAnimationFrame(animate);
                } else {
                    rotate180(animateBackward); // Aplica rotação de 180 graus e inicia movimento para trás
                }
            };
            animate();
        };

        const animateBackward = () => {
            const startTime = Date.now();
            const endTime = startTime + duration;
            const startPosition = robot.position.clone();
            const animate = () => {
                const now = Date.now();
                const t = Math.min(1, (now - startTime) / duration);
                robot.position.copy(startPosition.clone().lerp(backwardEndPosition, t));
                if (now < endTime) {
                    requestAnimationFrame(animate);
                } else {
                    rotate180(animateForward); // Aplica rotação de 180 graus e inicia movimento para frente
                }
            };
            animate();
        };

        animateForward(); // Inicia a animação de movimento para frente
    } else {
        console.error('Robot not found in the scene.');
    }
}

  switchCamera() {
    if (this.webgl.camera instanceof THREE.PerspectiveCamera) {
      this.webgl.camera = new THREE.OrthographicCamera(-300, 500, 400, -400, 0.1, 10000);
      const aspect = window.innerWidth / window.innerHeight;
      const frustumSize = 1000;
      this.webgl.camera.position.set(0, 0, 5000);
      this.webgl.camera.lookAt(this.webgl.scene.position);
      this.cameraTypeText = 'Orthographic';
    } else {
      this.webgl.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 300, 10000);
      this.webgl.camera.position.set(0, 0, 2000);
      this.webgl.camera.lookAt(this.webgl.scene.position);
      this.cameraTypeText = 'Perspective';
    }

    // Atualizar as referências dos controles da câmera
    if (this.webgl.trackballControls) {
      this.webgl.trackballControls.object = this.webgl.camera;
    }
    if (this.webgl.orbitControls) {
      this.webgl.orbitControls.object = this.webgl.camera;
    }
    if (this.webgl.firstPersonControls) {
      this.webgl.firstPersonControls.object = this.webgl.camera;
    }
    if (this.webgl.flyControls) {
      this.webgl.flyControls.object = this.webgl.camera;
    }
  }
}
