import { Paddle } from '../gameObjects/Paddle'
import { Wall } from '../gameObjects/Wall'
import { GameObject } from '../gameObjects/GameObject'
import { PlayerComponent } from '../components/PlayerComponent'
import { Game } from '../components/Game'
import { KeyListenerComponent } from '../components/KeyListenerComponent'
import { TextComponent } from '../components/TextComponent'
// import { startKeyPressed } from './utils'
import { UpdateUserDto } from '@ft_dto/users'
import * as CON from './constants'
import { UpdateGameUserDto } from '@ft_dto/game'


export function canvasInitializer (canvas: HTMLCanvasElement, config: keyof typeof CON.config) {
	canvas.width = CON.config[config].screenWidth;
	canvas.height = CON.config[config].screenHeight;
}


export function paddleInitializer (paddels: Paddle[], config: keyof typeof CON.config, type: CON.InstanceTypes) {
	const paddleHeight = CON.config[config].screenHeight * CON.config[config].paddleHeightFactor;
	const leftPaddle = new Paddle(
		"left",
		CON.config[config].paddleOffset_X,
		CON.config[config].screenHeight / 2 - paddleHeight / 2,
		CON.config[config].paddleWidth,
		paddleHeight,
		CON.BASE_COLOR
	);
	const rightPaddle = new Paddle(
		"right",
		CON.config[config].screenWidth - CON.config[config].paddleOffset_X - CON.config[config].paddleWidth,
		CON.config[config].screenHeight / 2 - paddleHeight / 2,
		CON.config[config].paddleWidth,
		paddleHeight,
		CON.BASE_COLOR
	);

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
		walles.push(new Wall("LeftBackTopWall",
			1,
			0,
			0,
			CON.config[config].wallWidth,
			CON.config[config].screenHeight / 2 - CON.config[config].backWallGap,
			CON.BASE_COLOR
		));
		walles.push(new Wall("LeftBackBottomWall",
			1,
			0,
			CON.config[config].screenHeight / 2 + CON.config[config].backWallGap,
			CON.config[config].wallWidth,
			CON.config[config].screenHeight /  2 - CON.config[config].backWallGap,
			CON.BASE_COLOR
		));
	}

	if (CON.config[config].rightBackWall == true) {
		walles.push(new Wall("RightBackTopWall",
			1,
			CON.config[config].screenWidth - CON.config[config].wallWidth,
			0,
			CON.config[config].wallWidth,
			CON.config[config].screenHeight / 2 - CON.config[config].backWallGap,
			CON.BASE_COLOR
		));
		walles.push(new Wall("RightBackBottomWall",
			1,
			CON.config[config].screenWidth - CON.config[config].wallWidth,
			CON.config[config].screenHeight / 2 + CON.config[config].backWallGap,
			CON.config[config].wallWidth, CON.config[config].screenHeight / 2 - CON.config[config].backWallGap,
			CON.BASE_COLOR
		));
	}
	
	//type 0 = horizontal wall, type 1 = vertical wall
	walles.push(new Wall("TopWall",
		0,
		0,
		0,
		CON.config[config].screenWidth,
		CON.config[config].wallWidth,
		CON.BASE_COLOR
	));
	walles.push(new Wall("BottomWall",
		0,
		0,
		(CON.config[config].screenHeight - CON.config[config].wallWidth),
		CON.config[config].screenWidth,
		CON.config[config].wallWidth, CON.BASE_COLOR
	));
}


export function lineInitializer (lines: GameObject[], config: keyof typeof CON.config) {
	lines.push(new GameObject(
		"centerLine",
		(CON.config[config].screenWidth / 2) - (CON.config[config].lineWidth / 2),
		0,
		CON.config[config].lineWidth,
		CON.config[config].screenHeight, CON.BASE_COLOR
	));
}


export function keyListenerInitializer (listener: KeyListenerComponent, game: Game, config: keyof typeof CON.config) {
	if(CON.config[config].sensorInput === true) {
		return;
	}
	listener.addKeyCallback(" ", () => {
		console.log("Space pressed");
		//startKeyPressed(game, config);
	});
}


export function messageFieldInitializer (messageFields: TextComponent[], config: keyof typeof CON.config) {
	messageFields.push(new TextComponent("left",
		"LEFT MESSAGE",
		CON.BASE_FONT,
		CON.BASE_COLOR,
		CON.ALIGN, CON.BASELINE,
		CON.BASE_FONT_SIZE,
		CON.config[config].bottomMessageOffset_X,
		CON.config[config].screenHeight - CON.config[config].wallWidth -	CON.config[config].bottomMessageOffset_Y));
	messageFields.push(new TextComponent("right",
		"RIGHT MESSAGE",
		CON.BASE_FONT,
		CON.BASE_COLOR,
		CON.ALIGN,
		CON.BASELINE,
		CON.BASE_FONT_SIZE,
		CON.config[config].screenWidth / 2 + CON.config[config].bottomMessageOffset_X,
		CON.config[config].screenHeight - CON.config[config].wallWidth - CON.config[config].bottomMessageOffset_Y));
}


export function playerInitializer (players: PlayerComponent[], config: keyof typeof CON.config, gameUsers: UpdateGameUserDto []) {
	var player1 : string = "placeholder name 1";
	var player2 : string = "placehoder name 2";
	
	const user1 = gameUsers[0]!.user! as UpdateUserDto;
	console.log("Player: user1 = ", user1.userName!);	
	player1 = user1.userName!;
	players.push(new PlayerComponent(player1, 0, config));
	
	if (gameUsers[1]) {
		const user2 = gameUsers[1].user as UpdateUserDto;
		console.log("Player: user2 = ", user2.userName!);
		player2 = user2.userName!;
		players.push(new PlayerComponent(player2, 1, config));
	}
}
