import { Wall } from '../gameObjects/Wall'
import { Paddle } from '../gameObjects/Paddle'
import { Ball } from '../gameObjects/Ball'
import { SoundFX } from '../gameObjects/SoundFX'
import * as CON from './constants'


function detectWallCollisions(ball: Ball, walls: Wall[], soundFX: SoundFX, config: keyof typeof CON.config) {
	if (!ball.canCollideWithHorizontalWall(config) && !ball.canCollideWithVerticalWall(config)) {	return false;	}

	for (let wall of walls) {
		//predict the ball next position based on its speed and direction
		const nextBallX = ball.getX() + ball.movementComponent.getSpeedX();
		const nextBallY = ball.getY() + ball.movementComponent.getSpeedY();

		//check if the ball will collide with the wall
		if (nextBallX + ball.getWidth() > wall.getX() && nextBallX < wall.getX() + wall.getWidth()) {
			if (nextBallY < wall.getY() + wall.getHeight() && ball.getY() + ball.getHeight() > wall.getY()) {
				soundFX.playWallHit();
				//determine which wall the ball hit
				if (wall.getType() === 0 && wall.getActive()) {
					ball.setLastCollisionWithHorizontalWall();
					ball.hitHorizontalWall();
					return true;
				}
				else if (wall.getActive()) {
					ball.setLastCollisionWithVerticalWall();
					ball.hitVerticalWall();
					return true;
				}
			}
		}
	}
	return false;
}

function detectPaddleCollisions(ball: Ball, paddles: Paddle[], soundFX: SoundFX, config: keyof typeof CON.config) {
	if (!ball.canCollideWithPaddle(config)) {	return false;	}

	for (let paddle of paddles) {
		//predict the ball next position based on its speed and direction
		const nextBallX = ball.getX() + ball.movementComponent.getSpeedX();
		const nextBallY = ball.getY() + ball.movementComponent.getSpeedY();

		//check if the ball will collide with the paddle
		if (nextBallX < paddle.getX() + paddle.getWidth() && ball.getX() + ball.getWidth() > paddle.getX()) {
			if (nextBallY < paddle.getY() + paddle.getHeight() && ball.getY() + ball.getHeight() > paddle.getY()) {
				soundFX.playPaddleHit();
				ball.setLastCollisionWithPaddle();
				ball.hitPaddle(paddle, config);
				return true;
			}
		}
	}
	return false;
}

export function detectCollision(ball: Ball, paddles: Paddle[], walls: Wall[], soundFX: SoundFX, config: keyof typeof CON.config) {
	return (detectPaddleCollisions(ball, paddles, soundFX, config) || detectWallCollisions(ball, walls, soundFX, config));
}
