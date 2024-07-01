import { drawGameObject } from "../utils/utils"

export class GameObject {
	protected name: string = "";
	protected type: string = "";
	protected x: number = 0;
	protected y: number = 0;
	protected width: number = 0;
	protected height: number = 0;
	protected color: string = "";

	constructor(name: string, x: number, y: number, width: number, height: number, color: string) {
		this.name = name;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
	}


	setValues(name:string, x: number, y: number, width: number, height: number, color: string) {
		this.name = name;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
	}

	getName() { 
		return this.name;
	}

	getX() {
		return this.x;
	}

	getY() {
		return this.y;
	}

	setX(x: number) {
		this.x = x;
	}

	setY(y: number) {
		this.y = y;
	}

	getWidth() {
		return this.width;
	}

	getHeight() {
		return this.height;
	}

	setColor(color: string) {
		this.color = color;
	}

	draw(ctx: CanvasRenderingContext2D) {
		drawGameObject(ctx, this.x, this.y, this.width, this.height, this.color);
	}
}
