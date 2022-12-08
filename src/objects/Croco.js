import { GameObject } from "./GameObject";
import { MONSTER } from "../constants";
import CrocoImage from "../../assets/monster/croco.sheet.png";
import Rectangle from "./Rectangle";
import { Monster } from "./Monster";

export class Croco extends Monster {
  constructor(scene, position) {
    if (!scene) throw new Error("not enough parmater 'scene'.");
    super(scene, position);
    this.init();
    this.create();
  }

  init() {
    this.width = MONSTER.CROCO.WIDTH;
    this.height = MONSTER.CROCO.HEIGHT;
    this.exp = 2;
    this.sheetOffset = [
      [this.width * 0, 0, this.width, this.height],
      [this.width * 1, 0, this.width, this.height],
      [this.width * 2, 0, this.width, this.height],
      [this.width * 3, 0, this.width, this.height],
      [this.width * 4, 0, this.width, this.height],
      [this.width * 5, 0, this.width, this.height],
    ];
    this.spriteIndex = 0;
    this.animationBuffer = 15;
    this.animationBufferCount = 0;
    this.hp = 20;
    this.maxHP = this.hp;
    this.tags = ["Monster"];
  }

  create() {
    this.rect = new Rectangle(this.position.x, this.position.y, this.width, this.height);
    const sheet = new Image();
    sheet.src = CrocoImage;
    this.sheet = sheet;
  }

  update() {
    this.updateAnimation();
    this.updatePosition();
    this.updateHPBar();
  }

  onCollision(target) {
    if (target.tags.includes("Shuriken")) {
      this.hp -= target.damage;
      if (this.hp <= 0) this.destroy();
    }
  }
}
