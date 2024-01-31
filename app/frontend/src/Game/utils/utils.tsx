
import { GameObject } from "../gameObjects/GameObject";
import { Ball } from "../gameObjects/Ball";
import { PlayerComponent } from "../components/PlayerComponent";
import { Game } from "../components/Game";
import * as CON from "./constants";
import { TextComponent } from "../components/TextComponent";


export function drawGameObject(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string) {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, width, height);
}


export function getNormalizedDistance(ball: GameObject, paddle: GameObject) {
	let paddleCenter = paddle.getY() + paddle.getHeight() / 2;
	let ballCenter = ball.getY() + ball.getHeight() / 2;
	let distance = ballCenter - paddleCenter;
	let normalizedDistance = distance / (paddle.getHeight() / 2);
	return normalizedDistance;		
}


export function switchDirectionForRightPaddle(newDirection: number, normalizedDistance: number) {
	if (normalizedDistance < 0) {
		return (Math.PI * 3) - newDirection;
	} else {
		return Math.PI - newDirection;
	}
}


function clearMessageFields(messageFields: TextComponent[]) {
	for (let message of messageFields) {
		message.setText("");
	}
}


export function startKeyPressed(game: Game) {
	if (game.gameState == 1 ) {
		return;
	} else if (game.gameState == 2) {
		clearMessageFields(game.messageFields);
		game.gameState = 1;
	} else if (game.gameState == 3){
		game.resetMatch();
	} else {
		clearMessageFields(game.messageFields);
		game.gameState = 1;
		game.ball?.startBall();
	}
}


export function pauseKeyPressed(game: Game) {
	if (game.gameState == 1) {
		game.messageFields[0].setText(CON.PAUSE_MESSAGE);
		game.gameState = 2;
	} else if (game.gameState == 2) {
		clearMessageFields(game.messageFields);
		game.gameState = 1;
	}
}


export function checkWinCondition(players: PlayerComponent[]) {
	for (let player of players) {
		if (player.getScore() >= CON.WINNING_SCORE) {
			return player;
		}
	}
	return null;
}

export function settleScore(players: PlayerComponent[], scored: string) {
	for (let player of players) {
		if (player.getSide() == scored) {
			player.setScore(player.getScore() + 1);
			player.scoreField?.setText(player.getScore().toString());
		}
	}
}


export function detectScore(ball: Ball, players: PlayerComponent[]) {
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
