import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { SocketServerProvider } from '../socket/socketserver.gateway';
import { Server, Socket } from 'socket.io';
import { UpdateGameObjectsDto, UpdateGameStateDto } from 'dto/game';
import { GameState, OnlineStatus } from '@prisma/client';
import { WebsocketStatusChangeDto } from '@ft_dto/socket';
import { TokenService } from 'src/users/token.service';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({
  cors: true,
})
export class GamesocketGateway {
  constructor(
    private readonly gameService: GameService,
    private readonly commonServer: SocketServerProvider,
    private readonly tokenService: TokenService,
    private readonly usersService: UsersService
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
  async updateGameState(client: Socket, payload: UpdateGameStateDto) {
    console.log('Game Socket Server: received game state: ', payload.state);
    this.game_io
      .to(payload.id.toString())
      .emit('game/updateGameState', payload);
    this.gameService.update(payload);
    this.changeOnlineStatus(client.id, payload);
  }


  async changeOnlineStatus(clientId: string, game: UpdateGameStateDto)
  {
    let status: OnlineStatus;
    if (game.state == GameState.FINISHED || game.state == GameState.ABORTED || game.state == GameState.REJECTED)
      status = OnlineStatus.ONLINE;
    else
      status = OnlineStatus.IN_GAME;

    const user1 = await this.broadCastOnlineStatus(clientId, status); // broadcast staus for first player
    await this.usersService.update(user1, {online: status});

    const gameFromDb = await this.gameService.findOne(game.id);
	if (!gameFromDb || !gameFromDb.GameUsers || gameFromDb.GameUsers.length < 2)
		return;
    const user2 = gameFromDb.GameUsers[1]?.userId == user1 ? gameFromDb?.GameUsers[0].userId : gameFromDb.GameUsers[1].userId;
    const user2Token = await this.tokenService.findAllTokensAsStringForUser(user2);
    this.broadCastOnlineStatus(user2Token[0], status); // broadcast status for second player

    await this.usersService.update(user2, {online: status});
  }
  
  async broadCastOnlineStatus(clientId: string, status: OnlineStatus) : Promise<number>
 {
    const user = await this.tokenService.findUserByToken(clientId);
    if (!user) 
    {
      console.log('Game Socket Server: user not found');
      return -1;
    }

    // change status for user in db and socket
      console.log("Emitting status change to ", status);
      const socketMessage : WebsocketStatusChangeDto = {
        userId: user.id,
        userName: user.userName,
        token: clientId,
        status: status
      };
      this.game_io.emit('socket/statusChange', socketMessage);
      return user.id;
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
