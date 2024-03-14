import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CreateChatMessageDto } from "../../dto/chat/create-chatMessage.dto";
import { FetchChatMessageDto } from "../../dto/chat/fetch-chatMessage.dto";
import { UpdateChatMessageDto } from "../../dto/chat/update-chatMessage.dto";
import { UpdateChatUserDto } from "../../dto/chat/update-chatUser.dto";

@Injectable()
export class ChatMessageService {
	constructor(
		private db: PrismaService
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
			console.log(`User ${user.userId} is not in room`);
			idsOfUsersNotInRoom.push(user.userId);
		}
		console.log(`Added message ${newMessage.id}`);
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
					}
				}
			});
			return messages.map((message) => ({
				chatId: message.chatId,
				userId: message.userId,
				userName: message.chat.users.find(user => user.user.id === message.userId).user.userName,
				message: message.content
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

	async getUnreadMessages(chatId: number, userId: number): Promise<number> {
		console.log(`Getting unread messages for user ${userId} in chat ${chatId}`);
		const unreadMessages = await this.db.chatUsers.findFirst({
			where: {
					chatId,
					userId
			}
		});
		console.log(`Found chat user record ${unreadMessages.id}:: ${unreadMessages.unreadMessages}`);
		return unreadMessages.unreadMessages;
	
	}

	async resetUnreadMessages(payload: {chatId: number, userId: number}): Promise<UpdateChatUserDto> {
		console.log(`Resetting unread messages for user ${payload.userId} in chat ${payload.chatId}`);
		const chatUserRecord = await this.db.chatUsers.findFirst({
			where: {
					chatId: payload.chatId,
					userId: payload.userId
			}
		});
		console.log(`Found chat user record ${chatUserRecord.id}`);
		const updatedUser = await this.db.chatUsers.update({
			where: { id: chatUserRecord.id },
			data: {
				unreadMessages: 0
			}
		});
		return updatedUser;
	}
}

