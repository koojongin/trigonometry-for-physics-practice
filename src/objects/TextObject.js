import {GameObject} from "./GameObject";
import {FONT_FAMILY} from "../constants";

export default class TextObject extends GameObject {
  fontSize = `12px`;
  fontFamily = FONT_FAMILY.MAPLE;
  font = `${this.fontSize} ${this.fontFamily}`;
  textBaseline = 'top';
  fillStyle = "#000";
  text;

  constructor(scene, position) {
    super(scene, position);
    this.create();
  }

  create() {
    this.context = this.scene.context;
  }

  update() {
    const {context} = this.scene;
    context.save();
    context.fillStyle = this.fillStyle;
    context.font = `${this.fontSize} ${this.fontFamily}`;
    context.textBaseline = this.textBaseline;
    context.fillText(this.text, this.position.x, this.position.y);
    context.restore();
  }

  setColor(colorKey) {
    if(!colorKey)throw new Error('missing parameter colorKey');
    this.fillStyle = colorKey;
  }

  getRect() {
    this.context.save();
    this.context.fillStyle = this.fillStyle;
    this.context.font = `${this.fontSize} ${this.fontFamily}`;
    this.context.textBaseline = this.textBaseline;
    const {width, fontBoundingBoxDescent: height} = this.context.measureText(this.text);
    this.context.restore();
    return {
      width, height
    }
  }

  setFontSize(fontSize) {
    this.fontSize = fontSize;
  }
}
