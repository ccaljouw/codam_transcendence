import { GameObject } from "./GameObject.js";
import { MovementComponent } from "../components/MovementComponent.js";
import { getNormalizedDistance, switchDirectionForRightPaddle } from "../utils/utils.js";
import * as CON from "../utils/constants.js";
export class Ball extends GameObject {
    movementComponent;
    constructor() {
        super("Ball", CON.BALL_START_X, CON.BALL_START_Y, CON.BALL_WIDTH, CON.BALL_WIDTH, CON.BALL_COLOR);
        this.movementComponent = new MovementComponent(0, 0, CON.BALL_START_X, CON.BALL_START_Y);
    }
    startBall() {
        const angle = Math.random() * Math.PI / 3 - Math.PI / 6;
        if (Math.random() < 0.5) {
            this.movementComponent.setDirection(angle + Math.PI);
        }
        else {
            this.movementComponent.setDirection(angle);
        }
        this.movementComponent.setSpeed(CON.BALL_BASE_SPEED + Math.random() * 2 - 1);
    }
    resetBall() {
        this.movementComponent.resetMovementComponent();
        this.movementComponent.x = CON.BALL_START_X;
        this.movementComponent.y = CON.BALL_START_Y;
    }
    increaseSpeed() {
        this.movementComponent.setSpeed(this.movementComponent.getSpeed() + CON.BALL_SPEED_INCREASE);
    }
    getNewDirection(paddle, angle) {
        let normalizedDistance = getNormalizedDistance(this, paddle);
        let newDirection = normalizedDistance * CON.MAX_BOUNCE_ANGLE;
        let ballDirection = this.movementComponent.getXdiretcion();
        if (ballDirection == 1) {
            this.x -= this.movementComponent.getSpeed() * 2;
            newDirection = switchDirectionForRightPaddle(newDirection, normalizedDistance);
        }
        this.x += this.movementComponent.getSpeed() * 2;
        return newDirection;
    }
    hitPaddle(paddle) {
        let newDirection = this.getNewDirection(paddle, this.movementComponent.getDirection());
        this.movementComponent.setDirection(newDirection);
        this.increaseSpeed();
    }
    hitHorizontalWall() {
        this.movementComponent.setSpeedY(this.movementComponent.getSpeedY() * -1);
        if (this.movementComponent.getYdiretcion() < 0) {
            this.y += this.movementComponent.getSpeedY() * 2;
        }
        else {
            this.y -= this.movementComponent.getSpeedY() * 2;
        }
    }
    hitVerticalWall() {
        this.movementComponent.setSpeedX(this.movementComponent.getSpeedX() * -1);
        if (this.movementComponent.getXdiretcion() < 0) {
            this.x += this.movementComponent.getSpeedX() * 2;
        }
        else {
            this.x -= this.movementComponent.getSpeedX() * 2;
        }
    }
    updateBall(state) {
        if (state == 2) {
            return;
        }
        this.movementComponent.update();
        this.x = this.movementComponent.x;
        this.y = this.movementComponent.y;
    }
}
