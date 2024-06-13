import { StatsDto } from '@ft_dto/stats';
import { Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class StatsService {
  constructor(
		private db: PrismaService,
	) { }

  async create(userId: number) : Promise<StatsDto> {
    try {
      return await this.db.stats.create({ data:  {userId}} );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError || PrismaClientValidationError || PrismaClientUnknownRequestError) {
        throw error;
      }
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  findAll() {
    return `This action returns all stats`;
  }

  findOne(id: number) {
    return this.hardcodedStats(id);
  }

  update(id: number, updateStatDto: StatsDto) {
    return `This action updates a #${id} stat`;
  }

  async remove(id: number) : Promise<StatsDto> {
    try {
      return await this.db.stats.delete({ where: { userId: id } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError || PrismaClientValidationError || PrismaClientUnknownRequestError) {
        throw error;
      }
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async hardcodedStats(id: number): Promise<StatsDto> {
		const stats: StatsDto = { 
      userId: 1, 
      rank: 3, 
      wonLastGame: false, 
      wins: 1, 
      losses: 2, 
      winLossRatio: 0.3, 
      consecutiveWins: 2, 
      maxConsecutiveWins: 2, 
      friends: 100, 
      achievements: [0,1,2,3,4,5], 
      last10Games: []
     }
    return stats;
	}
}
