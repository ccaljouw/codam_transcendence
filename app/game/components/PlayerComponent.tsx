
import { TextComponent } from "./TextComponent";
import * as CON from "../utils/constants";

export class PlayerComponent {
	private _id: string = "";	
	private _name: string = "";
	private _side: string = "";
	private _score: number = 0;
	private _bot: boolean = false;

	public nameField: TextComponent | null = null;
	public scoreField: TextComponent | null = null;

	constructor(name: string, side: string, theme: keyof typeof CON.themes, config: keyof typeof CON.config) {
		this._name = name;
		this._side = side;
		this.nameField = new TextComponent("nameField", this._name, CON.themes[theme].textFont, CON.themes[theme].leftPlayerColor, CON.ALIGN, CON.BASELINE, CON.PLAYER_SIZE, CON.config[config].screenWidth  / 2, CON.PLAYER_OFFSET_Y);
		this.scoreField = new TextComponent("scoreField", this._score.toString(), CON.themes[theme].textFont, CON.themes[theme].leftPlayerColor, CON.ALIGN, CON.BASELINE, CON.SCORE_SIZE, CON.config[config].screenWidth  / 2 - CON.SCORE_OFFSET_X, CON.SCORE_OFFSET_Y);

		if (this._side == "Right") {
			//this._bot = true;
			this.setRightPlayerFormat(theme, config);
	
		} else {
			this.setLeftPlayerFormat(theme, config);
		}
	}
	

	setRightPlayerFormat(theme: keyof typeof CON.themes, config: keyof typeof CON.config) {
		this.nameField?.setX(CON.config[config].screenWidth - CON.PLAYER_OFFSET_X);
		this.scoreField?.setX(CON.config[config].screenWidth  / 2 + CON.SCORE_OFFSET_X);
		this.nameField?.setColor(CON.themes[theme].leftPlayerColor);
		this.scoreField?.setColor(CON.themes[theme].leftPlayerColor);
	}


	setLeftPlayerFormat(theme: keyof typeof CON.themes, config: keyof typeof CON.config) {
		this.nameField?.setX(CON.PLAYER_OFFSET_X);
		this.scoreField?.setX(CON.config[config].screenWidth  / 2 - CON.SCORE_OFFSET_X);
		this.nameField?.setColor(CON.themes[theme].rightPlayerColor);
		this.scoreField?.setColor(CON.themes[theme].rightPlayerColor);
	}

	setId(id: string) {
		this._id = id;
	}

	getId() {
		return this._id;
	}

	setName(name: string) {
		this._name = name;
	}

	getName() {
		return this._name;
	}

	setSide(side: string) {
		this._side = side;
	}

	getSide() {
		return this._side;
	}

	setScore(score: number) {
		this._score = score;
	}

	getScore() {
		return this._score;
	}

	setBot(bot: boolean) {
		this._bot = bot;
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
