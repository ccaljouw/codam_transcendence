import { Paddle } from '../gameObjects/Paddle'
import { Wall } from '../gameObjects/Wall'
import { GameObject } from '../gameObjects/GameObject'
import { PlayerComponent } from '../components/PlayerComponent'
import { Game } from '../components/Game'
import { KeyListenerComponent } from '../components/KeyListenerComponent'
import { TextComponent } from '../components/TextComponent'
// import { startKeyPressed } from './utils'
import { escapeKeyPressed } from './utils'
import { UpdateUserDto } from '@ft_dto/users'
import * as CON from './constants'
import { UpdateGameUserDto } from '@ft_dto/game'


export function canvasInitializer (game: Game ) {
	game.canvas!.width = CON.config[game.config].screenWidth;
	game.canvas!.height = CON.config[game.config].screenHeight;
}


export function paddleInitializer (game: Game ) {
	const paddleHeight = CON.config[game.config].screenHeight * CON.config[game.config].paddleHeightFactor;
	const leftPaddle = new Paddle(
		"left",
		CON.config[game.config].paddleOffset_X,
		CON.config[game.config].screenHeight / 2 - paddleHeight / 2,
		CON.config[game.config].paddleWidth,
		paddleHeight,
		CON.BASE_COLOR
	);
	const rightPaddle = new Paddle(
		"right",
		CON.config[game.config].screenWidth - CON.config[game.config].paddleOffset_X - CON.config[game.config].paddleWidth,
		CON.config[game.config].screenHeight / 2 - paddleHeight / 2,
		CON.config[game.config].paddleWidth,
		paddleHeight,
		CON.BASE_COLOR
	);

	if (game.instanceType === 0) {
		leftPaddle.setKeyListerns(leftPaddle, CON.config[game.config].leftPaddleUpKey, CON.config[game.config].leftPaddleDownKey, game.config);
	} else if (game.instanceType === 1) {
		rightPaddle.setKeyListerns(rightPaddle, CON.config[game.config].rightPaddleUpKey, CON.config[game.config].rightPaddleDownKey, game.config);
	}
	game.paddels.push(leftPaddle);
	game.paddels.push(rightPaddle);
}

export function setVerticalWalls (walls: Wall[], config: string) {
		walls.push(new Wall("LeftBackTopWall",
			1,
			0,
			0,
			CON.config[config].wallWidth,
			CON.config[config].screenHeight / 2 - CON.config[config].backWallGap,
			CON.BASE_COLOR
		));
		walls.push(new Wall("LeftBackBottomWall",
			1,
			0,
			CON.config[config].screenHeight / 2 + CON.config[config].backWallGap,
			CON.config[config].wallWidth,
			CON.config[config].screenHeight /  2 - CON.config[config].backWallGap,
			CON.BASE_COLOR
		));
		walls.push(new Wall("RightBackTopWall",
			1,
			CON.config[config].screenWidth - CON.config[config].wallWidth,
			0,
			CON.config[config].wallWidth,
			CON.config[config].screenHeight / 2 - CON.config[config].backWallGap,
			CON.BASE_COLOR
		));
		walls.push(new Wall("RightBackBottomWall",
			1,
			CON.config[config].screenWidth - CON.config[config].wallWidth,
			CON.config[config].screenHeight / 2 + CON.config[config].backWallGap,
			CON.config[config].wallWidth, CON.config[config].screenHeight / 2 - CON.config[config].backWallGap,
			CON.BASE_COLOR
		));
	

	//decativate the vertical walls bydefault
	walls.forEach(wall => {
		if (wall.getType() === 1) {
			wall.deactivate();
		}
	});
}

export function setHorizontalWalls (walls: Wall[], config: string) {
	walls.push(new Wall("TopWall",
		0,
		0,
		0,
		CON.config[config].screenWidth,
		CON.config[config].wallWidth,
		CON.BASE_COLOR
	));
	walls.push(new Wall("BottomWall",
		0,
		0,
		(CON.config[config].screenHeight - CON.config[config].wallWidth),
		CON.config[config].screenWidth,
		CON.config[config].wallWidth, CON.BASE_COLOR
	));
}

//type 0 = horizontal wall, type 1 = vertical wall
export function wallInitializer (walls: Wall[], config: string) {
	setHorizontalWalls(walls, config);	
	setVerticalWalls(walls, config);
}


export function lineInitializer (lines: GameObject[], config: string) {
	lines.push(new GameObject(
		"centerLine",
		(CON.config[config].screenWidth / 2) - (CON.config[config].lineWidth / 2),
		0,
		CON.config[config].lineWidth,
		CON.config[config].screenHeight,
		CON.BASE_COLOR
	));
}


export function keyListenerInitializer (game: Game) {
	if(CON.config[game.config].sensorInput === true) {
		return;
	}
	game.keyListener.addKeyCallback(" ", () => {
		console.log("Space pressed. No function added yet");
	});
	game.keyListener.addKeyCallback("Escape", () => {
		console.log("Escape key pressed, aborting game")
		escapeKeyPressed(game)
	});
}


export function messageFieldInitializer (messageFields: TextComponent[], config: string) {
	messageFields.push(new TextComponent("left",
		"Get Ready",
		CON.BASE_FONT,
		CON.BASE_COLOR,
		CON.ALIGN, CON.BASELINE,
		CON.BASE_FONT_SIZE,
		CON.config[config].bottomMessageOffset_X,
		CON.config[config].screenHeight - CON.config[config].wallWidth -	CON.config[config].bottomMessageOffset_Y));
	messageFields.push(new TextComponent("right",
		"",
		CON.BASE_FONT,
		CON.BASE_COLOR,
		CON.ALIGN,
		CON.BASELINE,
		CON.BASE_FONT_SIZE,
		CON.config[config].screenWidth / 2 + CON.config[config].bottomMessageOffset_X,
		CON.config[config].screenHeight - CON.config[config].wallWidth - CON.config[config].bottomMessageOffset_Y));
}


export function playerInitializer (players: PlayerComponent[], config: string, gameUsers: UpdateGameUserDto []) {
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

	//set the allignment of the player names
	players.forEach(player => {
		player.nameField?.setAlign("left");
	});
}
