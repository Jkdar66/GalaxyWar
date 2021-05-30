import * as JSZip from "../../node_modules/jszip/index";
import { Flame } from "../Flame.js";

var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");
canvas.width = 40;
canvas.height = 150;
// ctx.globalAlpha = "0"
ctx.fillRect(0, 0, canvas.width, canvas.height);

var download = document.getElementById("download");

var flame = new Flame({x: 20, y: 0, canvas: canvas, ctx: ctx, scale: 1});

var zip = new JSZip();
var img = zip.folder("images");

var gif = []
for (let i = 0; i < 200; i++) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    flame.draw()

    var imgs = canvas.toDataURL("image/png");
    gif.push({img: i, src: imgs});
    img.file("flame" + i + ".gif", imgs, {base64: true});
}

for (let i = 0; i < gif.length; i++) {
    // download.href = gif[i].src;
    // download.click();
    // console.log(true);
}