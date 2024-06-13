import { StatsDto } from '@ft_dto/stats';
import { Injectable, NotFoundException } from '@nestjs/common';
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
      throw new Error(`Error creating stats: ${error.message}`);
    }
  }

  async findAll() : Promise<StatsDto[]> {
    try {
      return  await this.db.stats.findMany({
        orderBy: [
          { wins: 'desc' },
          { winLossRatio: 'desc' },
        ],
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError || PrismaClientValidationError || PrismaClientUnknownRequestError) {
        throw error;
      }
      throw new Error(`Error getting all stats: ${error.message}`);
    }
  }

  async findOne(userId: number) : Promise<StatsDto>{
    try {
      let stats: StatsDto;

      stats = await this.db.stats.findUnique({ where: { userId }});
      stats.rank = await this.getRank(userId);
      stats.friends = await this.getFriendCount(userId);
      // add last 10 games
			return stats;
		}
		catch (error) {
      if (error instanceof PrismaClientKnownRequestError || PrismaClientValidationError || PrismaClientUnknownRequestError) {
        throw error;
      }
			throw new NotFoundException(`User with id ${userId} does not have stats.`);
		}
  }

  update(userId: number, updateStatDto: StatsDto) {
    return `This action updates a #${userId} stat`;
  }

  async remove(userId: number) : Promise<StatsDto> {
    try {
      return await this.db.stats.delete({ where: { userId } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError || PrismaClientValidationError || PrismaClientUnknownRequestError) {
        throw error;
      }
      throw new Error(`Error deleting stats: ${error.message}`);
    }
  }

  async getRank(userId: number): Promise<number> {
    try {
      const allStats: StatsDto[] = await this.findAll();
      return allStats.findIndex(stats => stats.userId === userId) + 1;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError || PrismaClientValidationError || PrismaClientUnknownRequestError) {
        throw error;
      }
      throw new Error(`Error getting rank: ${error.message}`);
    }
  }
  
  async findRankTop10(): Promise<string[]> {
    try {
      const top10 = await this.db.stats.findMany({
        orderBy: [
          { wins: 'desc' },
          { winLossRatio: 'desc' },
        ],
        take: 10,
        select: {
          user: {
            select: {
              userName: true,
            },
          },
        },
      });
      const usernames: string[] = top10.map(stat => stat.user.userName);
      return usernames;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError || PrismaClientValidationError || PrismaClientUnknownRequestError) {
        throw error;
      }
      throw new Error(`Error getting top 10 ranked players: ${error.message}`);
    }
  }

  async getFriendCount(userId: number): Promise<number> {
    try {
      const friendCount = await this.db.user.findUnique({
        where: { id: userId },
        select: { friends: true },
      });

      if (!friendCount) {
        return 0;
      }

      return friendCount.friends.length;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError || PrismaClientValidationError || PrismaClientUnknownRequestError) {
        throw error;
      }
      throw new Error(`Error getting friends: ${error.message}`);
    }
  }
}
