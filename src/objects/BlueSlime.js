import { MONSTER } from "../constants";
import MushRoomImage from "../../assets/monster/mushroom.sheet.png";
import Rectangle from "./Rectangle";
import { Monster } from "./Monster";

export class BlueSlime extends Monster {
  constructor(scene, position) {
    if (!scene) throw new Error("not enough parmater 'scene'.");
    super(scene, position);
    this.init();
    this.create();
  }

  init() {
    this.exp = 1;
    this.width = MONSTER.MUSHROOM.WIDTH;
    this.height = MONSTER.MUSHROOM.HEIGHT;
    this.sheetOffset = [
      [this.width * 0, 0, this.width, this.height],
      [this.width * 1, 0, this.width, this.height],
      [this.width * 2, 0, this.width, this.height],
    ];
    this.spriteIndex = 0;
    this.animationBuffer = 25;
    this.animationBufferCount = 0;
    this.hp = 5;
    this.maxHP = this.hp;
    this.tags = ["Monster"];
  }

  create() {
    this.rect = new Rectangle(this.position.x, this.position.y, this.width, this.height);
    const sheet = new Image();
    sheet.src = MushRoomImage;
    this.sheet = sheet;
  }

  update() {
    this.updatePosition();
    this.updateAnimation();
    this.updateHPBar();
  }

  updateAnimation() {
    const { context } = this.scene;
    context.drawImage(
      this.sheet,
      this.sheetOffset[this.spriteIndex][0],
      0,
      this.width,
      this.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
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
    if (target.tags.includes("Shuriken")) {
      this.hp -= target.damage;
      if (this.hp <= 0) this.destroy();
    }
  }
}
