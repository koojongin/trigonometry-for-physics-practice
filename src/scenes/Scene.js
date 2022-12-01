export default class Scene {
  context;

  constructor(context) {
    this.context = context;
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
}
