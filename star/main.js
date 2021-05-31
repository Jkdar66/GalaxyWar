import { Star } from "../Bacground.js";

var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");
canvas.width = 40;
canvas.height = 150;
ctx.fillRect(0, 0, canvas.width, canvas.height);

var star = new Star({
    minX: 15, maxX: 10,
    minY: 5, maxY: 10,
    minSize: 20, maxSize: 20
});

var zip = new JSZip();

var img = zip.folder("images");

function draw() {
    ctx.save();
    ctx.shadowBlur = 20;
    ctx.shadowColor = "white";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
    ctx.fill(star.getPath());
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