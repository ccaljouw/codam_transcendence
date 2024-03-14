
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


// export function startKeyPressed(game: Game, config: keyof typeof CON.config) {
// 	if (game.gameState == `FINISHED`) {
// 		game.resetMatch();
// 	} else if (game.gameState == `WAITING`){
// 		game.gameState = `STARTED`;
// 		countdown(game, config);
// 	}
// }

export function countdown(game: Game, config: keyof typeof CON.config) {
	let count = CON.config[config].countdownTime;
	let interval = setInterval(() => {
		game.messageFields[0]?.setText(count.toString());
		count--;
		
		if (count == -1) {
			clearMessageFields(game.messageFields);
			clearInterval(interval);
			if (game.instanceType === 0) {
				game.ball?.getStartValues(config, game);
			}
		}
	}, 1000);
}

// export function pauseKeyPressed(game: Game) {
// 	if (game.gameState == 1) {
// 		game.messageFields[0].setText(CON.PAUSE_MESSAGE);
// 		game.gameState = 2;
// 	} else if (game.gameState == 2) {
// 		clearMessageFields(game.messageFields);
// 		game.gameState = 1;
// 	}
// }


export function checkWinCondition(players: PlayerComponent[], config: keyof typeof CON.config, game: Game) {
	const winningScore = CON.config[config].winningScore;
	for (let player of players) {
		if (player.getScore() >= winningScore) {
			return player;
		}
	}
	return null;
}

export function settleScore(players: PlayerComponent[], thisSideScored: string, game: Game) {
	for (let player of players) {
		if (player.getSide() == thisSideScored) {
			player.setScore(player.getScore() + 1);
			player.scoreField?.setText(player.getScore().toString());
		}
	}
	game.gameSocket.emit("game/updateGameObjects", {roomId: game.roomId, score1: players[0].getScore(), score2: players[1].getScore()});
}


export function detectScore(ball: Ball, players: PlayerComponent[], config: keyof typeof CON.config, game: Game) {
	if (ball.getX() < 0) {
		settleScore(players, "Right", game);
		return true;
	}
	else if (ball.getX() + ball.getWidth() > CON.config[config].screenWidth) {
		settleScore(players, "Left", game);
		return true;
	}
	return false;
}

