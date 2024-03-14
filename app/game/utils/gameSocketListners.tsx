
import { Game } from '../components/Game.tsx';
import { UpdateGameDto } from '../../backend/src/game/dto/update-game.dto.ts';
import { GameState } from '@prisma/client';
import { transcendenceSocket } from '../../frontend/src/globals/socket.globalvar.tsx';
import { updateGameStateDto } from '../../backend/src/game/dto/update-game-state.dto.ts';
import { UpdateGameObjectsDto } from '../../backend/src/game/dto/update-game-objects.dto.ts';

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
    game.receivedUpdatedGameObjects.resetGame = payload.resetGame;
    // game.receivedUpdatedGameObjects.resetMatch = payload.resetMatch;
    game.receivedUpdatedGameObjects.finish = payload.finish;

    
    if (game.gameState === GameState.FINISHED) {
        return;
    }
    
    if (payload.resetGame === 1) { 
      game.resetGame();
    }

    // if (payload.resetMatch === 1) {
    //   game.resetMatch();
    // }

    if (payload.finish === 1 && payload.winner !== -1) {
      game.endGame(game.players[payload.winner]);
    }

    if (payload.paddle1Y > 0 || payload.paddle2Y > 0) {
      setNewPaddlePositions(game, payload.paddle1Y, payload.paddle2Y);
    }
    
    if (payload.score1 >= 0 || payload.score2 >= 0) {
      setNewScore(game, payload.score1, payload.score2);
    }

  });

  gameSocket.on(`game/updateGameState`, (payload: updateGameStateDto) => {
    console.log(`Game script: received game state update from server`, payload.roomId, payload.state, payload?.winner);
    game.gameState = payload.state;
  });
}

function setNewScore(game: Game, score1: number, score2: number) {
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
