var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");
canvas.width = 30;
canvas.height = 30;

function getRadianAngle(degreeValue) {
    return degreeValue * Math.PI / 180;
}

var x = canvas.width/2, y = canvas.height/2, outerR = 100, innerR = outerR*0.5;

function getP(){
    var path = new Path2D();
    path.moveTo(x, y - outerR);
    path.lineTo(x + c(innerR, innerR)/2, y - c(innerR, innerR)/2);
    path.lineTo(x + outerR, y);
    path.lineTo(x + c(innerR, innerR)/2, y + c(innerR, innerR)/2);
    path.lineTo(x, y + outerR);
    path.lineTo(x - c(innerR, innerR)/2, y + c(innerR, innerR)/2);
    path.lineTo(x - outerR, y);
    path.lineTo(x - c(innerR, innerR)/2, y - c(innerR, innerR)/2);
    path.lineTo(x, y - outerR);
    return path;
}

function c(a, b){
    var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    return c;
}

var innerPath = new Path2D();
innerPath.arc(x, y, 2.5, 0, Math.PI *2, false);

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(0, 0, 0)";
    // ctx.fillRect(0, 0, canvas.width, canvas.height); 

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.shadowColor = "rgb(255, 255, 255)";
    ctx.shadowBlur = 4;
    ctx.globalCompositeOperation = "lighter";

    for (let i = 0; i < 5; i++) {
        ctx.fill(innerPath);
    }

    ctx.restore();
    ctx.globalCompositeOperation = "lighter";
    
    outerR = 8, innerR = 2;
    ctx.shadowBlur = 10;
    ctx.fill(getP());

    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.rotate(getRadianAngle(45));
    ctx.translate(-canvas.width/2, -canvas.height/2);

    outerR = 6, innerR = 1;
    ctx.fill(getP());

    ctx.resetTransform();

    // outerR = 8, innerR = 2;
    // ctx.translate(canvas.width/2, canvas.height/2);
    // ctx.rotate(getRadianAngle(22.5));
    // ctx.translate(-canvas.width/2, -canvas.height/2);
    // ctx.fill(getP());

    // ctx.resetTransform();
    
    // outerR = 10, innerR = 3;
    // ctx.translate(canvas.width/2, canvas.height/2);
    // ctx.rotate(getRadianAngle(22.5 + 45));
    // ctx.translate(-canvas.width/2, -canvas.height/2);
    // ctx.fill(getP());

    ctx.resetTransform();

    ctx.globalCompositeOperation = "source-over";
    requestAnimationFrame(draw);
}

draw();


var line = new Path2D();
line.moveTo(0, canvas.height/2);
line.lineTo(canvas.width, canvas.height/2);
line.moveTo(canvas.width/2, 0);
line.lineTo(canvas.width/2, canvas.height);
line.moveTo(0, 0);
line.lineTo(canvas.width, canvas.height);
line.moveTo(canvas.width, 0);
line.lineTo(0, canvas.height);