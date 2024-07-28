import { GameObject } from './GameObject'
import { MovementComponent } from '../components/MovementComponent'
import { getNormalizedDistance, switchDirectionForRightPaddle } from '../utils/utils'
import * as CON from '../utils/constants'
import { Game } from '../components/Game'
import { GameState } from '@prisma/client'
import { transcendenceSocket } from '@ft_global/socket.globalvar'

export class Ball extends GameObject {
	public	movementComponent: MovementComponent;
	private _lastCollisionWithWall: number = 0;
	private _lastCollisionWithPaddle: number = 0;
	private _lastcollisionType: string = "";
	private _longestRally: number = 0;
	private _rally: number = 0;

	constructor(config: keyof typeof CON.config, theme: keyof typeof CON.themes) {
		super("Ball",
			CON.config[config].screenWidth / 2 - CON.config[config].ballWidth /2,
			CON.config[config].screenHeight / 2 - CON.config[config].ballWidth /2,
			CON.config[config].ballWidth,
			CON.config[config].ballWidth,
			CON.themes[theme].ballColor);
		this.movementComponent = new MovementComponent(
			0,
			0,
			CON.config[config].screenWidth / 2 - CON.config[config].ballWidth /2,
			CON.config[config].screenHeight / 2 - CON.config[config].ballWidth /2);
	}
	

	public setLastCollisionWithHorizontalWall() {
		this._lastCollisionWithWall = Date.now();
		this._lastcollisionType = "h_wall";
	}

	public setLastCollisionWithVerticalWall() {
		this._lastCollisionWithWall = Date.now();
		this._lastcollisionType = "v_wall";
	}

	public setLastCollisionWithPaddle() {
		this._lastCollisionWithPaddle = Date.now();
		this._lastcollisionType = "paddle";
	}

	public canCollideWithHorizontalWall(config: keyof typeof CON.config) {
		if (this._lastcollisionType == "paddle" || this._lastcollisionType == "v_wall") {
			return true;
		} else {
			return Date.now() - this._lastCollisionWithWall > CON.config[config].collisionCooldown;
		}
	}

	public canCollideWithVerticalWall(config: keyof typeof CON.config) {
		if (this._lastcollisionType == "paddle" || this._lastcollisionType == "h_wall") {
			return true;
		} else {
			return Date.now() - this._lastCollisionWithWall > CON.config[config].collisionCooldown;
		}
	}

	public canCollideWithPaddle(config: keyof typeof CON.config) {
		if (this._lastcollisionType == "h_wall" || this._lastcollisionType == "v_wall") {
			return true;
		} else {
			return Date.now() - this._lastCollisionWithPaddle > CON.config[config].collisionCooldown;
		}
	}

	public getStartValues(config: keyof typeof CON.config, game: Game) {
		const gameSocket = transcendenceSocket;
		if (game.gameState != GameState.STARTED) {
			return;
		}
		
		var direction;
		var speed;

		//random angle beteen -1/6 PI and 1/6 PI
		const angle = Math.random() * Math.PI / 3 - Math.PI / 6;

		//set direction left or right
		if (Math.random() < 0.5) {
			direction = angle + Math.PI;
		} else {
			direction = angle;
		}

		//set base speed + random value between -1 and 1
		speed = CON.config[config].ballBaseSpeed + Math.random() * 2 - 1;
		this.movementComponent.setDirection(direction);
		this.movementComponent.setSpeed(speed);
		gameSocket.emit("game/updateGameObjects", {roomId: game.roomId, ballDirection: direction, ballSpeed: speed});
	} 

	public setStartValues(direction: number, speed: number) {
		this.movementComponent.setDirection(direction);
		this.movementComponent.setSpeed(speed);
	}
	
	public increaseSpeed(config: keyof typeof CON.config) {
		this.movementComponent.setSpeed(this.movementComponent.getSpeed() + CON.config[config].ballSpeedIncrease);
	}

	public getNewDirection(paddle: GameObject, angle: number) {
		let normalizedDistance = getNormalizedDistance(this, paddle);
		let newDirection = normalizedDistance * CON.MAX_BOUNCE_ANGLE;
		let ballDirection = this.movementComponent.getXdiretcion();

		let offset = this.movementComponent.getSpeedX() * 2;
		if (ballDirection == 1) {
			this.x -= offset
			newDirection = switchDirectionForRightPaddle(newDirection, normalizedDistance);
		}
		this.x += offset;
    	return newDirection;
    }

	public hitPaddle(paddle: GameObject, config: keyof typeof CON.config) {
		//get new direction based on where the ball hits the paddle
		let newDirection = this.getNewDirection(paddle, this.movementComponent.getDirection());
		this.movementComponent.setDirection(newDirection);
		this.increaseSpeed(config);
		this.incrementRally();
	}

	public hitHorizontalWall() {
		this.movementComponent.setSpeedY(this.movementComponent.getSpeedY() * -1);
		if (this.movementComponent.getYdiretcion() < 0) {
			this.y += this.movementComponent.getSpeed();
		} else {
			this.y -= this.movementComponent.getSpeed();
		}
	}

	public hitVerticalWall() {
		this.movementComponent.setSpeedX(this.movementComponent.getSpeedX() * -1);
		if (this.movementComponent.getXdiretcion() < 0) {
			this.x += this.movementComponent.getSpeed();
		} else {
			this.x -= this.movementComponent.getSpeed();
		}
	}

	public updateBall(state: GameState, deltaTime: number) {
		if (state != `STARTED`) {
			return;
		}
		this.movementComponent.update(deltaTime);
		this.x = this.movementComponent.getX();
		this.y = this.movementComponent.getY();
	}

	public incrementRally() {
		this._rally++;
		if (this._rally > this._longestRally) {
			this.setLongestRally(this._rally);
		}
	}

	public resetRally() {
		this._rally = 0;
	}

	public setLongestRally(rally: number) {
		this._longestRally = rally;
	}

	public getLongestRally() {
		return this._longestRally;
	}
	
	public resetLongestRally() {
		this._longestRally = 0;
	}

	public resetBothRallies() {
		this.resetRally();
		this.resetLongestRally();
	}
}
