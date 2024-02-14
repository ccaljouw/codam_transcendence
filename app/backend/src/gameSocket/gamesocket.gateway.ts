import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from '@nestjs/websockets';
import { GameSocketService } from './gamesocket.service';
import { CreateGameSocketDto } from './dto/create-gamesocket.dto';
import { UpdateGameSocketDto } from './dto/update-gamesocket.dto';
import { Server } from 'socket.io';

@WebSocketGateway({
	cors: {
		// origin: ['http://localhost:3000', 'http://localhost:3001'],
		origin: ['http://localhost:3000']
	},
}
)
export class GameSocketGateway {
	constructor(private readonly gameService: GameSocketService) {}
	
	@WebSocketServer()
	socketServer: Server;
  handleConnection(client: any, ...args: any[]){
	console.log(`Client connected: ${client.id}`);
	//
}

handleDisconnect(client: any){
	console.log(`Client disconnected ${client.id}`)
}

@SubscribeMessage('message')
  handleMessage(client: any, payload: string) {
	console.log(`Got message: ${payload}`);
	this.socketServer.emit('message', payload);
    // return 'Hello world!';
  }

  @SubscribeMessage('createGame')
  async create(@MessageBody() createGameDto: CreateGameSocketDto) {
	const gameId = await this.gameService.create(createGameDto);
	this.socketServer.emit('newGame', `${gameId}`);
    return ;
  }

  @SubscribeMessage('findAllGame')
  findAll() {
    return this.gameService.findAll();
  }

  @SubscribeMessage('findOneGame')
  findOne(@MessageBody() id: number) {
    return this.gameService.findOne(id);
  }

  @SubscribeMessage('updateGame')
  update(@MessageBody() updateGameDto: UpdateGameSocketDto) {
    return this.gameService.update(updateGameDto.id, updateGameDto);
  }

  @SubscribeMessage('removeGame')
  remove(@MessageBody() id: number) {
	console.log (`Remove ${id}`);
    return this.gameService.remove(id);
  }
}
