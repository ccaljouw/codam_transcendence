import { Game } from '../components/Game';
import { GameState } from '@prisma/client';
import { transcendenceSocket } from '@ft_global/socket.globalvar';
import { UpdateGameObjectsDto, updateGameStateDto, UpdateGameDto } from '@ft_dto/game';


export function setSocketListeners(gameData: UpdateGameDto, socket: typeof transcendenceSocket, game: Game) {
  const roomId: number = gameData.id;
  const gameSocket = socket;
  
  gameSocket.emit("game/joinRoom", roomId);
  console.log("Script: joined room");
    
  gameSocket.on(`game/updateGameObjects`, (payload: UpdateGameObjectsDto) => {
    if (game.gameState === GameState.FINISHED) {
      return;
    }
    
    console.log(`Script (${gameData.id}) received game objects update`, payload);

    if (payload.roomId !== undefined) {
      game.receivedUpdatedGameObjects = {
        ...game.receivedUpdatedGameObjects,
        ...payload        
      };
    } else { 
      console.error(`Script: received game objects update from server, but no roomId in payload`, payload);
    }

    if (payload.resetGame === 1 && game.instanceType < 2) {
      game.resetGame();
    }

    if (payload.winner != undefined && game.instanceType < 2) {
      game.endGame(payload.winner!);
    }
    
    // if (payload.resetMatch === 1) {
    //   game.resetMatch();
    // }


    if (payload.paddle1Y! > 0 || payload.paddle2Y! > 0) {
      setNewPaddlePositions(game, payload.paddle1Y!, payload.paddle2Y!);
    }
    
    if (payload.score1! >= 0 || payload.score2! >= 0) {
      setNewScore(game, payload.score1!, payload.score2!);
    }
  });

  gameSocket.on(`game/updateGameState`, (payload: updateGameStateDto) => {
    if (game.gameState === GameState.FINISHED) {
      return;
    }
    console.log(`Script: received game state update from server`, payload.roomId, payload.state, payload?.winner, payload?.score1, payload?.score2);
    game.gameState = payload.state;
   
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

function setNewPaddlePositions(game: Game, paddle1Y: number, paddle2Y: number) {
  if (game.instanceType === 0 && paddle2Y > 0) {
    game.paddels[1].setY(paddle2Y);
   }
   if (game.instanceType === 1 && paddle1Y > 0) {
    game.paddels[0].setY(paddle1Y);
   }
}
