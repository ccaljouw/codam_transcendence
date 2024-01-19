import { Paddle } from "../gameObjects/Paddle";
import * as CON from "../utils/constants";
export function LeftPaddleInitializer() {
    let leftPaddle = new Paddle("LeftPaddle", CON.PADDLE_OFFSET_X, CON.PADDLE_OFFSET_Y, CON.PADDLE_WIDTH, CON.PADDLE_HEIGHT, CON.LEFT_PADDLE_COLOR);
    leftPaddle.setKeyListerns(leftPaddle, CON.LEFT_PADDLE_UP_KEY, CON.LEFT_PADDLE_DOWN_KEY);
    return leftPaddle;
}
export function RightPaddleInitializer() {
    let rightPaddle = new Paddle("RightPaddle", (CON.SCREEN_WIDTH - CON.PADDLE_OFFSET_X - CON.PADDLE_WIDTH), CON.PADDLE_OFFSET_Y, CON.PADDLE_WIDTH, CON.PADDLE_HEIGHT, CON.RIGHT_PADDLE_COLOR);
    rightPaddle.setKeyListerns(rightPaddle, CON.RIGHT_PADDLE_UP_KEY, CON.RIGHT_PADDLE_DOWN_KEY);
    return rightPaddle;
}
