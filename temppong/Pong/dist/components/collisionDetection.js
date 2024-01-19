import * as CON from "../utils/constants.js";
function checkWallCollisions(ball, walls) {
    for (let wall of walls) {
        if (ball.getY() < wall.getY() + wall.getHeight() + CON.MARGIN && ball.getY() + ball.getHeight() > wall.getY() - CON.MARGIN) {
            if (wall.getType() == 0) {
                ball.hitHorizontalWall();
            }
            else {
                ball.hitVerticalWall();
            }
        }
    }
}
function checkPAddleCollisions(ball, paddles) {
    for (let paddle of paddles) {
        if (ball.getX() + ball.getWidth() + ball.movementComponent.getSpeedX() > paddle.getX() && ball.getX() - CON.MARGIN < paddle.getX() + paddle.getWidth()) {
            if ((ball.getY() + ball.getHeight() + CON.MARGIN) > paddle.getY() && ball.getY() - CON.MARGIN < paddle.getY() + paddle.getHeight()) {
                ball.hitPaddle(paddle);
            }
        }
    }
}
function checkGoalCollisions(ball, walls) {
    if (ball.getX() + ball.getWidth() < 0) {
        return "Right";
    }
    else if (ball.getX() > CON.SCREEN_WIDTH) {
        return "Left";
    }
}
export function detectCollision(ball, paddles, walls) {
    checkWallCollisions(ball, walls);
    checkPAddleCollisions(ball, paddles);
    return checkGoalCollisions(ball, walls);
}
