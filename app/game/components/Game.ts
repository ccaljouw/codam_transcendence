import { UpdateGameDto, UpdateGameUserDto, UpdateGameObjectsDto } from '@ft_dto/game'
import { GameState } from '@prisma/client'
import { SoundFX } from '../gameObjects/SoundFX'
import { Wall } from '../gameObjects/Wall'
import { GameObject } from '../gameObjects/GameObject'
import { Paddle } from '../gameObjects/Paddle'
import { Ball } from '../gameObjects/Ball'
import { KeyListenerComponent } from './KeyListenerComponent'
import { PlayerComponent } from './PlayerComponent'
import { TextComponent } from './TextComponent'
import * as CON from '../utils/constants'
import { setSocketListeners } from '../utils/gameSocketListners'
import { updateObjects, checkForGoals } from '../utils/updateObjects'
import { countdown, setTheme } from '../utils/utils'
import { initializeGameObjects, drawGameObjects, resetGameObjects } from '../utils/objectController'


export class Game {
	canvas?: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	gameData: UpdateGameDto | null = null;
	theme: string;
	config: string;
	instanceType: CON.InstanceTypes = CON.InstanceTypes.notSet;
	gameState: GameState = GameState.WAITING;
	keyListener: KeyListenerComponent = new KeyListenerComponent();
	soundFX: SoundFX = new SoundFX();
	gameUsers: UpdateGameUserDto [] = [];
	walls: Wall [] = [] ;
	lines: GameObject [] = [];
	paddels: Paddle [] = [];
	players: PlayerComponent [] = [];
	ball: Ball | null = null;
	messageFields: TextComponent [] = [];
	backgroundFill: GameObject | null = null;
	receivedUpdatedGameObjects: UpdateGameObjectsDto = {roomId: -1, ballX: -1, ballY: -1, ballDirection: -1, ballSpeed: 0, ballDX: -1, ballDY: -1, paddle1Y: -1, paddle2Y: -1, score1: -1, score2: -1, resetGame: -1, resetMatch: -1, winner: -1};
	winner: PlayerComponent | null = null;
	roomId: number = 0;
	elapasedTimeSincceLastUpdate: number = 0;
	lastFrameTime: number = 0;
	currentAnimationFrame: number = 0;

	constructor(newCanvas: HTMLCanvasElement | undefined, instanceType: CON.InstanceTypes, data: UpdateGameDto, givenConfig: string, givenTheme: string) {
		this.config = givenConfig;
		this.theme = givenTheme;
		this.gameData = data;
		this.instanceType = instanceType;
		this.roomId = this.gameData.id;
		this.canvas = newCanvas? newCanvas : undefined;
		this.ctx = this.canvas?.getContext("2d") as CanvasRenderingContext2D;
		this.gameUsers = this.gameData.GameUsers as UpdateGameUserDto [];
		initializeGameObjects(this);
		setTheme(this);
		setSocketListeners(this);
		console.log("script: instance type: ", this.instanceType);
	}
	

	gameLoop(currentTime:number) {
		let deltaTime = (currentTime - this.lastFrameTime) / 1000;
		this.lastFrameTime = currentTime;
		
		if (this.gameState == `FINISHED` ) {
			return;
		}

		if (this.gameState == `WAITING` && this.canvas) {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.messageFields[0].setText(CON.config[this.config].startMessage);
		}
		
		if (this.gameState == `STARTED`) {
			updateObjects(this, deltaTime);
			checkForGoals(this);
		}
		
		if (this.canvas) {
				this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
				drawGameObjects(this);
				this.currentAnimationFrame = requestAnimationFrame(this.gameLoop.bind(this));
		}
	}

	finishGame(winningSide: number) {
		if (this.gameState === `FINISHED`) {
			return;
		}
		this.gameState = `FINISHED`;
		this.winner = this.players[winningSide];
		if (this.canvas) {
			this.messageFields[0]?.setText(this.winner?.getName() + " won the match!");
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			drawGameObjects(this);
		}
		cancelAnimationFrame(this.currentAnimationFrame);
		console.log("player: ", this.winner?.getSide(), this.winner?.getName(), " won the match");
		// this.gameSocket.off(`game/updateGameObjects`);
		// this.gameSocket.off(`game/updateGameState`);
	}

	abortGame(n: number) {
		if (this.canvas) {
			if (n === 1) {
				this.messageFields[0]?.setText("Other player left the game");
			} else {
				this.messageFields[0]?.setText("Game aborted");
			}
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			drawGameObjects(this);
		}
		this.gameState = `FINISHED`;
		cancelAnimationFrame(this.currentAnimationFrame);
		console.log("script: game aborted");
	}

	resetGame() {
		if (this.gameState === `FINISHED`) {
			return;
		}
		console.log("script: resetGame called");
		resetGameObjects(this);
		this.messageFields[0]?.setText("GOAL!");
		countdown(this);
	}
 

	startGame() {
		this.gameState = `STARTED`;
		countdown(this);
		this.gameLoop(1);
	}
}
