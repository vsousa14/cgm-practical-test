import * as THREE from 'three';

export class Box extends THREE.Object3D {
  constructor(width, height, depth, thickness) {
    super();

    // Inferior
    const bottom = this.createPanel(width, thickness, depth, 0, -height / 2 + thickness / 2, 0);
    this.add(bottom);

    // Laterais
    const front = this.createPanel(width, height, thickness, 0, 0, -depth / 2 + thickness / 2);
    const back = this.createPanel(width, height, thickness, 0, 0, depth / 2 - thickness / 2);
    const left = this.createPanel(thickness, height, depth - thickness * 2, -width / 2 + thickness / 2, 0, 0);
    const right = this.createPanel(thickness, height, depth - thickness * 2, width / 2 - thickness / 2, 0, 0);

    // Adiciona as laterais à caixa
    this.add(front);
    this.add(back);
    this.add(left);
    this.add(right);
  }

  createPanel(width, height, depth, posX, posY, posZ) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
    const panel = new THREE.Mesh(geometry, material);
    panel.position.set(posX, posY, posZ);
    return panel;
  }
}

export class Shelf extends THREE.Object3D {
  constructor(width, height, depth, thickness) {
    super();

    // Bottom shelf
    const bottom = this.createShelf(width * 2, thickness, depth, 0, -height / 2 + thickness / 2, 0);
    bottom.rotateZ(Math.PI / 20);
    bottom.translateX(-width * (Math.PI / 6));

    // Middle shelf
    const middle = this.createShelf(width * 2, thickness, depth, 0, -height / 2 + thickness / 2, 0);
    middle.rotateZ(Math.PI / 20);
    middle.translateY(height * (Math.PI / 4));

    // Top shelf
    const top = this.createShelf(width * 2, thickness, depth, 0, -height / 2 + thickness / 2, 0);
    top.rotateZ(-Math.PI / 20);
    top.translateX(-width / 2);
    top.translateY(height * (Math.PI / 2));

    this.add(bottom);
    this.add(middle);
    this.add(top);

    // Add boxes on each shelf
    this.addBoxesToShelf(bottom, width, height, depth, thickness,0, true);
    this.addBoxesToShelf(middle, width, height, depth, thickness,  0, true);
    this.addBoxesToShelf(top, width, height, depth, thickness, 0, false);
  }

  createShelf(width, height, depth, posX, posY, posZ) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
    const panel = new THREE.Mesh(geometry, material);
    panel.position.set(posX, posY, posZ);
    return panel;
  }

  addBoxesToShelf(shelf, shelfWidth, shelfHeight, shelfDepth, shelfThickness, angle, alignLeft) {
    const boxWidth = shelfWidth / 2;
    const boxHeight = shelfHeight / 2;
    const boxDepth = shelfDepth / 2;
    const boxThickness = shelfThickness / 2;
    const margin = 2.5; // Defina a margem desejada aqui
    
    const box1 = new Box(boxWidth, boxHeight, boxDepth, boxThickness);
    const box2 = new Box(boxWidth, boxHeight, boxDepth, boxThickness);
    
    // Set positions relative to the shelf, ensuring they are aligned and not overlapping
    if (alignLeft) {
      box1.position.set(-shelfWidth / 2 + boxWidth / 2, boxHeight / 2 + boxThickness / 2, 0);
      box2.position.set(-shelfWidth / 2 + boxWidth * 1.5 + margin, boxHeight / 2 + boxThickness / 2, 0);
    } else {
      box1.position.set(shelfWidth / 2 - boxWidth / 2, boxHeight / 2 + boxThickness / 2, 0);
      box2.position.set(shelfWidth / 2 - boxWidth * 1.5 - margin, boxHeight / 2 + boxThickness / 2, 0);
    }
    
    // Apply the same rotation to the boxes as the shelf
    box1.rotation.z = angle;
    box2.rotation.z = angle;
    
    shelf.add(box1);
    shelf.add(box2);
  }
  
  
  
}

export class Robot extends THREE.Object3D {
  constructor(width, height, depth) {
    super();

    // Body
    const bodyGeometry = new THREE.BoxGeometry(width, height, depth);
    const bodyMaterial = new THREE.MeshNormalMaterial();
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    this.add(body);

    // Calcula o tamanho das rodas com base nas dimensões do corpo
    const wheelRadius = Math.min(width, depth) * 0.3; // 30% do tamanho do corpo

    // Wheels
    const wheelGeometry = new THREE.SphereGeometry(wheelRadius, 32, 32);
    const wheelMaterial = new THREE.MeshNormalMaterial();
    const frontLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    const frontRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    const backLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    const backRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);

    // Posiciona as rodas nos cantos do corpo
    const halfWidth = width / 2;
    const halfDepth = depth / 2;
    const wheelPosY = -height / 2 - wheelRadius; // Abaixo do corpo

    frontLeftWheel.position.set(-halfWidth, wheelPosY, halfDepth);
    frontRightWheel.position.set(halfWidth, wheelPosY, halfDepth);
    backLeftWheel.position.set(-halfWidth, wheelPosY, -halfDepth);
    backRightWheel.position.set(halfWidth, wheelPosY, -halfDepth);

    this.add(frontLeftWheel);
    this.add(frontRightWheel);
    this.add(backLeftWheel);
    this.add(backRightWheel);

    // Braço Inferior
    const lowerArmWidth = width * 0.15;
    const lowerArmHeight = height * 0.4;
    const lowerArmDepth = depth * 0.15;

    const lowerArmGeometry = new THREE.BoxGeometry(lowerArmWidth, lowerArmHeight, lowerArmDepth);
    const lowerArmMaterial = new THREE.MeshNormalMaterial();
    const lowerArm = new THREE.Mesh(lowerArmGeometry, lowerArmMaterial);
    lowerArm.position.set(0, height*0.6, 0); // No centro da face superior do corpo
    lowerArm.rotation.z = -Math.PI / 6; // Rotação para o lado direito

    // Braço Superior
    const upperArmWidth = width * 0.15;
    const upperArmHeight = height * 0.4;
    const upperArmDepth = depth * 0.15;

    const upperArmGeometry = new THREE.BoxGeometry(upperArmWidth, upperArmHeight, upperArmDepth);
    const upperArmMaterial = new THREE.MeshNormalMaterial();
    const upperArm = new THREE.Mesh(upperArmGeometry, upperArmMaterial);
    upperArm.position.set(width*0.2, height * 0.3, 0); // Acima do braço inferior, no centro
    upperArm.rotation.z = -Math.PI / 4; // Rotação para o lado direito

    lowerArm.add(upperArm); // Adiciona o braço superior como filho do braço inferior

    this.add(lowerArm);
  }
}

export class Warehouse extends THREE.Object3D{
  constructor(width, height, depth, thickness) {
    super();

    // Floor
    const floor = this.createWarehouse(width * 2, thickness, depth, 0, -height / 2 + thickness / 2, 0);
    this.add(floor);

    // Dimensions for the shelves
    const shelfWidth = 200;
    const shelfHeight = 150;
    const shelfDepth = 200;
    const shelfThickness = 5;

    // Create and add 3 shelves
    const shelf1 = new Shelf(shelfWidth, shelfHeight, shelfDepth, shelfThickness);
    const shelf2 = new Shelf(shelfWidth, shelfHeight, shelfDepth, shelfThickness);
    const shelf3 = new Shelf(shelfWidth, shelfHeight, shelfDepth, shelfThickness);

    // Position the shelves
    const shelfSpacing = shelfWidth + 50; // Ajuste o espaçamento conforme necessário
    const shelfElevation = 10; // Ajuste a elevação conforme necessário para flutuar acima do chão

    shelf1.position.set(-shelfSpacing, shelfHeight / 2 + shelfElevation, 0);
    shelf2.position.set(0, shelfHeight / 2 + shelfElevation, 0);
    shelf3.position.set(shelfSpacing, shelfHeight / 2 + shelfElevation, 0);

    // Rotate the shelves by 90 degrees around the Y-axis
    shelf1.rotation.y = Math.PI / 2;
    shelf2.rotation.y = Math.PI / 2;
    shelf3.rotation.y = Math.PI / 2;

    this.add(shelf1);
    this.add(shelf2);
    this.add(shelf3);

    // Add robot in front of the shelves
    this.robot = new Robot(100, 200, 100); // Defina os parâmetros desejados para o robô
    this.robot.position.set(0, shelfHeight / 2 + 15, shelfDepth / 2 + 350); // Posiciona na frente das estantes
    this.add(this.robot);
  }

  createWarehouse(width, height, depth, posX, posY, posZ) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
    const panel = new THREE.Mesh(geometry, material);
    panel.position.set(posX, posY, posZ);
    return panel;
  }

    getRobot(){
      return this.robot;
    }
}

