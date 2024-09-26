import * as CON from '../utils/constants'
import { GameObject } from './GameObject'

//type 0  is horizontal, 1 is vertical
export class Wall extends GameObject {
	private _type: CON.WallTypes
	private _active: boolean;

	constructor(name: string, type: number, x: number, y: number, width: number, height: number, color: string) {
		super(name, x, y, width, height, color);
		this._type = type;
		this._active = true;
	}
	
	getType() {
		return this._type;
	}

	activate() {
		this._active = true;
	}

	deactivate() {
		this._active = false;
	}

	getActive() {
		return this._active;
	}
}
