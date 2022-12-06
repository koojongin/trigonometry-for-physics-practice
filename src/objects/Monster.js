import {v4} from "uuid";
import {GameObject} from "./GameObject";

export class Monster extends GameObject {

  constructor(scene, position) {
    super(scene, position);
  }

  destroy() {
    this.scene.monsters.splice(this.index, 1);
    const targetPlayer = this.scene.player;
    targetPlayer.exp += this.exp;
  }
}
