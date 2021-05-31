import { BulletImage } from "./Bullet.js";
import { BULLET_TYPE, Config, FlameType, RocketConfig } from "./Config.js";
import { FlameGif } from "./Flame.js";
import { NodeJS } from "./Node.js";


export class Rocket extends NodeJS {
    img: HTMLImageElement;
    rocketConfig: RocketConfig;
    private drag: Function;
    private oldValue: {x: number, y: number};
    private newValue: {x: number, y: number};
    constructor(config: Config, rocketConfig?: RocketConfig) {
        super(config);
        this.rocketConfig = rocketConfig;
        this.rocketConfig.bullet = [];
        this.rocketConfig.flame = [];
        this.img = new Image();
        this.img.onload = () => {
            this.config.w = this.config.w || this.img.width;
            this.config.h = this.config.h || this.img.height;
            this.config.x -= (this.config.w *this.config.scale) /2;
            this.config.y -= (this.config.h *this.config.scale) + 50;
            this.draw();
        }
        this.img.src = this.config.imgSrc;

        const _this = this;
        this.drag = function (callback: (e: MouseEvent | TouchEvent) => void) {
            let isDown = false;
            _this.oldValue = { x: null, y: null };
            _this.newValue = { x: null, y: null };
            _this.addMouseEvent("mousedown", (e: MouseEvent) => {
                e.preventDefault();
                isDown = true;
                var bounds = _this.config.canvas.getBoundingClientRect();
                _this.oldValue.x = e.clientX - bounds.x;
                _this.oldValue.y = e.clientY - bounds.y;
            });
            _this.addTouchEvent("touchstart", (e: TouchEvent)=>{
                e.preventDefault();
                isDown = true;
                var bounds = _this.config.canvas.getBoundingClientRect();
                var touch = e.touches.item(e.touches.length-1);
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
            _this.addMouseEvent("mousemove", (e: MouseEvent) => {
                e.preventDefault();
                if (isDown) {
                    var bounds = _this.config.canvas.getBoundingClientRect();
                    _this.newValue = {
                        x: e.clientX - bounds.x,
                        y: e.clientY - bounds.y
                    }
                    _this.move();
                    callback(e);
                }
            });
            _this.addTouchEvent("touchmove", (e: TouchEvent)=>{
                e.preventDefault();
                if (isDown) {

                    var touch = e.touches.item(e.touches.length-1);
                    var bounds = _this.config.canvas.getBoundingClientRect();
                    _this.newValue = {
                        x: touch.clientX - bounds.x,
                        y: touch.clientY - bounds.y
                    }
                    _this.move();
                    callback(e);
                }
            });     
            window.addEventListener("keydown", (e)=>{
                e.preventDefault();
                switch(e.code){
                    case "ArrowRight":
                        _this.oldValue = {x: _this.config.x, y: _this.config.y};
                        _this.newValue = {x: _this.config.x + 10, y: _this.config.y};
                        _this.move()
                        break;
                    case "ArrowLeft":
                        _this.oldValue = {x: _this.config.x, y: _this.config.y};
                        _this.newValue = {x: _this.config.x - 10, y: _this.config.y};
                        _this.move();
                        break;
                }
            });
            return isDown;
        }
        this.drag(() => {});
    }

    move(){
        const canvPos = this.config.canvas.getBoundingClientRect();
        const windowPos = {
            x1: canvPos.x, 
            y1: canvPos.y,
            x2: canvPos.x + canvPos.width,
            y2: canvPos.y + canvPos.height
        }
        const nodePos = {
            x1: this.config.x, 
            y1: this.config.y,
            x2: this.config.x + this.config.scaleW,
            y2: this.config.y + this.config.scaleH
        }
        if(nodePos.x1 >= windowPos.x1 && nodePos.x2 <= windowPos.x2){
            this.config.moving = true;
            var x = (this.newValue.x - this.oldValue.x);
            var y = (this.newValue.y - this.oldValue.y);
            if(nodePos.x1 + x < windowPos.x1) {
                this.config.x = 0;
                return;
            }
            if(nodePos.x2 + x > windowPos.x2)  {
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
        cfg.scaleW = cfg.w * cfg.scale;
        cfg.scaleH = cfg.h * cfg.scale;
        cfg.ctx.drawImage(this.img, cfg.x, cfg.y, cfg.scaleW, cfg.scaleH);
    }
    pushBullet() {
        const config = this.rocketConfig;
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
    
    pushFlame(){
        const config = this.rocketConfig;
        for (let i = 0; i < config.flameData.length; i++) {
            let data = config.flameData[i];
            var x = this.getX(data.x);
            var y = this.getY(data.y);
            config.flame.push(new FlameGif({
                x: x, 
                y: y, 
                canvas: this.config.canvas, 
                ctx: this.config.ctx, 
                scale: this.config.scale
            },
                FlameType.BLUE
            ));
        }
    }
    drawFlame(){
        const flame = this.rocketConfig.flame;

        if(flame.length == 0) {
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
    private getX(percent: number): number{
        return Math.round(this.config.x + (percent * (this.config.scaleW | 0) /100));
    }
    private getY(percent: number): number{
        return Math.round(this.config.y + (percent * (this.config.scaleH | 0) /100));
    }
    update(){
        this.draw();
        this.drawFlame();
    }
}