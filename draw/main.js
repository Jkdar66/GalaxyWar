var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");
canvas.width = 700;
canvas.height = 700;

ctx.fillRect(0, 0, canvas.width, canvas.height);

var x1 = canvas.width/2;
var y1 = canvas.height/2;

canvas.addEventListener("click", (e)=>{
    var cvsPos = canvas.getBoundingClientRect();
    var msePos = {x: e.clientX - cvsPos.x, y: e.clientY - cvsPos.y};
    var x1 = canvas.width/2;
    var y1 = canvas.height/2;
    var path = new Path2D();
    path.moveTo(x1, y1);

    var m = (y1 - msePos.y) / (x1 - msePos.x);
    var xs = -1;
    if(x1 - msePos.x < 0){
        xs = 1;
        m = -m;
    }

    for (let i = 0; i < 300; i++) {
        x1+=xs;
        y1-=m;
    }
    path.lineTo(x1, y1);
    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.stroke(path);

});
