import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { SocketServerProvider } from '../socket/socketserver.gateway';
import { Server, Socket } from 'socket.io';
import { UpdateGameObjectsDto, UpdateGameStateDto } from 'dto/game';
import { GameState } from '@prisma/client';

@WebSocketGateway({
  cors: true,
})
export class GamesocketGateway {
  constructor(
    private readonly gamesocketService: GameService,
    private readonly commonServer: SocketServerProvider,
  ) {}

  @WebSocketServer()
  game_io: Server = this.commonServer.socketIO;

  @SubscribeMessage('game/joinRoom')
  joinRoom(client: Socket, id: number) {
    try {
      console.log(`Game Socket Server: someone is joining the room: ${id}`);
      client.join(id.toString());
      const player = this.game_io.sockets.sockets.get(client.id);
      this.game_io
        .to(id.toString())
        .emit('game/message', `Player ${player?.id} joined the room`);
    } catch (error) {
      console.log(`Game Socket Server: error joining room: ${id}`);
    }
  }

  @SubscribeMessage('game/updateGameState')
  updateGameState(client: Socket, payload: UpdateGameStateDto) {
    console.log(
      'Game Socket Server: received game state update from client: ',
      payload.state,
    );
    this.game_io
      .to(payload.id.toString())
      .emit('game/updateGameState', payload);

    this.gamesocketService.update(payload);
  }

  @SubscribeMessage('game/updateGameObjects')
  updateGameObjects(client: Socket, payload: UpdateGameObjectsDto) {
    this.game_io
      .to(payload.roomId.toString())
      .emit('game/updateGameObjects', payload);
  }

  // todo add code based on tracked game id's. here or in game service
  @SubscribeMessage('disconnect')
  async handleDisconnect(client: Socket) {
    const gameId = await this.gamesocketService.findGameForClientId(client.id);
    console.log('Game Socket Server: gameId: ', gameId, ' disconnected');

    if (gameId) {
      const payload: UpdateGameStateDto = {
        id: gameId,
        state: GameState.ABORTED,
      };
      this.gamesocketService.update(payload);

      this.game_io
        .to(payload.id.toString())
        .emit('game/updateGameState', payload);
      
        this.gamesocketService.disconnect(client);
      } else {
        console.log('Game Socket Server: client not in any game');
    }
  }
}
