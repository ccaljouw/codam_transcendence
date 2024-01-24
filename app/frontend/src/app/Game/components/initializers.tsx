
import { Paddle } from "../gameObjects/Paddle";
import { Wall } from "../gameObjects/Wall";
import { Line } from "../gameObjects/Line";
import { Ball } from "../gameObjects/Ball";
import { Player } from "./Player";
import { Game } from "./game";
import { KeyListener } from "../components/KeyListener";
import { TextObject } from "./TextObject";
import { startKeyPressed, pauseKeyPressed } from "../utils/utils";
import * as CON from "../utils/constants";


export function canvasInitializer (canvas: HTMLCanvasElement) {
	canvas.width = CON.SCREEN_WIDTH;
	canvas.height = CON.SCREEN_HEIGHT;
	canvas.style.backgroundColor = "black";
}

export function paddleInitializer (paddels: Paddle[]) {

	let name = "left";
	const leftPaddle = new Paddle(name, CON.PADDLE_OFFSET_X, CON.PADDLE_OFFSET_Y, CON.PADDLE_WIDTH, CON.PADDLE_HEIGHT, CON.LEFT_PADDLE_COLOR);
	leftPaddle.setKeyListerns(leftPaddle, CON.LEFT_PADDLE_UP_KEY, CON.LEFT_PADDLE_DOWN_KEY);
	paddels.push(leftPaddle);

	name = "right";
	const rightPaddle = new Paddle(name, (CON.SCREEN_WIDTH - CON.PADDLE_OFFSET_X - CON.PADDLE_WIDTH), CON.PADDLE_OFFSET_Y, CON.PADDLE_WIDTH, CON.PADDLE_HEIGHT, CON.RIGHT_PADDLE_COLOR);
	rightPaddle.setKeyListerns(rightPaddle, CON.RIGHT_PADDLE_UP_KEY, CON.RIGHT_PADDLE_DOWN_KEY);
	paddels.push(rightPaddle);
}


//type 0 = horizontal wall, type 1 = vertical wall
export function wallInitializer (walles: Wall[]) {
	
	let name = "wall";
	
	if (CON.PLAYER_1_BACKWALLS == true) {
		
		name = "LeftBackTopWall ";
		const leftTopWall = new Wall(name, 1, 0, 0, CON.WALL_WIDTH, CON.SCREEN_HEIGHT / 2 - CON.BACK_WALL_GAP, CON.BACK_WALL_COLOR);
		walles.push(leftTopWall);
		
		name = "LeftBackBottomWall ";
		const leftBottomWall = new Wall(name, 1, 0, CON.SCREEN_HEIGHT / 2 + CON.BACK_WALL_GAP, CON.WALL_WIDTH, CON.SCREEN_HEIGHT /  2 - CON.BACK_WALL_GAP, CON.BACK_WALL_COLOR);
		walles.push(leftBottomWall);
	}
	if (CON.PLAYER_2_BACKWALLS == true) {
		
		name = "RightBackTopWall ";
		const rightTopWall = new Wall(name, 1, CON.SCREEN_WIDTH - CON.WALL_WIDTH, 0, CON.WALL_WIDTH, CON.SCREEN_HEIGHT / 2 - CON.BACK_WALL_GAP, CON.BACK_WALL_COLOR);
		walles.push(rightTopWall);
		
		name = "RightBackBottomWall ";
		const rightBottomWall = new Wall(name, 1, CON.SCREEN_WIDTH - CON.WALL_WIDTH, CON.SCREEN_HEIGHT / 2 + CON.BACK_WALL_GAP, CON.WALL_WIDTH, CON.SCREEN_HEIGHT / 2 - CON.BACK_WALL_GAP, CON.BACK_WALL_COLOR);
		walles.push(rightBottomWall);
	}
	
	

	name = "TopWall";
	const topWall = new Wall(name, 0, 0, 0, CON.SCREEN_WIDTH, CON.WALL_WIDTH, CON.WALL_COLOR);
	walles.push(topWall);

	name = "BottomWall";
	const bottomWall = new Wall(name, 0, 0, (CON.SCREEN_HEIGHT - CON.WALL_WIDTH), CON.SCREEN_WIDTH, CON.WALL_WIDTH, CON.WALL_COLOR);
	walles.push(bottomWall);
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


export function playerInitializer (players: Player[]) {
	players.push(new Player(CON.PLAYER_1_NAME, "Left"));
	players.push(new Player(CON.PLAYER_2_NAME, "Right"));
}
