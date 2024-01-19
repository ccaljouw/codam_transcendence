
import * as CON from "../utils/constants.js";
import { GameObject } from "./GameObject.js";

export class Line extends GameObject {

	constructor(name: string, x: number, y: number, width: number, height: number, color: string) {
		super(name, x, y, width, height, color);
	}
	
	update()  {}
	
}
