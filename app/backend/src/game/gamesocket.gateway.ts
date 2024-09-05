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
    private readonly gameService: GameService,
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
    console.log('Game Socket Server: received game state: ', payload.state);
    this.game_io
      //TODO: Carlo, wat doet deze .to?
      //(ik heb bij de handleDisconnect de .to weggehaald. Volgens mij ging daar niks van stuk,
      // maar misschien moet die weer terug?)
      .to(payload.id.toString())
      .emit('game/updateGameState', payload);
    // TODO: Carlo, dit wordt nu meerdere keren getriggert (omdat de berichten vaker dan 1x over de socket gaan??)
    this.gameService.update(payload);
  }

  @SubscribeMessage('game/updateGameObjects')
  updateGameObjects(client: Socket, payload: UpdateGameObjectsDto) {
    this.game_io
      .to(payload.roomId.toString())
      .emit('game/updateGameObjects', payload);
  }

  @SubscribeMessage('disconnect')
  async handleDisconnect(client: Socket) {
    // gameservice.disconnect sets status to ABORTED for all open (everything except for FINISHED) games that the client is in
    // and returns the ids of the games that were disconnected
    const disconnectedGames: number[] = await this.gameService.disconnect(
      client.id,
    );
    if (!disconnectedGames || disconnectedGames.length === 0) {
      console.log('Game Socket Server: client not in any game');
      for (const disconnectedGame of disconnectedGames) {
        this.game_io.emit('game/updateGameState', {
          id: disconnectedGame,
          state: GameState.ABORTED,
        });
      }
    }
  }
}
