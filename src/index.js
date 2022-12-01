import FirstScene from "./scenes/FirstScene";
import {BOX, CANVAS, FPS} from "./constants";
import MushRoomImage from '/assets/monster/mushroom.sheet.png';
import ErevBackground from '/assets/erev-background.png';
import ShurikenImage from '/assets/shuriken.png';


document.addEventListener('DOMContentLoaded', onload);

async function onload() {
  const canvasElement = document.querySelector('canvas');
  const startButtonElement = document.querySelector('.start-button');
  const clickEventHandler = () => {
    startButtonElement.removeEventListener('click', clickEventHandler);
    startButtonElement.remove();
    start();
  }
  startButtonElement.addEventListener('click', clickEventHandler);
  const context = canvasElement.getContext('2d');


  const boxes = Array.from(new Array(CANVAS.WIDTH / BOX.WIDTH), (value, xIndex) => {
    return Array.from(new Array(CANVAS.HEIGHT / BOX.HEIGHT), (value, yIndex) => {
      return {
        x: xIndex * BOX.WIDTH, y: yIndex * BOX.HEIGHT
      };
    })
  }).flat();

  const drawDebugBackground = () => boxes.forEach((box) => {
    if (((box.x / BOX.WIDTH) % 2 + (box.y / BOX.HEIGHT) % 2) % 2) {
      context.fillStyle = "#f1f1f1";
    } else {
      context.fillStyle = "#c0c0c0";
    }
    context.fillRect(box.x, box.y, 20, 20);
  });

  const Resources = await Promise.all(loadResources());


  function start() {
    const firstScene = new FirstScene(context);
    setInterval(() => {
      context.clearRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
      // drawDebugBackground();
      firstScene.update();
    }, 1000 / FPS);
  }

}


function loadResources() {
  const imagePaths = [MushRoomImage, ErevBackground, ShurikenImage];
  return imagePaths.map((imagePath) => {
    const image = new Image();
    image.src = imagePath;
    return new Promise((resolve, reject) => {
      image.onload = () => {
        resolve(image);
      }
    });
  })

}
