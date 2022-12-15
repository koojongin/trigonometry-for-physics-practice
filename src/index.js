import FirstScene from "./scenes/FirstScene";
import { BOX, CANVAS, getAssetImagePaths } from "./constants";
import ThrowShurikenAudio from "../assets/audio/throw-shuriken.wav";
import CollisionShurikenAudio from "../assets/audio/collision-shuriken.wav";
import ErevBGM from "../assets/audio/erev.ogg";

document.addEventListener("DOMContentLoaded", onload);
global.RESOURCE = { IMAGE: {}, AUDIO: {} };

async function onload() {
  const canvasElement = document.querySelector("canvas");
  canvasElement.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    event.stopPropagation();
  });
  const startButtonElement = document.querySelector(".start-button");
  const textLogsElement = document.querySelector(".text-logs");

  const clickEventHandler = () => {
    startButtonElement.removeEventListener("click", clickEventHandler);
    startButtonElement.remove();
    start();
  };
  const context = canvasElement.getContext("2d");

  const boxes = Array.from(new Array(CANVAS.WIDTH / BOX.WIDTH), (value, xIndex) => {
    return Array.from(new Array(CANVAS.HEIGHT / BOX.HEIGHT), (value, yIndex) => {
      return {
        x: xIndex * BOX.WIDTH,
        y: yIndex * BOX.HEIGHT,
      };
    });
  }).flat();

  const drawDebugBackground = () =>
    boxes.forEach((box) => {
      if ((((box.x / BOX.WIDTH) % 2) + ((box.y / BOX.HEIGHT) % 2)) % 2) {
        context.fillStyle = "#f1f1f1";
      } else {
        context.fillStyle = "#c0c0c0";
      }
      context.fillRect(box.x, box.y, 20, 20);
    });

  const Resources = await loadResources();
  startButtonElement.addEventListener("click", clickEventHandler);

  function start() {
    const firstScene = new FirstScene(context, canvasElement, {
      textLogsElement,
    });
    const callback = () =>
      requestAnimationFrame(() => {
        context.clearRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
        // drawDebugBackground();
        firstScene.update();
        callback();
      });
    callback();
  }
}

async function loadResources() {
  const imagePaths = getAssetImagePaths();

  const audioPaths = [ThrowShurikenAudio, CollisionShurikenAudio, ErevBGM];

  const audioPromises = audioPaths.map((audioPath) => {
    return new Promise((resolve) => {
      const audio = new Audio(audioPath);
      audio.oncanplaythrough = () => {
        resolve(audio);
      };
    });
  });
  const imagePromises = imagePaths.map((imagePath) => {
    const image = new Image();
    image.src = imagePath;
    return new Promise((resolve, reject) => {
      image.onload = () => {
        resolve(image);
        global.RESOURCE.IMAGE[imagePath] = image;
      };
    });
  });

  return Promise.all([...audioPromises, ...imagePromises]);
}
