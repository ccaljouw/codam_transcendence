import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto, UserProfileDto, CreateUserDto } from '@ft_dto/users';
import { PrismaService } from '../database/prisma.service';
import { StatsDto } from '@ft_dto/stats/stats.dto';

@Injectable()
export class StatsService {

	constructor(
		private db: PrismaService,
	) { }

  //todo: Carien: create servide, now hardcoded
  async findStatsFor(id: number): Promise<StatsDto> {
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
