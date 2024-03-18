import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { FetchChatDto } from "../../dto/chat/fetch-chat.dto";
import { CreateChatSocketDto } from "../../dto/chat/create-chatSocket.dto";

@Injectable()
export class ChatService {
	constructor(
		private db: PrismaService
	) { }

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
				}
			});
		if (exists) // Return chat id if it exists
		{
			console.log(`Chat exists ${exists.id}`);
			return ({ id: exists.id, ownerId: exists.ownerId, visibility: exists.visibility });
		}
		return null;
	}

	// This function is used to create a chat between two users.
	async createDM(payload: CreateChatSocketDto): Promise<FetchChatDto> {
		console.log(`creating chat... for ${payload.user1Id} and ${payload.user2Id}`);

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
		console.log(`Created chat ${newChat.id}`);

		// Add users to chat
		await this.db.chatUsers.createMany({
			data: [
				{ chatId: newChat.id, userId: payload.user1Id, lastRead: new Date() },
				{ chatId: newChat.id, userId: payload.user2Id, lastRead: new Date() }
			]
		});
		console.log(`Added users ${payload.user1Id} and ${payload.user2Id} to chat ${newChat.id}`);

		return ({ id: newChat.id, ownerId: newChat.ownerId, visibility: newChat.visibility })
	}
}