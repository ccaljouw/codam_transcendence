import WebSocket, { WebSocketServer } from 'ws';
import { GameState } from '@prisma/client';
import { Game } from '../components/Game';
import { UpdateGameObjectsDto } from '@ft_dto/game';

export function setObserverSocket(game: Game) {
  const server = new WebSocketServer({ port: 3000 });
  const id = game.gameData!.id;

  console.log(`Observer socket server for game ${id} started on port 3000`);

  server.on('connection', (socket: WebSocket) => {
    console.log(`Observer (${id}) connected to game backend socket`);

    socket.on('message', (data: WebSocket.Data) => {
      try {
        const payload: UpdateGameObjectsDto = JSON.parse(data.toString());
        if (payload && payload.roomId) {
          updateGameObjects(game, payload);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });
  });

  function updateGameObjects(game: Game, payload: UpdateGameObjectsDto) {
    if (game.gameState === GameState.FINISHED) {
      return;
    }
    console.log(`Observer (${id}) received game objects update`, payload);
    if (payload.roomId !== undefined) {
      game.receivedUpdatedGameObjects = {
        ...game.receivedUpdatedGameObjects,
        ...payload
      };
    } else {
      console.error(`Observer: received game objects update from server, but no roomId in payload`, payload);
    }
  }
}

