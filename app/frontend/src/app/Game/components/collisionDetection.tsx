
import { Wall } from "../gameObjects/Wall";
import { Paddle } from "../gameObjects/Paddle";
import { Ball } from "../gameObjects/Ball";
import * as CON from "../utils/constants";
import { Player } from "./Player";
import { settleScore } from "../utils/utils";


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


function checkPaddleCollisions(ball: Ball, paddles: Paddle[]) {
	for (let paddle of paddles) {
		if (ball.getX() + ball.getWidth() + ball.movementComponent.getSpeedX() > paddle.getX() && ball.getX() - CON.MARGIN < paddle.getX() + paddle.getWidth()) {
			if ((ball.getY() + ball.getHeight() + CON.MARGIN) > paddle.getY() && ball.getY() - CON.MARGIN < paddle.getY() + paddle.getHeight()) {
				ball.hitPaddle(paddle);
			}
		}
	}
}


export function detectScore(ball: Ball, players: Player[]) {
	let goal = false;
	if (ball.getX() + ball.getWidth() < 0) {
		settleScore(players, "Right");
		return true;
	}
	else if (ball.getX() > CON.SCREEN_WIDTH) {
		settleScore(players, "Left");
		return true;
	}
	return false;
}


export function detectCollision(ball: Ball, paddles: Paddle[], walls: Wall[]) {
	checkWallCollisions(ball, walls);
	checkPaddleCollisions(ball, paddles);
}
  