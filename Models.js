import * as THREE from 'three';

export class Box extends THREE.Object3D {
  constructor(width, height, depth, thickness) {
    super();

    const bottom = this.createPanel(width, thickness, depth, 0, -height / 2 + thickness / 2, 0);
    this.add(bottom);

    const front = this.createPanel(width, height, thickness, 0, 0, -depth / 2 + thickness / 2);
    const back = this.createPanel(width, height, thickness, 0, 0, depth / 2 - thickness / 2);
    const left = this.createPanel(thickness, height, depth - thickness * 2, -width / 2 + thickness / 2, 0, 0);
    const right = this.createPanel(thickness, height, depth - thickness * 2, width / 2 - thickness / 2, 0, 0);

    this.add(front);
    this.add(back);
    this.add(left);
    this.add(right);
  }

  createPanel(width, height, depth, posX, posY, posZ) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshLambertMaterial({ color: '#debd62' });
    const panel = new THREE.Mesh(geometry, material);
    panel.position.set(posX, posY, posZ);
    return panel;
  }
}

export class Shelf extends THREE.Object3D {
  constructor(width, height, depth, thickness) {
    super();

    const bottom = this.createShelf(width * 2, thickness, depth, 0, -height / 2 + thickness / 2, 0);
    bottom.rotateZ(Math.PI / 20);
    bottom.translateX(-width * (Math.PI / 6));

    const middle = this.createShelf(width * 2, thickness, depth, 0, -height / 2 + thickness / 2, 0);
    middle.rotateZ(Math.PI / 20);
    middle.translateY(height * (Math.PI / 4));

    const top = this.createShelf(width * 2, thickness, depth, 0, -height / 2 + thickness / 2, 0);
    top.rotateZ(-Math.PI / 20);
    top.translateX(-width / 2);
    top.translateY(height * (Math.PI / 2));

    this.add(bottom);
    this.add(middle);
    this.add(top);

    this.addBoxesToShelf(bottom, width, height, depth, thickness,0, true);
    this.addBoxesToShelf(middle, width, height, depth, thickness,  0, true);
    this.addBoxesToShelf(top, width, height, depth, thickness, 0, false);
  }

  createShelf(width, height, depth, posX, posY, posZ) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshLambertMaterial({ color: '#916f10' });
    const panel = new THREE.Mesh(geometry, material);
    panel.position.set(posX, posY, posZ);
    return panel;
  }

  addBoxesToShelf(shelf, shelfWidth, shelfHeight, shelfDepth, shelfThickness, angle, alignLeft) {
    const boxWidth = shelfWidth / 2;
    const boxHeight = shelfHeight / 2;
    const boxDepth = shelfDepth / 2;
    const boxThickness = shelfThickness / 2;
    const margin = 2.5;
    
    const box1 = new Box(boxWidth, boxHeight, boxDepth, boxThickness);
    const box2 = new Box(boxWidth, boxHeight, boxDepth, boxThickness);
    
    if (alignLeft) {
      box1.position.set(-shelfWidth / 2 + boxWidth / 2, boxHeight / 2 + boxThickness / 2, 0);
      box2.position.set(-shelfWidth / 2 + boxWidth * 1.5 + margin, boxHeight / 2 + boxThickness / 2, 0);
    } else {
      box1.position.set(shelfWidth / 2 - boxWidth / 2, boxHeight / 2 + boxThickness / 2, 0);
      box2.position.set(shelfWidth / 2 - boxWidth * 1.5 - margin, boxHeight / 2 + boxThickness / 2, 0);
    }
    
    box1.rotation.z = angle;
    box2.rotation.z = angle;
    
    shelf.add(box1);
    shelf.add(box2);
  }
  
}

export class Robot extends THREE.Object3D {
  constructor(width, height, depth) {
    super();

    const bodyGeometry = new THREE.BoxGeometry(width, height, depth);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    this.add(body);

    const wheelRadius = Math.min(width, depth) * 0.3;

    const wheelGeometry = new THREE.SphereGeometry(wheelRadius, 32, 32);
    const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff });
    const frontLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    const frontRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    const backLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    const backRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);

    const halfWidth = width / 2;
    const halfDepth = depth / 2;
    const wheelPosY = -height / 2 - wheelRadius;

    frontLeftWheel.position.set(-halfWidth, wheelPosY, halfDepth);
    frontRightWheel.position.set(halfWidth, wheelPosY, halfDepth);
    backLeftWheel.position.set(-halfWidth, wheelPosY, -halfDepth);
    backRightWheel.position.set(halfWidth, wheelPosY, -halfDepth);

    this.add(frontLeftWheel);
    this.add(frontRightWheel);
    this.add(backLeftWheel);
    this.add(backRightWheel);

    const lowerArmRadiusTop = width * 0.07;
    const lowerArmRadiusBottom = width * 0.07;
    const lowerArmHeight = height * 0.4;

    const lowerArmGeometry = new THREE.CylinderGeometry(lowerArmRadiusTop, lowerArmRadiusBottom, lowerArmHeight, 32);
    const lowerArmMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const lowerArm = new THREE.Mesh(lowerArmGeometry, lowerArmMaterial);
    lowerArm.position.set(0, height * 0.6, 0);
    lowerArm.rotation.z = -Math.PI / 6;

    const upperArmRadiusTop = width * 0.07;
    const upperArmRadiusBottom = width * 0.07;
    const upperArmHeight = height * 0.4;

    const upperArmGeometry = new THREE.CylinderGeometry(upperArmRadiusTop, upperArmRadiusBottom, upperArmHeight, 32);
    const upperArmMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const upperArm = new THREE.Mesh(upperArmGeometry, upperArmMaterial);
    upperArm.position.set(width * 0.2, height * 0.3, 0); 
    upperArm.rotation.z = -Math.PI / 4; 

    lowerArm.add(upperArm);

    this.add(lowerArm);
  }
}


export class Warehouse extends THREE.Object3D{
  constructor(width, height, depth, thickness) {
    super();

    const floor = this.createWarehouse(width * 2, thickness, depth, 0, -height / 2 + thickness / 2, 0);
    this.add(floor);

    const backWallHeight = height * 10;
    const backWallYPosition = -height / 2 + backWallHeight / 2 + thickness / 2; 
    const backWall = this.createWarehouse(width * 2, backWallHeight, thickness, 0, backWallYPosition, -depth / 2 + thickness / 2);
    this.add(backWall);

    const shelfWidth = 200;
    const shelfHeight = 150;
    const shelfDepth = 200;
    const shelfThickness = 5;

    const shelf1 = new Shelf(shelfWidth, shelfHeight, shelfDepth, shelfThickness);
    const shelf2 = new Shelf(shelfWidth, shelfHeight, shelfDepth, shelfThickness);
    const shelf3 = new Shelf(shelfWidth, shelfHeight, shelfDepth, shelfThickness);

    const shelfSpacing = shelfWidth + 50;
    const shelfElevation = 10;

    shelf1.position.set(-shelfSpacing * 5, shelfHeight / 2 + shelfElevation, -780);
    shelf2.position.set(0, shelfHeight / 2 + shelfElevation, -780);
    shelf3.position.set(shelfSpacing * 5, shelfHeight / 2 + shelfElevation, -780);

    shelf1.rotation.y = Math.PI / 2;
    shelf2.rotation.y = Math.PI / 2;
    shelf3.rotation.y = Math.PI / 2;

    this.add(shelf1);
    this.add(shelf2);
    this.add(shelf3);

    this.robot = new Robot(100, 200, 100);
    this.robot.position.set(0, shelfHeight / 2 + 15, shelfDepth / 2);
    this.add(this.robot);
  }

  createWarehouse(width, height, depth, posX, posY, posZ) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshLambertMaterial({ color: '#E6E6E6' });
    const panel = new THREE.Mesh(geometry, material);
    panel.position.set(posX, posY, posZ);
    return panel;
  }

    getRobot(){
      return this.robot;
    }
}

