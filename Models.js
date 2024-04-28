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

export class Shelf extends THREE.Object3D{
  constructor(width,height,depth, thickness){
    super()

    //bottomShelf
    const bottom = this.createShelf(width*2, thickness, depth, 0, -height / 2 + thickness / 2, 0);
    bottom.rotateZ(Math.PI/20);
    bottom.translateX(-width*(Math.PI/6));

    //middleShelf
    const middle = this.createShelf(width*2, thickness, depth, 0, -height / 2 + thickness / 2, 0);
    middle.rotateZ(Math.PI/20);
    middle.translateY(height*(Math.PI/4));
    
    //topShelf
    const top = this.createShelf(width*2, thickness, depth, 0, -height / 2 + thickness / 2, 0);
    top.rotateZ(-Math.PI/20);
    top.translateX(-width/2);
    top.translateY(height*(Math.PI/2));

    this.add(bottom);
    this.add(middle);
    this.add(top);

  }

  createShelf(width,height,depth,posX,posY,posZ){
    const geometry = new THREE.BoxGeometry(width,height,depth);
    const material = new THREE.MeshNormalMaterial({side: THREE.DoubleSide});
    const panel = new THREE.Mesh(geometry, material);
    panel.position.set(posX,posY,posZ);
    return panel;
  }
}