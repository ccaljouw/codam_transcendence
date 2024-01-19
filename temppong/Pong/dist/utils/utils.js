import * as CON from "./constants.js";
export function drawGameObject(ctx, x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}
export function getNormalizedDistance(ball, paddle) {
    let paddleCenter = paddle.getY() + paddle.getHeight() / 2;
    let ballCenter = ball.getY() + ball.getHeight() / 2;
    let distance = ballCenter - paddleCenter;
    let normalizedDistance = distance / (paddle.getHeight() / 2);
    return normalizedDistance;
}
export function switchDirectionForRightPaddle(newDirection, normalizedDistance) {
    if (normalizedDistance < 0) {
        return (Math.PI * 3) - newDirection;
    }
    else {
        return Math.PI - newDirection;
    }
}
export function settleScore(players, scored) {
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
export function endGame(game, winner) {
    game.gameState = 3;
    game.messageField?.setText(winner + CON.WIN_MESSAGE);
}
export function startKeyPressed(game) {
    if (game.gameState == 1) {
        return;
    }
    if (game.gameState == 3) {
        game.resetMatch();
    }
    else {
        game.gameState = 1;
        game.messageField?.setText("");
        game.ball?.startBall();
    }
}
export function pauseKeyPressed(game) {
    if (game.gameState == 1) {
        game.gameState = 2;
        game.messageField?.setText(CON.PAUSE_MESSAGE);
    }
    else if (game.gameState == 2) {
        game.gameState = 1;
    }
}
export function updateMessageField(messageField, gameState) {
    if (gameState == 0) {
        messageField.setText(CON.START_MESSAGE);
    }
    else if (gameState == 1) {
        messageField.setText("");
    }
    else if (gameState == 2) {
        messageField.setText(CON.PAUSE_MESSAGE);
    }
}
