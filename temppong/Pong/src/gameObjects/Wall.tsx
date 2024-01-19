
import * as CON from "../utils/constants.js";
import { GameObject } from "./GameObject.js";

//type 0  is horizontal, 1 is vertical
export class Wall extends GameObject {
	//set horizontal or vertical
	private _type: CON.WallTypes

	constructor(name: string, type: number, x: number, y: number, width: number, height: number, color: string) {
		super(name, x, y, width, height, color);
		this._type = type;
	}
	
	getType() {
		return this._type;
	}

	update()  {}
}
