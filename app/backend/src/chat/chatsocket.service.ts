import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatSocketDto } from './dto/create-chatSocket.dto';
import { UpdateChatSocketDto } from './dto/update-chatSocket.dto';
import { PrismaService } from 'src/database/prisma.service';

import { } from './dto/create-chat.dto'
import { } from './dto/create-chatUser.dto'
import { } from './dto/update-chat.dto'
import { } from './dto/update-chatUser.dto'
import { CreateChatMessageDto } from './dto/create-chatMessage.dto'
import { UpdateChatMessageDto } from './dto/update-chatMessage.dto';
import { FetchChatMessageDto } from './dto/fetch-chatMessage.dto';
import { FetchChatDto } from './dto/fetch-chat.dto';

@Injectable()
export class ChatSocketService {

	constructor(private db: PrismaService) { }

	// This function is used to create a chat between two users.
	async createDM(payload: CreateChatSocketDto): Promise<FetchChatDto> {
		console.log(`creating chat... for ${payload.user1_id} and ${payload.user2_id}`);

		// Check if chat exists
		const exists = await this.db.chat.findFirst(
			{
				where: {
					AND: [
						{ users: { some: { userId: payload.user1_id } } },
						{ users: { some: { userId: payload.user2_id } } },
						{ visibility: "DM" }
					]
				}
			});
		if (exists) // Return chat id if it exists
		{
			console.log(`Chat exists ${exists.id}`);
			return ({id: exists.id, ownerId: exists.ownerId, visibility: exists.visibility});
		}

		// Create chat
		const newChat = await this.db.chat.create({
			data: {
				ownerId: payload.user1_id,
				visibility: "DM",
			}
		});
		console.log(`Created chat ${newChat.id}`);

		// Add users to chat
		await this.db.chatUsers.createMany({
			data: [
				{ chatId: newChat.id, userId: payload.user1_id, lastRead: new Date() },
				{ chatId: newChat.id, userId: payload.user2_id, lastRead: new Date() }
			]
		});
		console.log(`Added users ${payload.user1_id} and ${payload.user2_id} to chat ${newChat.id}`);

		return ({id: newChat.id, ownerId: newChat.ownerId, visibility: newChat.visibility})
	}

	// async addMessage(msg: {chatId: number, userId: number, message: string}) {
	// 	console.log(`Adding message to chat ${msg.chatId} from ${msg.userId}`);
	// 	const data : CreateChatMessageDto = {
	// 		chatId: msg.chatId,
	// 		userId: msg.userId,
	// 		content: msg.message
	// 	}
	// 	const newMessageId = await this.db.chatMessages.create({ data }); 
	// 	return newMessageId;
	// }

	async messageToDB(createChatMessageDto: CreateChatMessageDto): Promise<Number> {
		const newMessage = await this.db.chatMessages.create({ data: createChatMessageDto });
		console.log(`Added message ${newMessage.id}`);
		return newMessage.id;
	}

	findAll() {
		return `This action returns all game`;
	}
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
											loginName: true
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
				loginName: message.chat.users.find(user => user.user.id === message.userId).user.loginName,
				message: message.content
			}))
		} catch {
			throw new NotFoundException(`No messages found for this chat.`);
		}
	}
	
			

  async findMessagesInChatAfter(chatId: number, start: Date) : Promise < UpdateChatMessageDto[] > {
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
	}
