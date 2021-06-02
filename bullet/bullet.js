var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");
canvas.width = 700;
canvas.height = 700;

ctx.fillRect(0, 0, canvas.width, canvas.height);


class Circle{
    constructor(x, y, r, fillStyle){
        this.x = x;
        this.y = y;
        this.r = r;
        this.path = new Path2D();
        this.path.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
        this.path.moveTo(this.x, this.y-this.r);
        this.path.lineTo(this.x, this.y+this.r);
        this.fillStyle = fillStyle;

        this.draw = function(){
            this.path = new Path2D();
            ctx.translate(canvas.width/2, canvas.height/2);
            ctx.rotate(degree * Math.PI / 180);
            ctx.translate(-canvas.width/2, -canvas.height/2);
            var x = this.x - canvas.width/2;
            var y = this.y - canvas.height/2;
            this.path.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
            ctx.fillStyle = this.fillStyle;
            ctx.fill(this.path);
            ctx.resetTransform();
        }
    }
}

class Sprite{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.ys = 0.5;
        this.particulars = [];
        this.length = 20;
        this.index = 1;

        this.rgb = 255;

        for (let i = 0; i < this.length; i++) {
            var style = "rgb(" + this.rgb + "," + this.rgb + "," + this.rgb + ")";
            if(this.particulars.length == 0){
                var y = this.y, r = 8;
                var circle = new Circle(this.x, y, r, style);
                this.particulars.push(circle);
            } else{
                var y = this.y, r = this.particulars[i-1].r /1.001;
                var circle = new Circle(this.x, y, r, style);
                this.particulars.push(circle);
            }
            this.rgb -= 10;
        }

        this.move = function(){
            this.particulars[0].y -= this.ys;
        }

        this.draw = function(){
            for (let i = 0; i < this.index; i++) {
                const elem = this.particulars[i];
                if(i > 0){
                    const elem2 = this.particulars[i - 1];
                    elem.y = elem2.y + elem2.r * 1.5;
                }
                elem.draw();
                if(this.index < this.length - 1){
                    var lis = this.particulars;
                    var j = this.index - 1;
                    var absY = Math.abs(lis[j].y - lis[j+1].y);
                    if(absY >= lis[j].r){
                        this.index++;
                    }
                }
            }
            // this.move(); 
        }
    }
}

var sprite = new Sprite(canvas.width/2, canvas.height/2);


var beta = 0;
var outX = null, outY = null;
var outerRadius = 0;
canvas.addEventListener("mousemove", (e)=>{
    var cvsPos = canvas.getBoundingClientRect();
    var msePos = {x: e.clientX - cvsPos.x, y: e.clientY - cvsPos.y};

    var a = Math.abs(msePos.y - sprite.y);
    var b = Math.abs(msePos.x - sprite.x);
    var c = getC(a, b);

    outerRadius = c;
    // outX = msePos.x;
    // outY = msePos.y;

    degree = degreeValue({x: sprite.x, y: sprite.y}, msePos);
    if(msePos.x <= sprite.x){
        degree = -degree;
    }
});

function getC(a, b){
    var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    return c;
}

function getBeta(a, b, c){
    var pow = Math.pow;
    var result = (pow(b, 2) + pow(a, 2) + pow(c, 2)) /(2 *a * c);
    console.log(result);
    return Math.acos(result);
}

function getAlpha(a, b, c){
    var pow = Math.pow;
    var result = (pow(b, 2) + pow(c, 2) - pow(a, 2)) /(2 *b * c);
    return Math.acos(result);
}

var degree = 0;
function update(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    sprite.draw();
    var circle = new Circle(sprite.x, sprite.y, outerRadius);
    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.stroke(circle.path);
    ctx.resetTransform();
    // if(outX != null){
    //     var path = new Path2D();

    //     path.moveTo(outX, outY);
    //     path.lineTo(sprite.x, sprite.y - outerRadius);
    //     path.moveTo(sprite.x, sprite.y);
    //     path.lineTo(sprite.x, sprite.y - outerRadius);

    //     path.moveTo(outX, outY);
    //     path.lineTo(sprite.x, sprite.y);

    //     path.moveTo(sprite.x, sprite.y);
    //     var dx = (sprite.x - outX) /2;
    //     var dy = (outY - (sprite.y - outerRadius)) /2;

    //     path.lineTo(outX + dx, outY - dy);

    //     path.moveTo(outX + dx, outY - dy);
    //     path.lineTo(sprite.x, outY - dy);

    //     // var a = Math.abs(sprite.x - (outX + dx)) ;
    //     // var b = Math.abs(sprite.y - (outY - dy));
    //     // var c = getC(a, b);
    //     // degree = Math.round(Math.asin(a/c)*180/Math.PI) *2;
        
    //     // if(outX <= sprite.x){
    //     //     // console.log(degree);
    //     //     degree = -degree;
    //     // }

    //     ctx.stroke(path);
    // }
    requestAnimationFrame(update);
}

update();

function degreeValue(nodePos, msePos){
    var a = Math.abs(msePos.y - nodePos.y);
    var b = Math.abs(msePos.x - nodePos.x);
    var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

    var dx = (nodePos.x - msePos.x) /2;
    var dy = (msePos.y - (nodePos.y - c)) /2;

    var a2 = Math.abs(nodePos.x - (msePos.x + dx)) ;
    var b2 = Math.abs(nodePos.y - (msePos.y - dy));
    var c2 = getC(a2, b2);
    var degree = Math.round(Math.asin(a2/c2)*180/Math.PI) *2;
    return degree;
}
