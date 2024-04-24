import { Game } from '../components/Game'
import * as CON from './constants'
import { Ball } from '../gameObjects/Ball'
import { detectCollision } from './collisionDetection'
import { detectScore, checkWinCondition } from './utils'
import { GameState } from '@prisma/client'
import { UpdateGameStateDto } from '@ft_dto/game'
import { transcendenceSocket } from '@ft_global/socket.globalvar'

//todo split per instance type and adjust imports 


export function updateObjects(game: Game, deltaTime: number, config: keyof typeof CON.config) {
  if (game.gameState !== GameState.STARTED) {
    return;
  }

  game.elapasedTimeSincceLastUpdate += deltaTime;

  updatePaddles(game, deltaTime, config);
  updateBall(game, deltaTime, config);
  // game.messageFields.forEach(message => message.update());
}

function updatePaddles(game: Game, deltaTime: number, config: keyof typeof CON.config) {
  const gameSocket = transcendenceSocket;

  CON.config[config].socketUpdateInterval
  let paddleMoved = game.paddels.map(paddle => paddle.updatePaddle(deltaTime, config, game.ball as Ball));
  if (paddleMoved.some(moved => moved === true) && game.elapasedTimeSincceLastUpdate >= CON.config[config].socketUpdateInterval) {
    if (game.instanceType === 0) {
      gameSocket.emit("game/updateGameObjects", {
        roomId: game.roomId,
        paddle1Y: game.paddels[0].movementComponent.getY()
      });
    }
    if (game.instanceType === 1) {
      gameSocket.emit("game/updateGameObjects", {
        roomId: game.roomId,
        paddle2Y: game.paddels[1].movementComponent.getY()
      });
    }
  }
}

function updateBall(game: Game, deltaTime: number, config: keyof typeof CON.config) {
  emmitBallPosition(game, deltaTime, config);
  interpolateBallPosition(game, config);
}

function emmitBallPosition(game: Game, deltaTime: number, config: keyof typeof CON.config) {
  game.ball?.updateBall(game.gameState, deltaTime);
  
  if (game.instanceType === 0 && game.elapasedTimeSincceLastUpdate >= CON.config[config].socketUpdateInterval) { //todo change to observer
    const gameSocket = transcendenceSocket;
    gameSocket.emit("game/updateGameObjects", {
      roomId: game.roomId,
      ballX: game.ball?.movementComponent.getX(),
      ballY: game.ball?.movementComponent.getY(),
      ballDX: game.ball?.movementComponent.getSpeedX(),
      ballDY: game.ball?.movementComponent.getSpeedY()
    });
    game.elapasedTimeSincceLastUpdate = 0;
  
   let collisionDetected = detectCollision(game.ball as Ball, game.paddels, game.walls, game.soundFX, game.config);
    //todo option to add collision emit
  }
}

function interpolateBallPosition(game: Game, config: keyof typeof CON.config) {
  if (game.instanceType === 1) { //todo change to not observer
    let targetBallSettings: {x: number, y: number, dx: number, dy: number};
    if (game.receivedUpdatedGameObjects.ballX! > 0) {
      targetBallSettings = { x: game.receivedUpdatedGameObjects.ballX!, y: game.receivedUpdatedGameObjects.ballY!, dx: game.receivedUpdatedGameObjects.ballDX!, dy: game.receivedUpdatedGameObjects.ballDY!};
        
      const currentX = game.ball?.getX();
      const currentY = game.ball?.getY();
      const currentDX = game.ball?.movementComponent.getSpeedX();
      const currentDY = game.ball?.movementComponent.getSpeedY();

      game.ball?.movementComponent.setX(currentX! + (targetBallSettings.x - currentX!) * CON.config[config].interpolationFactor);
      game.ball?.movementComponent.setY(currentY! + (targetBallSettings.y - currentY!) * CON.config[config].interpolationFactor);
      game.ball?.movementComponent.setSpeedX(currentDX! + (targetBallSettings.dx - currentDX!) * CON.config[config].interpolationFactor);
      game.ball?.movementComponent.setSpeedY(currentDY! + (targetBallSettings.dy - currentDY!) * CON.config[config].interpolationFactor);
    }
  }
}

export function checkForGoals(game: Game, config: keyof typeof CON.config) {
  const gameSocket = transcendenceSocket;
  if (game.instanceType !== 0) { //todo change to not observer
    return;
  }

  if (game.ball) {
    let goal = detectScore(game.ball as Ball, game.players, config, game);
    if (goal === false) {
      return;
    }
  }
  
  let winningSide: number = checkWinCondition(game.players, config) ?? -1;
  if (winningSide !== -1) {
    const payload : UpdateGameStateDto  = {roomId: game.roomId, state: GameState.FINISHED, winner: winningSide, score1: game.players[0].getScore(), score2: game.players[1].getScore()};
    gameSocket.emit("game/updateGameState", payload);
    game.finishGame(winningSide);
  
  } else {
    game.resetGame();
    gameSocket.emit("game/updateGameObjects", {roomId: game.roomId, resetGame: 1});
  }
}