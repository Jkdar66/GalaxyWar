import { NodeJS } from "./Node.js";
export class Star {
    constructor(config) {
        this.cfg = config;
        this.cfg.path2d = new Path2D();
        this.values = {
            x: this.cfg.minX + Math.round(Math.random() * this.cfg.maxX),
            y: this.cfg.minY + Math.round(Math.random() * this.cfg.maxY),
            size: this.cfg.minSize + Math.round(Math.random() * this.cfg.maxSize),
            ys: 0.5,
            radius: 0
        };
        this.values.radius = 50 / 100 * this.values.size;
    }
    getPath() {
        var path = new Path2D();
        this.values.y += this.values.ys;
        var x = this.values.x, y = this.values.y, size = this.values.size, r = this.values.radius;
        path.moveTo(x, y);
        path.lineTo(x + r, y + size);
        path.lineTo(x + r + size, y + size + r);
        path.lineTo(x + r, y + size + (2 * r));
        path.lineTo(x, y + (2 * size) + (2 * r));
        path.lineTo(x - r, y + size + (2 * r));
        path.lineTo(x - r - size, y + size + r);
        path.lineTo(x - r, y + size);
        path.lineTo(x, y);
        if (this.values.y > this.cfg.maxY) {
            var maxY = 5 * 100 / this.cfg.maxY;
            this.values.y = this.cfg.minY + Math.round(Math.random() * maxY);
            this.values.x = this.cfg.minX + Math.round(Math.random() * this.cfg.maxX);
        }
        return path;
    }
}
export class Background extends NodeJS {
    constructor(config, numberOfStars) {
        super(config);
        this.stars = [];
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
    draw() {
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
