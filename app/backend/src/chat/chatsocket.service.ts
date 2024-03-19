import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UpdateChatUserDto } from '@ft_dto/chat'

@Injectable()
export class ChatSocketService {

	constructor(private db: PrismaService) { }

	async getUserTokenArray(ids: number[]) : Promise<string[]> {
		const users = await this.db.user.findMany({
			where: {
				id: {
					in: ids
				}
			},
			select: {
				token: true
			}
		});
		return users.map(user => user.token);
	}

	async changeChatUserStatus(payload: {
		userId: number, 
		chatId: number, 
		isInChatRoom: boolean}
	): Promise<UpdateChatUserDto> {
		console.log(`Changing chat user status for ${payload.userId} in chat ${payload.chatId} to ${payload.isInChatRoom}`);
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
				lastRead: new Date(),
				isInChatRoom: payload.isInChatRoom
			}
		});
		return updatedUser;
	}

	async setChatUserOfflineAfterDisconnect(userId: number) {
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
