var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

var collied = null;

class Circle {
    constructor(x, y, radius, color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    draw() {
        var path = new Path2D();
        path.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fill(path);
        ctx.restore();
    }
}
class Rect {
    constructor(config){
        this.config = config;
    }
    draw() {
        var path = new Path2D();
        path.rect(this.config.x, this.config.y, this.config.w, this.config.h);
        ctx.save();
        ctx.fillStyle = this.config.color;
        ctx.fill(path);
        ctx.restore();
    }
}

class Player{
    constructor(x, y, radius, color, enemies){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.enemies = enemies;
        this.circle = new Circle(this.x, this.y, this.radius, this.color);
        this.bullets = [];
        this.life = 100;
        this.oldLife = this.life;
        this.barConfig = {
            x: canvas.width-25, y: canvas.height/4*3, 
            w: 25, h: -canvas.height/2*this.life/100,
            color: "rgb(0,255,0)",
            r: 0,
            g: 255
        };
        this.loadBar = new Rect(this.barConfig);

        window.addEventListener("click", (e)=>{
            const angle = Math.atan2(e.clientY - this.y, e.clientX - this.x);
            const velocity = {
                x: Math.cos(angle) * 10,
                y: Math.sin(angle) * 10
            }
            this.bullets.push(new Bullet(this.x, this.y, velocity, 8, "rgb(255, 255, 0)"));
        });
    }
    bulletsColliedEnemies(bullet, i) {
        for (let j = 0; j < this.enemies.length; j++) {
            const enemy = this.enemies[j];
            const dx = bullet.x - enemy.x;
            const dy = bullet.y - enemy.y;
            const dist = Math.sqrt(dx*dx + dy*dy) - (bullet.radius + enemy.radius);
            if(dist <= 0) {
                if(enemy.radius <= 20){
                    this.enemies.splice(j, 1);
                }else {
                    enemy.radius -= 5;
                }
                this.bullets.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    getLoadBarColor() {
        this.barConfig.r += 2;
        this.barConfig.g -= 2;
        return "rgb(" + this.barConfig.r + "," + this.barConfig.g + ","  + "0)";
    }
    updateLoadBar() {
        if(this.oldLife != this.life) {
            this.barConfig.h = -canvas.height/2*this.life/100;
            this.barConfig.color = this.getLoadBarColor();
            this.loadBar = new Rect(this.barConfig);
            this.oldLife = this.life;
        }
    }
    draw() {
        this.circle.draw();
        this.loadBar.draw();
    }
    update() {
        this.updateLoadBar();
        for (let i = 0; i < this.bullets.length; i++) {
            const bullet = this.bullets[i];
            bullet.update();
            this.bulletsColliedEnemies(bullet, i);
        }
        this.draw();
    }
}

class Bullet{
    constructor(x, y, velocity, radius, color){
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
        this.circle = new Circle(this.x, this.y, this.radius, this.color);
    }
    draw() {
        this.circle = new Circle(this.x, this.y, this.radius, this.color);
        this.circle.draw();
    }
    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

class Enemy{
    constructor(x, y, velocity, radius, color, player){
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
        this.life = 100;
        this.player = player;
        this.circle = new Circle(this.x, this.y, this.radius, this.color);
        this.bullets = [];
        
        this.fireBullet = setInterval(()=>{
            var vel = {x: this.velocity.x * 5, y: this.velocity.y * 5};
            this.bullets.push(new Bullet(this.x, this.y, vel, 5, this.color));
        }, 3000);
    }
    draw() {
        this.circle = new Circle(this.x, this.y, this.radius, this.color);
        this.circle.draw();
    }
    colliedPlayer() {
        const dx = this.x - this.player.x;
        const dy = this.y - this.player.y;
        const dist = Math.sqrt(dx*dx + dy*dy) - (this.radius + this.player.radius);
        if(dist <= 0) {
            return true;
        }
        return false;
    }
    bulletsColliedPlayer() {
        for (let i = 0; i < this.bullets.length; i++) {
            const bullet = this.bullets[i];
            const dx = bullet.x - this.player.x;
            const dy = bullet.y - this.player.y;
            const dist = Math.sqrt(dx*dx + dy*dy) - (bullet.radius + this.player.radius);
            if(dist <= 0) {
                this.bullets.splice(i, 1);
                return true;
            }   
        }
        return false;
    }
    update() {
        this.draw();
        this.bullets.forEach(bullet => {
            bullet.update();
        });
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        if(this.colliedPlayer()) {
            window.cancelAnimationFrame(collied);
        }
        if(this.bulletsColliedPlayer()) {
            player.life--;
        }
    }
}

class Enemies {
    constructor() {
        this.enemies = [];
        this.enemiesInter = null;
        this.box = {
            x: 0,
            y: 0,
            w: canvas.width,
            h: canvas.height,
            edge: -40,
        }
        this.createEnemies();
    }
    getRandomPointsForBox(box, min, max) {
        min += box.edge;
        max += box.edge;
        return this.randomPointNearRect(box.x, box.y, box.w, box.h, min, max);
    }
    randomPointNearRect(x, y, w, h, minDist, maxDist) {
        const dist = (Math.random() * (maxDist - minDist) + minDist) | 0;
        x += dist;
        y += dist;
        w -= dist * 2;
        h -= dist * 2;
        if (Math.random() <  w / (w + h)) {
          x = Math.random() * w + x;
          y = Math.random() < 0.5 ? y : y + h - 1;
        } else {
          y = Math.random() * h + y;
          x = Math.random() < 0.5 ? x: x + w - 1;
        }
        return [x | 0, y | 0];
    }
    createEnemies() {
        this.enemiesInter = setInterval(()=> {
            var pos = this.getRandomPointsForBox(this.box, 4, 18);
            const x = pos[0];
            const y = pos[1];
            const angle = Math.atan2(canvas.height/2 - y, canvas.width/2 - x);
            const velocity = {
                x: Math.cos(angle),
                y: Math.sin(angle)
            }
            const radius = Math.random() * (40 - 10) + 10;
            const rgb = {
                r: Math.round(Math.random() * 155 + 100),
                g: Math.round(Math.random() * 155 + 100),
                b: Math.round(Math.random() * 155 + 100)
            }
            var color = "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
            const enemy = new Enemy(x, y, velocity, radius, color, player);
            this.enemies.push(enemy);
        }, 1500);
    }
    update() {
        this.enemies.forEach(enemy => {
            enemy.update();
        });
    }
}

const enemies = new Enemies();
const player = new Player(canvas.width/2, canvas.height/2, 50, "rgb(255, 255, 0)", enemies.enemies);

function animation() {
    collied = requestAnimationFrame(animation);
    if(canvas.width != innerWidth){
        canvas.width = innerWidth;
    }
    if(canvas.height != innerHeight){
        canvas.height = innerHeight;
    }
    ctx.fillStyle = "rgba(0, 0, 0, 0.1";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    enemies.update();
    player.update();
}

animation();