import { Game } from '../components/Game'
import { GameObject } from '../gameObjects/GameObject'
import { Ball } from '../gameObjects/Ball'
import * as CON from './constants'
import {
	 	wallInitializer,
		paddleInitializer,
		keyListenerInitializer,
		messageFieldInitializer,
		playerInitializer,
		lineInitializer,
		canvasInitializer } from "./initializers";

export function initializeGameObjects(game: Game) {
  canvasInitializer(game);
  messageFieldInitializer(game.messageFields, game.config);
  paddleInitializer(game);
  wallInitializer(game.walls, game.config);
  lineInitializer(game.lines, game.config);
  playerInitializer(game.players, game.config, game.gameUsers);
  keyListenerInitializer(game);
  game.backgroundFill = new GameObject("background", 0, 0, CON.config[game.config].screenWidth, CON.config[game.config].screenHeight, 'black');
  setBall(game);
}

function setBall(game: Game) {
  game.ball = null;
  game.ball = new Ball(game.config, game.theme);
}

export function drawGameObjects(game: Game) {
  game.backgroundFill?.draw(game.ctx); 
  game.paddels.forEach(paddle => paddle.draw(game.ctx));
  game.lines.forEach(line => line.draw(game.ctx));
  game.players.forEach(player => player.scoreField?.draw(game.ctx));
  game.players.forEach(player => player.nameField?.draw(game.ctx));
  game.messageFields.forEach(message => message.draw(game.ctx));
  game.ball?.draw(game.ctx);
  game.walls.forEach(wall => {  if (wall.getActive()) { wall.draw(game.ctx);}});
 }


export function resetGameObjects(game: Game) {
  game.soundFX.reinitialize();
  game.paddels.forEach(paddle => paddle.resetPaddle(game.config));
  setBall(game);
}
