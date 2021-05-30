import { Config, MEvent, TEvent } from "./Config.js";

export class NodeJS {
    config: Config;
    constructor(config: Config) {
        this.config = config;
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

    private handelMouseEvent<K extends keyof MEvent>(type: K, callback: (e: MouseEvent) => void) {
        this.config.canvas.addEventListener(type, (e) => {
            if (this.isPointInPath({x: e.clientX, y: e.clientY})) {
                callback(e);
            }
        });
    }

    private handelTouchEvent<K extends keyof TEvent>(type: K, callback: (e: TouchEvent) => void) {
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
