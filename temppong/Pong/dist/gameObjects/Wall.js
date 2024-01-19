import { GameObject } from "./GameObject.js";
export class Wall extends GameObject {
    _type;
    constructor(name, type, x, y, width, height, color) {
        super(name, x, y, width, height, color);
        this._type = type;
    }
    getType() {
        return this._type;
    }
    update() { }
}
