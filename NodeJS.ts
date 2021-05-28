export class NodeJS {
    config: Config;
    constructor(bounds: Bounds){

    }
    
}

interface Bounds{
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Config{
    relativX: number;
    relativY: number;
    middelX: number;
    middelY: number;
    abslouteX: number;
    abslouteY: number;
    width: number;
    height: number;
    rotateDegree: number;
    canvas: HTMLCanvasElement;
}
