
import { GameObject } from "./GameObject";
import { MovementComponent } from "../components/MovementComponent";
import { getNormalizedDistance, switchDirectionForRightPaddle } from "../utils/utils";
import * as CON from "../utils/constants";
import { detectCollision } from "../components/collisionDetection";


export class Ball extends GameObject {
	
	public	movementComponent: MovementComponent;

	constructor() {
		super("Ball", CON.BALL_START_X, CON.BALL_START_Y, CON.BALL_WIDTH, CON.BALL_WIDTH, CON.BALL_COLOR);
		this.movementComponent = new MovementComponent(0, 0, CON.BALL_START_X, CON.BALL_START_Y);
	}


	public startBall() {
		//random angle beteen -1/6 PI and 1/6 PI
		const angle = Math.random() * Math.PI / 3 - Math.PI / 6;

		//set direction left or right
		if (Math.random() < 0.5) {
			this.movementComponent.setDirection(angle + Math.PI);
		} else {
			this.movementComponent.setDirection(angle);
		}
		//set base speed + random value between -1 and 1
		this.movementComponent.setSpeed(CON.BALL_BASE_SPEED + Math.random() * 2 - 1);		
	}


	public resetBall() {
		this.movementComponent.resetMovementComponent();
		this.movementComponent.x = CON.BALL_START_X;
		this.movementComponent.y = CON.BALL_START_Y;
	}


	public increaseSpeed() {
		this.movementComponent.setSpeed(this.movementComponent.getSpeed() + CON.BALL_SPEED_INCREASE);
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


	public hitPaddle(paddle: GameObject) {
		
		//get new direction based on where the ball hits the paddle
		let newDirection = this.getNewDirection(paddle, this.movementComponent.getDirection());
		this.movementComponent.setDirection(newDirection);
		
		this.increaseSpeed();
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


	public updateBall(state: number) {
		if (state == 2) {
			return;
		}
		this.movementComponent.update();
		this.x = this.movementComponent.x;
		this.y = this.movementComponent.y;
	}
}
