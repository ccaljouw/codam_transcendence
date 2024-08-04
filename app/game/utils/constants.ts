import myThemes from '../pongThemes.json'
import myConfig from '../pongConfig.json'

//turn on or of console logging for the game script here
export const logging = true;

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
	leftPlayerFont: string;
	rightPlayerFont: string;
	leftPlayerSize: number;
	rightPlayerSize: number;
	textColor: string;
	textFont: string;
	leftScoreFieldColor: string;
	rightScoreFieldColor: string;
	leftScoreFieldFont: string;
	rightScoreFieldFont: string;
	leftScoreFieldSize: number;
	rightScoreFieldSize: number;
	bottomLeftTextColor: string;
	bottomLeftTextFont: string;
	bottomLeftTextSize: number;
	bottomRightTextColor: string;
	bottomRightTextFont: string;
	bottomRightTextSize: number;
};

function parseThemes(jsonThemes: any): Record<string, Theme> {
	const themes: Record<string, Theme> = {};

	for (const key in jsonThemes) {
		const value = jsonThemes[key];
		themes[key] = {
			leftPaddleColor: value.leftPaddleColor,
			rightPaddleColor: value.rightPaddleColor,
			ballColor: value.ballColor,
			backgroundColor: value.backgroundColor,
			lineColor: value.lineColor,
			wallColor: value.wallColor,
			backWallColor: value.backWallColor,
			leftPlayerColor: value.leftPlayerColor,
			rightPlayerColor: value.rightPlayerColor,
			leftPlayerFont: value.leftPlayerFont,
			rightPlayerFont: value.rightPlayerFont,
			leftPlayerSize: parseInt(value.leftPlayerSize, 10),
			rightPlayerSize: parseInt(value.rightPlayerSize, 10),
			textColor: value.textColor,
			textFont: value.textFont,
			leftScoreFieldColor: value.leftScoreFieldColor,
			rightScoreFieldColor: value.rightScoreFieldColor,
			leftScoreFieldFont: value.leftScoreFieldFont,
			rightScoreFieldFont: value.rightScoreFieldFont,
			leftScoreFieldSize: parseInt(value.leftScoreFieldSize, 10),
			rightScoreFieldSize: parseInt(value.rightScoreFieldSize, 10),
			bottomLeftTextColor: value.bottomLeftTextColor,
			bottomLeftTextFont: value.bottomLeftTextFont,
			bottomLeftTextSize: parseInt(value.bottomLeftTextSize, 10),
			bottomRightTextColor: value.bottomRightTextColor,
			bottomRightTextFont: value.bottomRightTextFont,
			bottomRightTextSize: parseInt(value.bottomRightTextSize, 10),
		};
	}
	return themes;
}
export const themes: Record<string, Theme> = parseThemes(myThemes);


type Config = {
	screenWidth: number;
	screenHeight: number;
	countdownTime: number;
	winningScore: number;
	collisionCooldown: number;
	ballWidth: number;
	ballBaseSpeed: number;
	ballSpeedIncrease: number;
	paddleBaseSpeed: number;
	socketUpdateInterval: number;
	interpolationFactor: number;
	sensorInput: boolean;
	leftPaddleUpKey: string;
	leftPaddleDownKey: string;
	rightPaddleUpKey: string;
	rightPaddleDownKey: string;
	backWallGap: number;
	startMessage: string;
	winMessage: string;
	scoreFieldOffset_X: number;
	scoreFieldOffset_Y: number;
	bottomMessageOffset_X: number;
	bottomMessageOffset_Y: number;
	playerNameOffset_X: number;
	playerNameOffset_Y: number;
	lineWidth: number;
	wallWidth: number;
	paddleWidth: number;
	paddleOffset_X: number;
	paddleHeightFactor: number;
	paddleGap: number;
	AILevel: number;
	helpAtEnd: boolean;
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
			ballWidth: parseInt(value.ballWidth, 10),
			ballBaseSpeed: parseInt(value.ballBaseSpeed, 10),
			ballSpeedIncrease: parseInt(value.ballSpeedIncrease, 10),
			socketUpdateInterval: parseFloat(value.socketUpdateInterval),
			interpolationFactor: parseFloat(value.interpolationFactor),
			paddleBaseSpeed: parseInt(value.paddleBaseSpeed, 10),
			sensorInput: value.sensorInput === "true",
			leftPaddleUpKey: value.leftPaddleUpKey,
			leftPaddleDownKey: value.leftPaddleDownKey,
			rightPaddleUpKey: value.rightPaddleUpKey,
			rightPaddleDownKey: value.rightPaddleDownKey,
			backWallGap: parseInt(value.backWallGap, 10),
			startMessage: value.startMessage,
			winMessage: value.winMessage,
			scoreFieldOffset_X: parseInt(value.scoreFieldOffset_X, 10),
			scoreFieldOffset_Y: parseInt(value.scoreFieldOffset_Y, 10),
			bottomMessageOffset_X: parseInt(value.bottomMessageOffset_X, 10),
			bottomMessageOffset_Y: parseInt(value.bottomMessageOffset_Y, 10),
			playerNameOffset_X: parseInt(value.playerNameOffset_X, 10),
			playerNameOffset_Y: parseInt(value.playerNameOffset_Y, 10),
			lineWidth: parseInt(value.lineWidth, 10),
			wallWidth: parseInt(value.wallWidth, 10),
			paddleWidth: parseInt(value.paddleWidth, 10),
			paddleOffset_X: parseInt(value.paddleOffset_X, 10),
			paddleHeightFactor: parseFloat(value.paddleHeightFactor),
			paddleGap: parseInt(value.paddleGap, 10),
			AILevel: parseFloat(value.AILevel),
			helpAtEnd: value.helpAtEnd === "true",
		};
	}
	return config;
}
export const config: Record<string, Config> = parseConfig(myConfig);


//ball
export const BALL_MAX_START_ANGLE : number = Math.PI / 6;
export const BALL_MIN_START_ANGLE : number = -Math.PI / 6;
export const MAX_BOUNCE_ANGLE : number = Math.PI / 4;

//text
export const BASE_COLOR = "white";
export const BASE_FONT = "Arial";
export const BASE_FONT_SIZE = 30;
export const ALIGN = "center";
export const BASELINE = "middle";

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

export enum InstanceTypes {
	left,
	right,
	notSet
}

export enum PlayerSide {
	left,
	right,
}

export enum configTypes {
	standard,
	test,
	strongPong,
}
