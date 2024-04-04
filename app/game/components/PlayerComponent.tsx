import { TextComponent } from "./TextComponent"
import * as CON from "../utils/constants"

export class PlayerComponent {
	private _id: string = "";	
	private _name: string = "";
	private _side: CON.PlayerSide | null = null;
	private _score: number = 0;
	private _bot: boolean = false;

	public nameField: TextComponent | null = null;
	public scoreField: TextComponent | null = null;

	constructor(name: string, side: CON.PlayerSide, config: keyof typeof CON.config) {
		this._name = name;
		this._side = side;
		this.nameField = new TextComponent("nameField", this._name, CON.MESSAGE_FONT, CON.BASE_COLOR, CON.ALIGN, CON.BASELINE, CON.PLAYER_SIZE, CON.config[config].screenWidth  / 2, CON.PLAYER_OFFSET_Y);
		this.scoreField = new TextComponent("scoreField", this._score.toString(), CON.MESSAGE_FONT, CON.BASE_COLOR, CON.ALIGN, CON.BASELINE, CON.SCORE_SIZE, CON.config[config].screenWidth  / 2 - CON.SCORE_OFFSET_X, CON.SCORE_OFFSET_Y);

		if (this._side == 1) {
			//this._bot = true;
			this.setRightPlayerFormat(config);
	
		} else {
			this.setLeftPlayerFormat(config);
		}
	}
	

	setRightPlayerFormat(config: keyof typeof CON.config) {
		this.nameField?.setX(CON.config[config].screenWidth - CON.PLAYER_OFFSET_X);
		this.scoreField?.setX(CON.config[config].screenWidth  / 2 + CON.SCORE_OFFSET_X);
		this.nameField?.setColor(CON.BASE_COLOR);
		this.scoreField?.setColor(CON.BASE_COLOR);
	}


	setLeftPlayerFormat(config: keyof typeof CON.config) {
		this.nameField?.setX(CON.PLAYER_OFFSET_X);
		this.scoreField?.setX(CON.config[config].screenWidth  / 2 - CON.SCORE_OFFSET_X);
		this.nameField?.setColor(CON.BASE_COLOR);
		this.scoreField?.setColor(CON.BASE_COLOR);
	}

	setId(id: string) {
		this._id = id;
	}

	getId() {
		return this._id;
	}

	setName(name: string) {
		this._name = name;
		this.nameField?.setText(name);
	}

	getName() {
		return this._name;
	}

	setSide(side: CON.PlayerSide) {
		this._side = side;
	}

	getSide() {
		return this._side;
	}

	setScore(score: number) {
		this._score = score;
		this.scoreField?.setText(score.toString());
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
		this.setScore(this._score + 1);
	}

	resetScore() {
		this.setScore(0);
	}
}
