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
      return await this.db.stats.create({ data: {userId} });
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

  // todo: Carien: create update for achievements
  async update(userId: number, player: number, updateGameStateDto: UpdateGameStateDto) {
    try {
      let userStats: StatsDto;
      const victory: boolean = (player - 1) === updateGameStateDto.winnerId ? true : false;
      
      userStats = await this.db.stats.findUnique({ where: { userId }});
      if (!userStats) {
        userStats = await this.create(userId);
        throw new NotFoundException(`User with id ${userId} does not have stats.`);
      }

      userStats =  await this.db.stats.update({
        where: { userId },
        data: {
          wonLastGame: victory,
          wins: victory ? (userStats.wins + 1) : userStats.wins,
          losses: victory ? userStats.losses : (userStats.losses + 1),
          consecutiveWins: victory ? (userStats.consecutiveWins + 1) : 0,
        },
      });
      return await this.db.stats.update({
        where: { userId },
        data: {
          winLossRatio: userStats.wins / (userStats.wins + userStats.losses),
          achievements: await this.updateAchievements(userId, updateGameStateDto.id),
          maxConsecutiveWins: userStats.consecutiveWins > userStats.maxConsecutiveWins 
          ? userStats.consecutiveWins : userStats.maxConsecutiveWins, 
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
        scoreUser1: game.GameUsers[0]?.score ?? null,
        scoreUser2: game.GameUsers[1]?.score ?? null,
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

  private async updateAchievements(userId: number, lastGameId: number) : Promise<number[]> {
    try {
      const lastGame  = await this.db.game.findUnique({ 
        where: { id: lastGameId },
        select: {
          winnerId: true,
          gameStartedAt: true,
          gameFinishedAt: true,
          longestRally: true,
          GameUsers: { 
            select: { 
              userId: true, 
              score: true, 
              }
            },
          }, 
        });

      const opponentId: number = lastGame.GameUsers[0].userId ?  lastGame.GameUsers[1].userId : lastGame.GameUsers[0].userId;
      const opponent: StatsDto = await this.db.stats.findUnique({ where: { userId: opponentId }});
      let currentUser: StatsDto = await this.db.stats.findUnique({ where: { userId }});

      for (let i = 0; i <= 14; i++) {
        if (currentUser.achievements .includes(i)) {
          console.log(`${i} achievement already present.`);
        } else {
          switch (i) {
            case 0:
              //Awarded when the player wins their first game.
              if (currentUser.wins)
                currentUser.achievements.push(i);
              break;
            case 1:
              //Given when a player wins three games in a row
              if (currentUser.maxConsecutiveWins > 2)
                currentUser.achievements.push(i);
              break;
            case 2:
              //Earned when a player wins 100 games
              if (currentUser.wins === 100 )
                currentUser.achievements.push(i);
              break;
            case 3:
              // check for rank 1
              if ( await this.getRank(userId) === 1)
                currentUser.achievements.push(i);
              break;
            case 4:
              // won last game with margin of one point
              if ( currentUser.wonLastGame && 
                    Math.abs(lastGame.GameUsers[0].score - lastGame.GameUsers[1].score) === 1)
                currentUser.achievements.push(i);
              break;
            case 5:
              // winning match without losing a point
              if ( currentUser.wonLastGame && 
                    Math.min(lastGame.GameUsers[0].score, lastGame.GameUsers[1].score) === 0)
                currentUser.achievements.push(i);
              break;
            case 6:
              // long rally (no data available)
              if (lastGame.longestRally && lastGame.longestRally > 20 )
                currentUser.achievements.push(i);
              break;
            case 7:
              //Awarded when a player beats an opponent who has won more than twice as many games as they have.
              if (opponent.wins > (currentUser.wins * 2))
                currentUser.achievements.push(i);
              break;
            case 8:
              if (this.isStartTimeBetween(lastGame.gameStartedAt, 4, 7))
                currentUser.achievements.push(i);
              break;
            case 9:
              if (this.isStartTimeBetween(lastGame.gameStartedAt, 0, 4))
                currentUser.achievements.push(i);
              break;
            case 10:
              //todo: Jorien & Carien: figure out why this is not working
              // if(this.durationLongerThen(lastGame.gameStartedAt, lastGame.gameFinishedAt, 10))
              //   currentUser.achievements.push(i);
              break;
            case 11:
              // Awarded for playing match against the computer. (not possible yet)
              break;
            case 12:
              //Awarded for using the strongpong controller. (no data yet)
              break;
            case 13:
              //Awarded for sending more then 100 messages to someone. (??)
              break;
            case 14:
              // Awarded for being a StrongPong developer.
              if (currentUser.userId < 5)
                currentUser.achievements.push(i);
              break;
            default:
              console.log('No achievement for this index.');
          }
          currentUser.achievements.sort((a, b) => a - b);
        }
      }
      return currentUser.achievements;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError || PrismaClientValidationError || PrismaClientUnknownRequestError) {
        throw error;
      }
      throw new Error(`Error deleting stats: ${error.message}`);
    }
  }

  private isStartTimeBetween(startTime: Date, startHour: number, endHour: number): boolean {
    const hours = startTime.getHours();  
    
    return (hours >= startHour && hours < endHour);
  }

  //todo: Jorien & Carien: figure out why this is not working 
  // private durationLongerThen(start: Date, end: Date, durationInMinutes: number) {
  //   const differenceMs = end.getTime() - start.getTime();
  //   const differenceMinutes = differenceMs / (1000 * 60);
    
  //   return differenceMinutes > 10;
  // }
}
