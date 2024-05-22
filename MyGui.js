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
    this.isAnimationPlaying = false;
    this.currentDirection = 'forward'; 
    this.duration = 2500;
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
    gui.add(guiVars, 'animateRobot').name('Animate Robot').listen();
    const cleanSceneButton = gui.add(guiVars, 'cleanScene').name('Clean Scene');
    cleanSceneButton.domElement.classList.add('clean-scene-button');
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
    const light = new THREE.DirectionalLight(0xffffff, 1);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1000, 0); 
    directionalLight.castShadow = true; 
    this.webgl.scene.add(directionalLight);

    directionalLight.shadow.mapSize.width = 2048; 
    directionalLight.shadow.mapSize.height = 2048; 
    directionalLight.shadow.camera.near = 0.5; 
    directionalLight.shadow.camera.far = 5000; 

    box.castShadow = true;
    box.receiveShadow = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); 
    this.webgl.scene.add(ambientLight);
  }

  drawEstante() {
    this.cleanScene();
    const estante = new Shelf(200, 150, 200, 5);
    this.webgl.scene.add(estante);
    this.webgl.scene.add(new THREE.AxesHelper(50));

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); 
    directionalLight.position.set(0, 1000, 0); 
    directionalLight.castShadow = true; 
    this.webgl.scene.add(directionalLight);

    directionalLight.shadow.mapSize.width = 2048; 
    directionalLight.shadow.mapSize.height = 2048; 
    directionalLight.shadow.camera.near = 0.5; 
    directionalLight.shadow.camera.far = 5000; 

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); 
    this.webgl.scene.add(ambientLight);
  }

  drawWarehouse() {
    this.cleanScene();
    const warehouse = new Warehouse(2000, 150, 2000, 5);
    this.webgl.scene.add(warehouse);
    //this.robotInstance = warehouse.getRobot();

    warehouse.receiveShadow = true;
    warehouse.castShadow = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); 
    this.webgl.scene.add(ambientLight); 

    const spotLight1 = new THREE.SpotLight(0xffffff, 0.8); 
    spotLight1.position.set(2000, 2000, -800); 
    spotLight1.castShadow = true; 
    spotLight1.target.position.set(900, -1750, -900); 
    this.webgl.scene.add(spotLight1);
    this.webgl.scene.add(spotLight1.target);

    const spotLight2 = new THREE.SpotLight(0xffffff, 0.8); 
    spotLight2.position.set(0, 2000, -800); 
    spotLight2.castShadow = true; 
    spotLight2.target.position.set(0, -1750, -900); 
    this.webgl.scene.add(spotLight2);
    this.webgl.scene.add(spotLight2.target);

    const spotLight3 = new THREE.SpotLight(0xffffff, 0.8); 
    spotLight3.position.set(-2000, 2000, -800); 
    spotLight3.castShadow = true; 
    spotLight3.target.position.set(-900, -1750, -900); 
    this.webgl.scene.add(spotLight3);
    this.webgl.scene.add(spotLight3.target);

    [spotLight1, spotLight2, spotLight3].forEach(light => {
      light.angle = Math.PI / 10; 
      light.penumbra = 0.1; 
      light.decay = 2; 
      light.distance = 5000;

      light.shadow.mapSize.width = 2048;
      light.shadow.mapSize.height = 2048;
      light.shadow.camera.near = 0.5;
      light.shadow.camera.far = 5000;
    });

  }

  drawRobot() {
    //this.cleanScene();
    const robot = new Robot(150, 200, 150);
    this.webgl.scene.add(robot);
    robot.position.set(0,120,0);
    this.robotInstance = robot;

    // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); 
    // directionalLight.position.set(0, 1000, 0); 
    // directionalLight.castShadow = true; 
    // this.webgl.scene.add(directionalLight);

    // directionalLight.shadow.mapSize.width = 2048; 
    // directionalLight.shadow.mapSize.height = 2048; 
    // directionalLight.shadow.camera.near = 0.5; 
    // directionalLight.shadow.camera.far = 5000; 

    // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); 
    // this.webgl.scene.add(ambientLight);
  }

  animateRobot() {
    if (!this.robotInstance) {
        console.error('Robot not found in the scene.');
        return;
    }

    if (this.isAnimationPlaying) {
        this.isAnimationPlaying = false;
        console.log('Animation paused');
        return;
    }

    this.isAnimationPlaying = true;
    console.log('Animation started');

    // Continue the animation based on the current direction
    if (this.currentDirection === 'forward') {
        this.animateForward();
    } else {
        this.animateBackward();
    }
}


startAnimationLoop() {

  // Start the initial animation based on the current direction
  if (this.currentDirection === 'forward') {
      this.animateForward();
  } else {
      this.animateBackward();
  }
}

 rotate180 = (callback) => {
  const robot = this.robotInstance;
  const startRotation = robot.rotation.clone();
  const targetRotation = new THREE.Euler(0, startRotation.y + Math.PI, 0); 
  const startTime = Date.now();
  const endTime = startTime + this.duration / 2; 
  const animateRotation = () => {
      if (!this.isAnimationPlaying) return;
      const now = Date.now();
      const t = Math.min(1, (now - startTime) / (this.duration / 2));
      robot.rotation.y = startRotation.y + Math.PI * t; 
      if (now < endTime) {
          requestAnimationFrame(animateRotation);
      } else {
          callback(); 
      }
  };
  animateRotation();
};

animateForward = () => {
  const robot = this.robotInstance;
  const startTime = Date.now();
  const endTime = startTime + this.duration;
  const startPosition = robot.position.clone();
  const initialPosition = robot.position.clone();
  const forwardEndPosition = initialPosition.clone().add(new THREE.Vector3(1000, 0, 0)); 
  const animate = () => {
      if (!this.isAnimationPlaying) return;
      const now = Date.now();
      const t = Math.min(1, (now - startTime) / this.duration);
      robot.position.copy(startPosition.clone().lerp(forwardEndPosition, t));
      if (now < endTime) {
          requestAnimationFrame(animate);
      } else {
          this.currentDirection = 'backward'; // Update the direction
          this.rotate180(this.animateBackward); 
      }
  };
  animate();
};

animateBackward = () => {
  const robot = this.robotInstance;
  const startTime = Date.now();
  const endTime = startTime + this.duration;
  const startPosition = robot.position.clone();
  const initialPosition = robot.position.clone();
  const backwardEndPosition = initialPosition.clone().add(new THREE.Vector3(-1000, 0, 0)); 
  const animate = () => {
      if (!this.isAnimationPlaying) return;
      const now = Date.now();
      const t = Math.min(1, (now - startTime) / this.duration);
      robot.position.copy(startPosition.clone().lerp(backwardEndPosition, t));
      if (now < endTime) {
          requestAnimationFrame(animate);
      } else {
          this.currentDirection = 'forward'; // Update the direction
          this.rotate180(this.animateForward); 
      }
  };
  animate();
};

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
