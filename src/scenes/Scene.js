import { format } from "date-fns";

export default class Scene {
  context;
  mouse = { position: { x: 0, y: 0 } };

  constructor(context, canvas) {
    this.context = context;
    this.canvas = canvas;
    this.textLogs = [];
    this.create();
  }

  create() {}

  update() {}

  addLog(text) {
    this.textLogs.push({ createdAt: new Date(), text });
    // this.textLogsElement.insertAdjacentHTML("beforeend", html);
    this.updateTextLogBox(this.textLogsElement);
  }

  updateTextLogBox(textLogElement) {
    textLogElement.innerHTML = "";
    this.textLogs.forEach((textLog) => {
      const { text, createdAt } = textLog;
      const html = `<div class="log-monster-created"><span class="timestamp">[${format(
        createdAt,
        "hh:mm:ss"
      )}]</span>${text}</div>`;
      textLogElement?.insertAdjacentHTML("beforeend", html);
    });
  }

  updateGameObjects(objects) {
    objects.forEach((object, index) => {
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
      // if (object.isDead) {
      //   objects.splice(index, 1);
      // }
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
