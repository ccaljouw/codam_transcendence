
import { Paddle } from "../gameObjects/Paddle.js";
import { Wall } from "../gameObjects/Wall.js";
import { Line } from "../gameObjects/Line.js";
import { Ball } from "../gameObjects/Ball.js";
import { Game } from "./game.js";
import { KeyListener } from "./KeyListner.js";
import { TextObject } from "./TextObject.js";
import { startKeyPressed, pauseKeyPressed } from "../utils/utils.js";
import * as CON from "../utils/constants.js";


export function canvasInitializer (canvas: HTMLCanvasElement) {
	canvas.width = CON.SCREEN_WIDTH;
	canvas.height = CON.SCREEN_HEIGHT;
	canvas.style.backgroundColor = "black";
}

export function paddleInitializer (side: string) {

	let name = side + "Paddle";

	if (side == "Left") {
		const paddle = new Paddle(name, CON.PADDLE_OFFSET_X, CON.PADDLE_OFFSET_Y, CON.PADDLE_WIDTH, CON.PADDLE_HEIGHT, CON.LEFT_PADDLE_COLOR);
		paddle.setKeyListerns(paddle, CON.LEFT_PADDLE_UP_KEY, CON.LEFT_PADDLE_DOWN_KEY);
		return paddle;

	} else if (side == "Right") {
		const paddle = new Paddle(name, (CON.SCREEN_WIDTH - CON.PADDLE_OFFSET_X - CON.PADDLE_WIDTH), CON.PADDLE_OFFSET_Y, CON.PADDLE_WIDTH, CON.PADDLE_HEIGHT, CON.RIGHT_PADDLE_COLOR);
		paddle.setKeyListerns(paddle, CON.RIGHT_PADDLE_UP_KEY, CON.RIGHT_PADDLE_DOWN_KEY);
		return paddle;
	}
	throw new Error("Side is not valid");
}

//type is hor or ver
export function wallInitializer (side: string, type: number) {
	if (type != 0 && type != 1) {
		throw new Error("Type is not valid");
	}
	
	let name = side + "Wall";

	if (side == "Top") {
		return new Wall(name, type, 0, 0, CON.SCREEN_WIDTH, CON.WALL_WIDTH, CON.WALL_COLOR);

	} else if (side == "Bottom") {
		return new Wall(name, type, 0, (CON.SCREEN_HEIGHT - CON.WALL_WIDTH), CON.SCREEN_WIDTH, CON.WALL_WIDTH, CON.WALL_COLOR);
	}
	throw new Error("Side is not valid");
}

export function lineInitializer (name: string) {
	
	let lineName = name + "Line";
	if (name == "Center") {
		return new Line(name, (CON.SCREEN_WIDTH / 2) - (CON.LINE_WIDTH / 2), 0, CON.LINE_WIDTH, CON.SCREEN_HEIGHT, CON.LINE_COLOR);

	} else {
		throw new Error("Name is not valid");
	}
}

export function ballInitializer () {
	return new Ball();
}


export function keyListenerInitializer (game: Game) {
	const keyListener = new KeyListener();
	keyListener.addKeyCallback("CON.PAUSE_KEY", () => {
		pauseKeyPressed(game);
	});
	
 	keyListener.addKeyCallback(" ", () => {
		startKeyPressed(game);
	});
	return new KeyListener();
}


export function messageFieldInitializer () {
	const messageField = new TextObject(CON.START_MESSAGE, CON.MESSAGE_FONT, CON.MESSAGE_COLOR , CON.MESSAGE_ALIGN, CON.MESSAGE_BASELINE, CON.MESSAGE_SIZE, CON.SCREEN_WIDTH / 2 + CON.MESSAGE_OFFSET_X, CON.MESSAGE_OFFSET_Y);
	return messageField;

}
