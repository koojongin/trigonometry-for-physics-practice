import { GameObject } from "./GameObject";
import Rectangle from "./Rectangle";

export class Monster extends GameObject {
  constructor(scene, position) {
    super(scene, position);
    this.initialize();
    // this.scene.addLog(`몬스터(${this.constructor.name})(이/가) 생성되었습니다.`);
  }

  initialize() {
    this.speed = 3;
    this.velocity = { x: 0, y: 0, degrees: 0 };
    this.hpBar = {
      rect: null,
      padding: { top: 1, left: 1, right: 1, bottom: 1 },
    };
    this.hpBar.rect = new Rectangle(0, 0, 60, 7);
  }

  toward(velocity) {
    this.velocity = velocity;
  }

  updateHPBar() {
    const { context } = this.scene;
    const { x, y } = this.position;
    const { rect: hpBarRect, padding } = this.hpBar;
    hpBarRect.x = x + this.width / 2 - hpBarRect.width / 2 - 2;
    hpBarRect.y = this.height + y + 3;

    context.save();
    context.stroke();

    context.fillStyle = "#000000";
    context.fillRect(hpBarRect.x, hpBarRect.y, hpBarRect.width, hpBarRect.height);

    //전체 체력
    context.fillStyle = "#d50012";
    context.fillRect(
      hpBarRect.x + padding.left,
      hpBarRect.y + padding.top,
      hpBarRect.width - padding.left - padding.right,
      hpBarRect.height - padding.top - padding.bottom
    );

    //현재 체력
    context.fillStyle = "#58eb41";
    context.fillRect(
      hpBarRect.x + padding.left,
      hpBarRect.y + padding.top,
      hpBarRect.width * (this.hp / this.maxHP) - padding.left - padding.right,
      hpBarRect.height - padding.top - padding.bottom
    );

    //겉테두리
    context.strokeStyle = "rgba(255,255,255,0.57)";
    context.lineWidth = 1;
    context.strokeRect(hpBarRect.x, hpBarRect.y, hpBarRect.width, hpBarRect.height);

    context.restore();
  }

  updateAnimation() {
    const { context } = this.scene;
    context.drawImage(
      this.sheet,
      this.sheetOffset[this.spriteIndex][0],
      0,
      this.width,
      this.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    this.animationBufferCount++;
    if (this.animationBufferCount >= this.animationBuffer) {
      this.spriteIndex++;
      this.animationBufferCount = 0;
    }
    if (this.spriteIndex >= this.sheetOffset.length) {
      this.spriteIndex = 0;
    }
  }

  updatePosition() {
    this.position.x += this.velocity.x * this.speed;
    this.position.y += this.velocity.y * this.speed;

    if (!this.rect)
      this.rect = new Rectangle(this.position.x, this.position.y, this.width, this.height);
    this.rect.x = this.position.x;
    this.rect.y = this.position.y;
    this.updateHPBar();
  }

  destroy() {
    this.scene.monsters.splice(this.index, 1);
    const targetPlayer = this.scene.player;
    targetPlayer.exp += this.exp;
  }
}
