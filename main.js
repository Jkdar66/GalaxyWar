import { GAME } from "./Game.js";
const scaleWidth = 2560, scaleHeight = 1297;
var config = {
    canvas: { x: 0, y: 0, w: window.innerWidth, h: window.innerHeight },
    speed: 25
};
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const scale = getScale();
document.body.appendChild(canvas);
canvas.width = config.canvas.w;
canvas.height = config.canvas.h;
ctx.save();
var background = new GAME.Background({
    x: 0,
    y: 0,
    w: canvas.width,
    h: canvas.height,
    canvas: canvas,
    ctx: ctx,
    scale: scale,
    imgSrc: "images\\star\\starFav2.png"
}, 300 * scale);
var player = new GAME.Rocket({
    x: canvas.width / 2,
    y: canvas.height,
    ctx: ctx,
    canvas: canvas,
    scale: scale,
    imgSrc: "images\\rocket\\gigant.png"
}, {
    bulletData: [
        { x: 6.45, y: 21.33 },
        { x: 93.55, y: 21.33 },
        { x: 26.18, y: 14.34 },
        { x: 73.82, y: 14.34 },
        { x: 41.32, y: 7 },
        { x: 58.68, y: 7 }
    ],
    flameData: [
        { x: 6.45, y: 77.62 },
        { x: 93.55, y: 77.62 }
    ]
});
var asteroids = GAME.CREATE_ASTEROIDS({
    list: [],
    canvas: canvas,
    ctx: ctx,
    scale: scale,
    minX: 0, maxX: canvas.width, minY: -canvas.height, maxY: canvas.height / 3,
    start: 0, end: 30
});
function responsive() {
    config.canvas = { x: 0, y: 0, w: window.innerWidth, h: window.innerHeight };
    canvas.width = config.canvas.w;
    canvas.height = config.canvas.h;
}
function init() {
    responsive();
    ctx.restore();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "source-over";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    asteroids.scale = scale;
    asteroids.update();
    player.config.scale = scale;
    player.update();
}
function update() {
    requestAnimationFrame(update);
    init();
    for (let i = 0; i < player.rocketConfig.bullet.length; i++) {
        const elem = player.rocketConfig.bullet[i];
        if (elem.config.y < 0) {
            player.rocketConfig.bullet.splice(i, 1);
            i--;
            continue;
        }
        elem.config.y -= (config.speed * scale);
        elem.update();
    }
}
window.onload = function () {
    update();
};
window.addEventListener("keydown", (e) => {
    switch (e.code) {
        case "Space":
            let fire = true;
            var bullet = player.rocketConfig.bullet;
            if (bullet.length > 0) {
                const blt = bullet[bullet.length - 1].config;
                var bltY = blt.y + (blt.scaleH * 2 + (config.speed * scale));
                if (bltY < player.config.y)
                    fire = true;
                else
                    fire = false;
            }
            if (fire) {
                player.pushBullet();
            }
            break;
    }
});
function getScale() {
    var scale = 1;
    if (innerWidth <= 500) {
        scale = (innerWidth / scaleWidth) * 3;
    }
    else if (innerWidth <= 850) {
        scale = (innerWidth / scaleWidth) * 3;
    }
    if (innerWidth <= 1000 && innerHeight <= 500) {
        scale = (innerWidth / scaleWidth) * 2;
    }
    return scale;
}
function bulletColliedAsteroid() {
    var bullets = player.rocketConfig.bullet;
    var asteros = asteroids.list;
    for (let i = 0; i < bullets.length; i++) {
        const bulletCfg = bullets[i].config;
        const bulletPos = {
            x1: bulletCfg.x,
            y1: bulletCfg.y,
            x2: bulletCfg.x + bulletCfg.scaleW,
            y2: bulletCfg.y + bulletCfg.scaleH
        };
    }
}
