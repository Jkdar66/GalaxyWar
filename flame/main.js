import { Flame } from "../Flame.js";
var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");
canvas.width = 40;
canvas.height = 150;
ctx.fillRect(0, 0, canvas.width, canvas.height);
var download = document.getElementById("download");

var flame = new Flame({ x: 20, y: 0, canvas: canvas, ctx: ctx, scale: 1 });

var zip = new JSZip();

var img = zip.folder("images");

for (let i = 0; i < 200; i++) {
    flame.draw();
}

// var gif = [];
for (let i = 0; i < 300; i++) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    flame.draw();
    // gif.push({ img: i, src: imgs });
    var imgs = canvas.toDataURL("image/png");
    img.file("flame_" + i + ".png", imgs.substr(imgs.indexOf(',')+1), { base64: true });
}

zip.generateAsync({type:"blob"})
.then(function(content) {
    // Force down of the Zip file
    saveAs(content, "archive.zip");
});