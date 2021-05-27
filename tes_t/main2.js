import { Bullet } from "../lib.js";

var canvas =document.createElement("canvas");
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");

var blt = new Bullet({
    x: 100, 
    y: 100, 
    w: 5,
    h: 40,
    canvas: canvas, 
    ctx: ctx, 
    scale: 1,
    fill: "rgb(255, 40, 40)"
});

function update(){
    requestAnimationFrame(update);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.globalCompositeOperation = "copy";
    blt.draw();
}
update();