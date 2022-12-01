export class GameObject {
  timestamp;

  constructor(scene, position) {
    this.timestamp = new Date().getTime()
    this.scene = scene;
    this.position = position || {x: 0, y: 0};
    // this.create();
  }


  setPosition(x, y) {
    this.position = {x, y};
  }
}
