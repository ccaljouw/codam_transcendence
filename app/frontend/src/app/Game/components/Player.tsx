
import { TextObject } from "./TextObject";
import * as CON from "../utils/constants";

export class Player {
	private _id: string = "";	
	private _name: string = "";
	private _side: string = "";
	private _score: number = 0;
	private _bot: boolean = false;

	public nameField: TextObject | null = null;
	public scoreField: TextObject | null = null;

	constructor(name: string, side: string) {
		this._name = name;
		this._side = side;
		this.nameField = new TextObject("nameField", this._name, CON.PLAYER_FONT, "white", CON.PLAYER_ALIGN, CON.PLAYER_BASELINE, CON.PLAYER_SIZE, CON.SCREEN_WIDTH / 2, CON.PLAYER_OFFSET_Y);
		this.scoreField = new TextObject("scoreField", this._score.toString(), CON.SCORE_FONT, CON.SCORE_COLOR , CON.SCORE_ALIGN, CON.SCORE_BASELINE, CON.SCORE_SIZE, CON.SCREEN_WIDTH / 2 - CON.SCORE_OFFSET_X, CON.SCORE_OFFSET_Y);

		if (this._side == "Right") {
			//this._bot = true;
			this.setRightPlayerFormat();
	
		} else {
			this.setLeftPlayerFormat();
		}
	}
	

	setRightPlayerFormat() {
		this.nameField?.setX(CON.SCREEN_WIDTH - CON.PLAYER_OFFSET_X);
		this.scoreField?.setX(CON.SCREEN_WIDTH / 2 + CON.SCORE_OFFSET_X);
		this.nameField?.setColor(CON.PLAYER_2_COLOR);
		this.scoreField?.setColor(CON.PLAYER_2_COLOR);
	}


	setLeftPlayerFormat() {
		this.nameField?.setX(CON.PLAYER_OFFSET_X);
		this.scoreField?.setX(CON.SCREEN_WIDTH / 2 - CON.SCORE_OFFSET_X);
		this.nameField?.setColor(CON.PLAYER_1_COLOR);
		this.scoreField?.setColor(CON.PLAYER_1_COLOR);
	}

	setId(_id: string) {
		this._id = _id;
	}

	getId() {
		return this._id;
	}

	setName(_name: string) {
		this._name = _name;
	}

		getName() {
		return this._name;
	}

	setSide(_side: string) {
		this._side = _side;
	}

	getSide() {
		return this._side;
	}

	setScore(_score: number) {
		this._score = _score;
	}

	getScore() {
		return this._score;
	}

	setBot(_bot: boolean) {
		this._bot = _bot;
	}

	getBot() {
		return this._bot;
	}

	increaseScore() {
		this._score += 1;
	}

	resetScore() {
		this._score = 0;
	}
}
