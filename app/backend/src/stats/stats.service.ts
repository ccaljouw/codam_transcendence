import { StatsDto } from '@ft_dto/stats';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class StatsService {
  constructor(
		private db: PrismaService,
	) { }

  create(createStatDto: StatsDto) {
    return 'This action adds a new stat';
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

  remove(id: number) {
    return `This action removes a #${id} stat`;
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
