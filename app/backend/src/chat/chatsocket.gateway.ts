import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from '@nestjs/websockets';
import { ChatSocketService } from './chatsocket.service';
import { ChatMessageToRoomDto } from '@ft_dto/chat';
import { Server, Socket } from 'socket.io';
import { SocketServerProvider } from '../socket/socketserver.gateway';
import { ChatMessageService } from './chat-messages.service';

@WebSocketGateway({
	cors: true
})
export class ChatSocketGateway {
	constructor(
		private readonly chatSocketService: ChatSocketService,
		private readonly chatMessageService: ChatMessageService,
		private readonly commonServer: SocketServerProvider	// import global Websocket-server
	) { 
	}

	@WebSocketServer()
	chat_io: Server = this.commonServer.socketIO;
	
	// This is the function that is called when a message is sent.
	@SubscribeMessage('chat/message')
	handleMessage(_client: Socket, payload: string) {
		console.log(`Got message: ${payload}`);
		this.chat_io.emit('chat/message', payload);
		return ;
	}

	// This is the function that is called when a message is sent to a room.
	@SubscribeMessage('chat/msgToRoom')
	async handleMessageToRoom(_client: Socket, payload: ChatMessageToRoomDto) {
		console.log(`Got message from ${payload.userId} to room: ${payload.room} -> ${payload.message},`);
		const messageToChat : ChatMessageToRoomDto= {
			userId: payload.userId,
			userName: payload.userName,
			message: payload.message,
			room: payload.room,
			action: false
		};
		
		this.chat_io.to(payload.room).emit('chat/messageFromRoom', messageToChat);
		const messageResult = await this.chatMessageService.messageToDB({chatId: parseInt(payload.room), userId: payload.userId, content: payload.message}); //replace with api call in frontend?
		const tokenArray = await this.chatSocketService.getUserTokenArray(messageResult.usersNotInRoom);
		tokenArray.forEach(element => {
			if (element !== null) // if the user is online (ie has a token that is not null) but not in the room, send notification
			{
				console.log("Emitting to usernotinroom for " + payload.room + element)
				this.chat_io.to(element).emit('chat/messageToUserNotInRoom', messageToChat);
			}
		});
		console.log(`Sending username ${payload.userName} and message ${payload.message} to room`);
		return ;
	}

	// This is the function that is called when a user joins a room.
	@SubscribeMessage('chat/joinRoom')
	async joinRoom(client: Socket, payload: ChatMessageToRoomDto) {
		client.join(payload.room);
		const statusChangeMessage : ChatMessageToRoomDto = {
			userId: payload.userId,
			userName: payload.userName,
			room: payload.room,
			message: ` << ${payload.userName} has joined the room >> `,
			action: true
		};
		this.chat_io.to(payload.room).emit('chat/messageFromRoom', statusChangeMessage);
		console.log(`Joined room ${payload.room} with user ${payload.userName}`);
		await this.chatSocketService.changeChatUserStatus({userId: payload.userId, chatId: parseInt(payload.room), isInChatRoom: true});
		await this.chatMessageService.resetUnreadMessages({userId: payload.userId, chatId: parseInt(payload.room)});
	}

	// This is the function that is called when a user leaves a room.
	@SubscribeMessage('chat/leaveRoom')
	async leaveRoom(client: Socket, payload: ChatMessageToRoomDto) {
		// this.chat_io
		console.log(` << ${payload.userName} has left room ${payload.room}>> `)
		console.log(payload.message);
		const statusChangeMessage : ChatMessageToRoomDto = {
			userId: payload.userId,
			userName: payload.userName,
			room: payload.room,
			message: ` << ${payload.userName} has left the room >> `,
			action: true
		};
		console.log(`EMITTING: ${statusChangeMessage.message} to room ${payload.room}`);
		this.chat_io.to(payload.room).emit('chat/messageFromRoom', statusChangeMessage);
		client.leave(payload.room);
		await this.chatSocketService.changeChatUserStatus({userId: payload.userId, chatId: parseInt(payload.room), isInChatRoom: false});
	}
}