
import * as CON from "../utils/constants";
import { Wall } from "../gameObjects/Wall";
import { Line } from "../gameObjects/Line";
import { Paddle } from "../gameObjects/Paddle";
import { Ball } from "../gameObjects/Ball";
import { KeyListener } from "./KeyListener";
import { Player } from "./Player";
import { TextObject } from "./TextObject";
import { 
		detectCollision, detectScore } from "./collisionDetection";
import { endGame, updateMainMessage, checkWinCondition } from "../utils/utils";
import {
	 	wallInitializer,
		paddleInitializer,
		ballInitializer,
		keyListenerInitializer,
		messageFieldInitializer,
		playerInitializer,
		lineInitializer,
		canvasInitializer } from "./initializers";


export class Game {
	public gameState = CON.GameState.ready;
	public messageField: TextObject | null = null;
	public ball: Ball | null = null;
	public players: Player [] = [];

	private	_canvas: HTMLCanvasElement;
	private	_ctx: CanvasRenderingContext2D;
	private	_keyListener: KeyListener | null = null;
	private	_walls: Wall [] = [] ;
	private	_paddels: Paddle [] = [];
	private _lines: Line [] = [];


	constructor(newCanvas: HTMLCanvasElement) {
		this._canvas=newCanvas;
		canvasInitializer(this._canvas);
		this._ctx = this._canvas.getContext("2d") as CanvasRenderingContext2D;
		this.initializeGameObjects();
	}


	initializeGameObjects() {
		this.messageField = messageFieldInitializer();
		paddleInitializer(this._paddels);
		wallInitializer(this._walls);
		
		this._lines.push(lineInitializer("Center"));
		
		this._keyListener = keyListenerInitializer(this);
		playerInitializer(this.players);
		this.setBall()
	}


	setBall() {
		this.ball = null;
		this.ball = ballInitializer();
	}


	updateGameObjects() {
		this._paddels.forEach(paddle => paddle.updatePaddle(this.gameState));
		this.ball?.updateBall(this.gameState);
		detectCollision(this.ball as Ball, this._paddels, this._walls);
		
		let goal = detectScore(this.ball as Ball, this.players)
		let winner = checkWinCondition(this.players);
		if (winner) {
			endGame(this, winner);
		} else if (goal) {
			this.resetGame();
		}
	
		if (this.messageField ) {
			updateMainMessage(this.messageField, this.gameState);
		}
	}
	
	drawGameObjects() {
		this._lines.forEach(line => line.draw(this._ctx));
		this._walls.forEach(wall => wall.draw(this._ctx));
		this._paddels.forEach(paddle => paddle.draw(this._ctx));
		this.players.forEach(player => player.scoreField?.draw(this._ctx));
		this.players.forEach(player => player.nameField?.draw(this._ctx));
		this.ball?.draw(this._ctx);
		this.messageField?.draw(this._ctx);
	}

	//todo: add interpolation and implement pauze
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
