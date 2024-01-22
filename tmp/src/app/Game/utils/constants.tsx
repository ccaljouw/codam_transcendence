//define constant values
export const GAME_NAME = "Pong";


//screen
export const SCREEN_WIDTH = 1280;
export const SCREEN_HEIGHT = 720;
export const BACKGROUND_COLOR = "black";
export const BACKGROUND_IMAGE = "assets/background.png";


//wall
export const WALL_WIDTH = 20;
export const WALL_COLOR = "blue";
export const MARGIN = 3;

//lines
export const LINE_WIDTH = 6;
export const LINE_COLOR = "white";

//paddle
export const PADDLE_BASE_SPEED = 15;
export const PADDLE_WIDTH = 20;
export const PADDLE_HEIGHT = 150;
export const PADDLE_OFFSET_X = 25;
export const PADDLE_OFFSET_Y = SCREEN_HEIGHT / 2 - PADDLE_HEIGHT / 2;
export const LEFT_PADDLE_COLOR = "red";
export const RIGHT_PADDLE_COLOR = "green";
export const PADDLE_MIN_Y = WALL_WIDTH + PADDLE_BASE_SPEED;
export const PADDLE_MAX_Y = SCREEN_HEIGHT - PADDLE_HEIGHT - WALL_WIDTH - PADDLE_BASE_SPEED;


//ball
export const BALL_WIDTH = 15;
export const BALL_COLOR = "orange";
export const BALL_BASE_SPEED = 3;
export const BALL_START_X = SCREEN_WIDTH / 2  - BALL_WIDTH / 2;
export const BALL_START_Y = SCREEN_HEIGHT / 2 - BALL_WIDTH / 2;
export const BALL_SPEED_INCREASE = 0.1;
export const BALL_MAX_START_ANGLE = Math.PI / 6;
export const BALL_MIN_START_ANGLE = -Math.PI / 6;
export const MAX_BOUNCE_ANGLE = Math.PI / 4;


//score
export const SCORE_COLOR = "white";
export const SCORE_FONT = "Arial";
export const SCORE_SIZE = 70;
export const SCORE_OFFSET_X = 70;
export const SCORE_OFFSET_Y = 100;
export const SCORE_ALIGN = "center";
export const SCORE_BASELINE = "middle";
export const WINNING_SCORE = 2;


//player
export const PLAYER_1_COLOR = LEFT_PADDLE_COLOR;
export const PLAYER_2_COLOR = RIGHT_PADDLE_COLOR;
export const PLAYER_FONT = "Arial";
export const PLAYER_SIZE = 30;
export const PLAYER_OFFSET_X = 100;
export const PLAYER_OFFSET_Y = 50;
export const PLAYER_ALIGN = "center";
export const PLAYER_BASELINE = "middle";
export const PLAYER_1_NAME = "Godzilla";
export const PLAYER_2_NAME = "King Kong";


//keymappping
export const LEFT_PADDLE_UP_KEY = "w";
export const LEFT_PADDLE_DOWN_KEY = "s";
export const RIGHT_PADDLE_UP_KEY = "ArrowUp";
export const RIGHT_PADDLE_DOWN_KEY = "ArrowDown";
export const PAUSE_KEY = "p";
export const START_KEY = 32;


//messages
export const MESSAGE_COLOR = "white";
export const MESSAGE_FONT = "Arial";
export const MESSAGE_SIZE = 40;
export const MESSAGE_OFFSET_X = 0
export const MESSAGE_OFFSET_Y = 500;
export const MESSAGE_ALIGN = "center";
export const MESSAGE_BASELINE = "middle";

export const START_MESSAGE = "Press SPACE to start";
export const PAUSE_MESSAGE = "Press SPACE to resume";
export const WIN_MESSAGE = "Press SPACE to restart";

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

