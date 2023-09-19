
import { Bird } from "./bird";
import { QuadNode } from "./quadnode";
import * as config from "./config";
import { inv_sqrt } from "./util";

export class BirdManager {
    public birds: Bird[];
    public quadtree: QuadNode

    constructor() {
        this.birds = [];
        this.quadtree = new QuadNode(config.window_size[0], config.window_size[1], [0], 0, 0);
    }

    public add_bird(bird: Bird) {
        this.birds.push(bird);
        this.quadtree.insert(bird);
    }

    public update(dt: number) {
        // new Worker('./worker.js').postMessage('hello');
        for (let b of this.birds) {
            let vx = 0;
            let vy = 0;
            let count = 0;
            let px = 0;
            let py = 0;

            let [sx, sy] = [0, 0];
            let s_count = 0;

            for (let [bb, d2] of this.quadtree.search_range(b.x, b.y, config.sight_range)) {
                if (!(bb instanceof Bird)) {
                    throw new Error("Not a bird");
                }

                if (d2 <= config.separation_range2) {
                    sx += b.x - bb.x;
                    sy += b.y - bb.y;
                    s_count++;
                } else {
                    vx += bb.vx;
                    vy += bb.vy;
                    count++;
                    px += bb.x;
                    py += bb.y;
                }
            }

            if (count > 0) {
                // alignment
                b.vx += vx * config.alignment_strength / count;
                b.vy += vy * config.alignment_strength / count;

                // cohesion
                b.vx += (px / count - b.x) * config.cohesion_strength;
                b.vy += (py / count - b.y) * config.cohesion_strength;
            }

            // separation
            if (s_count > 0) {
                b.vx += sx * config.separation_strength / s_count;
                b.vy += sy * config.separation_strength / s_count;
            }

            // border field
            if (b.x < config.border_field_range) {
                b.vx += config.border_field_strength;
            } else if (b.x > config.window_size[0] - config.border_field_range) {
                b.vx -= config.border_field_strength;
            }
            if (b.y < config.border_field_range) {
                b.vy += config.border_field_strength;
            } else if (b.y > config.window_size[1] - config.border_field_range) {
                b.vy -= config.border_field_strength;
            }

            // limit speed
            let i = inv_sqrt(b.vx * b.vx + b.vy * b.vy);
            if (i * config.max_speed < 1) {
                b.vx *= i * config.max_speed;
                b.vy *= i * config.max_speed;
            }

            // update position
            let x = b.x + b.vx * dt;
            let y = b.y + b.vy * dt;

            // out of bound protection
            if (x < 0) {
                x = 0;
            } else if (x >= config.window_size[0]) {
                x = config.window_size[0] - 0.01;
            }
            if (y < 0) {
                y = 0;
            } else if (y >= config.window_size[1]) {
                y = config.window_size[1] - 0.01;
            }

            // move bird
            let node = this.quadtree.get_containing_node(b);
            let nb = new Bird(x, y, b.vx, b.vy);
            if (!node.do_contain_point(nb)) {
                node.remove(b);
                b.x = x;
                b.y = y;
                this.quadtree.insert(b);
            } else {
                b.x = x;
                b.y = y;
            }
        }
    }

    public render(ctx: CanvasRenderingContext2D) {

        if(config.show_border_field) {
            ctx.strokeStyle = 'white';
            ctx.beginPath();
            ctx.moveTo(config.border_field_range, config.border_field_range);
            ctx.lineTo(config.border_field_range, config.window_size[1] - config.border_field_range);
            ctx.lineTo(config.window_size[0] - config.border_field_range, config.window_size[1] - config.border_field_range);
            ctx.lineTo(config.window_size[0] - config.border_field_range, config.border_field_range);
            ctx.lineTo(config.border_field_range, config.border_field_range);
            ctx.stroke();
        }

        this.birds.forEach(b => b.render(ctx));
        // this.quadtree.draw_line(ctx, 'white');
    }
}