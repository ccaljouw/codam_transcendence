import { Injectable, Module } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
// import {Socke}
import {UserProfileDto} from '../users/dto/user-profile.dto'
import { SocketServerService } from './socketserver.service';


@WebSocketGateway({
	// cors: {
	// 	// origin: ['http://localhost:3000', 'http://localhost:3001'],
	// 	origin: ['http://localhost:3000']
	// },

})


@Injectable()
export class SocketServerProvider{
	constructor(private readonly serverService: SocketServerService) {}

	@WebSocketServer()
	socketIO : Server;

	corsArray = ['http://localhost:3000'];

	handleConnection(client: any, ...args: any[]) {
		console.log(`Client conned: ${client.id}`);
		//
	}
	
	async handleDisconnect(client: any) {
		await this.serverService.setClientStatusToOffline(client.id);
		console.log("EMIT (offline)", client.id);
		this.socketIO.emit("socket/statusChange","refresh!");
		console.log(`Client disconned ${client.id}`)
		
	}
	
	@SubscribeMessage('socket/online')
	async handleMessage(client: Socket, user: string)
	{
		// const clientId = client.id;
		console.log(`client ${client.id} wants to talk to me`);
		// console.log(client);
		// console.log();
		await this.serverService.setClientStatusToOnline(client, user);
			console.log("EMIT: (online)", user);
			this.socketIO.emit("socket/statusChange","refresh!");
			
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
