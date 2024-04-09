import { Game } from "../components/Game"
import * as CON from "./constants"
import { Ball } from "../gameObjects/Ball"
import { detectCollision } from "./collisionDetection"
import { detectScore, checkWinCondition } from "./utils"
import { GameState } from "@prisma/client"


export function updateObjects(game: Game, deltaTime: number, config: keyof typeof CON.config) {
  game.elapasedTimeSincceLastUpdate += deltaTime;

  updatePaddles(game, deltaTime, config);
  updateBall(game, deltaTime, config);
  // game.messageFields.forEach(message => message.update());
}


function updatePaddles(game: Game, deltaTime: number, config: keyof typeof CON.config) {
  // console.log("script: updatePaddles");
  let paddleMoved = game.paddels.map(paddle => paddle.updatePaddle(game.gameState, deltaTime, config));
  if (paddleMoved.some(moved => moved === true) && game.elapasedTimeSincceLastUpdate >= CON.config[config].socketUpdateInterval) {
    if (game.instanceType === 0) {
      game.gameSocket.emit("game/updateGameObjects", {
        roomId: game.roomId,
        paddle1Y: game.paddels[0].movementComponent.getY()
      });
    }
    if (game.instanceType === 1) {
      game.gameSocket.emit("game/updateGameObjects", {
        roomId: game.roomId,
        paddle2Y: game.paddels[1].movementComponent.getY()
      });
    }
  }
}

function updateBall(game: Game, deltaTime: number, config: keyof typeof CON.config) {
  if (game.gameState !== GameState.STARTED) {
    return;
  }
  // console.log("script: updateBall");
  emmitBallPosition(game, deltaTime, config);
  interpolateBallPosition(game, config);
}

function emmitBallPosition(game: Game, deltaTime: number, config: keyof typeof CON.config) {

  game.ball?.updateBall(game.gameState, deltaTime);
  
  if (game.instanceType === 0 && game.elapasedTimeSincceLastUpdate >= CON.config[config].socketUpdateInterval) { //todo change to observer
    game.gameSocket.emit("game/updateGameObjects", {
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
  if (game.instanceType !== 0) { //todo change to not observer
    return;
  }

  if (game.ball) {
    let goal = detectScore(game.ball as Ball, game.players, config, game);
    if (goal === false) {
      return;
    }
  }
  
  let winner = checkWinCondition(game.players, config) ?? -1;
  if (winner !== -1) {
    game.endGame(winner!);
    game.gameSocket.emit("game/updateGameObjects", {roomId: game.roomId, winner: winner});
    return;
  } else {
    game.resetGame();
    game.gameSocket.emit("game/updateGameObjects", {roomId: game.roomId, resetGame: 1});
  }
}