import '/src/index.css';
import Scene from "./Scene";
import ErevBGM from '/assets/audio/erev.ogg';
import ErevBackground from '/assets/erev-background.png';
import {CANVAS, MONSTER} from "../constants";
import {Monster} from "../objects/Monster";
import {Player} from "../objects/Player";

export default class FirstScene extends Scene {

  constructor(context) {
    super(context);
  }

  create() {
    const audio = new Audio(ErevBGM);
    audio.volume = 0.5;
    audio.loop = true;
    audio.play();
    this.monsters = [];
    this.player = new Player(this,
      {
        x: parseInt((CANVAS.WIDTH / 2 - MONSTER.MUSHROOM.WIDTH / 2)),
        y: parseInt((CANVAS.HEIGHT / 2 - MONSTER.MUSHROOM.HEIGHT / 2))
      });
    const monsterGenerationInterval = setInterval(() => {
      this.monsters.push(
        new Monster(this, {
          x: parseInt(Math.random() * (CANVAS.WIDTH - MONSTER.MUSHROOM.WIDTH)),
          y: parseInt(Math.random() * (CANVAS.HEIGHT - MONSTER.MUSHROOM.HEIGHT))
        })
      );//
      // clearInterval(monsterGenerationInterval);
    }, 200);
  }

  update() {
    // this.context.fillStyle = "#000000";
    // this.context.font = `100px ${FONT_FAMILY.MAPLE}`;
    // this.context.textBaseline = 'top';
    // const text = '데이터 로딩중...'
    // const {width: textBoxWidth, fontBoundingBoxDescent: textBoxHeight} = this.context.measureText(text);
    // this.context.fillText(text, CANVAS.WIDTH / 2 - textBoxWidth / 2, CANVAS.HEIGHT / 2 - textBoxHeight / 2);

    const background = new Image();
    background.src = ErevBackground;
    this.context.globalAlpha = 0.5;
    this.context.drawImage(background, 0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
    this.context.globalAlpha = 1;
    this.context.fillStyle = "#b72424";

    this.updateGameObjects([...this.monsters, this.player, ...this.player.gameObjects]);

  }
}
