import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from '@nestjs/websockets';
import { ChatSocketService } from './chatsocket.service';
import { CreateChatSocketDto } from './dto/create-chatSocket.dto';
import { UpdateChatSocketDto } from './dto/update-chatSocket.dto';
import { ChatMessageToRoomDto } from './dto/chat-messageToRoom.dto';
import { Server, Socket } from 'socket.io';
import { SocketServerProvider } from '../socket/socketserver.gateway';
import { stat } from 'fs';

@WebSocketGateway({
	cors: true
})
export class ChatSocketGateway {
	constructor(
		private readonly chatService: ChatSocketService,
		private readonly commonServer: SocketServerProvider	// import global Websocket-server
	) { 
		// this.setCorsOrigin(commonServer.corsArray); // CORS is defined in socketserver.gateway.ts
	}

	@WebSocketServer()
	chat_io: Server = this.commonServer.socketIO;
	
	// This is the function that is called when a message is sent.
	@SubscribeMessage('chat/message')
	handleMessage(client: Socket, payload: string) {
		console.log(`Got message: ${payload}`);
		this.chat_io.emit('chat/message', payload);
		return ;
	}

	// This is the function that is called when a message is sent to a room.
	@SubscribeMessage('chat/msgToRoom')
	async handleMessageToRoom(client: Socket, payload: ChatMessageToRoomDto) {
		console.log(`Got message from ${payload.userid} to room: ${payload.room} -> ${payload.message},`);
		const messageToChat : ChatMessageToRoomDto= {
			userid: payload.userid,
			username: payload.username,
			message: payload.message,
			room: payload.room,
			action: false
		};
		
		this.chat_io.to(payload.room).emit('chat/messageFromRoom', messageToChat);
		await this.chatService.messageToDB({chatId: parseInt(payload.room), userId: payload.userid, content: payload.message}); //replace with api call in frontend?
		console.log(`Sending username ${payload.username} and message ${payload.message} to room`);
		return ;
	}


	// This is the function that is called when a chat is created.
	@SubscribeMessage('chat/createDM')
	async createDM(@MessageBody() createGameDto: CreateChatSocketDto) {
		const chatId = await this.chatService.createDM(createGameDto); //replace with api call in frontend?
		this.chat_io.emit('chat/chatId', `${chatId}`);
		return;
	}

	// This is the function that is called when a user joins a room.
	@SubscribeMessage('chat/joinRoom')
	joinRoom(client: Socket, payload: ChatMessageToRoomDto) {
		client.join(payload.room);
		const statusChangeMessage : ChatMessageToRoomDto = {
			userid: payload.userid,
			username: payload.username,
			room: payload.room,
			message: ` << ${payload.username} has joined the room >> `,
			action: true
		};
		this.chat_io.to(payload.room).emit('chat/messageFromRoom', statusChangeMessage);
		console.log(`Joined room ${payload}`);
	}

	// This is the function that is called when a user leaves a room.
	@SubscribeMessage('chat/leaveRoom')
	leaveRoom(client: Socket, payload: ChatMessageToRoomDto) {
		// this.chat_io
		console.log(` << ${payload.username} has left room ${payload.room}>> `)
		console.log(payload.message);
		const statusChangeMessage : ChatMessageToRoomDto = {
			userid: payload.userid,
			username: payload.username,
			room: payload.room,
			message: ` << ${payload.username} has left the room >> `,
			action: true
		};
		console.log(`EMITTING: ${statusChangeMessage.message} to room ${payload.room}`);
		this.chat_io.to(payload.room).emit('chat/messageFromRoom', statusChangeMessage);
		client.leave(payload.room);
	}
}