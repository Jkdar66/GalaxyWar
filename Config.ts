import { Asteroid } from "./Asteroid.js";
import { BulletImage } from "./Bullet.js";
import { Flame } from "./Flame.js";

export interface Config {
    x: number;
    y: number;
    w?: number;
    h?: number;
    scaleW?: number;
    scaleH?: number;
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    scale: number;
    imgSrc?: string;
    moving?: boolean;
    fill?: string;
}

export interface RocketConfig {
    bulletData: Array<{ x: number, y: number }>;
    flameData?: Array<{ x: number, y: number }>;
    bullet?: Array<BulletImage>;
    flame?: Array<Flame>;
}

export interface MEvent {
    "mousedown": MouseEvent;
    "mouseenter": MouseEvent;
    "mouseleave": MouseEvent;
    "mousemove": MouseEvent;
    "mouseout": MouseEvent;
    "mouseover": MouseEvent;
    "mouseup": MouseEvent;
}

export interface TEvent{
    "touchcancel": TouchEvent;
    "touchend": TouchEvent;
    "touchmove": TouchEvent;
    "touchstart": TouchEvent;
}

export interface RocketConfig {
    bulletData: Array<{ x: number, y: number }>;
    flameData?: Array<{ x: number, y: number }>;
    bullet?: Array<BulletImage>;
    flame?: Array<Flame>;
}

export const BULLET_TYPE = {
    RED: "images\\laser\\red.png"
}

export interface AsteroidConfig{
    path: string[];
    sprite: HTMLImageElement[];
    spriteIndex: number;
    loop: number;
    remaining_loop: number;
    life: number;
    remaining_life: number;
    size?: string;
    imgWidth? :number;
    imgHeight?: number;
}

export const AsteroidSize = [
    {
        key: "small",
        type: ["a", "b"],
        number: [
            [100, 300, 400],
            [100, 300, 400]
        ],
        imgWidth: 64,
        imgHeight: 64
    },
    {
        key: "medium",
        type: ["a", "b", "c", "d"],
        number: [
            [100, 300, 400],
            [400],
            [100, 300, 400],
            [100, 300, 400]
        ],
        imgWidth: 120,
        imgHeight: 120
    },
    {
        key: "large",
        type: ["a", "b", "c"],
        number: [
            [100, 300],
            [100, 300],
            [100, 300, 400]
        ],
        imgWidth: 320,
        imgHeight: 240
    }
];

export interface CreateAsteroid{
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    list: Asteroid[];
    start: number;
    end: number;
    scale: number;
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    update?: Function;
}

export interface StarConfig{
    path2d?: Path2D;
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    minSize: number;
    maxSize: number;
}
