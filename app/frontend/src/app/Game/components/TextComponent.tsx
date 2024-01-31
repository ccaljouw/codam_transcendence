
import { GameObject } from "../gameObjects/GameObject";


export class TextComponent extends GameObject {
	private text: string = "";
	private font: string = "";
	private align: string = "";
	private baseline: string = "";
	private size: number = 0;

	constructor(name: string, text: string, font: string, color: string, align: string, baseline: string, size: number, x: number, y: number) {
		super(name, x, y, 0, 0, color);
		this.text = text;
		this.font = font;
		this.color = color;
		this.align = align;
		this.baseline = baseline;
		this.size = size;
	}

	
	public draw(ctx: CanvasRenderingContext2D) {
		ctx.font = this.size + "px " + this.font;
		ctx.fillStyle = this.color;
		ctx.textAlign = this.align as CanvasTextAlign;
		ctx.textBaseline = this.baseline as CanvasTextBaseline;
		ctx.fillText(this.text, this.x, this.y);
	}

	update() {
	//todo: implement message changes here based on state	
	}


	public setText(text: string) {
		this.text = text;
	}

	public setFont(font: string) {
		this.font = font;
	}

	public setColor(color: string) {
		this.color = color;
	}

	public setAlign(align: string) {
		this.align = align;
	}

	public setBaseline(baseline: string) {
		this.baseline = baseline;
	}

	public setSize(size: number) {
		this.size = size;
	}

	public getAlign() {
		return this.align;
	}

	public getBaseline() {
		return this.baseline;
	}

	public getSize() {
		return this.size;
	}
}

