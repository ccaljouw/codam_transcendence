
import { UpdateGameDto, UpdateGameUserDto, UpdateGameObjectsDto } from '@ft_dto/game';
import { transcendenceSocket } from '@ft_global/socket.globalvar'
import { GameState } from '@prisma/client';
import { SoundFX } from "../gameObjects/SoundFX";
import { Wall } from "../gameObjects/Wall";
import { GameObject } from "../gameObjects/GameObject";
import { Paddle } from "../gameObjects/Paddle";
import { Ball } from "../gameObjects/Ball";
import { KeyListenerComponent } from "./KeyListenerComponent";
import { PlayerComponent } from "./PlayerComponent";
import { TextComponent } from "./TextComponent";
import * as CON from "../utils/constants";
import { setSocketListeners } from "../utils/gameSocketListners";
import { detectCollision } from "../utils/collisionDetection";
import { detectScore, checkWinCondition, countdown } from "../utils/utils";
import {
	 	wallInitializer,
		paddleInitializer,
		ballInitializer,
		keyListenerInitializer,
		messageFieldInitializer,
		playerInitializer,
		lineInitializer,
		canvasInitializer } from "../utils/initializers";
import { error } from 'console';


export class Game {
	private	_canvas: HTMLCanvasElement;
	private	_ctx: CanvasRenderingContext2D;
	private	_keyListener: KeyListenerComponent = new KeyListenerComponent();
	private	_walls: Wall [] = [] ;
	private _lines: GameObject [] = [];
	private _backgroundFill: GameObject | null = null;
	private _lastFrameTime: number = 0;
	private _gameUsers: UpdateGameUserDto [] = [];
	public	paddels: Paddle [] = [];
	public	players: PlayerComponent [] = [];
	public	receivedUpdatedGameObjects: UpdateGameObjectsDto = {roomId: -1, ballX: -1, ballY: -1, ballDirection: -1, ballSpeed: -1, ballDX: -1, ballDY: -1, paddle1Y: -1, paddle2Y: -1, score1: -1, score2: -1, resetGame: -1, resetMatch: -1, finish: -1, winner: -1};
	public  instanceType: CON.instanceTypes = CON.instanceTypes.observer;
	public 	gameSocket:	typeof transcendenceSocket = transcendenceSocket;
	public	soundFX: SoundFX = new SoundFX();
	public	theme: keyof typeof CON.themes = "classic";
	public	config: keyof typeof CON.config = "test";
	public	gameState: GameState = GameState.WAITING;
	public	winner: PlayerComponent | null = null;
	public  roomId: number = 0;
	public	messageFields: TextComponent [] = [];
	public	ball: Ball | null = null;

	constructor(newCanvas: HTMLCanvasElement, instanceType: CON.instanceTypes, gameData: UpdateGameDto) {
		this.instanceType = instanceType;
		this.roomId = gameData.id;
		this._canvas = newCanvas;
		this._gameUsers = gameData.GameUsers as UpdateGameUserDto [];
		this.initializeGameObjects(this.config);
		setSocketListeners(gameData, this.gameSocket, this);
		this._ctx = this._canvas.getContext("2d") as CanvasRenderingContext2D;
	
		console.log("instance type: ", this.instanceType); //todo: remove
	}
	

	initializeGameObjects(config: keyof typeof CON.config) {
		if (this.instanceType < 2) {
			canvasInitializer(this._canvas, config);
			keyListenerInitializer(this._keyListener, this, config);
			messageFieldInitializer(this.messageFields, this.theme, config);
		}
		paddleInitializer(this.paddels, this.theme, config, this.instanceType);
		wallInitializer(this._walls, this.theme, config);
		lineInitializer(this._lines, this.theme, config);
		playerInitializer(this.players, this.theme, config, this._gameUsers);
		keyListenerInitializer(this._keyListener, this, config);
		this._backgroundFill = new GameObject("background", 0, 0, CON.config[config].screenWidth, CON.config[config].screenHeight, CON.themes[this.theme].backgroundColor);
		this.setBall()
	}
	
	setTheme(theme: keyof typeof CON.themes) {
	this.theme = theme;
	this.paddels.forEach(paddle => paddle.setColor(CON.themes[theme].leftPaddleColor));
	this.paddels.forEach(paddle => paddle.setColor(CON.themes[theme].rightPaddleColor));
	this._walls.forEach(wall => wall.setColor(CON.themes[theme].backWallColor));
	this._walls.forEach(wall => wall.setColor(CON.themes[theme].wallColor));
	this._lines.forEach(line => line.setColor(CON.themes[theme].lineColor));
	this._backgroundFill?.setColor(CON.themes[theme].backgroundColor);
	this.players.forEach(player => player.nameField?.setColor(CON.themes[theme].leftPlayerColor));
	this.players.forEach(player => player.scoreField?.setColor(CON.themes[theme].leftPlayerColor));
	this.messageFields.forEach(message => message.setColor(CON.themes[theme].leftPlayerColor));
	this.ball?.setColor(CON.themes[theme].ballColor);
	this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
	this.drawGameObjects();
}

	setBall() {
		this.ball = null;
		this.ball = ballInitializer(this.theme);
	}


	updateGameObjects(deltaTime: number, config: keyof typeof CON.config) {
		
		//paddels
		let paddleMoved = this.paddels.map(paddle => paddle.updatePaddle(this.gameState, deltaTime));
		if (paddleMoved.some(moved => moved === true)) {
			if (this.instanceType === 0) {
				this.gameSocket.emit("game/updateGameObjects", {roomId: this.roomId, paddle1Y: this.paddels[0].movementComponent.getY()});
			}
			if (this.instanceType === 1) {
				this.gameSocket.emit("game/updateGameObjects", {roomId: this.roomId, paddle2Y: this.paddels[1].movementComponent.getY()});
			}
		}
		

		//ball
		if (this.instanceType === 0 ) {
			this.ball?.updateBall(this.gameState, deltaTime);
			let collisionDetected = detectCollision(this.ball as Ball, this.paddels, this._walls, this.soundFX, this.config);
		//todoadd
			this.gameSocket.emit("game/updateGameObjects", {roomId: this.roomId, ballX: this.ball?.getX(), ballY: this.ball?.getY(), ballDX: this.ball?.movementComponent.getSpeedX, ballDY: this.ball?.movementComponent.getSpeedY});
		}

		if (this.instanceType === 1) {
			this.ball?.updateBall(this.gameState, deltaTime);
			detectCollision(this.ball as Ball, this.paddels, this._walls, this.soundFX, this.config);
			//todo interpolation
			if (this.receivedUpdatedGameObjects.ballX > 0) {
				this.ball?.setX(this.receivedUpdatedGameObjects.ballX);
			}
			if (this.receivedUpdatedGameObjects.ballY > 0) {
				this.ball?.setY(this.receivedUpdatedGameObjects.ballY);
			}
			if (this.receivedUpdatedGameObjects.ballDX > 0) {
				this.ball?.movementComponent.setSpeedX(this.receivedUpdatedGameObjects.ballDX);
			}
			if (this.receivedUpdatedGameObjects.ballDY > 0) {
				this.ball?.movementComponent.setSpeedY(this.receivedUpdatedGameObjects.ballDY);
			}
		}
	

		//game logic			
		if (this.instanceType === 0) { //todo change to 2;
			let goal = detectScore(this.ball as Ball, this.players, config, this);
			let winner = checkWinCondition(this.players, config, this);
			if (winner) {
				// this.gameSocket.emit("game/updateGameObjects", {roomId: this.roomId, finish: 1, winner: winner});
				this.endGame(winner);
			} else if (goal) {
				this.resetGame();
				this.gameSocket.emit("game/updateGameObjects", {roomId: this.roomId, resetGame: 1});
			}
		}
		
		// this.messageFields.forEach(message => message.update());
	}


	drawGameObjects() {
		this._backgroundFill?.draw(this._ctx); 
		this.paddels.forEach(paddle => paddle.draw(this._ctx));
		this._lines.forEach(line => line.draw(this._ctx));
		this.players.forEach(player => player.scoreField?.draw(this._ctx));
		this.players.forEach(player => player.nameField?.draw(this._ctx));
		this.messageFields.forEach(message => message.draw(this._ctx));
		this.ball?.draw(this._ctx);
		this._walls.forEach(wall => wall.draw(this._ctx));
	}

	resetGameObjects() {
		this.soundFX.reinitialize();
		this.paddels.forEach(paddle => paddle.resetPaddle());
		this.players.forEach(player => player.resetScore());
		this.players.forEach(player => player.scoreField?.setText(player.getScore().toString()));
		this.messageFields.forEach(message => message.setText(""));
		this.setBall();
	}


	gameLoop(currentTime:number) {
		//todo add master / slave check optional with interpolation
		//calculate delta time
		const deltaTime = (currentTime - this._lastFrameTime) / 1000;
		this._lastFrameTime = currentTime;
		
		if (this.gameState == `FINISHED`) {
			console.log("Game finished");
			return;
		}

		if (this.gameState == `WAITING`) {
			this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
			this.messageFields[0].setText(CON.config[this.config].startMessage);
		}
		
		if (this.gameState == `STARTED`) {
			this.updateGameObjects(deltaTime, this.config);
		}
		
		if (this.instanceType < 2 ) {
				this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
				this.drawGameObjects();
				requestAnimationFrame(this.gameLoop.bind(this));
		}
	}

	// resetMatch() {
	// 	this.resetGameObjects();
	// 	this.startGame();
	// }


	resetGame() {
		this.setBall();
		this.paddels.forEach(paddle => paddle.resetPaddle());
		this.messageFields[0]?.setText("GOAL!");
			countdown(this, this.config);
	}
  

	endGame(winner: PlayerComponent) {
		
		let name = winner?.getName();
		this.messageFields[0]?.setText(name + " won the match!");
		this.winner = winner;
		this.gameState = `FINISHED`;
		this.gameSocket.emit("game/updateGameState", {roomId: this.roomId, state: this.gameState, winner: this.winner});
	}

	//to start the game
	startGame() {
		this.gameState = `STARTED`;
		countdown(this, this.config);
		this.gameLoop(1);
	}
}
