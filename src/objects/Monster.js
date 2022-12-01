import {GameObject} from "./GameObject";
import {MONSTER} from "../constants";
import MushRoomImage from "../../assets/monster/mushroom.sheet.png";
import Rectangle from "./Rectangle";

//TODO: 클래스화
export function Monster(scene, position) {
  if (!scene) throw new Error("not enough parmater 'scene'.")
  const {context} = scene;
  const monster = new GameObject();
  monster.position = position;
  monster.width = MONSTER.MUSHROOM.WIDTH;
  monster.height = MONSTER.MUSHROOM.HEIGHT;
  monster.rect = new Rectangle(position.x, position.y, monster.width, monster.height);
  const sheet = new Image();
  sheet.src = MushRoomImage;

  const sheetOffset = [
    [63 * 0, 0, 63, 56],
    [63 * 1, 0, 63, 56],
    [63 * 2, 0, 63, 56],
  ];

  let spriteIndex = 0;
  const animationBuffer = 25;
  let animationBufferCount = 0;
  monster.update = () => {
    context.drawImage(sheet, sheetOffset[spriteIndex][0], 0, 63, 56, monster.position.x, monster.position.y, 63, 56);
    animationBufferCount++;
    if (animationBufferCount >= animationBuffer) {
      spriteIndex++;
      animationBufferCount = 0;
    }
    if (spriteIndex >= sheetOffset.length) {
      spriteIndex = 0;
    }
  }
  return monster;
}
