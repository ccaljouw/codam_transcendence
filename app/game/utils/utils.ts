import { GameObject } from '../gameObjects/GameObject'
import { Ball } from '../gameObjects/Ball'
import { PlayerComponent } from '../components/PlayerComponent'
import { Game } from '../components/Game'
import * as CON from './constants'
import { TextComponent } from '../components/TextComponent'
import { drawGameObjects } from './objectController'
import { transcendenceSocket } from '@ft_global/socket.globalvar'


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
			if (game.instanceType === 0 && game.ball?.movementComponent.getSpeed() === 0) {
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


export function checkWinCondition(players: PlayerComponent[], config: keyof typeof CON.config) {
	// console.log("Checking win condition");
	let winningScore = CON.config[config].winningScore;
	for (let player of players) {
		if (player.getScore() >= winningScore) {
			return player.getSide();
		}
	}
	return -1;
}

export function settleScore(players: PlayerComponent[], thisSideScored: CON.PlayerSide, game: Game) {
	const gameSocket = transcendenceSocket;

	players[thisSideScored].setScore(players[thisSideScored].getScore() + 1);
	gameSocket.emit("game/updateGameObjects", {roomId: game.roomId, score1: players[0].getScore(), score2: players[1].getScore()});
}


export function detectScore(ball: Ball, players: PlayerComponent[], config: keyof typeof CON.config, game: Game) {
	if (ball.getX() < 0) {
		settleScore(players, 1, game);
		return true;
	}
	else if (ball.getX() + ball.getWidth() > CON.config[config].screenWidth) {
		settleScore(players, 0, game);
		return true;
	}
	return false;
}


function setPaddleTheme(game: Game, theme: keyof typeof CON.themes) {
	game.paddels.forEach(paddle => paddle.setColor(CON.themes[theme].leftPaddleColor));
	game.paddels.forEach(paddle => paddle.setColor(CON.themes[theme].rightPaddleColor));
}

function setWallTheme(game: Game, theme: keyof typeof CON.themes) {
	game.walls.forEach(wall => wall.setColor(CON.themes[theme].backWallColor));
	game.walls.forEach(wall => wall.setColor(CON.themes[theme].wallColor));
}

function setPlayerTheme(game: Game, theme: keyof typeof CON.themes) {
	game.players.forEach(player => {
		if (player.getSide() == 0) {
			player.nameField?.setSize(CON.themes[theme].leftPlayerSize);
			player.nameField?.setColor(CON.themes[theme].leftPlayerColor);
			player.nameField?.setFont(CON.themes[theme].leftPlayerFont);
			player.scoreField?.setSize(CON.themes[theme].leftScoreFieldSize);
			player.scoreField?.setColor(CON.themes[theme].leftScoreFieldColor);
			player.scoreField?.setFont(CON.themes[theme].leftScoreFieldFont);
		}
		else {
			player.nameField?.setSize(CON.themes[theme].rightPlayerSize);
			player.nameField?.setColor(CON.themes[theme].rightPlayerColor);
			player.nameField?.setFont(CON.themes[theme].rightPlayerFont);
			player.scoreField?.setSize(CON.themes[theme].rightScoreFieldSize);
			player.scoreField?.setColor(CON.themes[theme].rightScoreFieldColor);
			player.scoreField?.setFont(CON.themes[theme].rightScoreFieldFont);
		}
	});
}
	

function setMessageTheme(game: Game, theme: keyof typeof CON.themes) {
	game.messageFields.forEach(message => {
		if (message.getName() == "left") {
			message.setColor(CON.themes[theme].bottomLeftTextColor);
			message.setFont(CON.themes[theme].bottomLeftTextFont);
			message.setSize(CON.themes[theme].bottomLeftTextSize);
		}
		else if (message.getName() == "right") {
			message.setColor(CON.themes[theme].bottomRightTextColor);
			message.setFont(CON.themes[theme].bottomRightTextFont);
			message.setSize(CON.themes[theme].bottomRightTextSize);
		}
	});
}


export function	setTheme(game: Game, theme: keyof typeof CON.themes) {
	game.theme = theme;
	setPaddleTheme(game, theme);
	setWallTheme(game, theme);
	setPlayerTheme(game, theme);
	setMessageTheme(game, theme);

	game.lines.forEach(line => line.setColor(CON.themes[theme].lineColor));
	game.backgroundFill?.setColor(CON.themes[theme].backgroundColor);
	game.ball?.setColor(CON.themes[theme].ballColor);
	game.ctx.clearRect(0, 0, game.canvas!.width, game.canvas!.height);
	drawGameObjects(game);
}

