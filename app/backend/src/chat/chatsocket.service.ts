import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UpdateChatUserDto } from '@ft_dto/chat'
import { Socket } from 'socket.io';
import { TokenService } from 'src/users/token.service';


@Injectable()
export class ChatSocketService {

	constructor(
		private readonly db: PrismaService,
		@Inject(forwardRef(() => TokenService)) private readonly tokenService: TokenService,
	) { }

	// TODO: should be moved to token service
	async getUserTokenArray(ids: number[]): Promise<string[]> { 
		const users = await this.db.tokens.findMany({
			where: {
				userId: {
					in: ids
				}
			},
			select: {
				token: true
			}
		});
		return users.map(user => user.token);
	}

	async getChatUserById(chatId: number, userId: number): Promise<UpdateChatUserDto | null> {
		const chatUser = await this.db.chatUsers.findUnique({
			where: {
				chatId_userId: {
					chatId,
					userId
				}
			}
		});
		return chatUser;
	}

	async isUserInChatRoom(chatId: number, userId: number): Promise<boolean> {
		const tokensForUser = await this.tokenService.findAllTokensForUser(userId);
		for (const token of tokensForUser) {
			if (token.chatId === chatId) {
				return true;
			}
		}
		return false;
	}

	async changeChatUserStatus(data: { client: Socket, userId: number, chatId: number, isInChatRoom: boolean }): Promise<UpdateChatUserDto | null> {

		console.log(`Changing chat user status for ${data.userId} with token ${data.client.id} in chat ${data.chatId} to ${data.isInChatRoom}`);

		await this.tokenService.updateToken({ userId: data.userId, chatId: data.isInChatRoom ? data.chatId : 0, token: data.client.id }); // update token with chatId if user is in chatroom, else set chatId to 0
		const userStillInChat = await this.isUserInChatRoom(data.chatId, data.userId);
		console.log(`User still in chat: ${userStillInChat}, data.isInChatRoom: ${data.isInChatRoom}`);
		if (!userStillInChat || data.isInChatRoom) { // if user is not in any chatroom, set isInChatRoom to false
			console.log(`Updating user ${data.userId} in chat ${data.chatId} to ${data.isInChatRoom}`);
			const updatedUser = await this.db.chatUsers.update({
				where: {
					chatId_userId: {
						chatId: data.chatId,
						userId: data.userId
					}
				},
				data: {
					isInChatRoom: data.isInChatRoom
				}
			});
			return updatedUser;
		}
		return null;
	}

	async setChatUserOfflineInAllChats(userId: number) {
		console.log(`Setting user ${userId} offline in all chats`);
		const chatUserRecords = await this.db.chatUsers.findMany({
			where: {
				userId
			}
		});
		for (const chatUserRecord of chatUserRecords) {
			await this.db.chatUsers.update({
				where: { id: chatUserRecord.id },
				data: {
					isInChatRoom: false
				}
			});
		}
		return;
	}


}
