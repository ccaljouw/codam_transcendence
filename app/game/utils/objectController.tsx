import { Game } from "../components/Game"
import { GameObject } from "../gameObjects/GameObject"
import { Ball } from "../gameObjects/Ball"
import * as CON from "./constants"
import {
	 	wallInitializer,
		paddleInitializer,
		keyListenerInitializer,
		messageFieldInitializer,
		playerInitializer,
		lineInitializer,
		canvasInitializer } from "./initializers";


export function initializeGameObjects(game: Game, config: keyof typeof CON.config) {
  if (game.instanceType < 2) {
    canvasInitializer(game.canvas, config);
    keyListenerInitializer(game.keyListener, game, config);
    messageFieldInitializer(game.messageFields, config);
  }
  
  paddleInitializer(game.paddels, config, game.instanceType);
  wallInitializer(game.walls, config);
  lineInitializer(game.lines, config);
  playerInitializer(game.players, config, game.gameUsers);
  keyListenerInitializer(game.keyListener, game, config);
  game.backgroundFill = new GameObject("background", 0, 0, CON.config[config].screenWidth, CON.config[config].screenHeight, 'black');
  setBall(game);
}

function setBall(game: Game) {
  game.ball = null;
  game.ball = new Ball();
}

export function drawGameObjects(game: Game) {
  game.backgroundFill?.draw(game.ctx); 
  game.paddels.forEach(paddle => paddle.draw(game.ctx));
  game.lines.forEach(line => line.draw(game.ctx));
  game.players.forEach(player => player.scoreField?.draw(game.ctx));
  game.players.forEach(player => player.nameField?.draw(game.ctx));
  game.messageFields.forEach(message => message.draw(game.ctx));
  game.ball?.draw(game.ctx);
  game.walls.forEach(wall => wall.draw(game.ctx));
}

export function resetGameObjects(game: Game) {
  game.soundFX.reinitialize();
  game.paddels.forEach(paddle => paddle.resetPaddle());
  setBall(game);
}
