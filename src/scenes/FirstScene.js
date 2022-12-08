import "/src/index.css";
import Scene from "./Scene";
import ErevBGM from "/assets/audio/erev.ogg";
import ErevBackground from "/assets/erev-background.png";
import { CANVAS, FONT_FAMILY, FPS, MONSTER } from "../constants";
import { Mushroom } from "../objects/Mushroom";
import { Player } from "../objects/Player";
import Rectangle from "../objects/Rectangle";
import Shuriken from "../objects/Shuriken";
import TextObject from "../objects/TextObject";
import { getElapsedTime, toHHMMSS } from "../util";
import { Croco } from "../objects/Croco";
import { Wall } from "../objects/Wall";

export default class FirstScene extends Scene {
  constructor(context, canvas) {
    super(context, canvas);
    this.textObjects = [];
    this.monsters = [];
    this.elapsedTime = 0;
    this.generatedMonsters = 0;
    this.requestAnimations = {};
    this.resources = {};
    this.init();
  }

  init() {
    const audio = new Audio(ErevBGM);
    audio.volume = 0.2;
    audio.loop = true;
    audio.play();
    this.timerText = new TextObject(this);
    this.shuriken = new Shuriken(this, { x: -1000, y: 0 });
    this.player = new Player(this, {
      x: parseInt(CANVAS.WIDTH / 2 - MONSTER.MUSHROOM.WIDTH / 2),
      y: parseInt(CANVAS.HEIGHT / 2 - MONSTER.MUSHROOM.HEIGHT / 2),
    });
    this.resources.background = new Image();
    this.resources.background.src = ErevBackground; //MapleBackground;
    const generateMonster = () => {
      if (
        this.elapsedTime / (FPS * FPS) >= this.generatedMonsters &&
        this.generatedMonsters <= 10
      ) {
        this.monsters.push(
          new Mushroom(this, {
            // x: parseInt(Math.random() * (CANVAS.WIDTH - MONSTER.MUSHROOM.WIDTH)),
            // y: parseInt(Math.random() * (CANVAS.HEIGHT - MONSTER.MUSHROOM.HEIGHT)),
            x: 300,
            y: 100,
          })
        );
        this.generatedMonsters++;
      }
      this.requestAnimations.roundOne = requestAnimationFrame(generateMonster);
    };
    generateMonster();
    // this.monsterGenerationRequestId = requestAnimationFrame(generateMonster);

    this.addEvents();
    const skillBox = { width: 50, height: 50 };
    const margin = { left: 5, top: 5 };
    this.skills = [
      { width: 50, height: 50, x: 0 * skillBox.width, y: 0, text: "강화" },
      { width: 50, height: 50, x: 1 * skillBox.width, y: 0, text: "럭키세븐" },
      {
        width: 50,
        height: 50,
        x: 2 * skillBox.width,
        y: 0,
        text: "트리플스로우",
      },
      { width: 50, height: 50, x: 3 * skillBox.width, y: 0, text: "쿨감" },
      {
        width: 50,
        height: 50,
        x: 4 * skillBox.width,
        y: 0,
        text: "사거리",
      },
    ].map((skillBox, index) => {
      const { x, y } = skillBox;
      skillBox.x = x + margin.left * (index + 1);
      skillBox.y = y + margin.top;
      return new Rectangle(skillBox.x, skillBox.y, skillBox.width, skillBox.height, skillBox);
    });

    const rects = [
      { x: 300, y: 100, width: 50, height: 50, direction: "bottom" },
      { x: 300, y: 550, width: 50, height: 50, direction: "right" },
      { x: 950, y: 550, width: 50, height: 50, direction: "top" },
      { x: 950, y: 100, width: 50, height: 50, direction: "left" },
    ];
    this.walls = rects.map((rect) => {
      const wall = new Wall(this);
      wall.setDirection(rect.direction);
      wall.setRect(rect);
      return wall;
    });
  }

  update() {
    if (this.generatedMonsters == 10) {
      if (!this.crocoIntervalId) {
        this.crocoIntervalId = setInterval(() => {
          this.monsters.push(
            new Croco(this, {
              x: 300,
              y: 100,
            })
          );
          this.generatedMonsters++;
        }, 1000);
      }
    }

    this.elapsedTime += FPS;

    this.drawBackground();
    this.drawStageFloor();

    this.gameObjects = [
      ...this.monsters,
      this.player,
      ...this.player.gameObjects,
      ...this.textObjects,
    ];
    this.updateGameObjects(this.gameObjects);

    this.drawSkillUI();
    this.drawElapsedTime();
    this.drawExpUI();
    this.mouse.clicked = { x: -99, y: -99 };
  }

  addEvents() {
    this.canvas.addEventListener("mousemove", (e) => {
      this.mouse.position = this.getMousePos(e);
    });
    this.canvas.addEventListener("mouseup", (e) => {
      this.mouse.clicked = this.getMousePos(e);
    });
    window.addEventListener("keydown", (e) => {
      const { key } = e;
      const lowerKey = key.toLowerCase();
      if (lowerKey === "a") this.player.keyPressed.left = true;
      if (lowerKey === "d") this.player.keyPressed.right = true;
      if (lowerKey === "w") this.player.keyPressed.up = true;
      if (lowerKey === "s") this.player.keyPressed.down = true;
    });
    window.addEventListener("keyup", (e) => {
      const { key } = e;
      const lowerKey = key.toLowerCase();
      if (lowerKey === "a") this.player.keyPressed.left = false;
      if (lowerKey === "d") this.player.keyPressed.right = false;
      if (lowerKey === "w") this.player.keyPressed.up = false;
      if (lowerKey === "s") this.player.keyPressed.down = false;
    });
  }

  drawStageFloor() {
    this.walls.forEach((wall) => {
      wall.update();
    });
    // console.log(rects);
  }

  drawBackground() {
    this.context.globalAlpha = 0.5;
    this.context.drawImage(this.resources.background, 0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
    this.context.globalAlpha = 1;
    this.context.fillStyle = "#b72424";
    // const backgroundUI = new Image();
    // backgroundUI.src = MapleBackground;
    // this.context.drawImage(backgroundUI, 0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
  }

  drawExpUI() {
    this.context.save();
    const expStringText = new TextObject(this);
    expStringText.text = `EXP`;
    expStringText.setFontSize(16);
    const { width: expStringWidth, height: expStringHeight } = expStringText.getRect();
    expStringText.position = { x: 0, y: CANVAS.HEIGHT - expStringHeight };
    expStringText.update();

    const expBox = {
      width: 150,
      height: expStringHeight,
      marginLeft: 1,
    };
    expBox.x = expStringText.position.x + expStringWidth + expBox.marginLeft;
    expBox.y = expStringText.position.y;
    this.context.beginPath();
    this.context.rect(
      expStringText.position.x + expStringWidth + expBox.marginLeft,
      expStringText.position.y,
      expBox.width,
      expBox.height
    );
    this.context.stroke();
    this.context.fillStyle = "rgba(51,51,51,0.49)";
    this.context.fillRect(expBox.x, expBox.y, expBox.width, expBox.height);

    const expText = new TextObject(this);
    const expPercentString = this.player.getCurrentExpPercent();
    expText.text = `${expPercentString}%`;
    expText.setFontSize(16);
    expText.setColor("#ffffff");
    const { width, height } = expText.getRect();
    expText.position = { x: expBox.x, y: expBox.y };
    expText.update();
    this.context.restore();
  }

  drawElapsedTime() {
    this.timerText.text = toHHMMSS(getElapsedTime(this.elapsedTime, FPS));
    this.timerText.setFontSize(20);
    const { width } = this.timerText.getRect();
    this.timerText.setPosition(CANVAS.WIDTH / 2 - width / 2, 0);
    this.timerText.update();
  }

  drawSkillUI() {
    this.context.save();
    this.skills.forEach((skillBox, index) => {
      const { x, y, width, height } = skillBox;
      this.context.fillStyle = "rgba(255,255,255,0.8)";
      this.context.fillRect(x, y, width, height);

      this.context.fillStyle = "#000000";
      this.context.font = `20px ${FONT_FAMILY.MAPLE}`;
      this.context.textBaseline = "top";
      this.context.fillText(skillBox.text, x, y, skillBox.width);

      this.context.strokeStyle = "#000000";
      this.context.strokeRect(x, y, width, height);
    });

    const [selectedSkillBox] = this.skills.filter((skillBox) =>
      skillBox.contains(this.mouse.position)
    );
    if (selectedSkillBox) {
      this.canvas.style.cursor = "pointer";
      const { x, y, width, height } = selectedSkillBox;
      // console.log(selectedSkillBox.text);
      this.context.fillStyle = "rgba(167,255,121,0.45)";
      this.context.fillRect(x, y, width, height);
      this.context.strokeStyle = "#d20f0f";
      this.context.strokeRect(x, y, width, height);

      if (selectedSkillBox?.contains(this.mouse.clicked)) {
        if (selectedSkillBox.text.indexOf("강화") >= 0) {
          if (!Shuriken.upgrade) Shuriken.upgrade = 0;
          Shuriken.upgrade += 1;
          selectedSkillBox.text = `강화${Shuriken.upgrade}`;
        }

        if (selectedSkillBox.text.indexOf("럭키세븐") >= 0) {
          Shuriken.luckySeven = true;
          selectedSkillBox.text = `럭세on`;
        }

        if (selectedSkillBox.text.indexOf("트리플스로우") >= 0) {
          Shuriken.tripleThrow = true;
          selectedSkillBox.text = `트리플on`;
        }

        if (selectedSkillBox.text.indexOf("쿨감") >= 0) {
          if (!Shuriken.reduceCooldown) Shuriken.reduceCooldown = 0;
          Shuriken.reduceCooldown += 10;
          if (Shuriken.reduceCooldown > 100) Shuriken.reduceCooldown = 100;
          selectedSkillBox.text = `쿨감${Shuriken.reduceCooldown}`;
        }

        if (selectedSkillBox.text.indexOf("사거리") >= 0) {
          if (!Shuriken.moreRange) Shuriken.moreRange = 20 * 100;
          const addRange = 20;
          Shuriken.moreRange += addRange;
          selectedSkillBox.text = `사거리${Shuriken.moreRange / addRange}`;
        }
      }
    } else {
      this.canvas.style.cursor = "default";
    }
    this.context.restore();
  }
}
