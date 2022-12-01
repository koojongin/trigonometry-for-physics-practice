import {GameObject} from "./GameObject";

export class TextObject extends GameObject {
  font;
  text;

  constructor(text, opts) {
    super();
    const {font} = opts || {};
    this.font = font || '12px serif';
    this.text = text;
  }
}
