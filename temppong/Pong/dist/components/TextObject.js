import { GameObject } from "../gameObjects/GameObject.js";
export class TextObject extends GameObject {
    text = "";
    font = "";
    align = "";
    baseline = "";
    size = 0;
    constructor(text, font, color, align, baseline, size, x, y) {
        super("", x, y, 0, 0, color);
        this.text = text;
        this.font = font;
        this.color = color;
        this.align = align;
        this.baseline = baseline;
        this.size = size;
    }
    draw(ctx) {
        ctx.font = this.size + "px " + this.font;
        ctx.fillStyle = this.color;
        ctx.textAlign = this.align;
        ctx.textBaseline = this.baseline;
        ctx.fillText(this.text, this.x, this.y);
    }
    setText(text) {
        this.text = text;
    }
    setFont(font) {
        this.font = font;
    }
    setColor(color) {
        this.color = color;
    }
    setAlign(align) {
        this.align = align;
    }
    setBaseline(baseline) {
        this.baseline = baseline;
    }
    setSize(size) {
        this.size = size;
    }
    getAlign() {
        return this.align;
    }
    getBaseline() {
        return this.baseline;
    }
    getSize() {
        return this.size;
    }
}
