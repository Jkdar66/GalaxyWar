import { Config, MEvent, TEvent } from "./Config.js";

export class NodeJS {
    config: Config;
    drag: Function;
    constructor(config: Config) {
        this.config = config;

        const _this = this;
        this.drag = function (callback: (e: MouseEvent | TouchEvent) => void) {
            let isDown = false;
            let oldValue = { x: null, y: null };
            _this.addMouseEvent("mousedown", (e: MouseEvent) => {
                e.preventDefault();
                isDown = true;
                var bounds = _this.config.canvas.getBoundingClientRect();
                oldValue.x = e.clientX - bounds.x;
                oldValue.y = e.clientY - bounds.y;
            });
            _this.addTouchEvent("touchstart", (e: TouchEvent)=>{
                e.preventDefault();
                isDown = true;
                var bounds = _this.config.canvas.getBoundingClientRect();
                var touch = e.touches.item(e.touches.length-1);
                oldValue.x = touch.clientX - bounds.x;
                oldValue.y = touch.clientY - bounds.y;
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
            _this.addMouseEvent("mousemove", (e: MouseEvent) => {
                e.preventDefault();
                if (isDown) {
                    move({x: e.clientX, y: e.clientY})
                    callback(e);
                }
            });
            _this.addTouchEvent("touchmove", (e: TouchEvent)=>{
                e.preventDefault();
                if (isDown) {
                    var touch = e.touches.item(e.touches.length-1);
                    move({x: touch.clientX, y: touch.clientY})
                    callback(e);
                }
            });

            function move(e: {x: number, y: number}){
                _this.config.moving = true;
                var bounds = _this.config.canvas.getBoundingClientRect();
                let newValue = {
                    x: e.x - bounds.x,
                    y: e.y - bounds.y
                }
                _this.config.x += (newValue.x - oldValue.x);
                _this.config.y += (newValue.y - oldValue.y);
                // _this.config.x = newValue.x - (_this.config.scaleW/2);
                // _this.config.y = newValue.y - (_this.config.scaleH/2);
                oldValue = newValue;
            }
            return isDown;
        }
    }

    draw() { }

    update() {
        this.draw();
    }

    middelX(): number{
        return this.config.x + (this.config.scaleW/2);
    }
    middelY(): number{
        return this.config.y + (this.config.scaleH/2);
    }

    private isPointInPath(e: {x: number, y: number}): boolean{
        const bounds = this.config.canvas.getBoundingClientRect();
        const xEvent = e.x - bounds.x,
            yEvent = e.y - bounds.y;
        const rect = this.config;
        const path = { x1: rect.x, y1: rect.y, x2: rect.x + rect.scaleW, y2: rect.y + rect.scaleH };
        if (xEvent >= path.x1 && xEvent <= path.x2 && yEvent >= path.y1 && yEvent <= path.y2) {
            return true;
        }
        return false;
    }

    protected handelMouseEvent<K extends keyof MEvent>(type: K, callback: (e: MouseEvent) => void) {
        this.config.canvas.addEventListener(type, (e) => {
            if (this.isPointInPath({x: e.clientX, y: e.clientY})) {
                callback(e);
            }
        });
    }

    protected handelTouchEvent<K extends keyof TEvent>(type: K, callback: (e: TouchEvent) => void) {
        this.config.canvas.addEventListener(type, (e) => {
            var event = e.touches.item(e.touches.length-1);
            if (this.isPointInPath({x: event.clientX, y: event.clientY})) {
                callback(e);
            }
        });
    }

    addMouseEvent<K extends keyof MEvent>(type: K, callback: (e: MouseEvent) => void) {
        this.handelMouseEvent(type, callback);
    }

    addTouchEvent<K extends keyof TEvent>(type: K, callback: (e: TouchEvent) => void) {
        this.handelTouchEvent(type, callback);
    }
}
