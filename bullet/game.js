var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");
canvas.width = 700;
canvas.height = 700;

ctx.fillRect(0, 0, canvas.width, canvas.height);

class Player{
    constructor(circle){
        this.circle = circle;
        this.bullet = [];
        this.life = 20;
        this.remaining_life = 20;

        this.rotate = function(degree){
            this.circle.rotate = degree*180/Math.PI;
        }
    }
}

class Circle{
    constructor(x, y, r, rotate, fillStyle){
        this.x = x;
        this.y = y;
        this.r = r;
        this.rotate = rotate;
        this.fillStyle = fillStyle;
        this.path = new Path2D();

        this.draw = function(){
            ctx.save();
            this.path = new Path2D();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotate);
            ctx.translate(-this.x, -this.y);
            this.path.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
            ctx.fillStyle = this.fillStyle;
            ctx.fill(this.path);
            ctx.restore();
        }
    }
}

class Bullets {
    constructor(x, y, rotate, ys){
        this.x = x;
        this.y = y;
        this.ys = ys;
        this.rotate = rotate;
        this.bullets = [];
        this.length = 20;
        this.index = 1;

        this.rgb = 255;

        for (let i = 0; i < this.length; i++) {
            var style = "rgb(" + this.rgb + "," + this.rgb + "," + this.rgb + ")";
            var y = this.y, r = 8;
            if(this.bullets.length > 0){
                y = this.y, r = this.bullets[i-1].r /1.001;
            }
            var circle = new Circle(this.x, y, this.rotate, r, style);
            this.bullets.push(circle);
            this.rgb -= 10;
        }

        this.move = function(){
            this.bullets[0].y += this.ys;
        }

        this.draw = function(){
            for (let i = 0; i < this.index; i++) {
                const elem = this.bullets[i];
                if(i > 0){
                    const elem2 = this.bullets[i - 1];
                    elem.y = elem2.y + elem2.r * 1.5;
                }
                elem.draw();
                if(this.index < this.length - 1){
                    var lis = this.bullets;
                    var j = this.index - 1;
                    var absY = Math.abs(lis[j].y - lis[j+1].y);
                    if(absY >= lis[j].r){
                        this.index++;
                    }
                }
            }
            this.move();
        }
    }
}

const player = new Player(new Circle(canvas.width/2, canvas.height/2, 30, 0, "rgb(255, 255, 0"));

function update(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.circle.draw();
    requestAnimationFrame(update);
}

update();

window.addEventListener("mousedown", (e)=>{

});
