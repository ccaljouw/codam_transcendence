
import { Game } from '../components/Game.tsx';
import { UpdateGameDto } from '../../backend/src/game/dto/update-game.dto.ts';
import { sendToRoomDto } from '../../backend/src/game/dto/send-to-room.dto.ts';
import { GameState } from '@prisma/client';
import { transcendenceSocket } from '../../frontend/src/globals/socket.globalvar.tsx';
import { updateGameStateDto } from '../../backend/src/game/dto/update-game-state.dto.ts';
import { UpdateGameObjectsDto } from '../../backend/src/game/dto/update-game-objects.dto.ts';
import { settleScore } from './utils.tsx';

export function setSocketListeners(gameData: UpdateGameDto, socket: typeof transcendenceSocket, game: Game) {
  const roomId: number = gameData.id;
  const gameSocket = socket;
  
  gameSocket.emit("game/joinRoom", roomId);
  console.log("Game script: joined room");

  gameSocket.on(`game/updateGameObjects`, (payload: UpdateGameObjectsDto) => {
    console.log(`Game script: received game objects update from server`, payload);
    game.receivedUpdatedGameObjects.roomId = payload.roomId;
    game.receivedUpdatedGameObjects.ballX = payload.ballX;
    game.receivedUpdatedGameObjects.ballY = payload.ballY;
    game.receivedUpdatedGameObjects.ballDirection = payload.ballDirection;
    game.receivedUpdatedGameObjects.ballSpeed = payload.ballSpeed;
    game.receivedUpdatedGameObjects.ballDX = payload.ballDX;
    game.receivedUpdatedGameObjects.ballDY = payload.ballDY;
    game.receivedUpdatedGameObjects.paddle1Y = payload.paddle1Y;
    game.receivedUpdatedGameObjects.paddle2Y = payload.paddle2Y;
    game.receivedUpdatedGameObjects.score1 = payload.score1;
    game.receivedUpdatedGameObjects.score2 = payload.score2;


    setNewPaddlePositions(game, payload.paddle1Y, payload.paddle2Y);
    setNewScore(game, payload.score1, payload.score2);
    setNewBallVariables(game, payload.ballX, payload.ballY, payload.ballDirection, payload.ballSpeed, payload.ballDX, payload.ballDY);

  });

  gameSocket.on(`game/updateGameState`, (payload: updateGameStateDto) => {
    console.log(`Game script: received game state update from server`, payload.roomId, payload.state, payload?.winner);
    game.gameState = payload.state;
    // if (payload.state === GameState.FINISHED) {
    //   game.winner = payload.winner); 
  });
}

function setNewScore(game: Game, score1: number, score2: number) {
  if (game.gameState === GameState.FINISHED) {
    return;
  }
  if (score1 >= 0)   {
    game.players[0].setScore(score1);
    game.players[0].scoreField?.setText(score1.toString());
  }
  if (score2 >= 0) {
    game.players[1].setScore(score2);
    game.players[1].scoreField?.setText(score2.toString());
  }
}

function setNewPaddlePositions(game: Game, paddle1Y: number, paddle2Y: number) {
  if (game.instanceType === 0 && paddle2Y > 0) {
    game.paddels[1].movementComponent.setY(paddle2Y);
    game.paddels[1].setY(paddle2Y);
   }
   if (game.instanceType === 1 && paddle1Y > 0) {
    game.paddels[0].movementComponent.setY(paddle1Y);
    game.paddels[0].setY(paddle1Y);
   }
}

function setNewBallVariables(game: Game, ballX: number, ballY: number, ballDirection: number, ballSpeed: number, ballDX: number, ballDY: number) {
  if (game.instanceType === 1) {
    if (ballX > 0) {
      game.ball?.movementComponent.setX(ballX);
    }
    if (ballY > 0) {
      game.ball?.movementComponent.setY(ballY);
    }
    if (ballDirection > 0) {
      game.ball?.movementComponent.setDirection(ballDirection);
    }
    if (ballSpeed > 0) {
      game.ball?.movementComponent.setSpeed(ballSpeed);
    }
    if (ballDX  > 0) {
      game.ball?.movementComponent.setSpeedX(ballDX);
    }
    if (ballDY  > 0) {
      game.ball?.movementComponent.setSpeedY(ballDY);
    }
  }
}
