import { Injectable, Module } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebsocketStatusChangeDto } from './dto/statuschange';
import { SocketServerService } from './socketserver.service';
import { UsersService } from 'src/users/users.service';
import { OnlineStatus } from '@prisma/client';


@WebSocketGateway({
	cors: {
		origin: ['http://localhost:3000']
	},

})


@Injectable()
export class SocketServerProvider {
	constructor(
		private readonly serverService: SocketServerService,
		private readonly userService: UsersService
		) { }

	@WebSocketServer()
	socketIO: Server;

	handleConnection(client: Socket) {
		console.log(`Client connected: ${client.id}`);
	}

	async handleDisconnect(client: Socket) {
		try {
			const disconnectedUser = await this.userService.findUserByToken(client.id) 
			await this.serverService.setClientStatusToOffline(disconnectedUser.id);
			const newStatus: WebsocketStatusChangeDto = {
				userId: disconnectedUser.id,
				userName: disconnectedUser.loginName,
				token: client.id,
				status: OnlineStatus.OFFLINE
			};
			this.socketIO.emit("socket/statusChange", newStatus);
			console.log(`Client disconnected ${client.id}`)
		}
		catch (error) {
			console.error(`Error logging off user with token ${client.id}`);
		};

	}

	@SubscribeMessage('socket/statusChange')
	broadcastStatusChange(@MessageBody() data: any) {
		this.socketIO.emit("socket/statusChange", data);
	}

	@SubscribeMessage('socket/online')
	async handleMessage(client: Socket, payload: WebsocketStatusChangeDto) {
		try {
			await this.serverService.setClientStatusToOnline(client, payload.userId);
			const newStatus: WebsocketStatusChangeDto = {
				userId: payload.userId,
				userName: payload.userName,
				token: payload.token,
				status: OnlineStatus.ONLINE
			};
			this.socketIO.emit("socket/statusChange", "refresh!");
		}
		catch (error) {console.error(`Error setting user ${payload.userId} to online: `, error)};

	}

}
