import { Injectable } from "@nestjs/common";
import { OnlineStatus } from "@prisma/client";
import { Socket } from "socket.io";
import { UpdateUserDto } from "src/users/dto/update-user.dto";
import { UserProfileDto } from "src/users/dto/user-profile.dto";
import { UsersService } from "src/users/users.service";

@Injectable()
export class SocketServerService {
constructor(private users: UsersService){}
async setClientStatusToOnline(client: Socket, userId: string)
{

	const updateInfo : UpdateUserDto = {
		token: client.id,
		online: OnlineStatus.ONLINE
	};
	try {
		await this.users.update(parseInt(userId), updateInfo);
		console.log(`User with id ${userId} and session id ${client.id} set to online`);
	}
	catch (error)
	{
		console.error(`Error updating with id ${userId}: `, error);
	}
}

	async setClientStatusToOffline(token: string){
		try {
			const loggedOutUserId = await this.users.findUserIdByToken(token);
			if (loggedOutUserId)
			{
				const updateLoggedOutUserDto : UpdateUserDto = {
					token: null,
					online: OnlineStatus.OFFLINE
				}
				await this.users.update(loggedOutUserId, updateLoggedOutUserDto);
				console.log(`User with token ${token} set to offline`);
			} else {
				console.log(`No user found for token ${token}`);
			}
		}
		catch(error)
		{
			console.error(`Error logging of user with token ${token}`);
		}
	}
}