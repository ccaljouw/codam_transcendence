import { GameObject } from './GameObject'
import { MovementComponent } from '../components/MovementComponent'
import { Ball } from './Ball'
import { KeyListenerComponent } from '../components/KeyListenerComponent'
import * as CON from '../utils/constants'


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

	public updateAiPaddle(deltaTime: number, config: keyof typeof CON.config, ball: Ball, margin: number): boolean {
    if (ball == null || ball.movementComponent.getSpeed() === 0) {
        return false;
    }
		
    const AIlevel = CON.config[config].AILevel;
    const paddleSpeed = CON.config[config].paddleBaseSpeed / AIlevel;
		const ballY = ball.movementComponent.getY();
    const dampingFactor = Math.min(1, AIlevel / 10 + 0.5);
    const effectivePaddleSpeed = paddleSpeed * dampingFactor;
    const lerpFactor = deltaTime * effectivePaddleSpeed;
    
    // interpolation 
    const initialY = this.movementComponent.getY();
    const targetY = ballY;

		this.y += + lerpFactor * (targetY - this.movementComponent.getY());
    this.checkBounds(config);

		return Math.abs(this.y - initialY) > margin;
}


	public updatePaddle(deltaTime: number, config: keyof typeof CON.config, ball: Ball | null): boolean {
		let hasMoved = false;
		const margin = .5;

		if (this.name == `AI`) {
			return this.updateAiPaddle(deltaTime, config, ball as Ball, margin);
		}

		if (this.keyListener.checkKeysPressed()) {
			let initialY = this.y;
			this.movementComponent.update(deltaTime);
			this.y = this.movementComponent.getY();
			this.checkBounds(config);
			
			hasMoved = Math.abs(this.y - initialY) > margin;
		}
		return hasMoved;
	}
}
