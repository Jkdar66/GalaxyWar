import { Config, StarConfig } from "./Config.js";
import { NodeJS } from "./Node.js";

export class Star{
    cfg: StarConfig;
    values: {x: number, y: number, size: number, ys: number, radius: number};
    constructor(config: StarConfig){
        this.cfg = config;
        this.cfg.path2d = new Path2D();
        this.values = {
            x: this.cfg.minX + Math.round(Math.random() * this.cfg.maxX),
            y: this.cfg.minY + Math.round(Math.random() * this.cfg.maxY), //Math.round(Math.random() * 7 + 1)
            size: this.cfg.minSize + Math.round(Math.random() * this.cfg.maxSize), //Math.round(Math.random() * 5)
            ys: 0.5,
            radius: 0
        };
        this.values.radius = 50/100*this.values.size;
    }
    getPath(): Path2D{
        var path = new Path2D();
        this.values.y += this.values.ys;
        var x = this.values.x, y = this.values.y, size = this.values.size, r = this.values.radius;
        path.moveTo(x, y);
        path.lineTo(x + r, y + size);
        path.lineTo(x + r + size, y + size + r);
        path.lineTo(x + r, y + size + (2*r));
        path.lineTo(x, y + (2*size) + (2*r));
        path.lineTo(x - r, y + size + (2*r));
        path.lineTo(x - r - size, y + size + r);
        path.lineTo(x - r, y + size);
        path.lineTo(x, y);

        if(this.values.y > this.cfg.maxY) {
            var maxY = 5*100/this.cfg.maxY;
            this.values.y = this.cfg.minY + Math.round(Math.random() * maxY);
            this.values.x = this.cfg.minX + Math.round(Math.random() * this.cfg.maxX);
        }
        return path;
    }
}

export class Background extends NodeJS{
    stars: Star[] = [];
    numberOfStars: number;
    constructor(config: Config, numberOfStars: number){
        super(config);
        this.numberOfStars = numberOfStars;

        const cfg = this.config;
        for (let i = 0; i < this.numberOfStars; i++) {
            var star = new Star({
                minX: cfg.x, maxX: cfg.x + cfg.w, 
                minY: cfg.y, maxY: cfg.y + cfg.h,
                minSize: 1, maxSize: 5
            });
            this.stars.push(star);
        }
    }

    draw(){
        const ctx = this.config.ctx;
        const stars = this.stars;
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = "white";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
        for (let i = 0; i < stars.length; i++) {
            var star = stars[i];
            ctx.fill(star.getPath());
        }
        ctx.restore();
    }
}