export class GameObject {
  position = {};
  timestamp;

  constructor() {
    this.timestamp = new Date().getTime()
  }

  setPosition(x, y) {
    this.position = {x, y};
  }
}
