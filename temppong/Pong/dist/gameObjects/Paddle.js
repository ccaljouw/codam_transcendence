import { GameObject } from "./GameObject.js";
import { MovementComponent } from "../components/MovementComponent.js";
import { KeyListener } from "../components/KeyListner.js";
import * as CON from "../utils/constants.js";
export class Paddle extends GameObject {
    movementComponent;
    keyListener;
    constructor(name, x, y, width, height, color) {
        super(name, x, y, width, height, color);
        this.movementComponent = new MovementComponent(0, 0, x, y);
        this.keyListener = new KeyListener();
    }
    setKeyListerns(paddle, keyUp, keyDown) {
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
    resetPaddle() {
        this.y = CON.PADDLE_OFFSET_Y;
        this.movementComponent.setSpeed(0);
        this.movementComponent.setDirection(0);
        this.movementComponent.y = CON.PADDLE_OFFSET_Y;
    }
    checkBounds() {
        if (this.y > CON.PADDLE_MAX_Y) {
            this.movementComponent.setSpeed(0);
            this.y = CON.PADDLE_MAX_Y - this.movementComponent.getSpeed();
        }
        else if (this.y < CON.PADDLE_MIN_Y) {
            this.movementComponent.setSpeed(0);
            this.y = CON.PADDLE_MIN_Y + this.movementComponent.getSpeed();
        }
    }
    updatePaddle(state) {
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
