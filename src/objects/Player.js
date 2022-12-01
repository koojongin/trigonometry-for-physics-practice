import {GameObject} from "./GameObject";
import {CANVAS, MONSTER, SHURIKEN, TO_RADIANS} from "../constants";
import PlayerImage from "../../assets/player.sheet.png";
import ShurikenImage from "../../assets/shuriken.png";
import Rectangle from "./Rectangle";
import {getVelocity} from "./Pyhsics";

//TODO: 클래스화 시킬 것
function Shuriken(scene, position) {
  if (!scene) throw new Error("not enough parmater 'scene'.")

  const {context} = scene;

  const shuriken = new GameObject();
  shuriken.type = 'Shuriken';
  shuriken.width = SHURIKEN.WIDTH;
  shuriken.height = SHURIKEN.HEIGHT;
  shuriken.position = position;
  shuriken.speed = 10;

  const shurikenImage = new Image();
  shurikenImage.src = ShurikenImage;

  let angle = 0;

  const selectedMonster = scene.monsters.at(-1);
  const velocity = getVelocity(scene.player.position, selectedMonster?.position);
  const canvasRect = new Rectangle(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
  shuriken.update = () => {
    if (shuriken.isDead) return;
    shuriken.rect = new Rectangle(shuriken.position.x, shuriken.position.y, shuriken.width, shuriken.height);
    const isOveredFromCanvas = !shuriken.rect.intersect(canvasRect);
    if (isOveredFromCanvas) {
      const index = scene.player.gameObjects.findIndex(object => object.timestamp == shuriken.timestamp);
      if (index >= 0) {
        scene.player.gameObjects.splice(index, 1);
      }
      // console.log(scene.player.gameObjects.filter(object => object.type == 'Shuriken').length)
      return;
    }
    context.save();
    context.translate(shuriken.position.x + SHURIKEN.WIDTH / 2, shuriken.position.y + SHURIKEN.HEIGHT / 2);
    context.rotate(angle * TO_RADIANS);
    context.translate(-(shuriken.position.x + SHURIKEN.WIDTH / 2), -(shuriken.position.y + SHURIKEN.HEIGHT / 2));
    shuriken.position.x += velocity.x * shuriken.speed;
    shuriken.position.y += velocity.y * shuriken.speed;
    context.drawImage(shurikenImage, shuriken.position.x, shuriken.position.y);
    context.restore();
    angle += 145;
    scene.monsters.forEach((monster, monsterIndex) => {
      const isCollision = monster.rect.intersect(shuriken.rect);
      if (isCollision) {
        const index = scene.player.gameObjects.findIndex(object => object.timestamp == shuriken.timestamp);
        if (index >= 0) {
          scene.player.gameObjects.splice(index, 1);
        }
        scene.monsters.splice(monsterIndex, 1);
      }
    })
  }
  return shuriken;
}

export function Player(scene, position) {
  if (!scene) throw new Error("not enough parmater 'scene'.")
  const {context} = scene;
  const player = new GameObject();
  player.gameObjects = [];
  player.position = position;
  player.width = MONSTER.MUSHROOM.WIDTH;
  player.height = MONSTER.MUSHROOM.HEIGHT;
  const sheet = new Image();
  sheet.src = PlayerImage;

  const sheetOffset = [
    [63 * 0, 0, 63, 56],
    [63 * 1, 0, 63, 56],
    [63 * 2, 0, 63, 56],
  ];

  let spriteIndex = 0;
  const animationBuffer = 25;
  let animationBufferCount = 0;

  const shurikenBuffer = 10;
  let shurikenBufferCount = shurikenBuffer;
  player.update = () => {
    context.drawImage(sheet, sheetOffset[spriteIndex][0], 0, 63, 56, player.position.x, player.position.y, 63, 56);
    animationBufferCount++;
    if (animationBufferCount >= animationBuffer) {
      spriteIndex++;
      animationBufferCount = 0;
    }
    if (spriteIndex >= sheetOffset.length) {
      spriteIndex = 0;
    }


    if (scene.monsters?.length == 0) return;
    if (shurikenBufferCount >= shurikenBuffer) {
      player.gameObjects.push(
        new Shuriken(scene, {x: player.position.x + player.width / 2 - SHURIKEN.WIDTH / 2, y: player.position.y + player.height / 2 - SHURIKEN.HEIGHT / 2})
      );
      shurikenBufferCount = 0;
    } else {
      shurikenBufferCount++;
    }

  }
  return player;
}
