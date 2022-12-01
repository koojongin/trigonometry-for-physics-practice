import '/src/index.css';
import {GameObject} from "../objects/GameObject";
import Scene from "./Scene";

export default class SecondScene extends Scene {

  constructor(context) {
    super(context);
  }

  create() {
  }

  update() {
    console.log(this, this.context, this.monster);
    // this.context.fillStyle = "#000000";
    // this.context.font = `100px ${FONT_FAMILY.MAPLE}`;
    // this.context.textBaseline = 'top';
    // const text = '데이터 로딩중...'
    // const {width: textBoxWidth, fontBoundingBoxDescent: textBoxHeight} = this.context.measureText(text);
    // this.context.fillText(text, CANVAS.WIDTH / 2 - textBoxWidth / 2, CANVAS.HEIGHT / 2 - textBoxHeight / 2);
    // this.context.fillRect(this.monster.position.x, this.monster.position.y)
  }
}
