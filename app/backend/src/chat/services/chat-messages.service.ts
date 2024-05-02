import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CreateChatMessageDto, FetchChatMessageDto, UpdateChatMessageDto, UpdateChatUserDto } from "@ft_dto/chat";
import { ChatService } from "./chat.service";

@Injectable()
export class ChatMessageService {
	constructor(
		private readonly db: PrismaService,
		private readonly chatService: ChatService
	) { }

	// Called by socket when a user sends a message, adds the message to the database, sets unread messages for all offline users in the chat
	async messageToDB(createChatMessageDto: CreateChatMessageDto): Promise<{ messageId: number, usersNotInRoom: number[] }> {
		const newMessage = await this.db.chatMessages.create({ data: createChatMessageDto });
		const chatUsersNotInRoom = await this.db.chatUsers.findMany({
			where: {
				chatId: createChatMessageDto.chatId,
				isInChatRoom: false
			}
		});
		let idsOfUsersNotInRoom: number[] = [];
		for (const user of chatUsersNotInRoom) {
			await this.db.chatUsers.update({
				where: { id: user.id },
				data: {
					unreadMessages: user.unreadMessages + 1
				}
			});
			idsOfUsersNotInRoom.push(user.userId);
		}
		return { messageId: newMessage.id, usersNotInRoom: idsOfUsersNotInRoom };
	}

	// Called by the chat controller to get all messages in a chat
	async findMessagesInChat(chatId: number): Promise<FetchChatMessageDto[]> {
		try {
			const messages = await this.db.chatMessages.findMany({
				where: { chatId },
				include: {
					chat: {
						select: {
							users: {
								select: {
									user: {
										select:
										{
											id: true,
											userName: true
										}
									}
								}
							}
						}
					},
					invite: true
				}
			});

			return messages.map((message) => (
				{
					chatId: message.chatId,
					userId: message.userId,
					userName: message.chat.users.find(user => user.user.id === message.userId).user.userName,
					message: message.content,
					inviteId: message.inviteId,
					invite: message.invite
				}))
		} catch {
			throw new NotFoundException(`No messages found for this chat.`);
		}
	}

	async findMessagesInChatAfter(chatId: number, start: Date): Promise<UpdateChatMessageDto[]> {
		try {
			return await this.db.chatMessages.findMany({
				where: {
					chatId,
					createdAt: {
						gte: start, // gte = "greater than or equal to"
					},
				}
			});
		}
		catch {
			throw new NotFoundException(`No messages found for this chat.`);
		}
	}

	async unreadMessagesForUser(userId: number): Promise<number> {
		const unreadMessages = await this.db.chatUsers.findMany({
			where: {
				userId,
				unreadMessages: {
					gt: 0
				}
			}
		});
		let unreadMessagesCount = 0;
		for (const chat of unreadMessages) {
			unreadMessagesCount += chat.unreadMessages;
		}
		return unreadMessagesCount;
	}

	async unreadMessagesFromFriends(userId: number): Promise<number> {
		const friends = await this.db.user.findUnique({ where: { id: userId } }).friends();
		let friendChats : number[] = [];
		for (const friend of friends) {
			const chat  =  await this.chatService.findDMChat(userId, friend.id);
			if (chat) {
				friendChats.push(chat.id);
			}
		}
		const chatUsersWithUnreads = await this.db.chatUsers.findMany({
			where: {
				userId,
				chatId: {
					in: friendChats
				},
				unreadMessages: {
					gt: 0
				}
			}
		});
		let unreads = 0;
		for (const chat of chatUsersWithUnreads) {
			unreads += chat.unreadMessages;
		}
		return unreads;
	}



	async getUnreadMessages(chatId: number, userId: number): Promise<number> {
		const unreadMessages = await this.db.chatUsers.findFirst({
			where: {
				chatId,
				userId
			}
		});
		return unreadMessages.unreadMessages;

	}

	async resetUnreadMessages(payload: { chatId: number, userId: number }): Promise<UpdateChatUserDto> {
		const chatUserRecord = await this.db.chatUsers.findFirst({
			where: {
				chatId: payload.chatId,
				userId: payload.userId
			}
		});
		const updatedUser = await this.db.chatUsers.update({
			where: { id: chatUserRecord.id },
			data: {
				unreadMessages: 0
			}
		});
		return updatedUser;
	}
}

