import myThemes from "../pongthemes.json";
import myConfig from "../pongconfig.json";
import e from "express";

type Theme = {
	leftPaddleColor: string;
	rightPaddleColor: string;
	ballColor: string;
	backgroundColor: string;
	lineColor: string;
	wallColor: string;
	backWallColor: string;
	leftPlayerColor: string;
	rightPlayerColor: string;
	textColor: string;
	textFont: string;
};
export const themes: Record<string, Theme> = myThemes;

type Config = {
	screenWidth: number;
	screenHeight: number;
	countdownTime: number;
	winningScore: number;
	collisionCooldown: number;
	ballBaseSpeed: number;
	ballSpeedIncrease: number;
	paddleBaseSpeed: number;
	leftPaddleUpKey: string;
	leftPaddleDownKey: string;
	rightPaddleUpKey: string;
	rightPaddleDownKey: string;
	leftBackWall: boolean;
	rightBackWall: boolean;
	backWallGap: number;
	startMessage: string;
	winMessage: string;
};

function parseConfig(jsonConfig: any): Record<string, Config> {
	const config: Record<string, Config> = {};

	for (const key in jsonConfig) {
		const value = jsonConfig[key];
		config[key] = {
			screenWidth: parseInt(value.screenWidth, 10),
			screenHeight: parseInt(value.screenHeight, 10),
			countdownTime: parseInt(value.countdownTime, 10),
			winningScore: parseInt(value.winningScore, 10),
			collisionCooldown: parseInt(value.collisionCooldown, 10),
			ballBaseSpeed: parseInt(value.ballBaseSpeed, 10),
			ballSpeedIncrease: parseInt(value.ballSpeedIncrease, 10),
			paddleBaseSpeed: parseInt(value.paddleBaseSpeed, 10),
			leftPaddleUpKey: value.leftPaddleUpKey,
			leftPaddleDownKey: value.leftPaddleDownKey,
			rightPaddleUpKey: value.rightPaddleUpKey,
			rightPaddleDownKey: value.rightPaddleDownKey,
			leftBackWall: value.leftBackWall === "true",
			rightBackWall: value.rightBackWall === "true",
			backWallGap: parseInt(value.backWallGap, 10),
			startMessage: value.startMessage,
			winMessage: value.winMessage,
		};
	}
	return config;
}
export const config: Record<string, Config> = parseConfig(myConfig);


//ball
const SCREEN_WIDTH : number = config.standard.screenWidth;
const SCREEN_HEIGHT : number = config.standard.screenHeight;

export const BALL_WIDTH : number = 15;
export const BALL_START_X : number = SCREEN_WIDTH / 2  - BALL_WIDTH / 2;
export const BALL_START_Y : number = SCREEN_HEIGHT / 2 - BALL_WIDTH / 2;
export const BALL_MAX_START_ANGLE : number = Math.PI / 6;
export const BALL_MIN_START_ANGLE : number = -Math.PI / 6;
export const MAX_BOUNCE_ANGLE : number = Math.PI / 4;

//lines
export const LINE_WIDTH : number = 6;

//wall
export const WALL_WIDTH : number = 20;
// export const BACK_WALL_GAP : number = 100;

//paddle
export const PADDLE_WIDTH : number = 20;
export const PADDLE_HEIGHT : number = SCREEN_HEIGHT / 4 
export const PADDLE_OFFSET_X : number = 25;
export const PADDLE_OFFSET_Y : number = SCREEN_HEIGHT / 2 - PADDLE_HEIGHT / 2;
export const PADDLE_MIN_Y : number = WALL_WIDTH + 2;
export const PADDLE_MAX_Y : number = SCREEN_HEIGHT - PADDLE_HEIGHT - WALL_WIDTH - 2;

//score
export const SCORE_SIZE : number = 70;
export const SCORE_OFFSET_X : number = 70;
export const SCORE_OFFSET_Y : number = 100;

//player
export const PLAYER_SIZE = 30;
export const PLAYER_OFFSET_X = 150;
export const PLAYER_OFFSET_Y = 50;
export const PLAYER_1_NAME = "Left Player Name";
export const PLAYER_2_NAME = "Right Player Name";


//messages
export const ALIGN = "center";
export const BASELINE = "middle";

//center message
// export const CENTER_MESSAGE_SIZE = 30;
// export const CENTER_MESSAGE_X = SCREEN_WIDTH / 2 - CENTER_MESSAGE_SIZE / 2;
// export const CENTER_MESSAGE_Y = SCREEN_HEIGHT - WALL_WIDTH -  CENTER_MESSAGE_SIZE - 200;

//left and right messages (side)
export const SIDE_MESSAGE_SIZE = 25;
export const SIDE_MESSAGE_OFFSET_X = WALL_WIDTH + SIDE_MESSAGE_SIZE + 200;
export const SIDE_MESSAGE_OFFSET_Y = SCREEN_HEIGHT - WALL_WIDTH + SIDE_MESSAGE_SIZE - 50;

//top message
// export const TOP_MESSAGE_SIZE = 30;
// export const TOP_MESSAGE_OFFSET_X = SCREEN_WIDTH / 2 - TOP_MESSAGE_SIZE - 200;
// export const TOP_MESSAGE_OFFSET_Y = WALL_WIDTH + TOP_MESSAGE_SIZE + 100;


// export enum GameState {
// 	waiting,
// 	play,
// 	// pause,
// 	end
// }

export enum WallTypes {
	horizontal,
	vertical
}

export enum MessageFields {
	center, 
	left,
	right,
	top,
}

export enum instanceTypes {
	left,
	right,
	observer
}

export enum PlayerSide {
	left,
	right
}



