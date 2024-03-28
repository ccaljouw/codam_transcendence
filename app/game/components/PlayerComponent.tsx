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
				
		this.nameField = new TextComponent(
			"nameField",
			this._name,
			CON.BASE_FONT,
			CON.BASE_COLOR,
			CON.ALIGN,
			CON.BASELINE,
			CON.BASE_FONT_SIZE,
			10,
			CON.config[config].playerNameOffset_Y
			);
			
			this.scoreField = new TextComponent(
			"scoreField",
			this._score.toString(),
			CON.BASE_FONT,
			CON.BASE_COLOR,
			CON.ALIGN,
			CON.BASELINE,
			CON.BASE_FONT_SIZE,
			10,
			CON.config[config].scoreFieldOffset_Y
		);
		
				console.log("!!! offset: ", CON.config[config].scoreFieldOffset_Y);

		if (this._side == 1) {
			//this._bot = true;
			this.nameField?.setX(CON.config[config].screenWidth / 2 + CON.config[config].playerNameOffset_X);
			this.scoreField?.setX(CON.config[config].screenWidth / 2 + CON.config[config].scoreFieldOffset_X);
	
		} else {
			this.nameField?.setX(CON.config[config].playerNameOffset_X);
			this.scoreField?.setX(CON.config[config].screenWidth  / 2 - CON.config[config].scoreFieldOffset_X);
		}
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
