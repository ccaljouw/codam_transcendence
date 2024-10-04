import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UpdateChatUserDto } from '@ft_dto/chat'
import { TokenService } from '../../users/token.service';


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

	async changeChatUserStatus(data: { token: string, userId: number, chatId: number, isInChatRoom: boolean }): Promise<UpdateChatUserDto | null> {

		const currentToken = await this.tokenService.getTokenEntry(data.token);
		if (currentToken && currentToken.chatId && currentToken.chatId !== data.chatId && currentToken.chatId !== 0) {
			try {
				await this.db.chatUsers.update({
					where: {
						chatId_userId: {
							chatId: currentToken.chatId,
							userId: data.userId
						}
					},
					data: {
						isInChatRoom: false
					}
				});
			} catch (e) {
				console.error("Error updating chatUser", e);
			}
		}
		await this.tokenService.updateToken({ userId: data.userId, chatId: data.isInChatRoom ? data.chatId : 0, token: data.token }); // update token with chatId if user is in chatroom, else set chatId to 0
		const userStillInChat = await this.isUserInChatRoom(data.chatId, data.userId);
		if (!userStillInChat || data.isInChatRoom) { // if user is not in any chatroom, set isInChatRoom to false
			console.log("User is not in chatroom, setting isInChatRoom to false", data);
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
