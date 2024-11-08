import { UpdateGameStateDto } from '@ft_dto/game';
import { GameResultDto, StatsDto } from '@ft_dto/stats';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class StatsService {
  constructor(private db: PrismaService
  ) {}

  async create(userId: number): Promise<StatsDto> {
    try {
      return await this.db.stats.create({
        data: { userId, ladderPosition: [userId] },
      });
    } catch (error) {
      console.log('Error creating stats:', error);
      throw error;
    }
  }

  async findAll(): Promise<StatsDto[]> {
    try {
      return await this.db.stats.findMany({
        orderBy: [{ wins: 'desc' }, { winLossRatio: 'desc' }],
      });
    } catch (error) {
      console.log('Error getting all stats:', error);
      throw error;
    }
  }

  async findOne(userId: number): Promise<StatsDto> {
    try {
      const stats: StatsDto = await this.db.stats.findUnique({
        where: { userId },
      });
      if (!stats) {
        throw new NotFoundException(
          `User with id ${userId} does not have stats.`,
        );
      }
      stats.rank = await this.getRank(userId);
      stats.friends = await this.getFriendCount(userId);
      stats.last10Games = await this.getLast10Games(userId);
      return stats;
    } catch (error) {
      console.log('Error getting stats:', error);
      throw error;
    }
  }

  async update(
    userId: number,
    player: number,
    updateGameStateDto: UpdateGameStateDto,
  ): Promise<StatsDto> {
    try {
      let userStats: StatsDto;
      const victory: boolean =
        userId === updateGameStateDto.winnerId ? true : false;

      console.log('updating stats for player: ', player);
      console.log('victory: ', victory);

      userStats = await this.db.stats.findUnique({ where: { userId } });
      if (!userStats) {
        throw new Error(`Error updating stats for id ${userId}.`);
      }

      userStats = await this.db.stats.update({
        where: { userId },
        data: {
          wonLastGame: victory,
          wins: victory ? userStats.wins + 1 : userStats.wins,
          losses: victory ? userStats.losses : userStats.losses + 1,
          consecutiveWins: victory ? userStats.consecutiveWins + 1 : 0,
        },
      });
      if (!userStats) {
        throw new Error(`Error updating stats for id ${userId}.`);
      }

      if (player === 1) await this.updateLadder(updateGameStateDto.id);

      const achievements = await this.updateAchievements(
        userId,
        updateGameStateDto.id,
      );
      if (!achievements)
        throw new Error(`Error updating achievements for id ${userId}.`);

      return await this.db.stats.update({
        where: { userId },
        data: {
          winLossRatio: userStats.wins / (userStats.wins + userStats.losses),
          achievements: achievements,
          maxConsecutiveWins:
            userStats.consecutiveWins > userStats.maxConsecutiveWins
              ? userStats.consecutiveWins
              : userStats.maxConsecutiveWins,
        },
      });
    } catch (error) {
      console.log('Error updating stats:', error);
      throw error;
    }
  }

  async remove(userId: number): Promise<StatsDto> {
    try {
      return await this.db.stats.delete({ where: { userId } });
    } catch (error) {
      console.log('Error removing stats:', error);
      throw error;
    }
  }

  async updateLadder(lastGameId: number): Promise<void> {
    try {
      // get game data
      const game = await this.db.game.findUnique({
        where: { id: lastGameId },
        select: {
          GameUsers: {
            select: {
              userId: true,
              score: true,
              user: { select: { stats: { select: { ladderPosition: true } } } },
            },
          },
          inviteId: true,
        },
      });
      if (!game)
        throw new NotFoundException(`No game found with id ${lastGameId}`);

      // do not update ladder if game is not played with invite
      if (!game.inviteId) return;

      // determine current ladder positions
      const ladder1: number[] = [
        ...game.GameUsers[0].user.stats.ladderPosition,
      ];
      const ladder2: number[] = [
        ...game.GameUsers[1].user.stats.ladderPosition,
      ];

      // check for swap and add relevant ladder positions
      if (
        (ladder1[0] < ladder2[0] &&
          game.GameUsers[0].score < game.GameUsers[1].score) ||
        (ladder1[0] > ladder2[0] &&
          game.GameUsers[0].score > game.GameUsers[1].score)
      ) {
        console.log('swapping ladder positions');
        ladder1.unshift(game.GameUsers[1].user.stats.ladderPosition[0]);
        ladder2.unshift(game.GameUsers[0].user.stats.ladderPosition[0]);
      } else {
        console.log('not swapping ladder positions');
        ladder1.unshift(game.GameUsers[0].user.stats.ladderPosition[0]);
        ladder2.unshift(game.GameUsers[1].user.stats.ladderPosition[0]);
      }

      // update ladder positions
      await this.db.stats.update({
        where: { userId: game.GameUsers[0].userId },
        data: { ladderPosition: ladder1 },
      });
      await this.db.stats.update({
        where: { userId: game.GameUsers[1].userId },
        data: { ladderPosition: ladder2 },
      });
    } catch (error) {
      console.log('Error updating ladder:', error);
      throw error;
    }
  }

  async getRank(userId: number): Promise<number> {
    try {
      const allStats: StatsDto[] = await this.findAll();
      if (!allStats)
        throw new NotFoundException(`No stats found for ${userId}`);
      return allStats.findIndex((stats) => stats.userId === userId) + 1;
    } catch (error) {
      console.log('Error getting rank:', error);
      throw error;
    }
  }

  async getLadder(userId: number): Promise<number[]> {
    const ladderPosition = await this.db.stats.findUnique({
      where: { userId },
      select: { ladderPosition: true },
    });
    if (!ladderPosition)
      throw new NotFoundException(`No ladder position found.`);
    return ladderPosition.ladderPosition;
  }

  async findRankTop10(): Promise<string[]> {
    try {
      const top10 = await this.db.stats.findMany({
        orderBy: [{ wins: 'desc' }, { winLossRatio: 'desc' }],
        take: 10,
        select: {
          user: {
            select: { userName: true },
          },
        },
      });
      if (!top10) throw new Error(`Error getting top10 games.`);
      return top10.map((stat) => stat.user.userName);
    } catch (error) {
      console.log('Error getting top10:', error);
      throw error;
    }
  }

  async findLadderTop10(): Promise<string[]> {
    try {
      const ladder = await this.db.stats.findMany({
        select: {
          ladderPosition: true,
          user: {
            select: { userName: true },
          },
        },
      });
      if (!ladder) throw new Error(`Error getting top10 games for ladder.`);
      console.log('ladder:', ladder);
      const top10 = ladder.sort(
        (a, b) => a.ladderPosition[0] - b.ladderPosition[0],
      );
      return top10.slice(0, 10).map((stat) => stat.user.userName);
    } catch (error) {
      throw error;
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
      console.log('Error getting friend count:', error);
      throw error;
    }
  }

  async getLast10Games(userId: number): Promise<GameResultDto[]> {
    try {
      const games = await this.db.game.findMany({
        where: {
          GameUsers: {
            some: {
              userId: userId,
            },
          },
          state: 'FINISHED',
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
      if (!games) return [];
      const gameResults = games.map((game) => ({
        id: game.id,
        state: game.state,
        user1Name: game.GameUsers[0]?.user.userName ?? null,
        user2Name: game.GameUsers[1]?.user.userName ?? null,
        scoreUser1: game.GameUsers[0]?.score ?? null,
        scoreUser2: game.GameUsers[1]?.score ?? null,
        winnerId: game.winnerId,
      }));

      return gameResults;
    } catch (error) {
      console.log('Error getting last 10 games:', error);
      throw error;
    }
  }

  private async updateAchievements(
    userId: number,
    lastGameId: number,
  ): Promise<number[]> {
    try {
      const lastGame = await this.db.game.findUnique({
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
            },
          },
        },
      });
      if (!lastGame) throw new Error(`No game found with id ${lastGameId}`);
      console.log('Updating stats for:', lastGame);
      const opponentId: number = lastGame.GameUsers[0].userId
        ? lastGame.GameUsers[1].userId
        : lastGame.GameUsers[0].userId;
      const opponent: StatsDto = await this.db.stats.findUnique({
        where: { userId: opponentId },
      });
      const currentUser: StatsDto = await this.db.stats.findUnique({
        where: { userId },
      });

      for (let i = 0; i <= 14; i++) {
        if (currentUser.achievements.includes(i)) {
          console.log(`${i} achievement already present.`);
        } else {
          switch (i) {
            case 0:
              //Awarded when the player wins their first game.
              if (currentUser.wins) currentUser.achievements.push(i);
              break;
            case 1:
              //Given when a player wins three games in a row
              if (currentUser.maxConsecutiveWins > 2)
                currentUser.achievements.push(i);
              break;
            case 2:
              //Earned when a player wins 100 games
              if (currentUser.wins === 100) currentUser.achievements.push(i);
              break;
            case 3:
              // check for rank 1
              if ((await this.getRank(userId)) === 1)
                currentUser.achievements.push(i);
              break;
            case 4:
              // won game with margin of one point
              if (
                currentUser.wonLastGame &&
                Math.abs(
                  lastGame.GameUsers[0].score - lastGame.GameUsers[1].score,
                ) === 1
              )
                currentUser.achievements.push(i);
              break;
            case 5:
              // winning match without losing a point
              if (
                currentUser.wonLastGame &&
                Math.min(
                  lastGame.GameUsers[0].score,
                  lastGame.GameUsers[1].score,
                ) === 0
              )
                currentUser.achievements.push(i);
              break;
            case 6:
              // long rally (no data available)
              if (lastGame.longestRally && lastGame.longestRally > 20)
                currentUser.achievements.push(i);
              break;
            case 7:
              //Awarded when a player beats an opponent who has won more than twice as many games as they have.
              if (opponent.wins && opponent.wins > currentUser.wins * 2)
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
              if (
                this.durationLongerThen(
                  lastGame.gameStartedAt,
                  lastGame.gameFinishedAt,
                  10,
                )
              )
                currentUser.achievements.push(i);
              break;
            case 11:
              // Awarded for playing match against the computer. (not possible yet)
              break;
            case 12:
              //Awarded for using the strongpong controller. (no data yet)
              break;
            case 13:
              //Awarded for sending more then 100 messages to someone. (??)
              const messageCount = await this.db.chatMessages.count({
                where: {
                  userId: userId,
                },
              });
              if (messageCount && messageCount > 100)
                currentUser.achievements.push(i);
              break;
            case 14:
              // Awarded for being a StrongPong developer.
              const user = await this.db.user.findUnique({
                where: { id: userId },
                select: { loginName: true },
              });
              if (!user) throw new Error(`No user found with id ${userId}`);
              console.log('loginname in achievements', user.loginName);
              const Developers: string[] = [
                'ccaljouw',
                'cwesseli',
                'jaberkro',
                'avan-and',
              ];
              if (Developers.includes(user.loginName)) {
                console.log('user is developer');
                currentUser.achievements.push(i);
              }
              break;
            default:
              console.log('No achievement for this index.');
          }
          currentUser.achievements.sort((a, b) => a - b);
        }
      }
      return currentUser.achievements;
    } catch (error) {
      console.log('Error updating achievements:', error);
      throw error;
    }
  }

  private isStartTimeBetween(
    startTime: Date,
    startHour: number,
    endHour: number,
  ): boolean {
    const hours = startTime.getHours();

    return hours >= startHour && hours < endHour;
  }

  private durationLongerThen(
    start: Date,
    end: Date,
    durationInMinutes: number,
  ): boolean {
    if (!start || !end) {
      console.log(`no start or end time. Start: ${start}, end: ${end}`);
      return false;
    }
    const differenceMs = end.getTime() - start.getTime();
    const differenceMinutes = differenceMs / (1000 * 60);

    return differenceMinutes > durationInMinutes;
  }
}
