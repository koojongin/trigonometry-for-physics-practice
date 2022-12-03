import '/src/index.css';
import Scene from "./Scene";
import ErevBGM from '/assets/audio/erev.ogg';
import ErevBackground from '/assets/erev-background.png';
import MapleBackground from '/assets/maple-background.png';
import {CANVAS, FONT_FAMILY, MONSTER} from "../constants";
import {Monster} from "../objects/Monster";
import {Player} from "../objects/Player";
import Rectangle from "../objects/Rectangle";
import Shuriken from "../objects/Shuriken";

export default class FirstScene extends Scene {

  textObjects = [];
  monsters = [];

  constructor(context, canvas) {
    super(context, canvas);
  }

  create() {
    const audio = new Audio(ErevBGM);
    audio.volume = 0.3;
    audio.loop = true;
    audio.play();
    this.shuriken = new Shuriken(this, {x: -1000, y: 0});
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
      );
      // if (this.monsters.length > 5)
      //   clearInterval(monsterGenerationInterval);
    }, 3000);

    this.canvas.addEventListener('mousemove', (e) => {
      const result = this.getMousePos(e);
      this.mouse.position = result;
    });

    this.canvas.addEventListener('mouseup', (e) => {
      const result = this.getMousePos(e);
      this.mouse.clicked = result;
    })

    window.addEventListener('keydown', (e) => {
      const {key} = e;
      const lowerKey = key.toLowerCase();
      if (lowerKey == 'a')
        this.player.keyPressed.left = true;
      if (lowerKey == 'd')
        this.player.keyPressed.right = true;
      if (lowerKey == 'w')
        this.player.keyPressed.up = true;
      if (lowerKey == 's')
        this.player.keyPressed.down = true;
    });

    window.addEventListener('keyup', (e) => {
      const {key} = e;
      const lowerKey = key.toLowerCase();
      if (lowerKey == 'a')
        this.player.keyPressed.left = false;
      if (lowerKey == 'd')
        this.player.keyPressed.right = false;
      if (lowerKey == 'w')
        this.player.keyPressed.up = false;
      if (lowerKey == 's')
        this.player.keyPressed.down = false;
    })

    const skillBox = {width: 50, height: 50};
    const margin = {left: 5, top: 5};
    this.skills = [
      {width: 50, height: 50, x: 0 * skillBox.width, y: 0, text: '공업'},
      {width: 50, height: 50, x: 1 * skillBox.width, y: 0, text: '럭키세븐'},
      {width: 50, height: 50, x: 2 * skillBox.width, y: 0, text: '트리플스로우'},
      {width: 50, height: 50, x: 3 * skillBox.width, y: 0, text: '쿨감'},
      {width: 50, height: 50, x: 4 * skillBox.width, y: 0, text: '사거리'}
    ].map((skillBox, index) => {
      const {x, y} = skillBox;
      skillBox.x = x + margin.left * (index + 1);
      skillBox.y = y + margin.top;
      return new Rectangle(skillBox.x, skillBox.y, skillBox.width, skillBox.height, skillBox);
    });

  }

  update() {
    const background = new Image();
    background.src = ErevBackground//MapleBackground;
    this.context.globalAlpha = 0.5;
    this.context.drawImage(background, 0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
    this.context.globalAlpha = 1;
    this.context.fillStyle = "#b72424";

    const backgroundUI = new Image();
    backgroundUI.src = MapleBackground;
    this.context.drawImage(backgroundUI, 0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);

    this.gameObjects = [...this.monsters, this.player, ...this.player.gameObjects, ...this.textObjects];
    this.updateGameObjects(this.gameObjects);
    this.drawUI();

    this.mouse.clicked = {x: -99, y: -99};
  }

  drawUI() {
    this.context.save();
    this.skills.forEach((skillBox, index) => {
      const {x, y, width, height} = skillBox;
      this.context.fillStyle = "rgba(255,255,255,0.8)";
      this.context.fillRect(x, y, width, height);

      this.context.fillStyle = "#000000";
      this.context.font = `20px ${FONT_FAMILY.MAPLE}`;
      this.context.textBaseline = 'top';
      this.context.fillText(skillBox.text, x, y, skillBox.width);

      this.context.strokeStyle = "#000000";
      this.context.strokeRect(x, y, width, height);
    });

    const [selectedSkillBox] = this.skills.filter(skillBox => skillBox.contains(this.mouse.position));
    if (selectedSkillBox) {
      this.canvas.style.cursor = 'pointer';
      const {x, y, width, height} = selectedSkillBox;
      // console.log(selectedSkillBox.text);
      this.context.fillStyle = "rgba(167,255,121,0.45)";
      this.context.fillRect(x, y, width, height);
      this.context.strokeStyle = "#d20f0f";
      this.context.strokeRect(x, y, width, height);

      if (selectedSkillBox?.contains(this.mouse.clicked)) {
        if (selectedSkillBox.text.indexOf('공업') >= 0) {
          if (!Shuriken.moreDamage) Shuriken.moreDamage = 0;
          Shuriken.moreDamage += 1;
          selectedSkillBox.text = `공업${Shuriken.moreDamage}`
        }

        if (selectedSkillBox.text.indexOf('럭키세븐') >= 0) {
          Shuriken.luckySeven = true;
          selectedSkillBox.text = `럭세on`
        }

        if (selectedSkillBox.text.indexOf('트리플스로우') >= 0) {
          Shuriken.tripleThrow = true;
          selectedSkillBox.text = `트리플on`
        }

        if (selectedSkillBox.text.indexOf('쿨감') >= 0) {
          if (!Shuriken.reduceCooldown) Shuriken.reduceCooldown = 0;
          Shuriken.reduceCooldown += 10;
          if (Shuriken.reduceCooldown > 100)
            Shuriken.reduceCooldown = 100;
          selectedSkillBox.text = `쿨감${Shuriken.reduceCooldown}`;
        }

        if (selectedSkillBox.text.indexOf('사거리') >= 0) {
          if (!Shuriken.moreRange) Shuriken.moreRange = 0;
          const addRange = 20;
          Shuriken.moreRange += addRange;
          selectedSkillBox.text = `사거리${Shuriken.moreRange / addRange}`;
        }

      }
    } else {
      this.canvas.style.cursor = 'default';
    }
    this.context.restore();
  }

}
