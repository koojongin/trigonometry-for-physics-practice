import {GameObject} from "./GameObject";
import {MONSTER, SHURIKEN} from "../constants";
import PlayerImage from "../../assets/player.sheet.png";
import Shuriken from "./Shuriken";

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

  // let attackCooldownCount = Shuriken.prototype.cooldown;
  player.cooldowns = {
    shuriken: scene.shuriken.cooldown
  }

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

    attack();
  }

  function attack() {
    if (player.cooldowns.shuriken >= (scene.shuriken.cooldown - (Shuriken.reduceCooldown || 0))) {
      const timePosition = {...{x: player.position.x + player.width / 2 - SHURIKEN.WIDTH / 2, y: player.position.y + player.height / 2 - SHURIKEN.HEIGHT / 2}};
      const shuriken = new Shuriken(scene, timePosition);
      player.gameObjects.push(shuriken);
      if (Shuriken.luckySeven) {
        setTimeout(() => {
          const shuriken = new Shuriken(scene, {x: player.position.x + player.width / 2 - SHURIKEN.WIDTH / 2, y: player.position.y + player.height / 2 - SHURIKEN.HEIGHT / 2});
          // const shuriken = new Shuriken(scene, timePosition);
          player.gameObjects.push(shuriken);
        }, 50);
      }

      if (Shuriken.tripleThrow) {
        // const shuriken = new Shuriken(scene, {x: -30 + player.position.x + player.width / 2 - SHURIKEN.WIDTH / 2, y: 30 + player.position.y + player.height / 2 - SHURIKEN.HEIGHT / 2});
        setTimeout(() => {
          const shuriken = new Shuriken(scene, {x: player.position.x + player.width / 2 - SHURIKEN.WIDTH / 2, y: player.position.y + player.height / 2 - SHURIKEN.HEIGHT / 2});
          // const shuriken = new Shuriken(scene, timePosition);
          player.gameObjects.push(shuriken);
        }, 100);
      }

      player.cooldowns.shuriken = 0;
    } else {
      player.cooldowns.shuriken++;
    }
  }

  return player;
}
