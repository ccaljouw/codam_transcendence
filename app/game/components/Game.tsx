import { UpdateGameDto, UpdateGameUserDto, UpdateGameObjectsDto } from '@ft_dto/game'
import { GameState } from '@prisma/client'
import { transcendenceSocket } from '@ft_global/socket.globalvar'
import { SoundFX } from "../gameObjects/SoundFX"
import { Wall } from "../gameObjects/Wall"
import { GameObject } from "../gameObjects/GameObject"
import { Paddle } from "../gameObjects/Paddle"
import { Ball } from "../gameObjects/Ball"
import { KeyListenerComponent } from "./KeyListenerComponent"
import { PlayerComponent } from "./PlayerComponent"
import { TextComponent } from "./TextComponent"
import * as CON from "../utils/constants"
import { setSocketListeners } from "../utils/gameSocketListners"
import { updateObjects, checkForGoals } from "../utils/updateObjects"
import { countdown, setTheme } from "../utils/utils"
import { initializeGameObjects, drawGameObjects, resetGameObjects } from "../utils/objectController"


export class Game {
	canvas: HTMLCanvasElement;
	keyListener: KeyListenerComponent = new KeyListenerComponent();
	lastFrameTime: number = 0;
	elapasedTimeSincceLastUpdate: number = 0;
	gameUsers: UpdateGameUserDto [] = [];
	walls: Wall [] = [] ;
	lines: GameObject [] = [];
	backgroundFill: GameObject | null = null;
	ctx: CanvasRenderingContext2D;
	paddels: Paddle [] = [];
	players: PlayerComponent [] = [];
	receivedUpdatedGameObjects: UpdateGameObjectsDto = {roomId: -1, ballX: -1, ballY: -1, ballDirection: -1, ballSpeed: 0, ballDX: -1, ballDY: -1, paddle1Y: -1, paddle2Y: -1, score1: -1, score2: -1, resetGame: -1, resetMatch: -1, winner: -1};
	instanceType: CON.InstanceTypes = CON.InstanceTypes.observer;
	gameSocket:	typeof transcendenceSocket = transcendenceSocket;
	soundFX: SoundFX = new SoundFX();
	theme: keyof typeof CON.themes = "classic";
	config: keyof typeof CON.config = "test";
	gameState: GameState = GameState.WAITING;
	winner: PlayerComponent | null = null;
	roomId: number = 0;
	messageFields: TextComponent [] = [];
	ball: Ball | null = null;
	gameData: UpdateGameDto | null = null;

	constructor(newCanvas: HTMLCanvasElement, instanceType: CON.InstanceTypes, data: UpdateGameDto) {
		this.gameData = data; //todo import from server
		this.instanceType = instanceType;
		this.roomId = this.gameData.id;
		this.canvas = newCanvas;
		this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
		this.gameUsers = this.gameData.GameUsers as UpdateGameUserDto [];
		initializeGameObjects(this, this.config);
		setTheme(this, this.theme);
		setSocketListeners(this.gameData, this.gameSocket, this);
	
		console.log("script: instance type: ", this.instanceType); //todo: remove
	}
	

	gameLoop(currentTime:number) {
		let deltaTime = (currentTime - this.lastFrameTime) / 1000;
		let sentFinished = false;

		this.lastFrameTime = currentTime;
		
		if (this.gameState == `FINISHED` && sentFinished == false) {
			sentFinished = true;
			const payload = {roomId: this.roomId, state: GameState.FINISHED, winner: this.winner?.getSide(), score1: this.players[0].getScore(), score2: this.players[1].getScore()};
			this.gameSocket.emit("game/updateGameState", payload);
			return;
		}

		if (this.gameState == `WAITING`) {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.messageFields[0].setText(CON.config[this.config].startMessage);
		}
		
		if (this.gameState == `STARTED`) {
			updateObjects(this, deltaTime, this.config);
			checkForGoals(this, this.config);
		}
		
		if (this.instanceType < 2 ) {
				this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
				drawGameObjects(this);
				requestAnimationFrame(this.gameLoop.bind(this));
		}
	}

	// resetMatch() {
	// 	resetGameObjects(this);
	//	this.players.forEach(player => player.resetScore());
	//	game.messageFields.forEach(message => message.setText(""));
	// 	this.startGame();
	// }


	resetGame() {
		if (this.gameState === `FINISHED`) {
			return;
		}
		resetGameObjects(this);
		console.log("script: GOAL! detected. Resetting game.");
		this.messageFields[0]?.setText("GOAL!");
		countdown(this, this.config);
	}
  

	endGame(winningSide: number) {
		this.gameState = `FINISHED`;
		this.winner = this.players[winningSide];
		this.messageFields[0]?.setText(this.winner?.getName() + " won the match!");
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		drawGameObjects(this);
		console.log("player: ", this.winner?.getSide(), this.winner?.getName(), " won the match");
	}

	//to start the game
	startGame() {
		this.gameState = `STARTED`;
		countdown(this, this.config);
		this.gameLoop(1);
	}
}
