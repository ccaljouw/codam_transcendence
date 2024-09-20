import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CreateDMDto, FetchChatDto, UpdateChatUserDto } from "@ft_dto/chat";
import { UserProfileDto } from "@ft_dto/users";
import { ChatType, ChatUserRole } from "@prisma/client";
import { UpdateChatDto } from "@ft_dto/chat/update-chat.dto";
import { AuthService } from "src/authentication/services/authentication.service";

@Injectable()
export class ChatService {
	constructor(
		private db: PrismaService,
		private authService: AuthService
	) { }

	async update(chatId: number, data: UpdateChatDto): Promise<FetchChatDto> {
		const chat = await this.db.chat.update({
			where: { id: chatId },
			include: { users: true },
			data
		});
		const chatAuth = await this.db.chatAuth.findFirst({
			where: { chatId }
		});
		console.log("ChatAuth: ", chatAuth, "chat.visibility: ", chat.visibility);
		if (chatAuth && chat.visibility != ChatType.PROTECTED) { // Delete password if visibility is not protected
			await this.db.chatAuth.delete({ where: { id: chatAuth.id } });
		} else if(!chatAuth && (chat.visibility == ChatType.PROTECTED)) { // create empty password if visibility is protected and no password exists
			await this.authService.setChatPassword(chatId, "");
		}
		return chat;
	}

	async findOne(id: number): Promise<FetchChatDto> {
		const chat = await this.db.chat.findUnique({
			where: { id },
			include: { users: true }
		});
		return chat;
	}

	async findDMChat(user1: number, user2: number): Promise<FetchChatDto | null> {
		// Check if chat exists
		const exists = await this.db.chat.findFirst(
			{
				where: {
					AND: [
						{ visibility: "DM" },
						{ users: { some: { userId: user1 } } },
						{ users: { some: { userId: user2 } } },
					]
				},
				include: { users: true }
			});
		if (exists) // Return chat id if it exists
		{
			return (exists);
		}
		return null;
	}

	// This function is used to create a chat between two users.
	async createDM(payload: CreateDMDto): Promise<FetchChatDto> {

    const exists = await this.findDMChat(payload.user1Id, payload.user2Id);
    if (exists) {
      // Return chat id if it exists
      return exists;
    }

		// Create chat
		const newChat = await this.db.chat.create({
			data: {
				ownerId: payload.user1Id,
				visibility: "DM",
			},
			include: { users: true }
		});

		// Add users to chat
		await this.db.chatUsers.createMany({
			data: [
				{ chatId: newChat.id, userId: payload.user1Id, lastRead: new Date() },
				{ chatId: newChat.id, userId: payload.user2Id, lastRead: new Date() }
			]
		});

		return (newChat)
	}

	async getUsersInChat(chatId: number): Promise<UserProfileDto[]> {
		const users = await this.db.chatUsers.findMany({
			where: { chatId },
			include: { user: true }
		});
		return users.map(u => u.user);
	}

	async getChatUser(chatId: number, userId: number): Promise<UpdateChatUserDto> {
		const chatUser = await this.db.chatUsers.findFirst({
			where: { chatId, userId }
		});
		return chatUser;
	}

	async deleteChatUser(chatId: number, userId: number): Promise<boolean> {
		const chatUser = await this.db.chatUsers.delete({
			where: { chatId_userId: { chatId, userId } }
		});
		const usersLeft = await this.db.chatUsers.findMany({
			where: { chatId }
		});
		// If no users left, delete the chat
		if (usersLeft.length == 0) {
			await this.db.chat.delete({ where: { id: chatId } });
		}
		else if (chatUser.role == ChatUserRole.OWNER) {
			// TODO - assign new owner
		}
		return true;
	}

	async createChannel(userId: number): Promise<FetchChatDto> {
		console.log("Creating new channel for user ", userId);
		const newChat = await this.db.chat.create({
			data: {
				visibility: ChatType.PRIVATE,
				ownerId: userId,
				name: "New Channel " + Math.floor(Math.random() * 1000)
			},
			include: { users: true }
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

	async getChannelsForUser(userId: number): Promise<FetchChatDto[]> {
		const userChannels = await this.db.chatUsers.findMany({ // Get all channels with the user as a member
			where: {
				userId,
				chat: {
					NOT: { visibility: ChatType.DM }
				}
			},
			include: { chat: 
				{ include: { users: true } }
			 }
		});
		const openChannels = await this.db.chat.findMany({ // Get all public and protected channels where the user is not a member
			where: {
				OR: [
					{visibility: ChatType.PUBLIC},
					{visibility: ChatType.PROTECTED}
				],
				NOT: {
					users: { some: { userId } }
				}
			},
			include: { users: true }
		});

		return userChannels.map(c => c.chat).concat(openChannels);
	}

	async getSingleChannelForUser(userId: number, channelId: number): Promise<FetchChatDto> {
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
