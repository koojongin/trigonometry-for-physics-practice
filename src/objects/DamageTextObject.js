import TextObject from "./TextObject";

export default class DamageTextObject extends TextObject {


  constructor(scene, position) {
    super(scene, position || {x: 0, y: 0});
    this.eliminationCount = 20;
  }

  update() {
    if (this.eliminationCount <= 0) {
      return;
    }
    this.context.save();
    this.context.globalAlpha = 1 - ((this.eliminationCount * 5) / 100);
    super.update();
    this.context.restore();
    this.position = {
      x: this.position.x, y: this.position.y - 1,
    };
    this.eliminationCount--;
  }
}
