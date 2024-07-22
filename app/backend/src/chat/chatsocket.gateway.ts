import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatSocketService } from './services/chatsocket.service';
import { ChatMessageToRoomDto, InviteSocketMessageDto } from '@ft_dto/chat';
import { Server, Socket } from 'socket.io';
import { SocketServerProvider } from '../socket/socketserver.gateway';
import { ChatMessageService } from './services/chat-messages.service';
import { InviteService } from './services/invite.service';
import { TokenService } from 'src/users/token.service';
import { ChatService } from './services/chat.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authentication/guard/jwt-auth.guard';

@WebSocketGateway({
	cors: true
})
export class ChatSocketGateway {
	constructor(
		private readonly chatSocketService: ChatSocketService,
		private readonly chatMessageService: ChatMessageService,
		private readonly commonServer: SocketServerProvider,	// import global Websocket-server
		private readonly tokenService: TokenService,
		private readonly inviteService: InviteService,
		private readonly chatDbService: ChatService
	) {
	}

	@WebSocketServer()
	chat_io: Server = this.commonServer.socketIO;

	// This is the function that is called when a message is sent.
	@SubscribeMessage('chat/message')
	handleMessage(_client: Socket, payload: string) {
		return;
	}

	// This is the function that is called when a message is sent to a room.
	@SubscribeMessage('chat/msgToRoom')
	async handleMessageToRoom(_client: Socket, payload: ChatMessageToRoomDto) {
		let invite = null;
		if (payload.inviteId)
			invite = await this.inviteService.findOne(payload.inviteId);
		const messageToChat: ChatMessageToRoomDto = {
			userId: payload.userId,
			userName: payload.userName,
			message: payload.message,
			room: payload.room,
			action: false,
			inviteId: payload.inviteId,
			invite: invite
		};

		const messageResult = await this.chatMessageService.messageToDB({ chatId: parseInt(payload.room), userId: payload.userId, content: payload.message, inviteId: payload.inviteId }); //replace with api call in frontend?
		const tokenArray = await this.chatSocketService.getUserTokenArray(messageResult.usersNotInRoom);
		tokenArray.forEach(element => {
			if (element !== null) // if the user is online (ie has a token that is not null) but not in the room, send notification
			{
				this.chat_io.to(element).emit('chat/messageToUserNotInRoom', messageToChat);
			}
		});
		this.chat_io.to(payload.room).emit('chat/messageFromRoom', messageToChat);
		return;
	}

	// This is the function that is called when a user joins a room.
	@SubscribeMessage('chat/joinRoom')
	async joinRoom(client: Socket, payload: ChatMessageToRoomDto) {
		await client.join(payload.room);
		const user = await this.chatSocketService.getChatUserById(parseInt(payload.room), payload.userId);
		if (!user?.isInChatRoom) { // if user is not already in chatroom, emit status change message
			const statusChangeMessage: ChatMessageToRoomDto = {
				userId: payload.userId,
				userName: payload.userName,
				room: payload.room,
				message: "JOIN",
				action: true
			};
			this.chat_io.to(payload.room).emit('chat/messageFromRoom', statusChangeMessage);
		}
	}

	// This is the function that is called when a user leaves a room.
	@SubscribeMessage('chat/leaveRoom')
	async leaveRoom(client: Socket, payload: ChatMessageToRoomDto) {
		// this.chat_io
		await this.chatSocketService.changeChatUserStatus({ token: client.id, userId: payload.userId, chatId: parseInt(payload.room), isInChatRoom: false });
		const userStillInChatRoom = await this.chatSocketService.isUserInChatRoom(parseInt(payload.room), payload.userId);
		if (!userStillInChatRoom) // if all tokens for the user have left the chatroom, emit status change message
		{
			const statusChangeMessage: ChatMessageToRoomDto = {
				userId: payload.userId,
				userName: payload.userName,
				room: payload.room,
				message: "LEAVE",
				action: true
			};
			this.chat_io.to(payload.room).emit('chat/messageFromRoom', statusChangeMessage);
		}
		client.leave(payload.room);
	}

	@SubscribeMessage('invite/inviteResponse')
	async friendInviteResponse(client: Socket, payload: InviteSocketMessageDto) {
		if (payload.directMessageId == -1)	// If the direct message id is not set, find it.
			payload.directMessageId = (await this.chatDbService.findDMChat(payload.userId, payload.senderId)).id;
		const tokens = await this.tokenService.findAllTokensAsStringForUser(payload.senderId);
		for (const token of tokens) {
			this.chat_io.to(token).emit('invite/inviteResponse', payload);
		}
	}
}