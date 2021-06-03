import { CircleConfig, Config } from "./config.js";

export class Circle{
    config: Config;
    circle: CircleConfig;
    constructor(config: Config, circle: CircleConfig) {
        this.config = config;
        this.circle = circle;
    }

    draw(): void {
        const ctx = this.config.ctx;
        const circ = this.circle;
        const color = "rgb("+circ.rgb.r+","+circ.rgb.g+","+circ.rgb.b+")";
        ctx.save();
        var path = new Path2D();
        path.arc(circ.bounds.x, circ.bounds.y, circ.bounds.radius, 0, Math.PI*2, false);
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        if(circ.filled) {
            ctx.fill(path);
        }else{
            ctx.stroke(path);
        }
        ctx.restore();
    }
}