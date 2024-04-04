import { Paddle } from "../gameObjects/Paddle"
import { Wall } from "../gameObjects/Wall";
import { GameObject } from "../gameObjects/GameObject"
import { Ball } from "../gameObjects/Ball"
import { PlayerComponent } from "../components/PlayerComponent"
import { Game } from "../components/Game"
import { KeyListenerComponent } from "../components/KeyListenerComponent"
import { TextComponent } from "../components/TextComponent"
// import { startKeyPressed } from "./utils"
import { UpdateUserDto } from '@ft_dto/users'
import * as CON from "./constants"
import { UpdateGameUserDto } from '@ft_dto/game'


export function canvasInitializer (canvas: HTMLCanvasElement, config: keyof typeof CON.config) {
	canvas.width = CON.config[config].screenWidth;
	canvas.height = CON.config[config].screenHeight;
}


export function paddleInitializer (paddels: Paddle[], config: keyof typeof CON.config, type: CON.InstanceTypes) {

	const leftPaddle = new Paddle("left", CON.PADDLE_OFFSET_X, CON.PADDLE_OFFSET_Y, CON.PADDLE_WIDTH, CON.PADDLE_HEIGHT, CON.BASE_COLOR);
	const rightPaddle = new Paddle("right", (CON.config[config].screenWidth - CON.PADDLE_OFFSET_X - CON.PADDLE_WIDTH), CON.PADDLE_OFFSET_Y, CON.PADDLE_WIDTH, CON.PADDLE_HEIGHT, CON.BASE_COLOR);

	if (type === 0) {
		leftPaddle.setKeyListerns(leftPaddle, CON.config[config].leftPaddleUpKey, CON.config[config].leftPaddleDownKey, config);
	} else if (type === 1) {
		rightPaddle.setKeyListerns(rightPaddle, CON.config[config].rightPaddleUpKey, CON.config[config].rightPaddleDownKey, config);
	}
	paddels.push(leftPaddle);
	paddels.push(rightPaddle);
}


export function wallInitializer (walles: Wall[], config: keyof typeof CON.config) {
	
	if (CON.config[config].leftBackWall == true) {
		walles.push(new Wall("LeftBackTopWall", 1, 0, 0, CON.WALL_WIDTH, CON.config[config].screenHeight / 2 - CON.config[config].backWallGap, CON.BASE_COLOR));
		walles.push(new Wall("LeftBackBottomWall", 1, 0, CON.config[config].screenHeight / 2 + CON.config[config].backWallGap, CON.WALL_WIDTH, CON.config[config].screenHeight /  2 - CON.config[config].backWallGap, CON.BASE_COLOR));
	}

	if (CON.config[config].rightBackWall == true) {
		walles.push(new Wall("RightBackTopWall", 1, CON.config[config].screenWidth - CON.WALL_WIDTH, 0, CON.WALL_WIDTH, CON.config[config].screenHeight / 2 - CON.config[config].backWallGap, CON.BASE_COLOR));
		walles.push(new Wall("RightBackBottomWall", 1, CON.config[config].screenWidth - CON.WALL_WIDTH, CON.config[config].screenHeight / 2 + CON.config[config].backWallGap, CON.WALL_WIDTH, CON.config[config].screenHeight / 2 - CON.config[config].backWallGap, CON.BASE_COLOR));
	}
	
	//type 0 = horizontal wall, type 1 = vertical wall
	walles.push(new Wall("TopWall", 0, 0, 0, CON.config[config].screenWidth, CON.WALL_WIDTH, CON.BASE_COLOR));
	walles.push(new Wall("BottomWall", 0, 0, (CON.config[config].screenHeight - CON.WALL_WIDTH), CON.config[config].screenWidth, CON.WALL_WIDTH, CON.BASE_COLOR));
}


export function lineInitializer (lines: GameObject[], config: keyof typeof CON.config) {
	lines.push(new GameObject("centerLine", (CON.config[config].screenWidth / 2) - (CON.LINE_WIDTH / 2), 0, CON.LINE_WIDTH, CON.config[config].screenHeight, CON.BASE_COLOR));
}


export function keyListenerInitializer (listener: KeyListenerComponent, game: Game, config: keyof typeof CON.config) {
 	listener.addKeyCallback(" ", () => {
		console.log("Space pressed");
		//startKeyPressed(game, config);
	});
}


export function messageFieldInitializer (messageFields: TextComponent[], config: keyof typeof CON.config) {
	//messageFields.push(new TextComponent("center", CON.config[config].startMessage, CON.themes[theme].textFont, CON.themes[theme].textColor, CON.ALIGN, CON.BASELINE, CON.CENTER_MESSAGE_SIZE, CON.CENTER_MESSAGE_X, CON.CENTER_MESSAGE_Y));
	messageFields.push(new TextComponent("left", "LEFT MESSAGE", CON.MESSAGE_FONT, CON.MESSAGE_COLOR, CON.ALIGN, CON.BASELINE, CON.SIDE_MESSAGE_SIZE, CON.SIDE_MESSAGE_OFFSET_X, CON.SIDE_MESSAGE_OFFSET_Y));
	// messageFields.push(new TextComponent("right", "RIGHT MESSAGE", CON.themes[theme].textFont, CON.themes[theme].textColor , CON.ALIGN, CON.BASELINE, CON.SIDE_MESSAGE_SIZE, CON.SCREEN_WIDTH - CON.SIDE_MESSAGE_OFFSET_X, CON.SIDE_MESSAGE_OFFSET_Y));
	// messageFields.push(new TextComponent("top", "", CON.themes[theme].textFont, CON.themes[theme].textColor , CON.ALIGN, CON.BASELINE, CON.TOP_MESSAGE_SIZE, CON.TOP_MESSAGE_OFFSET_X, CON.TOP_MESSAGE_OFFSET_Y));
}


export function playerInitializer (players: PlayerComponent[], config: keyof typeof CON.config, gameUsers: UpdateGameUserDto []) {
	var player1 : string = "placeholder 1";
	var player2 : string = "AI";
	
	const user1 = gameUsers[0]!.user! as UpdateUserDto;
	console.log("Player: user1 = ", user1.userName!);	
	player1 = user1.userName!;
	
	if (gameUsers[1]) {
		const user2 = gameUsers[1].user as UpdateUserDto;
		console.log("Player: user2 = ", user2.userName!);
		player2 = user2.userName!;
	}
	
	players.push(new PlayerComponent(player1, 0, config));
	players.push(new PlayerComponent(player2, 1, config));
}
