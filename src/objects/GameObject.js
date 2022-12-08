import {v4} from "uuid";

export class GameObject {
  timestamp;

  constructor(scene, position) {
    this.timestamp = v4();//uuid
    this.scene = scene;
    this.position = position || {x: 0, y: 0};
    this.create();
  }

  create(){};


  setPosition(x, y) {
    this.position = {x, y};
  }
}
