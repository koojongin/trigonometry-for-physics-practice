export default class Scene {
  context;
  mouse = { position: { x: 0, y: 0 } };

  constructor(context, canvas) {
    this.context = context;
    this.canvas = canvas;
    this.create();
  }

  create() {}

  update() {}

  updateGameObjects(objects) {
    objects.forEach((object) => {
      if (object.isCustomDraw) return;
      if (object.constructor.name == "DamageTextObject") {
        if (object.eliminationCount == 0) {
          const index = this.textObjects?.findIndex((tObject) => {
            return tObject.timestamp == object.timestamp;
          });
          if (index >= 0) {
            this.textObjects?.splice(index, 1);
          }
        }
      }
      object.update();
    });
  }

  getMousePos(evt) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  }
}
