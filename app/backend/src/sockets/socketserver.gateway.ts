import { Injectable, Module } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';
import { Server } from 'socket.io';


@WebSocketGateway({
	// cors: {
	// 	// origin: ['http://localhost:3000', 'http://localhost:3001'],
	// 	origin: ['http://localhost:3000']
	// },
}
)

@Injectable()
export class SocketServerProvider{
	socketIO : Server;
	corsArray = ['http://localhost:3000'];

	handleConnection(client: any, ...args: any[]) {
		console.log(`Client conned: ${client.id}`);
		//
	}

	handleDisconnect(client: any) {
		console.log(`Client disconned ${client.id}`)
	}
}

// @Module({
// 	providers: [SocketServerProvider],
// 	exports: [SocketServerProvider]
// })
// export class SocketServerModule {}
