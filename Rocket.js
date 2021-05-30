import { BulletImage } from "./Bullet.js";
import { BULLET_TYPE } from "./Config.js";
import { Flame } from "./Flame.js";
import { NodeJS } from "./Node.js";
export class Rocket extends NodeJS {
    constructor(config, rocketConfig) {
        super(config);
        this.rocketConfig = rocketConfig;
        this.rocketConfig.bullet = [];
        this.rocketConfig.flame = [];
        this.img = new Image();
        this.img.onload = () => {
            this.config.w = this.config.w || this.img.width;
            this.config.h = this.config.h || this.img.height;
            this.config.x -= (this.config.w * this.config.scale) / 2;
            this.config.y -= (this.config.h * this.config.scale) + 50;
            this.draw();
        };
        this.img.src = this.config.imgSrc;
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
            window.addEventListener("keydown", (e) => {
                e.preventDefault();
                switch (e.code) {
                    case "ArrowRight":
                        _this.oldValue = { x: _this.config.x, y: _this.config.y };
                        _this.newValue = { x: _this.config.x + 10, y: _this.config.y };
                        _this.move(_this.oldValue, _this.newValue);
                        break;
                    case "ArrowLeft":
                        _this.oldValue = { x: _this.config.x, y: _this.config.y };
                        _this.newValue = { x: _this.config.x - 10, y: _this.config.y };
                        _this.move(_this.oldValue, _this.newValue);
                        break;
                }
            });
            return isDown;
        };
        this.drag(() => { });
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
    draw() {
        const cfg = this.config;
        cfg.ctx.save();
        let scale = cfg.scale;
        cfg.scaleW = cfg.w * scale;
        cfg.scaleH = cfg.h * scale;
        // cfg.ctx.translate(cfg.x+(cfg.scaleW/2), cfg.y+(cfg.scale/2));
        // cfg.ctx.rotate(45*Math.PI/180);
        cfg.ctx.drawImage(this.img, cfg.x, cfg.y, cfg.scaleW, cfg.scaleH);
        cfg.ctx.restore();
    }
    pushBullet() {
        var config = this.rocketConfig;
        for (let i = 0; i < config.bulletData.length; i++) {
            const data = config.bulletData[i];
            var x = this.getX(data.x);
            var y = this.getY(data.y);
            config.bullet.push(new BulletImage({
                x: x,
                y: y,
                canvas: this.config.canvas,
                ctx: this.config.ctx,
                scale: this.config.scale,
                imgSrc: BULLET_TYPE.RED
            }));
        }
    }
    pushFlame() {
        const config = this.rocketConfig;
        for (let i = 0; i < config.flameData.length; i++) {
            let data = config.flameData[i];
            var x = this.getX(data.x);
            var y = this.getY(data.y);
            config.flame.push(new Flame({
                x: x,
                y: y,
                canvas: this.config.canvas,
                ctx: this.config.ctx,
                scale: this.config.scale
            }));
        }
    }
    drawFlame() {
        const flame = this.rocketConfig.flame;
        if (flame.length == 0) {
            this.pushFlame();
        }
        const config = this.rocketConfig;
        for (let i = 0; i < flame.length; i++) {
            const elem = flame[i];
            let data = config.flameData[i];
            var x = this.getX(data.x);
            var y = this.getY(data.y);
            elem.config.x = x;
            elem.config.y = y;
            elem.config.scale = this.config.scale;
            elem.update();
        }
    }
    getX(percent) {
        return Math.round(this.config.x + (percent * (this.config.scaleW | 0) / 100));
    }
    getY(percent) {
        return Math.round(this.config.y + (percent * (this.config.scaleH | 0) / 100));
    }
    update() {
        this.draw();
        this.drawFlame();
    }
}
