
import { Wall } from "../gameObjects/Wall.js";
import { Paddle } from "../gameObjects/Paddle.js";
import { Ball } from "../gameObjects/Ball.js";
import * as CON from "../utils/constants.js";


function checkWallCollisions(ball: Ball, walls: Wall[]) {
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


function checkPAddleCollisions(ball: Ball, paddles: Paddle[]) {
	for (let paddle of paddles) {
		if (ball.getX() + ball.getWidth() + ball.movementComponent.getSpeedX() > paddle.getX() && ball.getX() - CON.MARGIN < paddle.getX() + paddle.getWidth()) {
			if ((ball.getY() + ball.getHeight() + CON.MARGIN) > paddle.getY() && ball.getY() - CON.MARGIN < paddle.getY() + paddle.getHeight()) {
				ball.hitPaddle(paddle);
			}
		}
	}
}


function checkGoalCollisions(ball: Ball, walls: Wall[]) {
	if (ball.getX() + ball.getWidth() < 0) {
		return "Right";
	}
	else if (ball.getX() > CON.SCREEN_WIDTH) {
		return "Left";
	}
}


export function detectCollision(ball: Ball, paddles: Paddle[], walls: Wall[]) {
	checkWallCollisions(ball, walls);
	checkPAddleCollisions(ball, paddles);
	return checkGoalCollisions(ball, walls);
}
  