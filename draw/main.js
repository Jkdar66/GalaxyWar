var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

var x = canvas.width/2;
var y = canvas.height/2;
var my = 0;
var mx = 0;
var path = new Path2D();
var msePos = {x: null, y: null};

var velX = 0;
var velY = 0;
var speed = 10;

canvas.addEventListener("click", (e)=>{
    var cvsPos = canvas.getBoundingClientRect();
    msePos = {x: e.clientX - cvsPos.x, y: e.clientY - cvsPos.y};

    var tx = msePos.x - x;
    var ty = msePos.y - y;
    var dist = Math.sqrt(tx * tx + ty * ty);

    if(dist >= speed){
        velX = (tx / dist) * speed;
        velY = (ty / dist) * speed;
    }

    player.fireBullet(velX, velY);

    radius = 10;
});

class MouseCursor {
    constructor(){
        this.fillStyle = "rgb(255, 0, 0)";
        this.strokeStyle = "rgb(255, 255, 255)";

        this.mouseCursor = new Path2D();
        this.mouseCursorPoint = new Path2D();
        this.outerRadius = 15;
        this.innerRadius = 5;

        canvas.addEventListener("mousemove", (e)=>{
            var cvsPos = canvas.getBoundingClientRect();
            let msePos = {x: e.clientX - cvsPos.x, y: e.clientY - cvsPos.y};
            this.getPath(msePos.x, msePos.y);
        });

        canvas.addEventListener("mousedown", (e)=>{
            var cvsPos = canvas.getBoundingClientRect();
            let msePos = {x: e.clientX - cvsPos.x, y: e.clientY - cvsPos.y};
            this.fillStyle = "rgb(0, 255, 0)";
            this.outerRadius = 10;
            this.innerRadius = 2.5;
            this.getPath(msePos.x, msePos.y);
        });

        canvas.addEventListener("mouseup", (e)=>{
           var cvsPos = canvas.getBoundingClientRect();
           let msePos = {x: e.clientX - cvsPos.x, y: e.clientY - cvsPos.y};
           this.outerRadius = 15;
           this.innerRadius = 5;
           this.fillStyle = "rgb(255, 0, 0)";
           this.getPath(msePos.x, msePos.y);
           this.mouseCursor = new Path2D();
           this.mouseCursorPoint = new Path2D();
        });

        canvas.addEventListener("mouseout", (e)=>{
            this.mouseCursor = new Path2D();
            this.mouseCursorPoint = new Path2D();
        });

        this.draw = function(){
            ctx.save();
            ctx.fillStyle = this.fillStyle;
            ctx.strokeStyle = this.strokeStyle;
            ctx.stroke(this.mouseCursor);
            ctx.fill(this.mouseCursorPoint);
            ctx.restore();
        }

        this.getPath = function(x, y){
            this.mouseCursor = new Path2D();
            this.mouseCursor.arc(x, y, this.outerRadius, 0, Math.PI*2, false);
            this.mouseCursor.moveTo(x - this.outerRadius, y);
            this.mouseCursor.lineTo(x + this.outerRadius, y);
            this.mouseCursor.moveTo(x, y - this.outerRadius);
            this.mouseCursor.lineTo(x, y + this.outerRadius);
            this.mouseCursorPoint = new Path2D();
            this.mouseCursorPoint.arc(x, y, this.innerRadius, 0, Math.PI*2, false);
        }
    }
}

class Player {
    constructor(){
        this.x = canvas.width/2;
        this.y = canvas.height/2;
        this.radius = 25;
        this.fillStyle = "rgb(255, 255, 0)";
        this.circle = new Circle(this.x, this.y, this.radius, this.fillStyle);
        this.bullet = [];
        this.outerRadius = 300;

        this.fireBullet = function(velX, velY){
            var blt = new Bullets(this.x, this.y, velX, velY, {r: 255, g: 0, b: 0}, speed, this);
            this.bullet.push(blt);
        }

        this.outerCircle = function(){
            ctx.save();
            ctx.strokeStyle = this.fillStyle;
            var x = this.x, y = this.y;
            ctx.beginPath();
            ctx.arc(x, y, this.outerRadius, 0, Math.PI*2, false);
            ctx.stroke();
        }

        this.draw = function(){
            this.outerCircle();
            for (let i = 0; i < this.bullet.length; i++) {
                const elem = this.bullet[i];
                elem.draw();
            }
            this.circle.draw();
        }
    }
}

class Enemy{
    constructor(x, y, velX, velY, s, radius, fillStyle){
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.speed = s;
        this.radius = radius;
        this.fillStyle = fillStyle;
        this.circle = new Circle(this.x, this.y, this.radius, this.fillStyle);
        this.bullets = [];

        this.fireBullet = function(){
            var dx = this.x - player.x;
            var dy = this.y - player.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            var minDist = this.radius + player.outerRadius;
            if(dist < minDist){
                if(this.bullets.length == 0){
                    var blt = new Bullets(this.x, this.y, this.velX, this.velY, 
                        {r: 255, g: 255, b: 100}, this.speed, this);
                    this.bullets.push(blt);
                }else {
                    var ind = this.bullets[0].bullets.length - 1;
                    var node = this.bullets[0].bullets[ind];
                    var r = node.radius;
                    if(node.x - r < 0 || node.x + r > canvas.width || node.y - r < 0 || node.y + r > canvas.height){
                        var blt = new Bullets(this.x, this.y, this.velX, this.velY, 
                            {r: 255, g: 255, b: 100}, this.speed, this);
                        this.bullets.push(blt);
                    }
                }
            }
        }

        this.move = function(){
            this.x += this.velX/5;
            this.y += this.velY/5;
        }

        this.draw = function(){
            for (let i = 0; i < this.bullets.length; i++) {
                const elem = this.bullets[i];
                elem.draw();
            }
            this.circle.x = this.x;
            this.circle.y = this.y;
            this.circle.draw();
            this.move();
            this.fireBullet();
        }
    }
}

class Enemies{
    constructor(){
        this.enemies = [];

        this.init = function(){
            for (let i = 0; i < 10; i++) {
                var cvs = canvas.getBoundingClientRect();

                var xPos = [
                    this.random(-(cvs.width/2), 0),
                    this.random(cvs.width, cvs.width + cvs.width/2)
                ];
                var yPos = [
                    this.random(-(cvs.height/2), 0),
                    this.random(cvs.height, cvs.height + cvs.height/2)
                ];
                
                var x = xPos[this.random(0, 1)];
                var y = yPos[this.random(0, 1)];

                var speed = 10, velX = 0, velY = 0;

                var dx = player.x - x;
                var dy = player.y - y;
                var dist = Math.sqrt(dx * dx + dy * dy);
            
                if(dist >= speed){
                    velX = (dx / dist) * speed;
                    velY = (dy / dist) * speed;
                }

                var radius = this.random(20, 40);

                var enemy = new Enemy(x, y, velX, velY, speed, radius, "rgb(200, 200, 20)");

                if(this.enemies.length == 0){
                    this.enemies.push(enemy);
                }else{
                    var node = {x: x, y: y, radius: radius};
                    while(this.isInArea(node)){
                        xPos = [
                            this.random(-(cvs.width/2), 0),
                            this.random(cvs.width, cvs.width + cvs.width/2)
                        ];
                        yPos = [
                            this.random(-(cvs.height/2), 0),
                            this.random(cvs.height, cvs.height + cvs.height/2)
                        ];
                        
                        x = xPos[this.random(0, 1)];
                        y = yPos[this.random(0, 1)];
        
                        speed = 10, velX = 0, velY = 0;

                        dx = x - player.x;
                        dy = y - player.y;
                        dist = Math.sqrt(dx * dx + dy * dy);
                    
                        if(dist >= speed){
                            velX = (dx / dist) * speed;
                            velY = (dy / dist) * speed;
                        }
        
                        radius = this.random(20, 40);
                        enemy = new Enemy(x, y, velX, velY, speed, radius, "rgb(200, 200, 20)");
                        node = {x: x, y: y, radius: radius};
                    }
                    this.enemies.push(enemy);
                }
            }
        }

        this.isInArea = function(node){
            for (let i = 0; i < this.enemies.length; i++) {
                const enemy = this.enemies[i];
                var dx = node.x - enemy.x;
                var dy = node.y - enemy.y;
                var dist = Math.sqrt(dx * dx + dy * dy);

                var absRadius = node.radius + enemy.radius;
                if(dist < absRadius) {
                    return true;
                }
            }
            return false;
        }

        this.random = function(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        this.init();
        this.draw = function(){
            for (let i = 0; i < this.enemies.length; i++) {
                const elem = this.enemies[i];
                elem.draw();
            }
        }
    }
}

class Bullets {
    constructor(x, y, velX, velY, rgb, speed, parent){
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.bullets = [];
        this.length = 20;
        this.index = 1;
        this.speed = speed;
        this.parent = parent;

        this.rgb = rgb;
        this.r = this.rgb.r;
        this.g = this.rgb.g;
        this.b = this.rgb.b;

        for (let i = 0; i < this.length; i++) {
            var radius = 8;
            var color = "rgb("+this.r+","+this.g+","+this.b+")";
            
            if(i > 0){
                radius = this.bullets[i-1].r / 1.005;
            }
            var circ = new Circle(this.x, this.y, radius, color);
            this.bullets.push(circ);

            this.r -= (this.rgb.r/25);
            this.g -= (this.rgb.g/25);
            this.b -= (this.rgb.b/25);
        }

        this.move = function(){
            if(this.velX != 0 || this.velY != 0){
                this.bullets[0].x += this.velX;
                this.bullets[0].y += this.velY;
                for (let i = 1; i < this.index; i++) {
                    const elem1 = this.bullets[i];
                    const elem2 = this.bullets[i-1];
                    elem1.x = elem2.x - (this.velX *(elem2.r*1.3/this.speed));
                    elem1.y = elem2.y - (this.velY *(elem2.r*1.3/this.speed));
                }
                if(this.index < this.length){
                    const node = this.bullets[this.index-1];

                    var dx = node.x - this.parent.x;
                    var dy = node.y - this.parent.y;
                    var dist = Math.sqrt(dx * dx + dy * dy);

                    if(dist > this.parent.radius){
                        this.index++;
                    }
                }
            }
        }

        this.draw = function(){
            for (let i = 0; i < this.index; i++) {
                const elem = this.bullets[i];
                elem.draw();
            }
            this.move();
        }
    }
}

class Circle{
    constructor(x, y, r, fillStyle){
        this.x = x;
        this.y = y;
        this.r = r;
        this.fillStyle = fillStyle;
        this.path = new Path2D();

        this.draw = function(){
            ctx.save();
            this.path = new Path2D();
            this.path.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
            ctx.fillStyle = this.fillStyle;
            ctx.fill(this.path);
            ctx.restore();
        }
    }
}

var player = new Player();
var enemies = new Enemies();
var cursor = new MouseCursor();

function update(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    enemies.draw();
    player.draw();
    cursor.draw();

    requestAnimationFrame(update);
}

update();