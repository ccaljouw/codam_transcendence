import { GameObject } from '../gameObjects/GameObject'
import { Ball } from '../gameObjects/Ball'
import { Game } from '../components/Game'
import * as CON from './constants'
import { TextComponent } from '../components/TextComponent'
import { drawGameObjects } from './objectController'
import { transcendenceSocket } from '@ft_global/socket.globalvar'
import { GameState } from '@prisma/client'
import { UpdateGameStateDto } from '@ft_dto/game'

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

export function escapeKeyPressed(game: Game) {
	const gameSocket = transcendenceSocket;
	const payload : UpdateGameStateDto  = {id: game.roomId, state: GameState.ABORTED};
  gameSocket.emit("game/updateGameState", payload);
	game.abortGame(0);
}

export function countdown(game: Game) {
	log("GameScript: countdown started");

	let count = CON.config[game.config].countdownTime;
	let interval = setInterval(() => {
		game.messageFields[0]?.setText(count.toString());
		count--;
		
		if (count == -1) {
			game.soundFX.playStart();
			clearMessageFields(game.messageFields);
			clearInterval(interval);
			if (game.instanceType === 0 && game.ball?.movementComponent.getSpeed() === 0) {
				game.ball?.getStartValues(game.config, game);
			}
		} else { game.soundFX.playCountdown2(); }
	}, 1000);
}

export function checkWinCondition(game: Game) {
	let winningScore = CON.config[game.config].winningScore;
	for (let player of game.players) {
		if (player.getScore() >= winningScore) {
			return player.getSide();
		}
	}
	return -1;
}

export function settleScore(thisSideScored: CON.PlayerSide, game: Game) {
	const gameSocket = transcendenceSocket;
	game.players[thisSideScored].setScore(game.players[thisSideScored].getScore() + 1);
	gameSocket.emit("game/updateGameObjects", {roomId: game.roomId, score1: game.players[0].getScore(), score2: game.players[1].getScore()});
}

export function detectScore(ball: Ball, game: Game) {
	if (ball.getX() < 0) {
		settleScore(1, game);
		return true;
	}
	else if (ball.getX() + ball.getWidth() > CON.config[game.config].screenWidth) {
		settleScore(0, game);
		return true;
	}
	return false;
}

function setPaddleTheme(game: Game) {
	game.paddels.forEach(paddle => paddle.setColor(CON.themes[game.theme].leftPaddleColor));
	game.paddels.forEach(paddle => paddle.setColor(CON.themes[game.theme].rightPaddleColor));
}

export function setWallTheme(game: Game) {
	game.walls.forEach(wall => {
		if (wall.getType() == 0) {
			wall.setColor(CON.themes[game.theme].wallColor);
		}
		else {
			wall.setColor(CON.themes[game.theme].backWallColor);
		}
	});
}

function setPlayerTheme(game: Game) {
	game.players.forEach(player => {
		if (player.getSide() == 0) {
			player.nameField?.setSize(CON.themes[game.theme].leftPlayerSize);
			player.nameField?.setColor(CON.themes[game.theme].leftPlayerColor);
			player.nameField?.setFont(CON.themes[game.theme].leftPlayerFont);
			player.scoreField?.setSize(CON.themes[game.theme].leftScoreFieldSize);
			player.scoreField?.setColor(CON.themes[game.theme].leftScoreFieldColor);
			player.scoreField?.setFont(CON.themes[game.theme].leftScoreFieldFont);
		}
		else {
			player.nameField?.setSize(CON.themes[game.theme].rightPlayerSize);
			player.nameField?.setColor(CON.themes[game.theme].rightPlayerColor);
			player.nameField?.setFont(CON.themes[game.theme].rightPlayerFont);
			player.scoreField?.setSize(CON.themes[game.theme].rightScoreFieldSize);
			player.scoreField?.setColor(CON.themes[game.theme].rightScoreFieldColor);
			player.scoreField?.setFont(CON.themes[game.theme].rightScoreFieldFont);
		}
	});
}
	
function setMessageTheme(game: Game) {
	game.messageFields.forEach(message => {
		if (message.getName() == "left") {
			message.setColor(CON.themes[game.theme].bottomLeftTextColor);
			message.setFont(CON.themes[game.theme].bottomLeftTextFont);
			message.setSize(CON.themes[game.theme].bottomLeftTextSize);
		}
		else if (message.getName() == "right") {
			message.setColor(CON.themes[game.theme].bottomRightTextColor);
			message.setFont(CON.themes[game.theme].bottomRightTextFont);
			message.setSize(CON.themes[game.theme].bottomRightTextSize);
		}
	});
}

export function	setTheme(game: Game) {
	setPaddleTheme(game);
	setWallTheme(game);
	setPlayerTheme(game);
	setMessageTheme(game);

	game.lines.forEach(line => line.setColor(CON.themes[game.theme].lineColor));
	game.backgroundFill?.setColor(CON.themes[game.theme].backgroundColor);
	game.ball?.setColor(CON.themes[game.theme].ballColor);
	game.ctx.clearRect(0, 0, game.canvas!.width, game.canvas!.height);
	drawGameObjects(game);
}

export function setAILevel(game: Game, level: number) {
	CON.config[game.config].AILevel = level;
}

export function log(message: string) {
	if (CON.logging) {
		console.log("GameScript: ", message);
	}
}