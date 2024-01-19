import { drawGameObject } from "../utils/utils.js";
export class GameObject {
    name = "";
    type = "";
    x = 0;
    y = 0;
    width = 0;
    height = 0;
    color = "";
    constructor(name, x, y, width, height, color) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
    setValues(name, x, y, width, height, color) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
    getName() { return this.name; }
    getX() { return this.x; }
    getY() { return this.y; }
    setX(x) { this.x = x; }
    setY(y) { this.y = y; }
    getWidth() { return this.width; }
    getHeight() { return this.height; }
    update() { }
    draw(ctx) {
        drawGameObject(ctx, this.x, this.y, this.width, this.height, this.color);
    }
}
