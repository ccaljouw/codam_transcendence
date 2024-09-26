import { GameObject } from './GameObject'
import { MovementComponent } from '../components/MovementComponent'
import { Ball } from './Ball'
import { KeyListenerComponent } from '../components/KeyListenerComponent'
import * as CON from '../utils/constants'
import { useContext } from 'react'
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar'
import { Console } from 'console'
import { log } from '../utils/utils'


export class Paddle extends GameObject {
	public	movementComponent: MovementComponent;
	public	keyListener: KeyListenerComponent;
	public	AIlevel: number = 0;

	constructor(aiLevel:number, name: string, x: number, y: number, width: number, height: number, color: string) {
		super(name, x, y, width, height, color);
		this.movementComponent = new MovementComponent(0, 0, x, y);
		this.keyListener = new KeyListenerComponent();
		this.AIlevel = aiLevel;
	}

	
	public setKeyListerns(paddle: Paddle, keyUp: string, keyDown: string, config: string) {
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

	private updateAiPaddle(deltaTime: number, config: keyof typeof CON.config, ball: Ball): boolean {
		let hasMoved = false;
		const margin = 2;
		const AIlevel = CON.config[config].AILevel;

		//calculate distance to ball
    const currentY = this.movementComponent.getY();
    const targetY = ball.movementComponent.getY();
		const requiredMovement = targetY - currentY;

		//if ball is far away, set paddle to center
		if (Math.abs(requiredMovement) > margin) {
			const dampingFactor = Math.min(1, AIlevel * 0.1);
	
					
			const speed = Math.min(CON.config[config].paddleBaseSpeed, Math.abs(requiredMovement) * dampingFactor);
			this.movementComponent.setSpeed(speed);
	
			//set direction of paddle
			this.movementComponent.setDirection(requiredMovement > 0 ? 0.5 * Math.PI : 1.5 * Math.PI);
			this.movementComponent.update(deltaTime);

			//update paddle position
			this.y = this.movementComponent.getY();
			this.checkBounds(config);
			hasMoved = true;
		}
    return hasMoved;
	}

	private AnalogupdatePaddle(deltaTime: number, config: keyof typeof CON.config, analogVal: number): boolean {
		// const margin = 10;
		// console.log("Analog value: ", analogVal.toPrecision(6));
		//todo: get sensor input
		// let sensorInputValue = 0; //-1 to 1

		//calculate paddle position
		const paddleMinY = CON.config[config].wallWidth + CON.config[config].paddleGap;
		const paddleMaxY = CON.config[config].screenHeight - this.height - CON.config[config].wallWidth - CON.config[config].paddleGap;
		const paddleRange = paddleMaxY - paddleMinY;
		// console.log("Analog paddleRange: ", paddleRange, "paddleMinY: ", paddleMinY, "paddleMaxY: ", paddleMaxY);
		//calculate required paddle position
		const requiredPaddlePosition = (paddleRange / 2)  + (analogVal * paddleRange)  + paddleMinY;
		// console.log("Analog requiredPaddlePosition: ", requiredPaddlePosition, "TRUE? ", requiredPaddlePosition - this.y < margin);
		

		//option 1: simply set new position (hacker verion)
		// if (requiredPaddlePosition - this.y < margin) {
		// 	return false;
		// }
		this.y = requiredPaddlePosition;
		return true
		
		
		// option 2: calculate using speed and delta time
		// const currentY = this.movementComponent.getY();
		// const requiredMovement = requiredPaddlePosition - currentY;
		// if (Math.abs(requiredMovement) > margin) {
		// 	const speed = Math.min(CON.config[config].paddleBaseSpeed, Math.abs(requiredMovement));
		// 	this.movementComponent.setSpeed(speed);
		// 	this.movementComponent.setDirection(requiredMovement > 0 ? 0.5 * Math.PI : 1.5 * Math.PI);
		// 	this.movementComponent.update(deltaTime);
		// 	this.y = this.movementComponent.getY();
		// 	this.checkBounds(config);
		// 	return = true;
		// }
		// return false;
	}


	public updatePaddle(deltaTime: number, config: keyof typeof CON.config, ball: Ball | null, analogVal: number): boolean {
    if (ball == null || ball.movementComponent.getSpeed() === 0) {
			return false;
		}

		if (this.AIlevel > 0) {
			return this.updateAiPaddle(deltaTime, config, ball as Ball);
		}

		//this value can be set in the pongConfig.json file: sensorInput = true
		// to choose which config we use (there are three in the json file) you can specify it in the constants.globalvar.tsx file
		if (CON.config[config].sensorInput) {
			console.log("sensor input");
			return this.AnalogupdatePaddle(deltaTime, config, analogVal);
		}
		let hasMoved = false;
		const margin = .5;
		if (this.keyListener.checkKeysPressed()) {
			console.log("key input");
			let hasMoved = false;
			const margin = .5;
			let initialY = this.y;
			this.movementComponent.update(deltaTime);
			this.y = this.movementComponent.getY();
			this.checkBounds(config);
			
			hasMoved = Math.abs(this.y - initialY) > margin;
			return hasMoved;
		}
		return false;
	}

	public setAIlevel(level: number) {
		this.AIlevel = level;
	}
}
