
import * as CON from "../utils/constants.js";
import { Wall } from "../gameObjects/Wall.js";
import { Line } from "../gameObjects/Line.js";
import { Paddle } from "../gameObjects/Paddle.js";
import { Ball } from "../gameObjects/Ball.js";
import { KeyListener } from "./KeyListner.js";
import { Player } from "./Player.js";
import { TextObject } from "./TextObject.js";
import { detectCollision } from "./collisionDetection.js";
import {
		settleScore,
		endGame,
		updateMessageField } from "../utils/utils.js";
import {
	 	wallInitializer,
		paddleInitializer,
		ballInitializer,
		keyListenerInitializer,
		messageFieldInitializer,
		lineInitializer,
		canvasInitializer } from "./initializers.js";


export class Game {
	public gameState = CON.GameState.ready;
	public messageField: TextObject | null = null;
	public ball: Ball | null = null;
	public players: Player [] = [];

	private	_canvas: HTMLCanvasElement = document.createElement("canvas");
	private	_ctx: CanvasRenderingContext2D;
	// private _background = LoadBackground();
	private	_keyListener: KeyListener | null = null;
	private	_walls: Wall [] = [] ;
	private	_paddels: Paddle [] = [];
	private _lines: Line [] = [];


	constructor() {
		canvasInitializer(this._canvas);
		this._ctx = this._canvas.getContext("2d") as CanvasRenderingContext2D;
		document.body.appendChild(this._canvas);
		this.initializeGameObjects();
	}
	
	initializeGameObjects() {
		this.messageField = messageFieldInitializer();
		this._paddels.push(paddleInitializer("Right"));
		this._paddels.push(paddleInitializer("Left"));
		
		this._walls.push(wallInitializer("Top", 0));
		this._walls.push(wallInitializer("Bottom", 0));

		this._lines.push(lineInitializer("Center"));
		
		this._keyListener = keyListenerInitializer(this);
		this.setPlayers()
		this.setBall()
	}


	setBall() {
		this.ball = null;
		this.ball = ballInitializer();
	}


	setPlayers() {
		this.players.push(new Player(CON.PLAYER_1_NAME, "Left"));
		this.players.push(new Player(CON.PLAYER_2_NAME, "Right"));
	}


	updateGameObjects() {
		this._paddels.forEach(paddle => paddle.updatePaddle(this.gameState));
		this.ball?.updateBall(this.gameState);
		
		if (this.ball) {
			const scored = detectCollision(this.ball, this._paddels, this._walls);
			if (scored) {
				let win = settleScore(this.players, scored);
				if (win) {
					endGame(this, win);
				} else {
					this.resetGame();
				}
			}
		}
			
		if (this.messageField ) {
			updateMessageField(this.messageField, this.gameState);
		}
	}

	
	drawGameObjects() {
		// this._ctx.drawImage(this._background, 0, 0);
		this._lines.forEach(line => line.draw(this._ctx));
		this._walls.forEach(wall => wall.draw(this._ctx));
		this._paddels.forEach(paddle => paddle.draw(this._ctx));
		this.players.forEach(player => player.scoreField?.draw(this._ctx));
		this.players.forEach(player => player.nameField?.draw(this._ctx));
		this.ball?.draw(this._ctx);
		this.messageField?.draw(this._ctx);
	}

	//todo: add interpolation an dpauze
	gameLoop() {
		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
		this.updateGameObjects();
		this.drawGameObjects();
				
		//request next frame
		if (this.gameState == 1 || this.gameState == 0) {
			requestAnimationFrame(this.gameLoop.bind(this));
		}
	}

	resetMatch() {
		for (let player of this.players) {
			player.resetScore();
			player.scoreField?.setText(player.getScore().toString());
		}
		this.setBall();
		this.gameState = 0;
		this.messageField?.setText(CON.START_MESSAGE);
		this.gameLoop();
	}

	resetGame() {
		this.gameState = 0;
		this.setBall();
	}

	//to start the game
	startGame() {
		this.gameLoop();
	}
}
