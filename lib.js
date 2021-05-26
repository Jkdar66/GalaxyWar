class Node {
    constructor(config) {
        this.config = config;
        const _this = this;
        this.drag = function (callback) {
            let isDown = false;
            let oldValue = { x: null, y: null };
            _this.addMouseEvent("mousedown", (e) => {
                isDown = true;
                var bounds = _this.config.canvas.getBoundingClientRect();
                oldValue.x = e.clientX - bounds.x;
                oldValue.y = e.clientY - bounds.y;
            });
            _this.addTouchEvent("touchstart", (e) => {
                isDown = true;
                var bounds = _this.config.canvas.getBoundingClientRect();
                var touch = e.touches.item(e.touches.length - 1);
                oldValue.x = touch.clientX - bounds.x;
                oldValue.y = touch.clientY - bounds.y;
            });
            window.addEventListener("mouseup", (e) => {
                _this.config.moving = false;
                isDown = false;
            });
            window.addEventListener("touchend", (e) => {
                _this.config.moving = false;
                isDown = false;
            });
            _this.addMouseEvent("mousemove", (e) => {
                if (isDown) {
                    move({ x: e.clientX, y: e.clientY });
                    callback(e);
                }
            });
            _this.addTouchEvent("touchmove", (e) => {
                if (isDown) {
                    var touch = e.touches.item(e.touches.length - 1);
                    move({ x: touch.clientX, y: touch.clientY });
                    callback(e);
                }
            });
            function move(e) {
                _this.config.moving = true;
                var bounds = _this.config.canvas.getBoundingClientRect();
                let newValue = {
                    x: e.x - bounds.x,
                    y: e.y - bounds.y
                };
                _this.config.x += (newValue.x - oldValue.x);
                _this.config.y += (newValue.y - oldValue.y);
                // _this.config.x = newValue.x - (_this.config.scaleW/2);
                // _this.config.y = newValue.y - (_this.config.scaleH/2);
                oldValue = newValue;
            }
            return isDown;
        };
    }
    draw() { }
    update() {
        this.draw();
    }
    middelX() {
        return this.config.x + (this.config.scaleW / 2);
    }
    middelY() {
        return this.config.y + (this.config.scaleH / 2);
    }
    isPointInPath(e) {
        const bounds = this.config.canvas.getBoundingClientRect();
        const xEvent = e.x - bounds.x, yEvent = e.y - bounds.y;
        const rect = this.config;
        const path = { x1: rect.x, y1: rect.y, x2: rect.x + rect.scaleW, y2: rect.y + rect.scaleH };
        if (xEvent >= path.x1 && xEvent <= path.x2 && yEvent >= path.y1 && yEvent <= path.y2) {
            return true;
        }
        return false;
    }
    handelMouseEvent(type, callback) {
        this.config.canvas.addEventListener(type, (e) => {
            if (this.isPointInPath({ x: e.clientX, y: e.clientY })) {
                callback(e);
            }
        });
    }
    handelTouchEvent(type, callback) {
        this.config.canvas.addEventListener(type, (e) => {
            var event = e.touches.item(e.touches.length - 1);
            if (this.isPointInPath({ x: event.clientX, y: event.clientY })) {
                callback(e);
            }
        });
    }
    addMouseEvent(type, callback) {
        this.handelMouseEvent(type, callback);
    }
    addTouchEvent(type, callback) {
        this.handelTouchEvent(type, callback);
    }
}
export class Rocket extends Node {
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
            this.config.y -= (this.config.h * this.config.scale) + (this.config.h / 2);
            this.draw();
        };
        this.img.src = this.config.imgSrc;
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
export class Flame extends Node {
    constructor(config) {
        super(config);
        this.particle = [];
        this.drag = function () { };
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
export class BulletImage extends Node {
    constructor(config) {
        super(config);
        this.drag = function () { };
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
export class Bullet extends Node {
    constructor(config) {
        super(config);
        this.drag = function () { };
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
export const BULLET_TYPE = {
    // BLUE: "images\\LaserBullet\\LaserBlue.png",
    // GREEN: "images\\LaserBullet\\LaserGreen.png",
    // PURPLE: "images\\LaserBullet\\LaserPurple.png",
    RED: "images\\laser\\red.png"
    // SKYBLUE: "images\\LaserBullet\\LaserSkyBlue.png",
    // YELLOW: "images\\LaserBullet\\LaserYellow.png"
};
export class Asteroid extends Node {
    constructor(config, ctxConfig, astConfig) {
        super(config);
        this.ctxConfig = ctxConfig;
        this.asteroidConfig = astConfig;
        this.createSprite();
    }
    createSprite() {
        var path = this.getPath();
        for (let i = 0; i < 16; i++) {
            var absPath = path;
            if (i < 10)
                absPath += "0" + i + ".png";
            else
                absPath += i + ".png";
            var img = new Image();
            this.asteroidConfig.path.push(absPath);
            this.asteroidConfig.sprite.push(img);
            img.onload = function (e) {
            };
            img.src = absPath;
        }
        for (let i = 0; i < 16; i++) {
            var img = this.asteroidConfig.sprite[i];
            var path = this.asteroidConfig.path[i];
            const self = this;
            img.onload = function () {
                self.config.w = img.width;
                self.config.h = img.height;
                // self.config.ctx.drawImage(img, self.config.x, self.config.y);
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
                var x = cfg.x + this.ctxConfig.x;
                var y = cfg.y + this.ctxConfig.y;
                var img = self.sprite[self.spriteIndex];
                this.config.ctx.drawImage(img, x, y, cfg.scaleW, cfg.scaleH);
                this.config.ctx.strokeStyle = "red";
                // this.config.ctx.strokeRect(x, y, cfg.scaleW, cfg.scaleH);
                this.config.ctx.fillStyle = "rgb(0,255,0)";
                // this.config.ctx.fillRect(x, 
                //     y + cfg.scaleH - (cfg.scaleH/10), 
                //     cfg.scaleW/100* self.remaining_life, 
                //     cfg.scaleH/10
                // );
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
const AsteroidSize = [
    {
        key: "small",
        type: ["a", "b"],
        number: [
            [100, 300, 400],
            [100, 300, 400]
        ],
        imgWidth: 64,
        imgHeight: 64
    },
    {
        key: "medium",
        type: ["a", "b", "c", "d"],
        number: [
            [100, 300, 400],
            [400],
            [100, 300, 400],
            [100, 300, 400]
        ],
        imgWidth: 120,
        imgHeight: 120
    },
    {
        key: "large",
        type: ["a", "b", "c"],
        number: [
            [100, 300],
            [100, 300],
            [100, 300, 400]
        ],
        imgWidth: 320,
        imgHeight: 240
    }
];
export const CREATE_ASTEROIDS = function (cfg) {
    for (let i = cfg.start; i < cfg.end; i++) {
        var ast = new Asteroid({ x: 0, y: 0, ctx: cfg.ctx, canvas: cfg.canvas, scale: cfg.scale }, cfg.ctxConfig, { path: [], sprite: new Array(), spriteIndex: 0, loop: 5,
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
                ast = new Asteroid({ x: 0, y: 0, ctx: cfg.ctx, canvas: cfg.canvas, scale: cfg.scale }, cfg.ctxConfig, { path: [], sprite: new Array(), spriteIndex: 0, loop: 5,
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
        cfg.list.forEach(elem => {
            elem.config.scale = cfg.scale;
            elem.update();
        });
    };
    return cfg;
};
