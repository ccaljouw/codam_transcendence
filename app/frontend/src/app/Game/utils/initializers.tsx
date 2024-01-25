
import { Paddle } from "../gameObjects/Paddle";
import { Wall } from "../gameObjects/Wall";
import { GameObject } from "../gameObjects/GameObject";
import { Ball } from "../gameObjects/Ball";
import { PlayerComponent } from "../components/PlayerComponent";
import { GameComponent } from "../components/GameComponent";
import { KeyListenerComponent } from "../components/KeyListenerComponent";
import { TextComponent } from "../components/TextComponent";
import { startKeyPressed, pauseKeyPressed } from "./utils";
import * as CON from "./constants";


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


export function wallInitializer (walles: Wall[]) {
	
	if (CON.PLAYER_1_BACKWALLS == true) {
		walles.push(new Wall("LeftBackTopWall", 1, 0, 0, CON.WALL_WIDTH, CON.SCREEN_HEIGHT / 2 - CON.BACK_WALL_GAP, CON.BACK_WALL_COLOR));
		walles.push(new Wall("LeftBackBottomWall", 1, 0, CON.SCREEN_HEIGHT / 2 + CON.BACK_WALL_GAP, CON.WALL_WIDTH, CON.SCREEN_HEIGHT /  2 - CON.BACK_WALL_GAP, CON.BACK_WALL_COLOR));
	}

	if (CON.PLAYER_2_BACKWALLS == true) {
		walles.push(new Wall("RightBackTopWall", 1, CON.SCREEN_WIDTH - CON.WALL_WIDTH, 0, CON.WALL_WIDTH, CON.SCREEN_HEIGHT / 2 - CON.BACK_WALL_GAP, CON.BACK_WALL_COLOR));
		walles.push(new Wall("RightBackBottomWall", 1, CON.SCREEN_WIDTH - CON.WALL_WIDTH, CON.SCREEN_HEIGHT / 2 + CON.BACK_WALL_GAP, CON.WALL_WIDTH, CON.SCREEN_HEIGHT / 2 - CON.BACK_WALL_GAP, CON.BACK_WALL_COLOR));
	}
	
	//type 0 = horizontal wall, type 1 = vertical wall
	walles.push(new Wall("TopWall", 0, 0, 0, CON.SCREEN_WIDTH, CON.WALL_WIDTH, CON.WALL_COLOR));
	walles.push(new Wall("BottomWall", 0, 0, (CON.SCREEN_HEIGHT - CON.WALL_WIDTH), CON.SCREEN_WIDTH, CON.WALL_WIDTH, CON.WALL_COLOR));
}


export function lineInitializer (lines: GameObject[]) {
	lines.push(new GameObject("centerLine", (CON.SCREEN_WIDTH / 2) - (CON.LINE_WIDTH / 2), 0, CON.LINE_WIDTH, CON.SCREEN_HEIGHT, CON.LINE_COLOR));
}


export function ballInitializer () {
	return new Ball();
}


export function keyListenerInitializer (listener: KeyListenerComponent, game: GameComponent) {
	listener.addKeyCallback("CON.PAUSE_KEY", () => {
		pauseKeyPressed(game);
	});
	
 	listener.addKeyCallback(" ", () => {
		startKeyPressed(game);
	});
}


export function messageFieldInitializer (messageFields: TextComponent[]) {
	messageFields.push(new TextComponent("center", CON.START_MESSAGE, CON.CENTER_MESSAGE_FONT, CON.CENTER_MESSAGE_COLOR , CON.CENTER_MESSAGE_ALIGN, CON.CENTER_MESSAGE_BASELINE, CON.CENTER_MESSAGE_SIZE, CON.CENTER_MESSAGE_X, CON.CENTER_MESSAGE_Y));
	messageFields.push(new TextComponent("left", "LEFT MESSAGE", CON.SIDE_MESSAGE_FONT, CON.SIDE_MESSAGE_COLOR , CON.SIDE_MESSAGE_ALIGN, CON.SIDE_MESSAGE_BASELINE, CON.SIDE_MESSAGE_SIZE, CON.SIDE_MESSAGE_OFFSET_X, CON.SIDE_MESSAGE_OFFSET_Y));
	messageFields.push(new TextComponent("right", "RIGHT MESSAGE", CON.SIDE_MESSAGE_FONT, CON.SIDE_MESSAGE_COLOR , CON.SIDE_MESSAGE_ALIGN, CON.SIDE_MESSAGE_BASELINE, CON.SIDE_MESSAGE_SIZE, CON.SCREEN_WIDTH - CON.SIDE_MESSAGE_OFFSET_X, CON.SIDE_MESSAGE_OFFSET_Y));
	messageFields.push(new TextComponent("top", "TOP MESSAGE", CON.TOP_MESSAGE_FONT, CON.TOP_MESSAGE_COLOR , CON.TOP_MESSAGE_ALIGN, CON.TOP_MESSAGE_BASELINE, CON.TOP_MESSAGE_SIZE, CON.TOP_MESSAGE_OFFSET_X, CON.TOP_MESSAGE_OFFSET_Y));
}


export function playerInitializer (players: PlayerComponent[]) {
	players.push(new PlayerComponent(CON.PLAYER_1_NAME, "Left"));
	players.push(new PlayerComponent(CON.PLAYER_2_NAME, "Right"));
}
