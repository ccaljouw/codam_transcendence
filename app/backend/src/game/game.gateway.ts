import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from '@nestjs/websockets';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Server } from 'socket.io';

@WebSocketGateway({
	cors: {
		// origin: ['http://localhost:3000', 'http://localhost:3001'],
		origin: 'http://localhost:3000'
	},
}
)
export class GameGateway {
	constructor(private readonly gameService: GameService) {}
	
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
	console.log(`Got message: ${payload}`)
	this.socketServer.emit('message', payload);
    // return 'Hello world!';
  }

  @SubscribeMessage('createGame')
  create(@MessageBody() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
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
  update(@MessageBody() updateGameDto: UpdateGameDto) {
    return this.gameService.update(updateGameDto.id, updateGameDto);
  }

  @SubscribeMessage('removeGame')
  remove(@MessageBody() id: number) {
    return this.gameService.remove(id);
  }
}
