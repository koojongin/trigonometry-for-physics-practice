import {GameObject} from "./GameObject";
import {MONSTER} from "../constants";
import CrocoImage from "../../assets/monster/croco.sheet.png";
import Rectangle from "./Rectangle";
import {Monster} from "./Monster";

export class Croco extends Monster {
  width = MONSTER.CROCO.WIDTH;
  height = MONSTER.CROCO.HEIGHT;
  exp = 2;
  sheetOffset = [
    [this.width * 0, 0, this.width, this.height],
    [this.width * 1, 0, this.width, this.height],
    [this.width * 2, 0, this.width, this.height],
    [this.width * 3, 0, this.width, this.height],
    [this.width * 4, 0, this.width, this.height],
    [this.width * 5, 0, this.width, this.height],
  ];
  spriteIndex = 0;
  animationBuffer = 15;
  animationBufferCount = 0;
  hp = 20;

  tags = ['Monster'];

  constructor(scene, position) {
    if (!scene) throw new Error("not enough parmater 'scene'.")
    super(scene, position);
    this.create();
  }

  create() {
    this.rect = new Rectangle(this.position.x, this.position.y, this.width, this.height);
    const sheet = new Image();
    sheet.src = CrocoImage;
    this.sheet = sheet;
  }

  update() {
    const {context} = this.scene;
    context.drawImage(this.sheet, this.sheetOffset[this.spriteIndex][0], 0, this.width, this.height, this.position.x, this.position.y, this.width, this.height);
    this.animationBufferCount++;
    if (this.animationBufferCount >= this.animationBuffer) {
      this.spriteIndex++;
      this.animationBufferCount = 0;
    }
    if (this.spriteIndex >= this.sheetOffset.length) {
      this.spriteIndex = 0;
    }
  }

  onCollision(target) {
    if (target.tags.includes('Shuriken')) {
      this.hp -= target.damage;
      if (this.hp <= 0)
        this.destroy();
    }
  }
}
