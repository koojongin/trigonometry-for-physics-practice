import { GameObject } from "./GameObject";
import Rectangle from "./Rectangle";

export class Wall extends GameObject {
  rect;

  constructor(scene, position) {
    super(scene, position);
  }

  setRect(rect) {
    const { x, y, width, height } = rect;
    this.position = { x, y };
    this.rect = new Rectangle(x, y, width, height);
  }

  setDirection(direction) {
    if (!direction) throw new Error("direction을 설정하세요.");
    this.direction = direction;
  }

  update() {
    if (!this.direction) throw new Error("direction을 설정하세요.");
    const { x, y, width, height } = this.rect;
    const { context } = this.scene;
    const center = this.rect.getCenterPosition();
    context.fillRect(x, y, width, height);
    this.scene.monsters.forEach((monster) => {
      const isCollision = monster.rect.contains(center);
      if (isCollision) {
        let velocity = {};
        switch (this.direction) {
          case "left":
            velocity = { x: -1, y: 0 };
            break;
          case "right":
            velocity = { x: 1, y: 0 };
            break;
          case "top":
            velocity = { x: 0, y: -1 };
            break;
          case "bottom":
            velocity = { x: 0, y: 1 };
            break;
        }
        monster.toward(velocity);
      }
    });
  }
}
