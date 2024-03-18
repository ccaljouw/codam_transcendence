import { Injectable } from "@nestjs/common";
import { OnlineStatus } from "@prisma/client";
import { Socket } from "socket.io";
import { ChatSocketService } from "src/chat/chatsocket.service";
import { UpdateUserDto } from "dto/users/update-user.dto";
import { UsersService } from "src/users/users.service";

@Injectable()
export class SocketServerService {
	constructor(
		private users: UsersService,
		private chat: ChatSocketService
	) { }
	async setClientStatusToOnline(client: Socket, userId: number) {

		const updateInfo: UpdateUserDto = {
			token: client.id,
			online: OnlineStatus.ONLINE
		};
		try {
			await this.users.update(userId, updateInfo);
			console.log(`User with id ${userId} and session id ${client.id} set to online`);
		}
		catch (error) {
			console.error(`Error updating with id ${userId}: `, error);
			throw error;
		}
	}

	async setClientStatusToOffline(id: number) {
		try {
			await this.chat.setChatUserOfflineAfterDisconnect(id);
			await this.users.update(id, { token: null, online: OnlineStatus.OFFLINE });
		}
		catch (error) {
			console.error(`Error logging of user with id ${id}`);
		}
	}
}