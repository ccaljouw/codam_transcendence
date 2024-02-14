import { Injectable } from '@nestjs/common';
import { CreateGameSocketDto } from './dto/create-gamesocket.dto';
import { UpdateGameSocketDto } from './dto/update-gamesocket.dto';
import { PrismaService } from 'src/database/prisma.service';



@Injectable()
export class GameSocketService {

	constructor(private db: PrismaService) {}

	async create(data: CreateGameSocketDto) {
		// hier gaan we een game maken
		const exists = await this.db.game.findFirst(
			{where:{ 
				OR : [
				{user1_id : data.user1_id, user2_id: data.user2_id},
				{user1_id : data.user2_id, user2_id: data.user1_id}
				]
			}
			});
		if (exists)
			return exists.id;
		const gameId = await this.db.game.create({data});
		// this.db.game.find
		console.log (`Added to db ${gameId.id} with users ${data.user1_id} and ${data.user2_id}`);
		return gameId.id;
	}

	findAll() {
		return `This action returns all game`;
	}

	findOne(id: number) {
		return `This action returns a #${id} game`;
	}

	update(id: number, updateGameDto: UpdateGameSocketDto) {
		return `This action updates a #${id} game`;
	}

	async remove(id: number) {
		console.log(`Remove ${id}`);
		await this.db.game.delete({where: {id}});
		return `This action removes a #${id} game`;
	}
}
