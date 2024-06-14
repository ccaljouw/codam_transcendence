import { UpdateGameStateDto } from '@ft_dto/game';
import { GameResultDto, StatsDto } from '@ft_dto/stats';
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
      if (!stats)
        throw new NotFoundException(`User with id ${userId} does not have stats.`);
      stats.rank = await this.getRank(userId);
      stats.friends = await this.getFriendCount(userId);
      stats.last10Games = await this.getLast10Games(userId);
			return stats;
		}
		catch (error) {
      if (error instanceof PrismaClientKnownRequestError || PrismaClientValidationError || PrismaClientUnknownRequestError) {
        throw error;
      }
			throw new NotFoundException(`User with id ${userId} does not have stats.`);
		}
  }

  // todo: Carien: create update for stats and achievements
  async update(userId: number, player: number, updateGameStateDto: UpdateGameStateDto) {
    try {
      let userStats: StatsDto;
      userStats = await this.db.stats.findUnique({ where: { userId }});
      if (!userStats) {
        userStats = await this.create(userId);
        throw new NotFoundException(`User with id ${userId} does not have stats.`);
      }
      const victory: boolean = (player - 1) === updateGameStateDto.winner ? true : false;
      return await this.db.stats.update({
        where: { userId },
        data: {
          wonLastGame: victory,
          wins: victory ? (userStats.wins + 1) : userStats.wins,
          losses: victory ? userStats.losses : (userStats.losses + 1),
          winLossRatio: victory 
            ? (userStats.wins + 1) / (userStats.wins + (userStats.losses + 1))
            : userStats.wins / (userStats.wins + userStats.losses + 1),
          consecutiveWins: victory ? (userStats.consecutiveWins + 1) : 0,
          maxConsecutiveWins: victory 
            ? ((userStats.consecutiveWins + 1) > userStats.maxConsecutiveWins 
                ? (userStats.consecutiveWins + 1) 
                : userStats.maxConsecutiveWins)
            : userStats.maxConsecutiveWins,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError || PrismaClientValidationError || PrismaClientUnknownRequestError) {
        throw error;
      }
      throw new Error(`Error updating stats: ${error.message}`);
    }
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
            select: { userName: true },
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

  async getLast10Games(userId: number) : Promise<GameResultDto[]> {
    try {
      const games = await this.db.game.findMany({
        where: {
          GameUsers: {
            some: {
              userId: userId,
            },
          },
          state: 'FINISHED'
        },
        orderBy: { id: 'desc' },
        take: 10,
        include: {
          GameUsers: {
            select: { 
              score: true, 
              user: { select: { userName: true } },
            },
          },
        },
      });

      const gameResults  = games.map(game => ({
        id: game.id,
        state: game.state,
        user1Name: game.GameUsers[0]?.user.userName ?? null,
        user2Name: game.GameUsers[1]?.user.userName ?? null,
        score1: game.GameUsers[0]?.score ?? null,
        score2: game.GameUsers[1]?.score ?? null,
        winnerId: game.winnerId
      }));

      return gameResults;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError || PrismaClientValidationError || PrismaClientUnknownRequestError) {
        throw error;
      }
      throw new Error(`Error getting games: ${error.message}`);
    }
  }
}
