import { Bullet } from "./bullet.js";
import { Circle } from "./circle.js";

export interface Config{
    ctx: CanvasRenderingContext2D;
    canvasBounds: DOMRect;
}

export interface PlayerConfig {
    bounds: Bounds;
    speed: number;
    outerRadius: number;
    rgb: {r: number, g: number, b: number};
    bullet: Bullet[];
    player: Circle;
    outerCircle: Circle;
}

export interface EnemyConfig {
    bounds: Bounds;
    velX: number;
    velY: number;
    speed: number;
    rgb: {r: number, g: number, b: number};
    bullet: Bullet[];
    enemy: Circle;
    enemies: Enemy[];
}

export interface MouseCursorConfig {
    fillStyle: string;
    strokeStyle: string;
    mouseCursor: Path2D;
    mouseCursorPoint: Path2D;
    outerRadius: number;
    innerRadius: number;
}

export interface BulletConfig{
    bounds: Bounds;
    velX: number;
    velY: number;
    speed: number;
    length: number;
    index: number;
    rgb: {r: number, g: number, b: number};
    parent: Object;
}

export interface CircleConfig {
    bounds: Bounds;
    filled?: boolean;
    rgb: {r: number, g: number, b: number};
}

export interface Bounds{
    x: number;
    y: number;
    radius: number;
}