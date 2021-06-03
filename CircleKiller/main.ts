import { Config } from "./config.js";
import { Enemies } from "./Enemy.js";
import { MouseCursor } from "./mouseCursor.js";
import { Player } from "./player.js";

var canvas: HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;

var config: Config;
var player: Player;
var enemies: Enemies;
var mouseCursor: MouseCursor;

function init(){
    canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    config = {
        ctx: ctx,
        canvasBounds: canvas.getBoundingClientRect()
    };
    player = new Player(config);
    enemies = new Enemies(config);
    mouseCursor = new MouseCursor(config);
}

function update() {
    requestAnimationFrame(update);
}

function main() {
    init();
    update();
}
main();