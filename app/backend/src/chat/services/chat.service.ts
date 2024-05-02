import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CreateDMDto, CreateInviteDto, UpdateChatDto, UpdateInviteDto } from "@ft_dto/chat";

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
}