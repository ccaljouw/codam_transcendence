import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { SocketServerProvider } from '../socket/socketserver.gateway';
import { Server, Socket } from 'socket.io';
import { UpdateGameObjectsDto, updateGameStateDto } from 'dto/game';

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
    console.log(`Server: someone is joining the room: ${roomId}`);
    client.join(roomId.toString());
    const player = this.game_io.sockets.sockets.get(client.id);
    this.game_io
      .to(roomId.toString())
      .emit('game/message', `Player ${player?.id} joined the room`);
  }

  @SubscribeMessage('game/message')
  handleMessage(client: Socket, payload: string) {
    console.log(`Got message: ${payload}`);
    this.game_io.emit('game/message', payload);
  }

  @SubscribeMessage('game/updateGameState')
  updateGameState(client: Socket, payload: updateGameStateDto) {
    console.log(
      'Server: received game state update from client: ',
      payload.state,
    );
    const updatedGameState = { roomId: payload.roomId, state: payload.state };
    this.game_io
      .to(payload.roomId.toString())
      .emit('game/updateGameState', updatedGameState);
    // console.log(`Updating game state: ${payload.roomId} to ${payload.state}`);
    // if (payload.state === `READY_TO_START`) {
    //   this.game_io.to(payload.roomId.toString()).emit('game/message', "test from emit");
    //   console.log(`Game: game ready to start braidcast sent`);
    // }
  }

  //update game objects
  @SubscribeMessage('game/updateGameObjects')
  updateGameObjects(client: Socket, payload: UpdateGameObjectsDto) {
    //console.log('Server: received game object update from client: ', payload);
    this.game_io
      .to(payload.roomId.toString())
      .emit('game/updateGameObjects', payload);
  }

  // @SubscribeMessage('game/discconect')
  // handleDisconnect(client: Socket) {
  //   console.log(`Client disconnected: ${client.id}`);

  @SubscribeMessage('game/remove')
  remove(@MessageBody() id: number) {
    return this.gamesocketService.remove(id);
  }
}
