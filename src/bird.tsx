
import { rotate, inv_sqrt } from "./util";
import { sight_range, show_sight_range } from "./config";

export class Bird {
    public x: number;
    public y: number;
    public vx: number;
    public vy: number;
    public ax: number;
    public ay: number;
    static scale: number = 1;
    static color: string = 'white';

    constructor(x: number, y: number, vx: number, vy: number) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.ax = 0;
        this.ay = 0;
    }

    *iter_vertices() {
        let vertices = [
            [10, 0],
            [-5, -5],
            [0, 0],
            [-5, 5],
            [10, 0],
        ];
        let i = inv_sqrt(this.vx * this.vx + this.vy * this.vy);
        let [c, s] = [this.vx * i, this.vy * i];
        for (let v of vertices) {
            let p = rotate(v[0] * Bird.scale, v[1] * Bird.scale, c, s);
            yield [this.x + p[0], this.y + p[1]];
        }
    }

    public render(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = Bird.color;
        ctx.beginPath();
        let first = true;
        for (let v of this.iter_vertices()) {
            if (first) {
                ctx.moveTo(v[0], v[1]);
                first = false;
            } else {
                ctx.lineTo(v[0], v[1]);
            }
        }
        ctx.closePath();
        ctx.fill();

        // draw circle around bird
        if (show_sight_range) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, sight_range, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }

    equals(other: any): boolean {
        return this.x === other.x && this.y === other.y;
    }
}