// WindowManager.js
export default class WindowManager {
  #windows; #count; #id; #winData;
  #winShapeChangeCallback; #winChangeCallback;

  constructor() {
    let that = this;
    addEventListener("storage", e => {
      if (e.key === "windows") {
        let nw = JSON.parse(e.newValue);
        let changed = that.#didWindowsChange(that.#windows, nw);
        that.#windows = nw;
        if (changed && that.#winChangeCallback) that.#winChangeCallback();
      }
    });
    window.addEventListener('beforeunload', () => {
      let idx = that.getWindowIndexFromId(that.#id);
      that.#windows.splice(idx, 1);
      that.updateWindowsLocalStorage();
    });
  }

  #didWindowsChange(p, n) {
    if (p.length !== n.length) return true;
    return p.some((w, i) => w.id !== n[i].id);
  }

  init(metaData) {
    this.#windows = JSON.parse(localStorage.getItem("windows")) || [];
    this.#count   = parseInt(localStorage.getItem("count")||"0") + 1;
    this.#id      = this.#count;
    let shape = this.getWinShape();
    this.#winData = { id: this.#id, shape, metaData };
    this.#windows.push(this.#winData);
    localStorage.setItem("count", this.#count);
    this.updateWindowsLocalStorage();
  }

  getWinShape() {
    return { x:window.screenX, y:window.screenY, w:innerWidth, h:innerHeight };
  }

  getWindowIndexFromId(id) {
    return this.#windows.findIndex(w => w.id === id);
  }

  updateWindowsLocalStorage() {
    localStorage.setItem("windows", JSON.stringify(this.#windows));
  }

  update() {
    let s = this.getWinShape(), d = this.#winData.shape;
    if (s.x!==d.x||s.y!==d.y||s.w!==d.w||s.h!==d.h) {
      this.#winData.shape = s;
      this.#windows[this.getWindowIndexFromId(this.#id)].shape = s;
      if (this.#winShapeChangeCallback) this.#winShapeChangeCallback();
      this.updateWindowsLocalStorage();
    }
  }

  setWinShapeChangeCallback(cb) { this.#winShapeChangeCallback = cb; }
  setWinChangeCallback(cb)      { this.#winChangeCallback      = cb; }
  getWindows()                  { return this.#windows; }
  getThisWindowID()             { return this.#id; }
}
