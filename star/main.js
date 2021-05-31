import { Star } from "../Bacground.js";

var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");
canvas.width = 100;
canvas.height = 100;
ctx.fillRect(0, 0, canvas.width, canvas.height);


var star = new Star({
    minX: 49, maxX: 0,
    minY: 20, maxY: 10,
    minSize: 20, maxSize: 10
});

var zip = new JSZip();

var img = zip.folder("images");

function draw() {
    ctx.save();
    ctx.shadowBlur = 15;
    ctx.shadowColor = "rgb(255, 255, 255)";
    ctx.fillStyle = "white";
    ctx.fill(star.getPath());
    ctx.fill(star.getPath());
    ctx.fill(star.getPath());
    ctx.shadowBlur = 5;
    // ctx.shadowColor = "rgb(255, 180, 0)";
    // ctx.globalCompositeOperation = "lighter";
    // ctx.fill(star.getPath());
    // ctx.fill(star.getPath());
    // ctx.fill(star.getPath());
    // ctx.globalCompositeOperation = "source-over";
    // ctx.fill(star.getPath());
    // // ctx.fill(star.getPath());
    // // ctx.fill(star.getPath());
    ctx.restore();
}

draw();

// // var gif = [];
// for (let i = 0; i < 300; i++) {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     flame.draw();
//     // gif.push({ img: i, src: imgs });
//     var imgs = canvas.toDataURL("image/png");
//     img.file("flame_" + i + ".png", imgs.substr(imgs.indexOf(',')+1), { base64: true });
// }

// zip.generateAsync({type:"blob"})
// .then(function(content) {
//     // Force down of the Zip file
//     saveAs(content, "archive.zip");
// });