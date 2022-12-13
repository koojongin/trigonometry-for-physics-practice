import { GameObject } from "./GameObject";
import { CANVAS, SHURIKEN, TO_RADIANS } from "../constants";
import ShurikenImage from "../../assets/shuriken.png";
import { getDistance, getVelocity } from "./Pyhsics";
import Rectangle from "./Rectangle";
import DamageTextObject from "./DamageTextObject";
import ThrowShurikenAudio from "../../assets/audio/throw-shuriken.wav";
import CollisionShurikenAudio from "../../assets/audio/collision-shuriken.wav";
import _ from "../../lib/lodash.core";

export default class Shuriken extends GameObject {
  constructor(scene, position) {
    if (!scene) throw new Error("not enough parmater 'scene'.");
    super(scene, position);
  }

  init() {
    this.cooldown = 150;
    this.speed = 15;
    this.damage = 1;
    this.width = SHURIKEN.WIDTH;
    this.height = SHURIKEN.HEIGHT;
    this.tags = ["Missile", "Shuriken"];
    this.attacked = 0;
    this.attackedList = [];
    this.range = 100;
    this.movedDistance = 0;
  }

  setParent(target) {
    this.parent = target;
  }

  create() {
    this.init();
    this.canvasRect = new Rectangle(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
    this.range += Shuriken.moreRange || 0;
    this.damage = this.getDamage();
    const sprite = new Image();
    sprite.src = ShurikenImage;
    this.sprite = sprite;
    // const selectedMonster = this.scene.monsters.at(-1);

    this.velocity = getVelocity(
      {
        x: this.position.x + this.width / 2,
        y: this.position.y + this.height / 2,
      },
      this.scene.mouse.position
    );
    this.rect = new Rectangle(this.position.x, this.position.y, this.width, this.height);

    const isInCanvas = this.canvasRect.intersect(this.rect);
    if (!isInCanvas) return;
    const audio = new Audio(ThrowShurikenAudio);
    audio.volume = 0.5;

    this.audioCollision = new Audio(CollisionShurikenAudio);
    audio.volume = 0.5;
    audio.play();
  }

  update() {
    this.rect = new Rectangle(this.position.x, this.position.y, this.width, this.height);
    const isOveredFromCanvas = !this.rect.intersect(this.canvasRect);
    if (isOveredFromCanvas) {
      const index = this.scene.missiles.findIndex((object) => object.timestamp == this.timestamp);
      if (index >= 0) {
        this.scene.missiles.splice(index, 1);
      }
      // console.log(scene.player.gameObjects.filter(object => object.tag == 'Shuriken').length)
      return;
    }

    const { context } = this.scene;
    context.save();
    context.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
    context.rotate((180 - this.velocity.degrees) * TO_RADIANS);
    context.translate(-(this.position.x + this.width / 2), -(this.position.y + this.height / 2));
    this.position.x += this.velocity.x * this.speed;
    this.position.y += this.velocity.y * this.speed;
    context.drawImage(this.sprite, this.position.x, this.position.y);
    context.restore();

    this.scene.monsters.forEach((monster, monsterIndex) => {
      const isCollision = monster.rect.intersect(this.rect);
      if (isCollision) {
        monster.index = monsterIndex;
        this.onCollision(monster);
      }
    });

    this.movedDistance += Math.sqrt(
      this.velocity.x * this.speed * (this.velocity.x * this.speed) +
        this.velocity.y * this.speed * (this.velocity.y * this.speed)
    );
    if (this.movedDistance >= this.range) {
      this.destroy();
    }
  }

  getDamage() {
    const bonusRank = ((Shuriken.upgrade || 0) * 10 + 100) / 100;
    return (parseInt((Math.random() * (this.damage + 1)).toFixed(0)) + 1) * bonusRank;
  }

  destroy() {
    const index = this.scene.missiles.findIndex((object) => object.timestamp == this.timestamp);
    if (index >= 0) {
      this.scene.missiles.splice(index, 1);
    }
  }

  onCollision(target) {
    if (this.attackedList.includes(target.timestamp)) return;
    const index = this.scene.missiles.findIndex((object) => object.timestamp == this.timestamp);
    if (index >= 0) {
      const filteredMonsters = this.scene?.monsters
        .filter((monster) => {
          return (
            monster?.timestamp != target.timestamp &&
            !this.attackedList.includes(monster?.timestamp)
          );
        })
        .map((monster) => {
          return {
            distance: getDistance(
              {
                x: monster.position.x + monster.width / 2,
                y: monster.position.y + monster.height / 2,
              },
              {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height / 2,
              }
            ),
            ...monster,
          };
        });

      const result = _.sortBy(filteredMonsters, "distance");
      const [mostNearMonster] = result;
      if (mostNearMonster) {
        this.velocity = getVelocity(
          {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2,
          },
          {
            x: mostNearMonster?.position.x + mostNearMonster?.width / 2,
            y: mostNearMonster?.position.y + mostNearMonster?.height / 2,
          }
        );
      }
    }
    if (target?.tags?.includes("Monster")) {
      this.attackedList.push(target.timestamp);
      target.onCollision(this);
      this.audioCollision.currentTime = 0;
      this.audioCollision.play();
      this.drawDamage(target, this.damage);
      this.attackedList.push(this.timestamp);
      this.attacked++;
      if (this.attacked >= 3) {
        return this.scene.missiles.splice(index, 1);
      }
    }
  }

  drawDamage(target, damage) {
    const { position: tPosition, width: tWidth } = target;
    const textObject = new DamageTextObject(this.scene);
    textObject.text = parseInt(damage) + "";
    textObject.setColor("#e85252");
    textObject.setFontSize("25px");
    const { width: fWidth, height: fHeight } = textObject.getRect();
    textObject.setPosition(
      tPosition.x + tWidth / 2 - fWidth / 2 + (Math.random() * 20 - 10),
      tPosition.y - fHeight + (Math.random() * 20 - 10)
    );
    this.scene.textObjects.push(textObject);
  }
}
