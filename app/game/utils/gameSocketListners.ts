import { Game } from '../components/Game'
import { GameState } from '@prisma/client'
import { transcendenceSocket } from '@ft_global/socket.globalvar'
import { UpdateGameObjectsDto, UpdateGameStateDto, UpdateGameDto } from '@ft_dto/game'
import { updateWalls } from './updateObjects';
import { log } from './utils';


export function setSocketListeners(game: Game) {
  const gameSocket = transcendenceSocket;
  const roomId: number = game.gameData!.id;
  let gamerunning = false;

  gameSocket.emit("game/joinRoom", roomId);
  log("GameScript: joined room");
    
  gameSocket.on(`game/updateGameObjects`, (payload: UpdateGameObjectsDto) => {
    if (game.gameState === GameState.FINISHED) {
      return;
    }
    
    // turn off or remove this log
    //log(`GameScript ${game.gameData!.id} received game objects update ${payload}`);

    if (payload.roomId !== undefined) {
      game.receivedUpdatedGameObjects = {
        ...game.receivedUpdatedGameObjects,
        ...payload        
      };
    } else { 
      console.error(`GameScript: received game objects update from server, but no roomId in payload`, payload);
    }

    if (payload.resetGame === 1 && game.instanceType < 2) {
      game.resetGame();
    }

    if (payload.paddle1Y! > 0 || payload.paddle2Y! > 0) {
      setNewPaddlePositions(game, payload.paddle1Y!, payload.paddle2Y!);
    }
    
    if (payload.score1! >= 0 || payload.score2! >= 0) {
      setNewScore(game, payload.score1!, payload.score2!);
      updateWalls(game);
    }
  });

  gameSocket.on(`game/updateGameState`, (payload: UpdateGameStateDto) => {
    if (game.gameState === GameState.FINISHED) {
      return;
    }
    log(`GameScript: received game state update in handle gameState, gameid: ${payload.id}, state: ${payload.state}`);
    
    if (payload.state === GameState.FINISHED) {
      game.finishGame(payload.winnerId!);
      return;
    } 

    if (payload.state === GameState.ABORTED) {
      game.abortGame(1);
      return;
    }
    
    game.gameState = payload.state;
    
    if (game.gameState === GameState.STARTED && !gamerunning) {
      gamerunning = true;
      game.startGame();
    }
  });
}

function setNewScore(game: Game, score1: number, score2: number) {
  if (score1 >= 0)   {
    game.players[0].setScore(score1);
  }
  if (score2 >= 0) {
    game.players[1].setScore(score2);
  }
}

export function setNewPaddlePositions(game: Game, paddle1Y: number, paddle2Y: number) {
  if (game.instanceType === 0 && paddle2Y > 0) {
    game.paddels[1].setY(paddle2Y);
   }
   if (game.instanceType === 1 && paddle1Y > 0) {
    game.paddels[0].setY(paddle1Y);
   }
}


export function disconnectSocket(game: Game) {
  const gameSocket = transcendenceSocket;
  gameSocket.off(`game/updateGameObjects`);
  gameSocket.off(`game/updateGameState`);
  gameSocket.emit("game/leaveRoom", game.gameData!.id);
  log("GameScript: leaving room");
}
