
import { GameObject } from "./GameObject";
import { MovementComponent } from "../components/MovementComponent";
import { KeyListener } from "../components/KeyListner";
import * as CON from "../utils/constants";

export class Paddle extends GameObject {
	public	movementComponent: MovementComponent;
	public	keyListener: KeyListener;

	constructor(name: string, x: number, y: number, width: number, height: number, color: string) {
		super(name, x, y, width, height, color);
		this.movementComponent = new MovementComponent(0, 0, x, y);
		this.keyListener = new KeyListener();
	}
	
	
	public setKeyListerns(paddle: Paddle, keyUp: string, keyDown: string) {
		if (paddle == null) {
			throw new Error("Paddle is not initialized");
		}

		paddle.keyListener.addKeyCallback(keyUp, () => {
			paddle.movementComponent.setDirection(1.5 * Math.PI);
			paddle.movementComponent.setSpeed(5);
		});

		paddle.keyListener.addKeyCallback(keyDown, () => {
			paddle.movementComponent.setDirection(0.5 * Math.PI);
			paddle.movementComponent.setSpeed(5);
		});
	}

	public resetPaddle() {
		this.y = CON.PADDLE_OFFSET_Y;
		this.movementComponent.setSpeed(0);
		this.movementComponent.setDirection(0);
		this.movementComponent.y = CON.PADDLE_OFFSET_Y;
	}

	
	//checks if paddle is out of bounds. set back and stop movment to reduce lag
	private checkBounds() {
		if (this.y > CON.PADDLE_MAX_Y) {
			this.movementComponent.setSpeed(0);
			this.y = CON.PADDLE_MAX_Y - this.movementComponent.getSpeed();
		} else if (this.y < CON.PADDLE_MIN_Y) {
			this.movementComponent.setSpeed(0);
			this.y = CON.PADDLE_MIN_Y + this.movementComponent.getSpeed();
		}
	}

	public updatePaddle(state: number) {
		if (state == 2) {
			return;
		}
		if (state != 1) {
			this.resetPaddle();
			return;
		}
		if (this.keyListener.checkKeysPressed()) {
			this.movementComponent.update();
			this.y = this.movementComponent.y;
			this.checkBounds();	
		}
	}
}
