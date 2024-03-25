import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebsocketStatusChangeDto } from '@ft_dto/socket';
import { SocketServerService } from './socketserver.service';
import { OnlineStatus } from '@prisma/client';
import { TokenService } from 'src/users/token.service';


@WebSocketGateway({
	cors: {
		origin: ['http://localhost:3000']
	},

})
@Injectable()
export class SocketServerProvider {
	constructor(
		@Inject (forwardRef(() => SocketServerService)) private readonly serverService: SocketServerService,
		@Inject(forwardRef(() => TokenService)) private readonly tokenService: TokenService
	) { }

	@WebSocketServer()
	socketIO: Server;

	handleConnection(client: Socket) {
		console.log(`Client connected: ${client.id}`);
	}

	async handleDisconnect(client: Socket) {
		try {
			const disconnectedUser = await this.tokenService.findUserByToken(client.id)
			const lastTokenOfUserRemoved: boolean = await this.serverService.setClientStatusToOffline(client, disconnectedUser.id);
			if (lastTokenOfUserRemoved) {
				const newStatus: WebsocketStatusChangeDto = {
					userId: disconnectedUser.id,
					userName: disconnectedUser.userName,
					token: client.id,
					status: OnlineStatus.OFFLINE
				};
				this.socketIO.emit("socket/statusChange", newStatus);
				console.log(`Client disconnected ${client.id}`)
			}
			else
				console.log(`Client disconnected ${client.id} but user ${disconnectedUser.id} still has other active connections`);
		}
		catch (error) {
			console.error(`Error logging off user with token ${client.id}`);
		};

	}

	@SubscribeMessage('socket/statusChange')
	broadcastStatusChange(@MessageBody() data: any) {
		this.socketIO.emit("socket/statusChange", data);
	}

}
