import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatSocketService } from './services/chatsocket.service';
import { ChatMessageToRoomDto, FetchChatDto, InviteSocketMessageDto } from '@ft_dto/chat';
import { Server, Socket } from 'socket.io';
import { SocketServerProvider } from '../socket/socketserver.gateway';
import { ChatMessageService } from './services/chat-messages.service';
import { InviteService } from './services/invite.service';
import { TokenService } from '../users/token.service';
import { ChatService } from './services/chat.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/guard/jwt-auth.guard';

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
		console.log("Socket: message to room", payload);
		if (payload.inviteId)
			invite = await this.inviteService.findOne(payload.inviteId);
		const messageToChat: ChatMessageToRoomDto = {
			userId: payload.userId,
			userName: payload.userName,
			message: payload.message,
			room: payload.room,
			action: payload.action || false,
			inviteId: payload.inviteId,
			invite: invite,
			chatType: payload.chatType
		};

		// const messageResult = await this.chatMessageService.messageToDB({ chatId: parseInt(payload.room), userId: payload.userId, content: payload.message, inviteId: payload.inviteId }); //replace with api call in frontend?
		if (payload.chatType === "DM") {
			const usersNotInRoom = await this.chatMessageService.getUsersNotInRoom(parseInt(payload.room), payload.userId);
			const tokenArray = await this.chatSocketService.getUserTokenArray(usersNotInRoom);
			tokenArray.forEach(element => {
				if (element !== null) // if the user is online (ie has a token that is not null) but not in the room, send notification
				{
					this.chat_io.to(element).emit('chat/messageToUserNotInRoom', messageToChat);
				}
			});
		} else {
			const chatUser = await this.chatDbService.getChatUser(parseInt(payload.room), payload.userId);
			console.log ("Checking muted status", chatUser.mutedUntil, new Date());
			if (chatUser.mutedUntil && chatUser.mutedUntil > new Date()) {
				console.log("User is muted");
				messageToChat.message = "You are muted in this chatroom.";
				messageToChat.action = true;
				this.chat_io.to(_client.id).emit('chat/messageFromRoom', messageToChat);
				return;
			}
		}
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
		console.log("Socket: leave room", payload);
		if (parseInt(payload.room) === -1) return;
		// this.chat_io
		await this.chatSocketService.changeChatUserStatus({ token: client.id, userId: payload.userId, chatId: parseInt(payload.room), isInChatRoom: false });
		const userStillInChatRoom = await this.chatSocketService.isUserInChatRoom(parseInt(payload.room), payload.userId);
		if (!userStillInChatRoom) // if all tokens for the user have left the chatroom, emit status change message
		{
			console.log("Socket: leave room, user not in chatroom", payload.userName, " (", payload.userId, ") :", payload.room);
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

	@SubscribeMessage('chat/patch')
	async patchChat(client: Socket, payload: FetchChatDto) {
		console.log("Socket: chat patched", payload);
		const usersInChat = await this.chatDbService.getUsersInChat(payload.id);
		for (const user of usersInChat) {
			const tokens = await this.tokenService.findAllTokensAsStringForUser(user.id);
			for (const token of tokens) {
				console.log("Emitting chat/patch to token", token, user.id);
				this.chat_io.to(token).emit('chat/patch', payload);
			}
		}
	}

	async sendActionMessageToRoom(userId: number, userName: string, chatId: number, message: string) {
		const kickMessage: ChatMessageToRoomDto = {
			userId: userId,
			userName: userName,
			room: chatId.toString(),
			message: message,
			action: true
		};
		this.chat_io.to(chatId.toString()).emit('chat/messageFromRoom', kickMessage);
		this.chat_io.to(chatId.toString()).emit('chat/refreshList', kickMessage);
		return true;
	}

	sendRefreshMessageToRoom(chatId: number) {
		this.chat_io.to(chatId.toString()).emit('chat/refreshList', chatId);
		return true;
	}

	async joinRoomInSocket(userId: number, chatId: number, socketClientId: string) {
		const client : Socket = this.chat_io.sockets.sockets.get(socketClientId);
		if (!client) return false;
		await client.join(chatId.toString());
	}

	sendJoinMessageToRoom(userId: number, userName: string, chatId: number) {
		const joinMessage: ChatMessageToRoomDto = {
			userId: userId,
			userName: userName,
			room: chatId.toString(),
			message: "JOIN",
			action: true
		};
		this.chat_io.to(chatId.toString()).emit('chat/messageFromRoom', joinMessage);
	}

}