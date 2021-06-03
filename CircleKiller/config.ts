import { Bullet } from "./bullet.js";

export interface Config{
    ctx: CanvasRenderingContext2D;
    canvasBounds: DOMRect;
}

export interface PlayerConfig {
    bullet: Bullet[]; 
}

export interface EnemyConfig {

}

export interface MouseCursorConfig {
    fillStyle: string;
    strokeStyle: string;
    mouseCursor: Path2D;
    mouseCursorPoint: Path2D;
    outerRadius: number;
    innerRadius: number;
}

export interface CircleConfig {
}