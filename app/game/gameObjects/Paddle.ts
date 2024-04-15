import { GameObject } from './GameObject'
import { MovementComponent } from '../components/MovementComponent'
import { KeyListenerComponent } from '../components/KeyListenerComponent'
import * as CON from '../utils/constants'
import { GameState } from '@prisma/client'

export class Paddle extends GameObject {
	public	movementComponent: MovementComponent;
	public	keyListener: KeyListenerComponent;

	constructor(name: string, x: number, y: number, width: number, height: number, color: string) {
		super(name, x, y, width, height, color);
		this.movementComponent = new MovementComponent(0, 0, x, y);
		this.keyListener = new KeyListenerComponent();
	}

	
	public setKeyListerns(paddle: Paddle, keyUp: string, keyDown: string, config: keyof typeof CON.config) {
		if (paddle == null) {
			throw new Error("Paddle is not initialized");
		}

		paddle.keyListener.addKeyCallback(keyUp, () => {
			paddle.movementComponent.setDirection(1.5 * Math.PI);
			paddle.movementComponent.setSpeed(CON.config[config].paddleBaseSpeed);
		});

		paddle.keyListener.addKeyCallback(keyDown, () => {
			paddle.movementComponent.setDirection(0.5 * Math.PI);
			paddle.movementComponent.setSpeed(CON.config[config].paddleBaseSpeed);
		});
	}

	
	public resetPaddle(config: keyof typeof CON.config) {
		const paddleHeight = CON.config[config].screenHeight * CON.config[config].paddleHeightFactor;
		this.y = CON.config[config].screenHeight / 2 - paddleHeight / 2;
		this.movementComponent.setSpeed(0);
		this.movementComponent.setDirection(0);
		this.movementComponent.setY(CON.config[config].screenHeight / 2 - paddleHeight / 2);
	}

	
	//checks if paddle is out of bounds. set back and stop movment to reduce lag
	private checkBounds(config: keyof typeof CON.config) {
		const speed = this.movementComponent.getSpeed();
		const paddleMinY = CON.config[config].wallWidth + CON.config[config].paddleGap;
		const paddleMaxY = CON.config[config].screenHeight - this.height - CON.config[config].wallWidth - CON.config[config].paddleGap;
		if (this.y + speed > paddleMaxY) {
			this.movementComponent.setSpeed(0);
			this.y = paddleMaxY - speed;
		} else if (this.y - speed < paddleMinY) {
			this.movementComponent.setSpeed(0);
			this.y = paddleMinY + speed;
		}
	}


	public updatePaddle(state: GameState, deltaTime: number, config: keyof typeof CON.config) {
		if (state != `STARTED`) {
			return false;
		}
		let hasMoved = false;
		const margin = .5;
		if (this.keyListener.checkKeysPressed()) {
			let initialY = this.y;
			this.movementComponent.update(deltaTime);
			this.y = this.movementComponent.getY();
			this.checkBounds(config);
			
			hasMoved = Math.abs(initialY - this.y) > margin;
		}
		return hasMoved;
	}
}
