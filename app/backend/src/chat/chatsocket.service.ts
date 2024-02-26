import { Injectable } from '@nestjs/common';
import { CreateChatSocketDto } from './dto/create-gamesocket.dto';
import { UpdateChatSocketDto } from './dto/update-gamesocket.dto';
import { PrismaService } from 'src/database/prisma.service';

import {} from './dto/create-chat.dto'
import {} from './dto/create-chatUser.dto'
import {} from './dto/create-chatMessage.dto'
import {} from './dto/update-chat.dto'
import {} from './dto/update-chatUser.dto'

@Injectable()
export class ChatSocketService {

	constructor(private db: PrismaService) {}

	async createDM(data: CreateChatSocketDto) {
		console.log("creating chat...")
		
		// const exists = await this.db.game.findFirst(
		// 	{where:{ 
		// 		OR : [
		// 		{user1_id : data.user1_id, user2_id: data.user2_id},
		// 		{user1_id : data.user2_id, user2_id: data.user1_id}
		// 		]
		// 	}
		// 	});
		// if (exists)
		// 	return exists.id;
		// const gameId = await this.db.game.create({data});
		// console.log (`Added to db ${gameId.id} with users ${data.user1_id} and ${data.user2_id}`);
		// return gameId.id;
	}

	findAll() {
		return `This action returns all game`;
	}

	findOne(id: number) {
		return `This action returns a #${id} game`;
	}

	update(id: number, updateGameDto: UpdateChatSocketDto) {
		return `This action updates a #${id} game`;
	}

	async remove(id: number) {
		// console.log(`service: Remove  ${id}`);
		// await this.db.game.delete({where: {id}});
		// return `This action removes a #${id} game`;
	}
}
