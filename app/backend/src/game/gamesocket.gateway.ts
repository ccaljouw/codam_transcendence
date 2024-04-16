import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { SocketServerProvider } from '../socket/socketserver.gateway';
import { Server, Socket } from 'socket.io';
import { UpdateGameObjectsDto, UpdateGameStateDto } from 'dto/game';

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
  joinRoom(client: Socket, roomId: number) {
    console.log(`Game Socket Server: someone is joining the room: ${roomId}`);
    client.join(roomId.toString());
    const player = this.game_io.sockets.sockets.get(client.id);
    this.game_io
      .to(roomId.toString())
      .emit('game/message', `Player ${player?.id} joined the room`);
  }

  // @SubscribeMessage('game/message')
  // handleMessage(client: Socket, payload: string) {
  //   console.log(`Game Socket Server Got message: ${payload}`);
  //   this.game_io.emit('game/message', payload);
  // }

  @SubscribeMessage('game/updateGameState')
  updateGameState(client: Socket, payload: UpdateGameStateDto) {
    console.log(
      'Game Socket Server: received game state update from client: ',
      payload.state,
    );
    this.game_io
      .to(payload.roomId.toString())
      .emit('game/updateGameState', payload);

    this.gamesocketService.update(payload);
  }

  @SubscribeMessage('game/updateGameObjects')
  updateGameObjects(client: Socket, payload: UpdateGameObjectsDto) {
    this.game_io
      .to(payload.roomId.toString())
      .emit('game/updateGameObjects', payload);
  }

  // @SubscribeMessage('game/discconect')
  // handleDisconnect(client: Socket) {
  //   console.log(`Game Socket Server: Client disconnected: ${client.id}`);

  @SubscribeMessage('game/remove')
  remove(@MessageBody() id: number) {
    return this.gamesocketService.remove(id);
  }
}
