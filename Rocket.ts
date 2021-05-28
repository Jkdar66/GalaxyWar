import { BulletImage } from "./Bullet.js";
import { BULLET_TYPE, Config, RocketConfig } from "./Config.js";
import { Flame } from "./Flame.js";
import { NodeJS } from "./Node.js";


export class Rocket extends NodeJS {
    img: HTMLImageElement;
    rocketConfig: RocketConfig;
    private moveByKey: Function;
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
            this.config.y -= (this.config.h *this.config.scale) + (this.config.h /2);
            this.draw();
        }
        this.img.src = this.config.imgSrc;
        this.drag(() => {});

        const _this = this;
        _this.config.canvas.addEventListener("keydown", (e)=>{
            console.log(true);
            e.preventDefault();
            const value = {x: _this.config.x, y: _this.config.y};
            switch(e.code){
                case "ArrowRight":
                    console.log(true);
                    
                    _this.move({x: value.x, y: value.y}, {x: value.x + 1, y: value.y});
                    break;
                case "ArrowLeft":
                    _this.move({x: value.x, y: value.y}, {x: value.x - 1, y: value.y});
                    break;
            }
        });
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
    
    pushFlame(){
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