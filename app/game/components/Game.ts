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
import { disconnectSocket, setSocketListeners } from '../utils/gameSocketListners'
import { updateObjects, checkForGoals } from '../utils/updateObjects'
import { countdown, setTheme, log } from '../utils/utils'
import { initializeGameObjects, drawGameObjects, resetGameObjects } from '../utils/objectController'

export class Game {
	canvas?: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	gameData: UpdateGameDto | null = null;
	theme: string;
	config: string;
	aiLevel: number = 0; // case 0 then not an AI game
	instanceType: CON.InstanceTypes = CON.InstanceTypes.notSet;
	gameState: GameState = GameState.WAITING;
	keyListener: KeyListenerComponent = new KeyListenerComponent();
	soundFX: SoundFX = new SoundFX();
	gameUsers: UpdateGameUserDto[] = [];
	walls: Wall[] = [];
	lines: GameObject[] = [];
	paddels: Paddle[] = [];
	players: PlayerComponent[] = [];
	ball: Ball | null = null;
	messageFields: TextComponent[] = [];
	backgroundFill: GameObject | null = null;
	receivedUpdatedGameObjects: UpdateGameObjectsDto = { roomId: -1, ballX: -1, ballY: -1, ballDirection: -1, ballSpeed: 0, ballDX: -1, ballDY: -1, paddle1Y: -1, paddle2Y: -1, score1: -1, score2: -1, resetGame: -1, resetMatch: -1, winner: -1 };
	winner: PlayerComponent | null = null;
	roomId: number = 0;
	elapasedTimeSincceLastUpdate: number = 0;
	lastFrameTime: number = 0;
	currentAnimationFrame: number = 0;
	firstBike: number = 0;
	secondBike: number = 0;
	firstBikeConnected: boolean = false;
	secondBikeConnected: boolean = false;

	constructor(newCanvas: HTMLCanvasElement | undefined, instanceType: CON.InstanceTypes, data: UpdateGameDto, givenConfig: string, givenTheme: string, context: any, givenVolume: number, aiLevel: number) {
		this.config = givenConfig;
		this.theme = givenTheme;
		this.gameData = data;
		this.instanceType = instanceType;
		this.roomId = this.gameData.id;
		this.canvas = newCanvas ? newCanvas : undefined;
		this.ctx = this.canvas?.getContext("2d") as CanvasRenderingContext2D;
		this.gameUsers = this.gameData.GameUsers as UpdateGameUserDto[];
		this.soundFX.setVolume(givenConfig, givenVolume);
		this.aiLevel = aiLevel;
		this.firstBike = context.firstBike.value;
		this.secondBike = context.secondBike.value;
		this.firstBikeConnected = context.firstBike.connected;
		this.secondBikeConnected = context.secondBike.connected;
		initializeGameObjects(this);
		setTheme(this);
		setSocketListeners(this);
		console.log("script: game created with config: ", this.config, " and theme: ", this.theme);
		console.log("script: sensorInput = ", CON.config[this.config].sensorInput);
		context.subscribeToBikeUpdates(this.updateBikeValues.bind(this))
		log(`GameScript: instance type: ${this.instanceType}`);
	}

	updateBikeValues(firstBike: number, secondBike: number) {
		this.firstBike = firstBike;
		this.secondBike = secondBike;
	}

	redrawGameObjects() {
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		drawGameObjects(this);
	}

	gameLoop(currentTime: number) {
		let deltaTime = (currentTime - this.lastFrameTime) / 1000;
		this.lastFrameTime = currentTime;
		if (this.gameState == GameState.FINISHED) {
			this.soundFX.stopAll();
			return;
		}
		if (this.gameState == GameState.WAITING && this.canvas) {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.messageFields[0].setText(CON.config[this.config].startMessage);
		}
		if (this.gameState == GameState.STARTED) {
			updateObjects(this, deltaTime);
			checkForGoals(this);
		}
		if (this.canvas) {
			this.redrawGameObjects();
			this.currentAnimationFrame = requestAnimationFrame(this.gameLoop.bind(this));
		}
	}

	finishGame(winningSide: number) {
		if (this.gameState === GameState.FINISHED) {
			return;
		}

		if (winningSide === this.instanceType) {
			this.soundFX.playWin();
		} else {
			this.soundFX.playLose();
		}

		this.gameState = GameState.FINISHED;
		this.winner = this.players[winningSide];
		if (this.canvas) {
			if (winningSide === this.instanceType) {
				this.messageFields[0]?.setText("You WIN! :-)");
			} else {
				this.messageFields[0]?.setText("You LOSE! :-(");
			}
			this.messageFields[0]?.setAlign("left");
			this.messageFields[0]?.setX(50);
			this.redrawGameObjects();
		}
		cancelAnimationFrame(this.currentAnimationFrame);
		this.ball?.resetBothRallies();
		log(`GameScript: player: ${this.winner?.getSide()} ${this.winner?.getName()} won the match`);
		disconnectSocket(this);
	}

	abortGame(n: number) {
		if (this.canvas) {
			if (n === 1) {
				this.messageFields[0]?.setText("Other player left the game");
			} else {
				this.messageFields[0]?.setText("Game aborted");
			}
			this.redrawGameObjects();
		}
		this.gameState = GameState.FINISHED;
		this.cleanup
		log("GameScript: game aborted");
	}

	resetGame() {
		if (this.gameState === GameState.FINISHED) {
			return;
		}
		this.ball?.resetRally();
		log("GameScript: resetGame called");
		resetGameObjects(this);
		this.messageFields[0]?.setText("GOAL!");
		countdown(this);
		this.soundFX.playGoal();
	}

	startGame() {
		this.gameState = GameState.STARTED;
		countdown(this);
		this.gameLoop(1);
	}

	cleanCanvas() {
		log("GameScript: cleaning canvas");
		if (this.canvas) {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.canvas = undefined;
			this.ctx = null as any
		}
	}

	cleanup() {
		log("GameScript: cleaning up game");
		cancelAnimationFrame(this.currentAnimationFrame);
		this.soundFX.stopAll();
		this.ball = null;
		this.players = [];
		this.paddels = [];
		this.lines = [];
		this.walls = [];
		this.messageFields = [];
		this.backgroundFill = null;
		this.gameData = null;
		this.gameUsers = [];
		this.receivedUpdatedGameObjects = { roomId: -1, ballX: -1, ballY: -1, ballDirection: -1, ballSpeed: 0, ballDX: -1, ballDY: -1, paddle1Y: -1, paddle2Y: -1, score1: -1, score2: -1, resetGame: -1, resetMatch: -1, winner: -1 };
		this.winner = null;
		this.roomId = 0;
		this.elapasedTimeSincceLastUpdate = 0;
		this.lastFrameTime = 0;
		this.currentAnimationFrame = 0;
		this.instanceType = CON.InstanceTypes.notSet;
		this.config = "";
		this.theme = "";
		this.aiLevel = 0;
		this.firstBike = 0;
		this.secondBike = 0;
		this.firstBikeConnected = false;
		this.secondBikeConnected = false;
		disconnectSocket(this);
	}
}
