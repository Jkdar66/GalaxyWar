import { NodeJS } from "./Node.js";
export class BulletImage extends NodeJS {
    constructor(config) {
        super(config);
        this.img = new Image();
        this.img.onload = () => {
            this.config.w = this.config.w || this.img.width;
            this.config.h = this.config.h || this.img.height;
            this.draw();
        };
        this.img.src = this.config.imgSrc;
    }
    draw() {
        const cfg = this.config;
        let scale = cfg.scale;
        cfg.scaleW = cfg.w * scale;
        cfg.scaleH = cfg.h * scale;
        this.config.ctx.drawImage(this.img, cfg.x - cfg.scaleW / 2, cfg.y - cfg.scaleH, cfg.scaleW, cfg.scaleH);
    }
    addMouseEvent(type, callback) { }
}
export class Bullet extends NodeJS {
    constructor(config) {
        super(config);
    }
    draw() {
        const cfg = this.config;
        const ctx = cfg.ctx;
        let scale = cfg.scale;
        cfg.scaleW = Math.round(cfg.w * scale);
        cfg.scaleH = Math.round(cfg.h * scale);
        ctx.restore();
        ctx.shadowBlur = 5;
        ctx.shadowColor = cfg.fill || "rgb(255, 40, 40)";
        ctx.fillStyle = cfg.fill || "rgb(255, 40, 40)";
        var x = cfg.x - cfg.scaleW, y = cfg.y - (cfg.scaleH + cfg.scaleW), h = cfg.scaleH, r = cfg.scaleW;
        var path = createPath(x, y, h, r);
        ctx.fill(path);
        ctx.fill(path);
        ctx.fill(path);
        ctx.shadowColor = "rgb(255, 255, 255)";
        ctx.fillStyle = "rgb(255, 255, 255, 0.4)";
        r /= 2, x += r;
        path = createPath(x, y, h, r);
        ctx.fill(path);
        function createPath(x, y, h, r) {
            var path = new Path2D();
            path.moveTo(x, y);
            path.lineTo(x, y + h);
            path.arcTo(x, y + h + r, x + r, y + h + r, r);
            path.arcTo(x + r + r, y + h + r, x + r + r, y + r, r);
            path.lineTo(x + r + r, y);
            path.arcTo(x + r + r, y - r, x + r, y - r, r);
            path.arcTo(x, y - r, x, y + r, r);
            return path;
        }
    }
    addMouseEvent(type, callback) { }
}
