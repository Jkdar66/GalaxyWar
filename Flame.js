import { NodeJS } from "./Node.js";
export class FlameGif extends NodeJS {
    constructor(config, flameType) {
        super(config);
        this.flameConfig = {
            flameType: flameType,
            path: [],
            sprite: [],
            length: 300,
            index: 0
        };
        this.createSprite();
    }
    createSprite() {
        var path = this.flameConfig.flameType.toString();
        for (let i = 0; i < this.flameConfig.length; i++) {
            var absPath = path;
            absPath += i + ".png";
            var img = new Image();
            this.flameConfig.path.push(absPath);
            this.flameConfig.sprite.push(img);
            const self = this;
            img.onload = function () {
                self.config.w = img.width;
                self.config.h = img.height;
            };
            img.src = absPath;
        }
    }
    draw() {
        const cfg = this.flameConfig;
        const img = cfg.sprite[cfg.index];
        this.config.scaleW = this.config.w * this.config.scale;
        this.config.scaleH = this.config.h * this.config.scale;
        var x = this.config.x - (this.config.scaleW / 2);
        this.config.ctx.drawImage(img, x, this.config.y, this.config.scaleW, this.config.scaleH);
        this.flameConfig.index++;
        if (this.flameConfig.index == this.flameConfig.length) {
            this.flameConfig.index = 0;
        }
    }
}
class FlameParticle {
    constructor(x, y, scale) {
        this.scale = scale;
        this.radius = Math.round((5 + Math.random() * 15) * this.scale);
        this.x = Math.round(x);
        this.y = Math.round(y + this.radius);
        this.xs = (-0.25 + Math.random() * 0.5) * this.scale;
        this.ys = Math.round((-3 + Math.random() * 1.5) * this.scale);
        this.remaining_radius = this.radius;
        this.life = Math.round((30 + Math.random() * 60) * this.scale);
        this.remaining_life = this.life;
        this.r = 30; //255 //Math.round(Math.random() * 255);
        this.g = 125; //125;
        this.b = 255; //30 //Math.round(Math.random() * 100);
    }
}
export class Flame extends NodeJS {
    constructor(config) {
        super(config);
        this.particle = [];
        for (let j = 0; j < 100; j++) {
            var flameParticle = new FlameParticle(this.config.x, this.config.y, this.config.scale);
            this.particle.push(flameParticle);
        }
    }
    draw() {
        for (let i = 0; i < this.particle.length; i++) {
            var elem = this.particle[i];
            var path = new Path2D();
            this.config.ctx.restore();
            path.arc(elem.x, elem.y, elem.remaining_radius, 0, Math.PI * 2, false);
            this.config.ctx.globalCompositeOperation = "lighter";
            var opacity = Math.round(elem.remaining_life / elem.life * 100) / 100;
            var gradient = this.config.ctx.createRadialGradient(elem.x, elem.y, 0, elem.x, elem.y, elem.remaining_radius);
            gradient.addColorStop(0, "rgba(" + elem.r + ", " + elem.g + ", " + elem.b + ", " + opacity + ")");
            gradient.addColorStop(0.5, "rgba(" + elem.r + ", " + elem.g + ", " + elem.b + ", " + opacity + ")");
            gradient.addColorStop(1, "rgba(" + elem.r + ", " + elem.g + ", " + elem.b + ", 0)");
            this.config.ctx.fillStyle = gradient;
            this.config.ctx.fill(path);
            this.config.ctx.globalCompositeOperation = "source-over";
            elem.remaining_life -= 1;
            elem.remaining_radius -= 0.5;
            elem.x += elem.xs;
            elem.y -= elem.ys;
            if (elem.remaining_life < 0 || elem.remaining_radius < 0) {
                var flameParticle = new FlameParticle(this.config.x, this.config.y, this.config.scale);
                this.particle.push(flameParticle);
                this.particle.splice(i, 1);
                i--;
            }
        }
    }
    addMouseEvent(type, callback) { }
}
