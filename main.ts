import { GAME } from "./Game.js";

const scaleWidth = 2560, scaleHeight = 1297;
var config = {
    canvas: {x: 0, y: 0, w: window.innerWidth, h: window.innerHeight},
    ctx: {x: 0, y: 0},
    speed: 25
}

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

canvas.width = config.canvas.w;
canvas.height = config.canvas.h;
ctx.save();

var player = new GAME.Rocket({
    x: canvas.width/2, 
    y: canvas.height, 
    ctx: ctx, 
    canvas: canvas,
    scale: getScale(), 
    imgSrc: "images\\mghg-78667c.png"
}, 
{
    bulletData: [
        {x: 6.45, y: 21.33},
        {x: 93.55, y: 21.33},
        {x: 26.18, y: 14.34},
        // {x: 50, y: 0},
        {x: 73.82, y: 14.34},
        {x: 41.32, y: 7},
        {x: 58.68, y: 7}
    ],
    flameData: [
        {x: 6.45, y: 77.62},
        // {x: 22.08, y: 83.92},
        // {x: 30.65, y: 89.51},
        // {x: 39.83, y: 93.71},
        // {x: 50, y: 100},
        // {x: 60.17, y: 93.71},
        // {x: 69.35, y: 89.51},
        // {x: 77.92, y: 83.92},
        {x: 93.55, y: 77.62}
    ]
}
);

player.drag(()=>{});

var asteroids = GAME.CREATE_ASTEROIDS({
    list: [],
    canvas: canvas,
    ctx: ctx,
    ctxConfig: config.ctx,
    scale: getScale(),
    minX: -1000, maxX: canvas.width + 1000, minY: -(canvas.height*2), maxY: canvas.height/3,
    start: 0, end: 10
});

function responsive(): void{
    config.canvas = {x: 0, y: 0, w: window.innerWidth, h: window.innerHeight}
    canvas.width = config.canvas.w;
    canvas.height = config.canvas.h;
}

function init(): void{
    responsive();
    ctx.restore();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "source-over";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.config.scale = getScale();
    player.update();
    asteroids.scale = getScale();
    asteroids.update();
}

function moveWindow(){
    let cfg = player.config;
    if(cfg.moving){
        if(cfg.x < 0){
            config.ctx.x += config.speed;
        }else if(cfg.x + cfg.scaleW > config.canvas.w){
            config.ctx.x -= config.speed;
        }
        if(cfg.y < 0){
            config.ctx.y += config.speed;
        }
    }
}

function update(){
    requestAnimationFrame(update);
    moveWindow();
    init();

    for (let i = 0; i < player.rocketConfig.bullet.length; i++) {
        const elem = player.rocketConfig.bullet[i];
        if(elem.config.y < 0) { 
            player.rocketConfig.bullet.splice(i, 1);
            i--;
            continue;
        }
        elem.config.y -= (config.speed * getScale());
        elem.update();
    }
}

window.onload = function(){
    update();
}
window.addEventListener("keydown", (e)=>{
    switch(e.code){
        case "Space":
            let fire = true;
            var bullet = player.rocketConfig.bullet;
            if(bullet.length > 0){
                const blt = bullet[bullet.length-1].config;
                var bltY = blt.y + (blt.scaleH*2 + (config.speed*getScale()));
                if(bltY < player.config.y) fire = true;
                else fire = false;
            }
            if(fire){
                player.pushBullet();
            }
            break;
    }
});

function getScale(): number{
    var scale: number = 1;
    if(innerWidth <= 500) {
        scale = (innerWidth/scaleWidth) *3;
    }else if(innerWidth <= 850){
        scale = (innerWidth/scaleWidth) *3;
    }
    if(innerWidth <= 1000 && innerHeight <= 500){
        scale = (innerWidth/scaleWidth) *2;
    }
    return scale;
}