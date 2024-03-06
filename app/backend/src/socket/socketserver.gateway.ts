import { Injectable, Module } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
// import {Socke}
import { UserProfileDto } from '../users/dto/user-profile.dto'
import { WebsocketStatusChangeDto } from './dto/statuschange';
import { SocketServerService } from './socketserver.service';
import { UsersService } from 'src/users/users.service';
import { OnlineStatus } from '@prisma/client';


@WebSocketGateway({
	cors: {
		// origin: ['http://localhost:3000', 'http://localhost:3001'],
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

	corsArray = ['http://localhost:3000'];

	handleConnection(client: any, ...args: any[]) {
		console.log(`Client connected: ${client.id}`);
		//
	}

	async handleDisconnect(client: any) {
		try {
			const disconnectedUser = await this.userService.findUserByToken(client.id) 
			await this.serverService.setClientStatusToOffline(disconnectedUser.id);
			const newStatus: WebsocketStatusChangeDto = {
				userid: disconnectedUser.id,
				username: disconnectedUser.loginName,
				token: client.id,
				status: OnlineStatus.OFFLINE
			};
			this.socketIO.emit("socket/statusChange", newStatus);
			console.log("EMIT (offline)", client.id);
			// console.log(`Client disconnected ${client.id}`)
		}
		catch (error) {
			console.error(`Error logging off user with token ${client.id}`);
		};

	}

	@SubscribeMessage('socket/statusChange')
	broadcastStatusChange(@MessageBody() data: any) {
		console.log("Received status change", data);
		this.socketIO.emit("socket/statusChange", data);
	}

	@SubscribeMessage('socket/online')
	async handleMessage(client: Socket, payload: WebsocketStatusChangeDto) {
		// const clientId = client.id;
		console.log(`client ${client.id} wants to talk to me`);
		// console.log(client);
		// console.log();
		try {
			await this.serverService.setClientStatusToOnline(client, payload.userid);
			console.log("EMIT: (online)", payload);
			const newStatus: WebsocketStatusChangeDto = {
				userid: payload.userid,
				username: payload.username,
				token: payload.token,
				status: OnlineStatus.ONLINE
			};
			this.socketIO.emit("socket/statusChange", "refresh!");
		}
		catch (error) {console.error(`Error setting user ${payload.userid} to online: `, error)};

	}

	/**
//  * 
//  * @param corsArray array with CORS routes
//  */
	// setCorsOrigin(corsArray: string[]) {
	// 	WebSocketGateway({
	// 	  cors: {
	// 		origin: corsArray,
	// 	  },
	// 	})(SocketServerProvider);

}
