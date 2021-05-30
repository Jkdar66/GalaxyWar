export class NodeJS {
    constructor(config) {
        this.config = config;
    }
    draw() { }
    update() {
        this.draw();
    }
    middelX() {
        return this.config.x + (this.config.scaleW / 2);
    }
    middelY() {
        return this.config.y + (this.config.scaleH / 2);
    }
    isPointInPath(e) {
        const bounds = this.config.canvas.getBoundingClientRect();
        const xEvent = e.x - bounds.x, yEvent = e.y - bounds.y;
        const rect = this.config;
        const path = { x1: rect.x, y1: rect.y, x2: rect.x + rect.scaleW, y2: rect.y + rect.scaleH };
        if (xEvent >= path.x1 && xEvent <= path.x2 && yEvent >= path.y1 && yEvent <= path.y2) {
            return true;
        }
        return false;
    }
    handelMouseEvent(type, callback) {
        this.config.canvas.addEventListener(type, (e) => {
            if (this.isPointInPath({ x: e.clientX, y: e.clientY })) {
                callback(e);
            }
        });
    }
    handelTouchEvent(type, callback) {
        this.config.canvas.addEventListener(type, (e) => {
            var event = e.touches.item(e.touches.length - 1);
            if (this.isPointInPath({ x: event.clientX, y: event.clientY })) {
                callback(e);
            }
        });
    }
    addMouseEvent(type, callback) {
        this.handelMouseEvent(type, callback);
    }
    addTouchEvent(type, callback) {
        this.handelTouchEvent(type, callback);
    }
}
