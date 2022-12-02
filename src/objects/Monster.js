import {GameObject} from "./GameObject";
import {MONSTER} from "../constants";
import MushRoomImage from "../../assets/monster/mushroom.sheet.png";
import Rectangle from "./Rectangle";

//TODO: 클래스화
export class Monster extends GameObject {
  sheetOffset = [
    [63 * 0, 0, 63, 56],
    [63 * 1, 0, 63, 56],
    [63 * 2, 0, 63, 56],
  ];
  spriteIndex = 0;
  animationBuffer = 25;
  animationBufferCount = 0;
  hp = 20;

  tags = ['Monster'];

  constructor(scene, position) {
    if (!scene) throw new Error("not enough parmater 'scene'.")
    super(scene, position);
    this.create();
  }

  create() {
    this.width = MONSTER.MUSHROOM.WIDTH;
    this.height = MONSTER.MUSHROOM.HEIGHT;
    this.rect = new Rectangle(this.position.x, this.position.y, this.width, this.height);
    const sheet = new Image();
    sheet.src = MushRoomImage;
    this.sheet = sheet;
  }

  update() {
    const {context} = this.scene;
    context.drawImage(this.sheet, this.sheetOffset[this.spriteIndex][0], 0, 63, 56, this.position.x, this.position.y, 63, 56);
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
        this.scene.monsters.splice(this.index, 1);
    }
  }
}
