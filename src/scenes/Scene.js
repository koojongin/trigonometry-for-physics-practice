export default class Scene {
  context;
  mouse = {position: {x: 0, y: 0}}

  constructor(context, canvas) {
    this.context = context;
    this.canvas = canvas;
    this.create();
  }

  create() {
  }

  update() {
  };

  updateGameObjects(objects) {
    objects.forEach((object) => {
      object.update();
    })
  }

  getMousePos(evt) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
}
