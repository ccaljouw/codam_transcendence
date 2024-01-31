
//define constant values
export var scale = .6;

//screen
export const SCREEN_WIDTH : number = 1280 * scale;
export const SCREEN_HEIGHT : number = 720 * scale;
export const BACKGROUND_COLOR = "black";
export const BACKGROUND_IMAGE = "assets/background.png";
export const MARGIN : number = 5;


//lines
export const LINE_WIDTH : number = 6 * scale;
export const LINE_COLOR = "white";


//wall
export const WALL_WIDTH : number = 20 * scale;
export const WALL_COLOR = "blue";
export const BACK_WALL_GAP : number = 100 * scale;
export const BACK_WALL_COLOR = "red";


//paddle
export const PADDLE_BASE_SPEED : number = 10 * (scale / 2);

export const PADDLE_WIDTH : number = 20 * scale;
export const PADDLE_HEIGHT : number = SCREEN_HEIGHT / 4 
export const PADDLE_OFFSET_X : number = 25 * scale;
export const PADDLE_OFFSET_Y : number = SCREEN_HEIGHT / 2 - PADDLE_HEIGHT / 2;
export const LEFT_PADDLE_COLOR = "red";
export const RIGHT_PADDLE_COLOR = "green";
export const PADDLE_MIN_Y : number = WALL_WIDTH + MARGIN;
export const PADDLE_MAX_Y : number = SCREEN_HEIGHT - PADDLE_HEIGHT - WALL_WIDTH - MARGIN;


//ball
export const BALL_WIDTH : number = 15 * scale;
export const BALL_COLOR = "orange";
export const BALL_BASE_SPEED : number = 3 * scale;
export const BALL_START_X : number = SCREEN_WIDTH / 2  - BALL_WIDTH / 2;
export const BALL_START_Y : number = SCREEN_HEIGHT / 2 - BALL_WIDTH / 2;
export const BALL_SPEED_INCREASE : number = 0.1;
export const BALL_MAX_START_ANGLE : number = Math.PI / 6;
export const BALL_MIN_START_ANGLE : number = -Math.PI / 6;
export const MAX_BOUNCE_ANGLE : number = Math.PI / 4;


//score
export const SCORE_COLOR = "white";
export const SCORE_FONT = "Arial";
export const SCORE_SIZE : number = 70 * scale;
export const SCORE_OFFSET_X : number = 70;
export const SCORE_OFFSET_Y : number = 100;
export const SCORE_ALIGN = "center";
export const SCORE_BASELINE = "middle";
export const WINNING_SCORE : number = 2;


//player
export const PLAYER_1_COLOR = LEFT_PADDLE_COLOR;
export const PLAYER_2_COLOR = RIGHT_PADDLE_COLOR;
export const PLAYER_FONT = "Arial";
export const PLAYER_SIZE = 30 * scale;
export const PLAYER_OFFSET_X = 100 * scale;
export const PLAYER_OFFSET_Y = 50 * scale;
export const PLAYER_ALIGN = "center";
export const PLAYER_BASELINE = "middle";
export const PLAYER_1_NAME = "Godzilla";
export const PLAYER_2_NAME = "King Kong";
export const PLAYER_1_BACKWALLS : boolean = false;
export const PLAYER_2_BACKWALLS : boolean = false;

//keymappping
export const LEFT_PADDLE_UP_KEY = "w";
export const LEFT_PADDLE_DOWN_KEY = "s";
export const RIGHT_PADDLE_UP_KEY = "ArrowUp";
export const RIGHT_PADDLE_DOWN_KEY = "ArrowDown";
// export const PAUSE_KEY = "p";
// export const START_KEY = 32;


//messages
//center message
export const CENTER_MESSAGE_SIZE = 70 * scale;
export const CENTER_MESSAGE_X = SCREEN_WIDTH / 2 - CENTER_MESSAGE_SIZE / 2;
export const CENTER_MESSAGE_Y = SCREEN_HEIGHT - WALL_WIDTH -  CENTER_MESSAGE_SIZE - (200 * scale);
export const CENTER_MESSAGE_ALIGN = "center";
export const CENTER_MESSAGE_BASELINE = "middle";
export const CENTER_MESSAGE_COLOR = "white";
export const CENTER_MESSAGE_FONT = "Arial";
//left and right messages (side)
export const SIDE_MESSAGE_SIZE = 30 * scale;
export const SIDE_MESSAGE_OFFSET_X = WALL_WIDTH + SIDE_MESSAGE_SIZE + (300 * scale);
export const SIDE_MESSAGE_OFFSET_Y = SCREEN_HEIGHT - WALL_WIDTH + SIDE_MESSAGE_SIZE - (50 * scale);
export const SIDE_MESSAGE_ALIGN = "center";
export const SIDE_MESSAGE_BASELINE = "middle";
export const SIDE_MESSAGE_COLOR = "white";
export const SIDE_MESSAGE_FONT = "Arial";
//top message
export const TOP_MESSAGE_SIZE = 40 * scale;
export const TOP_MESSAGE_OFFSET_X = SCREEN_WIDTH / 2 - TOP_MESSAGE_SIZE - (200 * scale);
export const TOP_MESSAGE_OFFSET_Y = WALL_WIDTH + TOP_MESSAGE_SIZE + (100 * scale);
export const TOP_MESSAGE_ALIGN = "center";
export const TOP_MESSAGE_BASELINE = "middle";
export const TOP_MESSAGE_COLOR = "white";
export const TOP_MESSAGE_FONT = "Arial";
//messages
export const START_MESSAGE = "Press SPACE to start a game";
export const PAUSE_MESSAGE = "Game Paused";
export const WIN_MESSAGE = "Press SPACE to start a new match";


export enum GameState {
	ready,
	play,
	pause,
	end
}

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

