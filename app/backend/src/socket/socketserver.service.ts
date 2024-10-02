import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { Socket } from "socket.io";
import { ChatSocketService } from "../chat/services/chatsocket.service";
import { TokenService } from "../users/token.service";

@Injectable()
export class SocketServerService {
	constructor(
		@Inject (forwardRef(() => ChatSocketService)) private readonly chat: ChatSocketService,
		@Inject (forwardRef(() => TokenService)) private readonly tokens: TokenService
	) { }

	async setClientStatusToOffline(client: Socket, id: number) : Promise<boolean> { // returns true if last token of user removed
		try {
			const chatIdFromToken = await this.tokens.findChatIdByToken(client.id); // get chatId from token
			if (chatIdFromToken) // if user is in a chatroom, change the status (this function will check if user is still in that room on another client)
				await this.chat.changeChatUserStatus({token: client.id, userId: id, chatId: chatIdFromToken, isInChatRoom: false});
			const lastTokenOfUserRemoved = await this.tokens.removeToken(client.id); // remove Tokens returns true if this is the last token of this user
			if (lastTokenOfUserRemoved) // if this is the last token of the user, set user online in all chats
				await this.chat.setChatUserOfflineInAllChats(id);
			return lastTokenOfUserRemoved;
		}
		catch (error) {
			console.error(`Error logging of user with id ${id}`);
		}
	}
}