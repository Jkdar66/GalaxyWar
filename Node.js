export class NodeJS {
    constructor(config) {
        this.config = config;
        const _this = this;
        this.drag = function (callback) {
            let isDown = false;
            _this.oldValue = { x: null, y: null };
            _this.newValue = { x: null, y: null };
            _this.addMouseEvent("mousedown", (e) => {
                e.preventDefault();
                isDown = true;
                var bounds = _this.config.canvas.getBoundingClientRect();
                _this.oldValue.x = e.clientX - bounds.x;
                _this.oldValue.y = e.clientY - bounds.y;
            });
            _this.addTouchEvent("touchstart", (e) => {
                e.preventDefault();
                isDown = true;
                var bounds = _this.config.canvas.getBoundingClientRect();
                var touch = e.touches.item(e.touches.length - 1);
                _this.oldValue.x = touch.clientX - bounds.x;
                _this.oldValue.y = touch.clientY - bounds.y;
            });
            window.addEventListener("mouseup", (e) => {
                e.preventDefault();
                _this.config.moving = false;
                isDown = false;
            });
            window.addEventListener("touchend", (e) => {
                e.preventDefault();
                _this.config.moving = false;
                isDown = false;
            });
            _this.addMouseEvent("mousemove", (e) => {
                e.preventDefault();
                if (isDown) {
                    var bounds = _this.config.canvas.getBoundingClientRect();
                    _this.newValue = {
                        x: e.clientX - bounds.x,
                        y: e.clientY - bounds.y
                    };
                    _this.move(_this.oldValue, _this.newValue);
                    callback(e);
                }
            });
            _this.addTouchEvent("touchmove", (e) => {
                e.preventDefault();
                if (isDown) {
                    var touch = e.touches.item(e.touches.length - 1);
                    var bounds = _this.config.canvas.getBoundingClientRect();
                    _this.newValue = {
                        x: touch.clientX - bounds.x,
                        y: touch.clientY - bounds.y
                    };
                    _this.move(_this.oldValue, _this.newValue);
                    callback(e);
                }
            });
            return isDown;
        };
    }
    move(oldValue, newValue) {
        const canvPos = this.config.canvas.getBoundingClientRect();
        const windowPos = {
            x1: canvPos.x,
            y1: canvPos.y,
            x2: canvPos.x + canvPos.width,
            y2: canvPos.y + canvPos.height
        };
        const nodePos = {
            x1: this.config.x,
            y1: this.config.y,
            x2: this.config.x + this.config.scaleW,
            y2: this.config.y + this.config.scaleH
        };
        if (nodePos.x1 >= windowPos.x1 && nodePos.x2 <= windowPos.x2) {
            this.config.moving = true;
            var x = (this.newValue.x - this.oldValue.x);
            var y = (this.newValue.y - this.oldValue.y);
            if (nodePos.x1 + x < windowPos.x1) {
                this.config.x = 0;
                return;
            }
            if (nodePos.x2 + x > windowPos.x2) {
                this.config.x = windowPos.x2 - this.config.scaleW;
                return;
            }
            this.config.x += x;
            // _this.config.y += y;
            this.oldValue = this.newValue;
        }
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
