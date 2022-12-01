import {GameObject} from "./GameObject";
import {CANVAS, FONT_FAMILY, SHURIKEN, TO_RADIANS} from "../constants";
import ShurikenImage from "../../assets/shuriken.png";
import {getVelocity} from "./Pyhsics";
import Rectangle from "./Rectangle";

export default class Shuriken extends GameObject {
  cooldown = 150;
  speed = 10;
  damage = 1;
  width = SHURIKEN.WIDTH;
  height = SHURIKEN.HEIGHT;
  tags = ['Shuriken'];
  canvasRect = new Rectangle(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);

  constructor(scene, position) {
    if (!scene) throw new Error("not enough parmater 'scene'.")
    super(scene, position);
    this.create();
  }


  create() {
    // this.scene.shuriken.cooldown = this.cooldown;
    this.damage = this.damage + (Shuriken.moreDamage || 0);
    const sprite = new Image();
    sprite.src = ShurikenImage;
    this.sprite = sprite;
    const selectedMonster = this.scene.monsters.at(-1);
    this.velocity = getVelocity(
      {x: this.position.x + this.width / 2, y: this.position.y + this.height / 2},
      {x: selectedMonster?.position.x + selectedMonster?.width / 2, y: selectedMonster?.position.y + selectedMonster?.height / 2}
    );
    // console.log(this.velocity.degrees)
  }

  update() {
    this.rect = new Rectangle(this.position.x, this.position.y, this.width, this.height);
    const isOveredFromCanvas = !this.rect.intersect(this.canvasRect);
    if (isOveredFromCanvas) {
      const index = this.scene.player.gameObjects.findIndex(object => object.timestamp == this.timestamp);
      if (index >= 0) {
        this.scene.player.gameObjects.splice(index, 1);
      }
      // console.log(scene.player.gameObjects.filter(object => object.tag == 'Shuriken').length)
      return;
    }

    const {context} = this.scene;
    context.save();
    context.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
    context.rotate((180 - this.velocity.degrees) * TO_RADIANS);
    context.translate(-(this.position.x + this.width / 2), -(this.position.y + this.height / 2));
    this.position.x += this.velocity.x * this.speed;
    this.position.y += this.velocity.y * this.speed;
    context.drawImage(this.sprite, this.position.x, this.position.y);
    context.restore();
    // angle += 145;
    this.scene.monsters.forEach((monster, monsterIndex) => {
      const isCollision = monster.rect.intersect(this.rect);
      if (isCollision) {
        monster.index = monsterIndex;
        this.onCollision(monster);
      }
    })
  }

  onCollision(target) {
    const index = this.scene.player.gameObjects.findIndex(object => object.timestamp == this.timestamp);
    if (index >= 0) {
      this.scene.player.gameObjects.splice(index, 1);
    }
    target.onCollision(this);
    if (target?.tags?.includes('Monster')) {
      // this.scene.textObjects.push()
      const {context} = this.scene;
      context.save();
      context.fillStyle = "#000000";
      context.font = `20px ${FONT_FAMILY.MAPLE}`;
      context.textBaseline = 'top';
      const text = this.damage + "";
      const {width: textBoxWidth, fontBoundingBoxDescent: textBoxHeight} = context.measureText(text);
      const {position: tPosition, width: tWidth, height: tHeight} = target;
      context.fillText(text, tPosition.x + tWidth / 2 - textBoxWidth / 2, tPosition.y - textBoxHeight / 2 - 10);
      context.restore();
    }
  }
}

