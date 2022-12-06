import {GameObject} from "./GameObject";
import {MONSTER, SHURIKEN} from "../constants";
import PlayerImage from "../../assets/player.sheet.png";
import Shuriken from "./Shuriken";
import {LEVEL_UP_TABLE} from "./player/player.constant";

export class Player extends GameObject {
  keyPressed = {
    up: false, down: false, left: false, right: false
  }
  level = 1;
  gold = 0;
  exp = 0;
  gameObjects = [];
  width = MONSTER.MUSHROOM.WIDTH;
  height = MONSTER.MUSHROOM.HEIGHT;
  speed = 5;
  sheetOffset = [[63 * 0, 0, 63, 56], [63 * 1, 0, 63, 56], [63 * 2, 0, 63, 56],];
  spriteIndex = 0;
  animationBuffer = 25;
  animationBufferCount = 0;
  cooldowns = {
    shuriken: 0
  }

  constructor(scene, position) {
    if (!scene) throw new Error(`not enough parmater 'scene'.`);
    super(scene, position);
    this.create();
  }

  getCurrentExpPercent() {
    return (this.exp / LEVEL_UP_TABLE[this.level] * 100).toFixed(2);
  }

  create() {
    const sheet = new Image();
    sheet.src = PlayerImage;
    this.sheet = sheet;
    this.cooldowns = {
      shuriken: this.scene.shuriken.cooldown
    }
  }

  resetKeyPressed = () => {
    this.keyPressed = {
      up: false, down: false, left: false, right: false
    }
  }

  update() {
    const {context} = this.scene;
    context.drawImage(this.sheet, this.sheetOffset[this.spriteIndex][0], 0, this.width, this.height, this.position.x, this.position.y, this.width, this.height);

    if (this.keyPressed.left) this.position.x -= this.speed;
    if (this.keyPressed.right) this.position.x += this.speed;
    if (this.keyPressed.up) this.position.y -= this.speed;
    if (this.keyPressed.down) this.position.y += this.speed;

    this.animationBufferCount++;
    if (this.animationBufferCount >= this.animationBuffer) {
      this.spriteIndex++;
      this.animationBufferCount = 0;
    }
    if (this.spriteIndex >= this.sheetOffset.length) {
      this.spriteIndex = 0;
    }

    if (this.scene.monsters?.length == 0) return;
    this.attack();
  }

  attack() {
    if (this.cooldowns.shuriken >= (this.scene.shuriken.cooldown - (Shuriken.reduceCooldown || 0))) {
      const timePosition = {...{x: this.position.x + this.width / 2 - SHURIKEN.WIDTH / 2, y: this.position.y + this.height / 2 - SHURIKEN.HEIGHT / 2}};
      const shuriken = new Shuriken(this.scene, timePosition);
      this.gameObjects.push(shuriken);
      if (Shuriken.luckySeven) {
        setTimeout(() => {
          const shuriken = new Shuriken(this.scene, {x: this.position.x + this.width / 2 - SHURIKEN.WIDTH / 2, y: this.position.y + this.height / 2 - SHURIKEN.HEIGHT / 2});
          this.gameObjects.push(shuriken);
        }, 50);
      }

      if (Shuriken.tripleThrow) {
        setTimeout(() => {
          const shuriken = new Shuriken(this.scene, {x: this.position.x + this.width / 2 - SHURIKEN.WIDTH / 2, y: this.position.y + this.height / 2 - SHURIKEN.HEIGHT / 2});
          this.gameObjects.push(shuriken);
        }, 100);
      }

      this.cooldowns.shuriken = 0;
    } else {
      this.cooldowns.shuriken++;
    }
  }
}
