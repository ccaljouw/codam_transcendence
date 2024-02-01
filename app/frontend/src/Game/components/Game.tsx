
import * as CON from "../utils/constants";
import { Wall } from "../gameObjects/Wall";
import { GameObject } from "../gameObjects/GameObject";
import { Paddle } from "../gameObjects/Paddle";
import { Ball } from "../gameObjects/Ball";
import { KeyListenerComponent } from "./KeyListenerComponent";
import { PlayerComponent } from "./PlayerComponent";
import { TextComponent } from "./TextComponent";
import { 
		detectCollision } from "../utils/collisionDetection";
import { detectScore, checkWinCondition } from "../utils/utils";
import {
	 	wallInitializer,
		paddleInitializer,
		ballInitializer,
		keyListenerInitializer,
		messageFieldInitializer,
		playerInitializer,
		lineInitializer,
		canvasInitializer } from "../utils/initializers";


export class Game {
	private	_canvas: HTMLCanvasElement;
	private	_ctx: CanvasRenderingContext2D;
	private	_keyListener: KeyListenerComponent = new KeyListenerComponent();
	private	_walls: Wall [] = [] ;
	private	_paddels: Paddle [] = [];
	private _lines: GameObject [] = [];
	private _players: PlayerComponent [] = [];
	public gameState = CON.GameState.ready;
	public messageFields: TextComponent [] = [];
	public ball: Ball | null = null;

	constructor(newCanvas: HTMLCanvasElement, width: number) {
		this._canvas = newCanvas;
		this.initializeGameObjects(width);
		this._ctx = this._canvas.getContext("2d") as CanvasRenderingContext2D;
		// this.updateSize(width);
	}


	initializeGameObjects(width: number) {
		canvasInitializer(this._canvas, width);
		messageFieldInitializer(this.messageFields);
		paddleInitializer(this._paddels);
		wallInitializer(this._walls);
		lineInitializer(this._lines);
		playerInitializer(this._players);
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
		
		let goal = detectScore(this.ball as Ball, this._players)
		let winner = checkWinCondition(this._players) 
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
		this._lines.forEach(line => line.draw(this._ctx));
		this._walls.forEach(wall => wall.draw(this._ctx));
		this._players.forEach(player => player.scoreField?.draw(this._ctx));
		this._players.forEach(player => player.nameField?.draw(this._ctx));
		this.messageFields.forEach(message => message.draw(this._ctx));
	}



	//todo: add interpolation and implement pauze
	gameLoop() {
		if (this.gameState == 3) {
			return;
		}
		

		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
		
		if (this.gameState == 1) {
			this.updateGameObjects();
		}
		this.drawGameObjects();
		
		requestAnimationFrame(this.gameLoop.bind(this));
	}


	resetMatch() {
		for (let player of this._players) {
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
		this._paddels.forEach(paddle => paddle.resetPaddle());
		this.messageFields[3].setText("GOAL!");
		this.messageFields[1].setText(CON.START_MESSAGE);
		this.resetBall();
	}


	endGame(winner: PlayerComponent) {
	if (winner) {
		let i: CON.MessageFields = winner.getSide() == "left" ? 1 : 2;
		let name = winner.getName();
		this.messageFields[i].setText(name + " won the match!");
	}
	this.gameState = 3
	}

	updateSize(scale: number) { // this might not be needed, because it can be requested over here

		this._canvas.width = this._canvas.width * scale;
		this._canvas.height = this._canvas.height * scale;
		this._ctx.scale(scale, scale);
	}

	//to start the game
	startGame() {
		this.gameLoop();
	}
}
