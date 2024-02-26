import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from '@nestjs/websockets';
import { ChatSocketService } from './chatsocket.service';
import { CreateChatSocketDto } from './dto/create-gamesocket.dto';
import { UpdateChatSocketDto } from './dto/update-gamesocket.dto';
import { Server } from 'socket.io';
import { SocketServerProvider } from '../socket/socketserver.gateway';

@WebSocketGateway()
export class ChatSocketGateway {
	constructor(
		private readonly chatService: ChatSocketService,
		private readonly commonServer: SocketServerProvider	// import global Websocket-server
	) { 
		this.setCorsOrigin(commonServer.corsArray); // CORS is defined in socketserver.gateway.ts
	}

	@WebSocketServer()
	chat_io: Server = this.commonServer.socketIO;

	@SubscribeMessage('chat/message')
	handleMessage(client: any, payload: string) {
		console.log(`Got message: ${payload}`);
		this.chat_io.emit('chat/message', payload);
	}

	@SubscribeMessage('chat/createDM')
	async createDM(@MessageBody() createGameDto: CreateChatSocketDto) {
		const gameId = await this.chatService.createDM(createGameDto);
		this.chat_io.emit('chat/create', `${gameId}`);
		return;
	}

	@SubscribeMessage('chat/findAll')
	findAll() {
		return this.chatService.findAll();
	}

	@SubscribeMessage('chat/findOne')
	findOne(@MessageBody() id: number) {
		return this.chatService.findOne(id);
	}

	@SubscribeMessage('chat/update')
	update(@MessageBody() updateChatDto: UpdateChatSocketDto) {
		return this.chatService.update(updateChatDto.id, updateChatDto);
	}

	@SubscribeMessage('chat/remove')
	remove(@MessageBody() id: number) {
		console.log(`gateway: Remove ${id}`);
		return this.chatService.remove(id);
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
		})(ChatSocketGateway);
	}
}
