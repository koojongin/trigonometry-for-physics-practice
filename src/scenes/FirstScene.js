import "/src/index.css";
import Scene from "./Scene";
import BackgroundBGM from "/assets/audio/background.mp3";
import SkyBackground from "/assets/sky_background.png";
import { CANVAS, FONT_FAMILY, FPS, GRID_BOX, MONSTER } from "../constants";
import { BlueSlime } from "../objects/BlueSlime";
import { Player } from "../objects/Player";
import Rectangle from "../objects/Rectangle";
import Shuriken from "../objects/Shuriken";
import TextObject from "../objects/TextObject";
import { getElapsedTime, toHHMMSS } from "../util";
import { Croco } from "../objects/Croco";
import { Wall } from "../objects/Wall";
import { Tower } from "../objects/Tower";

export default class FirstScene extends Scene {
  constructor(context, canvas, options) {
    super(context, canvas);
    Object.assign(this, options);
    this.textObjects = [];
    this.monsters = [];
    this.elapsedTime = 0;
    this.generatedMonsters = 0;
    this.requestAnimations = {};
    this.resources = {};
    this.init();
  }

  init() {
    this.initBackground();
    this.towerBox = {
      width: GRID_BOX.WIDTH,
      height: GRID_BOX.HEIGHT,
      // startX: 205,
      // startY: 105,
      startX: 0,
      startY: 0,
    };
    this.missiles = [];
    this.shuriken = new Shuriken(this, { x: -1000, y: 0 });
    this.player = new Player(this, {
      x: parseInt(CANVAS.WIDTH / 2 - MONSTER.MUSHROOM.WIDTH / 2),
      y: parseInt(CANVAS.HEIGHT / 2 - MONSTER.MUSHROOM.HEIGHT / 2),
    });
    this.towers = [];

    this.initTower();
    this.initSkillUI();
    this.initWalls();
    this.batchMonsters();
  }

  initWalls() {
    const wallFrame = { width: 10, height: 10 };
    this.defaultRect = {
      x: 200,
      y: 80,
      width: wallFrame.width,
      height: wallFrame.height,
      direction: "bottom",
    };
    const rects = [
      this.defaultRect,
      ...[
        {
          x: this.defaultRect.x,
          y: CANVAS.HEIGHT - this.defaultRect.y,
          width: wallFrame.width,
          height: wallFrame.height,
          direction: "right",
        },
        {
          x: CANVAS.WIDTH - this.defaultRect.x,
          y: CANVAS.HEIGHT - this.defaultRect.y,
          width: wallFrame.width,
          height: wallFrame.height,
          direction: "top",
        },
        {
          x: CANVAS.WIDTH - this.defaultRect.x,
          y: this.defaultRect.y,
          width: wallFrame.width,
          height: wallFrame.height,
          direction: "left",
        },
      ],
    ];
    this.walls = rects.map((rect) => {
      const wall = new Wall(this);
      wall.setDirection(rect.direction);
      wall.setRect(rect);
      return wall;
    });
  }

  initSkillUI() {
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
  }

  initBackground() {
    const audio = new Audio(BackgroundBGM);
    audio.volume = 0.5;
    audio.loop = true;
    audio.play().then();
    this.timerText = new TextObject(this);
    this.resources.background = new Image();
    this.resources.background.src = SkyBackground; //MapleBackground;
    this.addEvents();
  }

  initTower() {
    this.tower = new Tower(this, { x: 0, y: 0 });
  }

  update() {
    if (this.generatedMonsters == 10) {
      if (!this.crocoIntervalId) {
        this.crocoIntervalId = setInterval(() => {
          this.monsters.push(
            new Croco(this, {
              x: this.defaultRect.x,
              y: this.defaultRect.y,
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
      ...this.towers,
      ...this.missiles,
      ...this.textObjects,
    ];
    this.updateGameObjects(this.gameObjects);
    this.drawBatchGrid();
    this.drawBatchMouseCursor();
    this.drawSkillUI();
    this.drawElapsedTime();
    this.drawExpUI();
    this.drawTower();
    if (this.mouse.isClicked) this.onClick(this.mouse.clicked);
    this.mouse.clicked = { x: -99, y: -99 };
    this.mouse.isClicked = false;
  }

  onClick(clickedPosition) {
    const { x, y } = clickedPosition;
    const tower = new Tower(this, { x, y });
    tower.setPosition(x - tower.width / 2, y - tower.height / 2);
    this.towers.push(tower);
  }

  drawTower() {}

  drawBatchMouseCursor() {
    const { image, sheetOffset, width, height } = this.tower;

    this.context.save();
    this.context.beginPath();
    const radius = (Shuriken.moreRange || 0) + this.shuriken.range;
    this.context.arc(this.mouse.position.x, this.mouse.position.y, radius, 0, 2 * Math.PI);
    this.context.fillStyle = "rgba(255,255,255,0.29)";
    this.context.fill();
    this.context.stroke();

    this.context.fillStyle = "#94f582";
    this.context.fillRect(
      this.mouse.position.x - width / 2,
      this.mouse.position.y - height / 2,
      width,
      height
    );
    this.context.globalAlpha = 0.5;
    this.context.restore();
    this.tower.position = {
      x: this.mouse.position.x - width / 2,
      y: this.mouse.position.y - height / 2,
    };
    this.tower.update();
    // this.context.drawImage(this.player);
  }

  batchMonsters() {
    const generateMonster = () => {
      if (
        this.elapsedTime / (FPS * FPS) >= this.generatedMonsters &&
        this.generatedMonsters <= 10
      ) {
        this.monsters.push(
          new BlueSlime(this, {
            // x: parseInt(Math.random() * (CANVAS.WIDTH - MONSTER.MUSHROOM.WIDTH)),
            // y: parseInt(Math.random() * (CANVAS.HEIGHT - MONSTER.MUSHROOM.HEIGHT)),
            x: this.defaultRect.x,
            y: this.defaultRect.y,
          })
        );
        this.generatedMonsters++;
      }
      this.requestAnimations.roundOne = requestAnimationFrame(generateMonster);
    };
    generateMonster();
  }

  drawBatchGrid() {
    // this.context
    const { width, height, startX, startY } = this.towerBox;
    const boxHorizontalLength = parseInt(CANVAS.WIDTH / width);
    const boxVerticalLength = parseInt(CANVAS.HEIGHT / height);
    this.context.save();
    this.context.strokeStyle = "rgba(0,0,0,0.07)";
    new Array(boxHorizontalLength).fill(1).forEach((value, xIndex) => {
      new Array(boxVerticalLength).fill(1).forEach((value, yIndex) => {
        this.context.strokeRect(width * xIndex + startX, height * yIndex + startY, width, height);
      });
    });
    this.context.restore();
  }

  addEvents() {
    this.mouse.isClicked = false;
    this.canvas.addEventListener("mousemove", (e) => {
      this.mouse.position = this.getMousePos(e);
    });
    this.canvas.addEventListener("mouseup", (e) => {
      this.mouse.clicked = this.getMousePos(e);
      this.mouse.isClicked = true;
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
    // this.context.globalAlpha = 0.5;
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
          if (!Shuriken.moreRange) Shuriken.moreRange = 0;
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
