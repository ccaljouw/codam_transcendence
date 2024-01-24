
import * as CON from "../utils/constants";
import { Wall } from "../gameObjects/Wall";
import { GameObject } from "../gameObjects/GameObject";
import { Paddle } from "../gameObjects/Paddle";
import { Ball } from "../gameObjects/Ball";
import { KeyListener } from "./KeyListener";
import { Player } from "./Player";
import { TextObject } from "./TextObject";
import { 
		detectCollision, detectScore } from "./collisionDetection";
import { checkWinCondition } from "../utils/utils";
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
	private	_canvas: HTMLCanvasElement;
	private	_ctx: CanvasRenderingContext2D;
	private	_keyListener: KeyListener = new KeyListener();
	private	_walls: Wall [] = [] ;
	private	_paddels: Paddle [] = [];
	private _lines: GameObject [] = [];

	public gameState = CON.GameState.ready;
	public messageFields: TextObject [] = [];
	public ball: Ball | null = null;
	public players: Player [] = [];


	constructor(newCanvas: HTMLCanvasElement) {
		this._canvas = newCanvas;
		this.initializeGameObjects();
		this._ctx = this._canvas.getContext("2d") as CanvasRenderingContext2D;
	}


	initializeGameObjects() {
		canvasInitializer(this._canvas);
		messageFieldInitializer(this.messageFields);
		paddleInitializer(this._paddels);
		wallInitializer(this._walls);
		lineInitializer(this._lines);
		playerInitializer(this.players);
		keyListenerInitializer(this._keyListener, this);
		this.resetBall()
	}
	

	resetBall() {
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
			this.endGame(winner);
		} else if (goal) {
			this.resetGame();
		}
		this.messageFields.forEach(message => message.update());
	}

	drawGameObjects() {
		this.ball?.draw(this._ctx);
		this._paddels.forEach(paddle => paddle.draw(this._ctx));
		this._walls.forEach(wall => wall.draw(this._ctx));
		this.players.forEach(player => player.scoreField?.draw(this._ctx));
		this.players.forEach(player => player.nameField?.draw(this._ctx));
		this.messageFields.forEach(message => message.draw(this._ctx));
		this._lines.forEach(line => line.draw(this._ctx));
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
		this.resetBall();
		this.messageFields[0].setText(CON.START_MESSAGE);
		this.gameState = 0;
		this.gameLoop();
	}


	resetGame() {
		this.gameState = 0;
		this.resetBall();
	}


	endGame(winner: string) {
	this.messageFields[0].setText(winner + " won the match");
	this.gameState = 3
}


	//to start the game
	startGame() {
		this.gameLoop();
	}
}
