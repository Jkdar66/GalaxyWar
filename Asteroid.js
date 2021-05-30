import { AsteroidSize } from "./Config.js";
import { NodeJS } from "./Node.js";
export class Asteroid extends NodeJS {
    constructor(config, astConfig) {
        super(config);
        this.asteroidConfig = astConfig;
        this.createSprite();
    }
    createSprite() {
        var path = this.getPath();
        for (let i = 0; i < 16; i++) {
            var absPath = path;
            if (i < 10) {
                absPath += "0" + i + ".png";
            }
            else {
                absPath += i + ".png";
            }
            var img = new Image();
            this.asteroidConfig.path.push(absPath);
            this.asteroidConfig.sprite.push(img);
            img.onload = function (e) { };
            img.src = absPath;
        }
        for (let i = 0; i < 16; i++) {
            var img = this.asteroidConfig.sprite[i];
            var path = this.asteroidConfig.path[i];
            const self = this;
            img.onload = function () {
                self.config.w = img.width;
                self.config.h = img.height;
            };
            img.src = path;
        }
    }
    getPath() {
        var index = Math.round(Math.random() * 2);
        this.asteroidConfig.imgWidth = AsteroidSize[index].imgWidth;
        this.asteroidConfig.imgHeight = AsteroidSize[index].imgHeight;
        var key = AsteroidSize[index].key;
        this.asteroidConfig.size = key;
        var typeLen = AsteroidSize[index].type.length - 1;
        var typeInd = Math.round(Math.random() * typeLen);
        var type = AsteroidSize[index].type[typeInd];
        var numLen = AsteroidSize[index].number[typeInd].length - 1;
        var numInd = Math.round(Math.random() * numLen);
        var number = AsteroidSize[index].number[typeInd][numInd];
        return "images\\asteroid\\" + key + "\\" + type + number;
    }
    draw() {
        const self = this.asteroidConfig;
        var i = self.spriteIndex;
        if (self.remaining_life > 0) {
            if (self.sprite[i] != null) {
                const cfg = this.config;
                let scale = cfg.scale;
                cfg.scaleW = cfg.w * scale;
                cfg.scaleH = cfg.h * scale;
                var img = self.sprite[self.spriteIndex];
                this.config.ctx.drawImage(img, cfg.x, cfg.y, cfg.scaleW, cfg.scaleH);
                this.config.ctx.strokeStyle = "red";
                this.config.ctx.fillStyle = "rgb(0,255,0)";
                var loadBounds = { x: cfg.x + cfg.scaleW / 4,
                    y: cfg.y + (cfg.scaleH - (cfg.scaleH / 10)),
                    w: cfg.scaleW / 2,
                    h: cfg.scaleH / 10
                };
                cfg.ctx.fillRect(loadBounds.x, loadBounds.y, loadBounds.w, loadBounds.h);
                cfg.y++;
            }
            if (self.remaining_loop == 0) {
                self.spriteIndex++;
                self.remaining_loop = self.loop;
                if (self.spriteIndex > 15) {
                    self.spriteIndex = 0;
                }
            }
            self.remaining_loop--;
        }
    }
}
export const CREATE_ASTEROIDS = function (cfg) {
    for (let i = cfg.start; i < cfg.end; i++) {
        var ast = new Asteroid({ x: 0, y: 0, ctx: cfg.ctx, canvas: cfg.canvas, scale: cfg.scale }, { path: [], sprite: new Array(), spriteIndex: 0, loop: 5,
            remaining_loop: 5, life: 100, remaining_life: 100 });
        var x = Math.round(cfg.minX + Math.random() * cfg.maxX);
        var y = Math.round(cfg.minY + Math.random() * cfg.maxY);
        var w = ast.asteroidConfig.imgWidth * cfg.scale;
        var h = ast.asteroidConfig.imgHeight * cfg.scale;
        if (cfg.list.length == 0) {
            ast.config.x = x;
            ast.config.y = y;
            cfg.list.push(ast);
        }
        else {
            var node = { x1: x, y1: y, x2: x + w, y2: y + h };
            while (isInArea(node)) {
                ast = new Asteroid({ x: 0, y: 0, ctx: cfg.ctx, canvas: cfg.canvas, scale: cfg.scale }, { path: [], sprite: new Array(), spriteIndex: 0, loop: 5,
                    remaining_loop: 5, life: 100, remaining_life: 100 });
                x = Math.round(cfg.minX + Math.random() * cfg.maxX);
                y = Math.round(cfg.minY + Math.random() * cfg.maxY);
                w = ast.asteroidConfig.imgWidth * cfg.scale;
                h = ast.asteroidConfig.imgHeight * cfg.scale;
                node = { x1: x, y1: y, x2: x + w, y2: y + h };
            }
            ast.config.x = x;
            ast.config.y = y;
            cfg.list.push(ast);
        }
    }
    function isInArea(node) {
        for (let j = 0; j < cfg.list.length; j++) {
            const elem = cfg.list[j];
            var x = elem.config.x;
            var y = elem.config.y;
            var w = elem.asteroidConfig.imgWidth * cfg.scale;
            var h = elem.asteroidConfig.imgHeight * cfg.scale;
            var node2 = { x1: x, y1: y, x2: x + w, y2: y + h };
            if (node2.x2 >= node.x1 && node2.x1 <= node.x2 &&
                node2.y2 >= node.y1 && node2.y1 <= node.y2) {
                return true;
            }
            if (node.x2 >= node2.x1 && node.x1 <= node2.x2 &&
                node.y2 >= node2.y1 && node.y1 <= node2.y2) {
                return true;
            }
        }
        return false;
    }
    cfg.update = function () {
        for (let i = 0; i < cfg.list.length; i++) {
            const elem = cfg.list[i];
            elem.config.scale = cfg.scale;
            elem.update();
            if (elem.config.y > elem.config.canvas.height) {
                cfg.list.splice(i, 1);
                i--;
            }
        }
    };
    return cfg;
};
