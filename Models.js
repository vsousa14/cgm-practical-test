import * as THREE from 'three';
import * as SceneUtils from 'three/addons/utils/SceneUtils.js';

// Carregador de texturas
const textureLoader = new THREE.TextureLoader();

// Carregamento assíncrono das texturas
const loadTexture = (url) => {
  return new Promise((resolve, reject) => {
    textureLoader.load(url, (texture) => {
      resolve(texture);
    }, undefined, (err) => {
      reject(err);
    });
  });
};

const cardboardPromise = loadTexture('Texturas/cartao.png');
const alternatorPromise = loadTexture('Texturas/alternador.png');

// Função para criar uma textura de canvas com texto sobre uma textura existente
function createTextTextureWithBackground(text, backgroundImage) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 512;
  canvas.height = 512;

  // Desenhar a textura de fundo
  context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  // Configurar estilo do texto
  context.fillStyle = '#000000';
  context.font = '48px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  // Quebrar o texto em várias linhas
  const lines = wrapText(context, text, canvas.width - 20); 

  // Desenhar as linhas de texto
  const lineHeight = 50; 
  const initialY = canvas.height / 2 - (lines.length / 2) * lineHeight; // Centralizar verticalmente
  lines.forEach((line, i) => {
    context.fillText(line, canvas.width / 2, initialY + i * lineHeight);
  });

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Função para quebrar o texto em várias linhas
function wrapText(context, text, maxWidth) {
  const words = text.split(' ');
  let lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = context.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

export class Box extends THREE.Object3D {
  constructor(largura, altura, comprimento, espessura, cardboard, alternator) {
    super();

    this.lado = Box.createMesh(new THREE.BoxGeometry(largura, altura, espessura, 16, 16, 16), cardboard);
    this.lado.position.set(0, altura / 2, comprimento / 2 + espessura / 2);
    this.add(this.lado);

    this.lado1 = Box.createMesh(new THREE.BoxGeometry(largura, altura, espessura, 16, 16, 16), cardboard);
    this.lado1.position.set(0, altura / 2, -(comprimento / 2 + espessura / 2));
    this.add(this.lado1);

    this.lado2 = Box.createMesh(new THREE.BoxGeometry(espessura, altura, comprimento + espessura * 2, 16, 16, 16), cardboard);
    this.lado2.position.set(-(largura / 2 + espessura / 2), altura / 2, 0);
    this.add(this.lado2);

    this.lado3 = Box.createMesh(new THREE.BoxGeometry(espessura, altura, comprimento + espessura * 2, 16, 16, 16), cardboard);
    this.lado3.position.set(largura / 2 + espessura / 2, altura / 2, 0);
    this.add(this.lado3);

    this.lado4 = Box.createMesh(new THREE.BoxGeometry(largura, 0, comprimento, 16, 16, 16), cardboard);
    this.lado4.position.set(0, 0, 0);
    this.add(this.lado4);

    this.cima = Box.createMesh(new THREE.BoxGeometry(largura + espessura * 2, 0, comprimento + espessura * 2, 16, 16, 16), alternator);
    this.cima.position.set(0, altura + espessura / 10, 0);
    this.add(this.cima);

    const textTextureWithBackground = createTextTextureWithBackground('ALTERNATORS XPTO MY COMPANY INC', cardboard.image);
    this.ladoComTexto = Box.createMesh(new THREE.BoxGeometry(espessura, altura, comprimento + espessura * 2, 16, 16, 16), textTextureWithBackground);
    this.ladoComTexto.position.set(-(largura / 2 + espessura / 2), altura / 2, 0);
    this.add(this.ladoComTexto);
  }

  static createMesh(geom, color) {
    const material = new THREE.MeshBasicMaterial({ map: color });
    const mesh = new THREE.Mesh(geom, material);
    return mesh;
  }
}

export const createBoxes = async () => {
  const [cardboard, alternator] = await Promise.all([cardboardPromise, alternatorPromise]);

  alternator.wrapS = THREE.RepeatWrapping;
  alternator.wrapT = THREE.RepeatWrapping;
  alternator.repeat.set(2, 3);

  const caixa1 = new Box(24.2, 30, 28, 1, cardboard, alternator);
  caixa1.rotation.y += Math.PI - 0.5678;
  caixa1.translateX(0);
  caixa1.translateZ(-97);

  const caixa2 = new Box(28.2, 30, 28, 1, cardboard, alternator);
  caixa2.rotation.y += Math.PI - 0.5678;
  caixa2.translateX(169);
  caixa2.translateZ(-95);

  return [caixa1, caixa2];
};

export class Map extends THREE.Object3D {
  constructor() {
    super();

    const cardboard = new THREE.TextureLoader().load('./Texturas/mapa.png');

    const geometry = new THREE.PlaneGeometry(1126, 1076);
    const mesh = new THREE.MeshBasicMaterial({ map: cardboard });

    const mapa = new THREE.Mesh(geometry, mesh);
    mapa.rotation.x = -0.5 * Math.PI;
    mapa.rotation.z = 0.7898;

    this.add(mapa);
  }
}
