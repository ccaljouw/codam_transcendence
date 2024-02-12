import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/database/prisma.service';



@Injectable()
export class GameService {

	constructor(private db: PrismaService) {}

	async create(createGameDto: CreateGameDto) {
		// hier gaan we een game maken
		const gameId = await this.db.game.create({data: {user1_id: 1, user2_id: 2}});
		// this.db.game.find
		console.log (`Added to db ${gameId.id}`);
		return 'This action adds a new game';
	}

	findAll() {
		return `This action returns all game`;
	}

	findOne(id: number) {
		return `This action returns a #${id} game`;
	}

	update(id: number, updateGameDto: UpdateGameDto) {
		return `This action updates a #${id} game`;
	}

	remove(id: number) {
		return `This action removes a #${id} game`;
	}
}
