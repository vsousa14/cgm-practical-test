import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { createBoxes, Map } from './Models.js';
import * as THREE from 'three';

export class MyGui {
  constructor(webgl) {
    this.webgl = webgl;

    const gui = new GUI();
    this.setupGui(gui);
  }

  setupGui(gui) {
    const guiVars = {
      cleanScene: () => {
        while (this.webgl.scene.children.length > 0) {
          this.webgl.scene.remove(this.webgl.scene.children[0]);
        }
      },
      drawFactory: async () => {
        guiVars.cleanScene();
        
        this.webgl.scene.add(new THREE.AxesHelper(50));

        const mapa = new Map();
        this.webgl.scene.add(mapa);

        const [caixa1, caixa2] = await createBoxes();

        const group = new THREE.Group();
        group.add(caixa1);
        group.add(caixa2);

        this.webgl.scene.add(group);

        group.rotation.y = 0.7898;
      },
    };

    gui.add(guiVars, 'cleanScene').name('Clean Scene');
    gui.add(guiVars, 'drawFactory').name('Draw Factory');

    const customContainer = document.getElementById('GUI-output');
    customContainer.appendChild(gui.domElement);
  }
}
