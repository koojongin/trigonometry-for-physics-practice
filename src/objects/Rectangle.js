export default class Rectangle {
  // x;
  // y;
  // width;
  // height;

  constructor(x, y, width, height) {
    if (x === undefined) {
      x = 0;
    }
    if (y === undefined) {
      y = 0;
    }
    if (width === undefined) {
      width = 0;
    }
    if (height === undefined) {
      height = 0;
    }
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  contains(rect) {
    const {x, y} = rect;
    return this.x <= x && x <= this.x + this.width &&
      this.y <= y && y <= this.y + this.height;
  }

  intersect(rect) {
    const r1 = {left: rect.x, right: rect.x + rect.width, top: rect.y, bottom: rect.y + rect.height};
    const r2 = {left: this.x, right: this.x + this.width, top: this.y, bottom: this.y + this.height};
    return !(r2.left > r1.right ||
      r2.right < r1.left ||
      r2.top > r1.bottom ||
      r2.bottom < r1.top);
  }


}
