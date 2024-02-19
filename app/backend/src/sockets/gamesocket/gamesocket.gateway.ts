import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { GamesocketService } from './gamesocket.service';
import { CreateGamesocketDto } from './dto/create-gamesocket.dto';
import { UpdateGamesocketDto } from './dto/update-gamesocket.dto';
import { SocketServerProvider } from '../socketserver.gateway';
import { Server } from 'socket.io';

@WebSocketGateway()
export class GamesocketGateway {
  constructor(
	private readonly gamesocketService: GamesocketService,
	private readonly commonServer: SocketServerProvider
	) {
		this.setCorsOrigin(commonServer.corsArray); // CORS is defined in socketserver.gateway.ts
	}

	@WebSocketServer()
	game_io: Server = this.commonServer.socketIO;

	@SubscribeMessage('game/message')
	handleMessage(client: any, payload: string) {
		console.log(`Got message: ${payload}`);
		this.game_io.emit('game/message', payload);
	}

  @SubscribeMessage('game/create')
  create(@MessageBody() createGamesocketDto: CreateGamesocketDto) {
    return this.gamesocketService.create(createGamesocketDto);
  }

  @SubscribeMessage('game/findAll')
  findAll() {
    return this.gamesocketService.findAll();
  }

  @SubscribeMessage('game/findOne')
  findOne(@MessageBody() id: number) {
    return this.gamesocketService.findOne(id);
  }

  @SubscribeMessage('game/update')
  update(@MessageBody() updateGamesocketDto: UpdateGamesocketDto) {
    return this.gamesocketService.update(updateGamesocketDto.id, updateGamesocketDto);
  }

  @SubscribeMessage('game/remove')
  remove(@MessageBody() id: number) {
    return this.gamesocketService.remove(id);
  }
  /**
   * 
   * @param corsArray array with CORS routes
   */
  setCorsOrigin(corsArray: string[]) {
	WebSocketGateway({
	  cors: {
		origin: corsArray,
	  },
	})(GamesocketGateway);
	}
}
