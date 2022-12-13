import { GameObject } from "./GameObject";
import { MONSTER, SHURIKEN, TOWER } from "../constants";
import TowerImage from "../../assets/tower.png";
import Shuriken from "./Shuriken";
import { LEVEL_UP_TABLE } from "./player/player.constant";

export class Tower extends GameObject {
  constructor(scene, position) {
    if (!scene) throw new Error(`not enough parmater 'scene'.`);
    super(scene, position);
    this.keyPressed = { up: false, down: false, left: false, right: false };
    this.level = 1;
    this.gold = 0;
    this.exp = 0;
    this.width = TOWER.WIDTH / 2;
    this.height = TOWER.HEIGHT / 2;
    this.image = TowerImage;
    this.speed = 5;
    this.sheetOffset = [
      [this.width * 0, 0, this.width, this.height],
      // [this.width * 1, 0, this.width, this.height],
      // [this.width * 2, 0, this.width, this.height],
    ];
    this.spriteIndex = 0;
    this.animationBuffer = 25;
    this.animationBufferCount = 0;
    this.cooldowns = {
      shuriken: 0,
    };
  }

  getCurrentExpPercent() {
    return ((this.exp / LEVEL_UP_TABLE[this.level]) * 100).toFixed(2);
  }

  create() {
    const sheet = new Image();
    sheet.src = TowerImage;
    this.sheet = sheet;
    this.cooldowns = {
      shuriken: this.scene.shuriken.cooldown,
    };
  }

  resetKeyPressed = () => {
    this.keyPressed = {
      up: false,
      down: false,
      left: false,
      right: false,
    };
  };

  update() {
    const { context } = this.scene;
    context.save();
    context.fillStyle = "rgb(255,255,255)";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
    context.drawImage(
      this.sheet,
      this.sheetOffset[this.spriteIndex][0],
      this.sheetOffset[this.spriteIndex][1],
      TOWER.WIDTH,
      TOWER.HEIGHT,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );

    context.restore();

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

  addMissile(object) {
    this.scene.missiles.push(object);
  }

  attack() {
    if (this.cooldowns.shuriken >= this.scene.shuriken.cooldown - (Shuriken.reduceCooldown || 0)) {
      const getCurrentPosition = () => {
        return {
          x: this.position.x + this.width / 2 - SHURIKEN.WIDTH / 2,
          y: this.position.y + this.height / 2 - SHURIKEN.HEIGHT / 2,
        };
      };
      const shuriken = new Shuriken(this.scene, getCurrentPosition());
      this.addMissile(shuriken);
      if (Shuriken.luckySeven) {
        setTimeout(() => {
          const shuriken = new Shuriken(this.scene, getCurrentPosition());
          this.addMissile(shuriken);
        }, 50);
      }

      if (Shuriken.tripleThrow) {
        setTimeout(() => {
          const shuriken = new Shuriken(this.scene, getCurrentPosition());
          this.addMissile(shuriken);
        }, 100);
      }

      this.cooldowns.shuriken = 0;
    } else {
      this.cooldowns.shuriken++;
    }
  }
}
