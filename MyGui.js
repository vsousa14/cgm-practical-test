// MyGui.js
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { Box, Shelf, Warehouse, Robot } from './Models.js';
import * as THREE from 'three';

export class MyGui {
  constructor(webgl) {
    this.webgl = webgl;
    this.activeControl = null;
    this.cameraTypeText = '';

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
  }

  drawRobot() {
    this.cleanScene();
    const robot = new Robot(200, 300, 200);
    this.webgl.scene.add(robot);
  }

  animateRobot() {
    console.log(this.webgl.scene.children.map(child => child.name));
    const robot = this.webgl.scene.getObjectByName('robot'); // Supondo que o robô tenha um nome na cena
    if (robot) {
      console.log("robot Existe: ", robot);
      // Define a posição inicial do robô
      const initialPosition = { x: robot.position.x };
  
      // Define a posição final para onde o robô andará para a frente
      const forwardEndPosition = { x: robot.position.x + 200 };
  
      // Define a posição final para onde o robô voltará
      const backwardEndPosition = { x: robot.position.x - 200 };
  
      // Cria uma animação Tween para o movimento para frente
      const forwardTween = new TWEEN.Tween(initialPosition)
        .to(forwardEndPosition, 2000) // Duração da animação para frente (em milissegundos)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(() => {
          robot.position.x = initialPosition.x;
        });
  
      // Cria uma animação Tween para o movimento para trás
      const backwardTween = new TWEEN.Tween(initialPosition)
        .to(backwardEndPosition, 2000) // Duração da animação para trás (em milissegundos)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(() => {
          robot.position.x = initialPosition.x;
        });
  
      // Encadeia as animações para formar um loop
      forwardTween.chain(backwardTween);
      backwardTween.chain(forwardTween);
  
      // Inicia a animação
      forwardTween.start();
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
