import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CreateDMDto, UpdateChatDto, UpdateChatUserDto } from "@ft_dto/chat";
import { UserProfileDto } from "@ft_dto/users";
import { ChatType, ChatUserRole } from "@prisma/client";

@Injectable()
export class ChatService {
	constructor(
		private db: PrismaService
	) { }

	async findOne(id: number): Promise<UpdateChatDto> {
		const chat = await this.db.chat.findUnique({
			where: { id },
			include: { users: true }
		});
		return chat;
	}

	async findDMChat(user1: number, user2: number): Promise<UpdateChatDto | null> {
		// Check if chat exists
		const exists = await this.db.chat.findFirst(
			{
				where: {
					AND: [
						{ visibility: "DM" },
						{ users: { some: { userId: user1 } } },
						{ users: { some: { userId: user2 } } },
					]
				}
			});
		if (exists) // Return chat id if it exists
		{
			return (exists);
		}
		return null;
	}

	// This function is used to create a chat between two users.
	async createDM(payload: CreateDMDto): Promise<UpdateChatDto> {

		const exists = await this.findDMChat(payload.user1Id, payload.user2Id);
		if (exists) // Return chat id if it exists
		{
			return exists;
		}

		// Create chat
		const newChat = await this.db.chat.create({
			data: {
				ownerId: payload.user1Id,
				visibility: "DM",
			}
		});

		// Add users to chat
		await this.db.chatUsers.createMany({
			data: [
				{ chatId: newChat.id, userId: payload.user1Id, lastRead: new Date() },
				{ chatId: newChat.id, userId: payload.user2Id, lastRead: new Date() }
			]
		});

		return ({ id: newChat.id, ownerId: newChat.ownerId, visibility: newChat.visibility })
	}

	async getUsersInChat(chatId: number): Promise<UserProfileDto[]> {
		const users = await this.db.chatUsers.findMany({
			where: { chatId },
			include: { user: true }
		});
		for (const user of users) {
			delete user.user.hash;
		}
		return users.map(u => u.user);
	}

	async getChatUser(chatId: number, userId: number): Promise<UpdateChatUserDto> {
		const chatUser = await this.db.chatUsers.findFirst({
			where: { chatId, userId }
		});
		return chatUser;
	}

	async createChannel(userId: number): Promise<UpdateChatDto> {
		console.log("Creating new channel for user ", userId);
		const newChat = await this.db.chat.create({
			data: {
				visibility: ChatType.PUBLIC,
				ownerId: userId,
				name: "New Channel " + Math.floor(Math.random() * 1000)
			}
		});
		const newChatUser = await this.db.chatUsers.create({
			data: {
				chatId: newChat.id,
				userId: userId,
				role: ChatUserRole.OWNER,
				lastRead: new Date()
			}
		});
		return (newChat)
	}

	async getChannelsForUser(userId: number): Promise<UpdateChatDto[]> {
		const userChannels = await this.db.chatUsers.findMany({
			where: {
				userId,
				chat: {
					NOT: { visibility: ChatType.DM }
				}
			},
			include: { chat: true }
		});
		const openChannels = await this.db.chat.findMany({
			where: {
				visibility: ChatType.PUBLIC,
				NOT: {
					users: { some: { userId } }
				}
			},
		});

		return userChannels.map(c => c.chat).concat(openChannels);
	}

	async getSingleChannelForUser(userId: number, channelId: number): Promise<UpdateChatDto> {
		console.log("Getting channel ", channelId, " for user ", userId);
		const chatUser = await this.db.chatUsers.findFirst({
			where: { userId, chatId: channelId }
		});
		console.log("ChatUser: ", chatUser);
		if (!chatUser) {
			await this.db.chatUsers.create({
				data: {
					chatId: channelId,
					userId,
					lastRead: new Date()
				}
			});
		}
		console.log("Getting channel ", channelId);
		const chat = await this.db.chat.findUnique({
			where: { id: channelId },
			include: { users: true }
		});
		return chat;
	}
}