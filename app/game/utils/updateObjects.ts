import { Game } from '../components/Game'
import * as CON from './constants'
import { Ball } from '../gameObjects/Ball'
import { detectCollision } from './collisionDetection'
import { detectScore, checkWinCondition, setWallTheme, log } from './utils'
import { GameState } from '@prisma/client'
import { UpdateGameStateDto } from '@ft_dto/game'
import { transcendenceSocket } from '@ft_global/socket.globalvar'

export function updateObjects(game: Game, deltaTime: number) {
  if (game.gameState !== GameState.STARTED) {
    return;
  }
  game.elapasedTimeSincceLastUpdate += deltaTime;
  updatePaddles(game, deltaTime);
  updateBall(game, deltaTime);
}

function updatePaddles(game: Game, deltaTime: number) {
  const gameSocket = transcendenceSocket;

  CON.config[game.config].socketUpdateInterval
  let paddleMoved = game.paddels.map(paddle => paddle.updatePaddle(deltaTime, game.config, game.ball as Ball));
  if (paddleMoved.some(moved => moved === true) && game.elapasedTimeSincceLastUpdate >= CON.config[game.config].socketUpdateInterval) {
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

function updateBall(game: Game, deltaTime: number) {
  emmitBallPosition(game, deltaTime);
  interpolateBallPosition(game);
}

function emmitBallPosition(game: Game, deltaTime: number) {
  game.ball?.updateBall(game.gameState, deltaTime);
  
  if (game.instanceType === 0 && game.elapasedTimeSincceLastUpdate >= CON.config[game.config].socketUpdateInterval) {
    const gameSocket = transcendenceSocket;
    gameSocket.emit("game/updateGameObjects", {
      roomId: game.roomId,
      ballX: game.ball?.movementComponent.getX(),
      ballY: game.ball?.movementComponent.getY(),
      ballDX: game.ball?.movementComponent.getSpeedX(),
      ballDY: game.ball?.movementComponent.getSpeedY()
    });
    game.elapasedTimeSincceLastUpdate = 0;
    detectCollision(game.ball as Ball, game.paddels, game.walls, game.soundFX, game.config);
  }
}

function interpolateBallPosition(game: Game) {
  if (game.instanceType === 1) {
    let targetBallSettings: {x: number, y: number, dx: number, dy: number};
    if (game.receivedUpdatedGameObjects.ballX! > 0) {
      targetBallSettings = { x: game.receivedUpdatedGameObjects.ballX!, y: game.receivedUpdatedGameObjects.ballY!, dx: game.receivedUpdatedGameObjects.ballDX!, dy: game.receivedUpdatedGameObjects.ballDY!};
        
      const currentX = game.ball?.getX();
      const currentY = game.ball?.getY();
      const currentDX = game.ball?.movementComponent.getSpeedX();
      const currentDY = game.ball?.movementComponent.getSpeedY();

      game.ball?.movementComponent.setX(currentX! + (targetBallSettings.x - currentX!) * CON.config[game.config].interpolationFactor);
      game.ball?.movementComponent.setY(currentY! + (targetBallSettings.y - currentY!) * CON.config[game.config].interpolationFactor);
      game.ball?.movementComponent.setSpeedX(currentDX! + (targetBallSettings.dx - currentDX!) * CON.config[game.config].interpolationFactor);
      game.ball?.movementComponent.setSpeedY(currentDY! + (targetBallSettings.dy - currentDY!) * CON.config[game.config].interpolationFactor);
    }
  }
}

export function checkForGoals(game: Game) {
  const gameSocket = transcendenceSocket;
  if (game.instanceType !== 0) {
    return;
  }

  if (game.ball) {
    let goal = detectScore(game.ball as Ball, game);
    if (goal === false) {
      return;
    }
  }
  
  let winningSide: number = checkWinCondition(game) ?? -1;
  if (winningSide !== -1) {
    log(`GameScript: game finished, longest rally: ${game.ball?.getLongestRally()}`);
    const payload : UpdateGameStateDto  = {id: game.roomId, state: GameState.FINISHED, winnerId: winningSide, score1: game.players[0].getScore(), score2: game.players[1].getScore(), longestRally: game.ball?.getLongestRally()};
    gameSocket.emit("game/updateGameState", payload);
    game.finishGame(winningSide);
    
  } else {
    game.resetGame();
    gameSocket.emit("game/updateGameObjects", {roomId: game.roomId, resetGame: 1});
  }
}

export function updateWalls(game: Game) {
  if (CON.config[game.config].helpAtEnd == false) {
    return;
  }
  
  const triggerScore = CON.config[game.config].winningScore - 1;
  const player_1_score = game.players[0].getScore();
  const player_2_score = game.players[1].getScore();
  
  if (player_1_score === triggerScore + 1 || player_2_score === triggerScore + 1) {
    return;
  }
  
  if (player_1_score === player_2_score ) {
    game.walls.forEach(wall => {
      if (wall.getName().includes("Back")) {
        wall.deactivate();
      }
    });
    if (player_1_score !== triggerScore && player_2_score !== triggerScore) {
      game.messageFields[1]?.setText("");
    }
    return;
  }
    
  if (player_1_score === triggerScore) {
    game.walls.forEach(wall => {
      if (wall.getName().includes("Right")) {
        wall.activate();
        game.messageFields[1]?.setText("Match point");
      }
    });
  }
          
  if (player_2_score === triggerScore) {
    game.walls.forEach(wall => {
      if (wall.getName().includes("Left")) {
        wall.activate();
        game.messageFields[1]?.setText("Match point");
      }
    });
  }
  setWallTheme(game);
}
 