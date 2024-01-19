import { GameObject } from "../gameObjects/GameObject.js";
import { Player } from "../components/Player.js";
import { Game } from "../components/game.js";
import * as CON from "./constants.js";
import { TextObject } from "../components/TextObject.js";


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

export function settleScore(players: Player[], scored: string) {
	for (let player of players) {
		if (player.getSide() == scored) {
			player.setScore(player.getScore() + 1);
			player.scoreField?.setText(player.getScore().toString());
		}
		if (player.getScore() == CON.WINNING_SCORE) {
			return player.getName() + " Wins!\n";
		}
	}
	return null;
}

export function endGame(game: Game, winner: string) {
	game.gameState = 3
	game.messageField?.setText(winner + CON.WIN_MESSAGE);
}

// export function LoadBackground() {
// 	const backGround = new Image();
// 	backGround.src = CON.BACKGROUND_IMAGE;
// 	return backGround;
// }

export function startKeyPressed(game: Game) {
	if (game.gameState == 1 ) {
		return;
	} 
	if (game.gameState == 3){
		game.resetMatch();
	} else {
		game.gameState = 1;
		game.messageField?.setText("");
		game.ball?.startBall();
	}
}

export function pauseKeyPressed(game: Game) {
	if (game.gameState == 1) {
		game.gameState = 2;
		game.messageField?.setText(CON.PAUSE_MESSAGE);
	} else if (game.gameState == 2) {
		game.gameState = 1;
	}
}

export function updateMessageField(messageField: TextObject, gameState: number) {
	if (gameState == 0) {
		messageField.setText(CON.START_MESSAGE);
	} else if (gameState == 1) {
		messageField.setText("");
	} else if (gameState == 2) {
		messageField.setText(CON.PAUSE_MESSAGE);
	}
}

