import Rectangle from "./Rectangle";
import { Monster } from "./Monster";
import MonsterSprite from "../../assets/monster/blue_slime.sheet.png";

export class BlueSlime extends Monster {
  constructor(scene, position) {
    if (!scene) throw new Error("not enough parmater 'scene'.");
    super(scene, position);
    this.init();
    this.create();
  }

  async init() {
    this.exp = 1;
    this.sheetSpritesLength = 5;
    this.sheet = global.RESOURCE.IMAGE[MonsterSprite];
    this.width = 40;
    this.height = 40;
    this.origin = {
      width: this.sheet.width / this.sheetSpritesLength,
      height: this.sheet.height,
    };
    this.sheetOffset = [
      [this.origin.width * 0, 0, this.origin.width, this.origin.height],
      [this.origin.width * 1, 0, this.origin.width, this.origin.height],
      [this.origin.width * 2, 0, this.origin.width, this.origin.height],
      [this.origin.width * 3, 0, this.origin.width, this.origin.height],
      [this.origin.width * 4, 0, this.origin.width, this.origin.height],
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
  }

  update() {
    this.updatePosition();
    this.updateAnimation();
    this.updateHPBar();
  }

  updateAnimation() {
    const { context } = this.scene;
    const [sheetStartX, sheetStartY] = this.sheetOffset[this.spriteIndex];
    context.drawImage(
      this.sheet,
      sheetStartX,
      sheetStartY,
      this.origin.width,
      this.origin.height,
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
