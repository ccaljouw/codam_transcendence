import {
  UpdateGameDto,
  UpdateGameStateDto,
  UpdateGameUserDto,
} from '@ft_dto/game';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { GameState } from '@prisma/client';
import { StatsService } from 'src/stats/stats.service';

@Injectable()
export class GameService {
  constructor(
    private db: PrismaService,
    private statsService: StatsService,
  ) {}

  private async createGameWithPlayer1(
    userId: number,
    clientId: string,
    invite: number,
  ): Promise<UpdateGameDto> {
    console.log('Create new game');
    try {
      return await this.db.game.create({
        data: {
          state: 'WAITING',
          inviteId: invite === 0 ? null : invite,
          GameUsers: {
            create: [
              {
                userId,
                clientId,
                player: 1,
              },
            ],
          },
        },
        include: { GameUsers: { include: { user: true } } },
      });
    } catch (error) {
      throw error;
    }
  }

  private async addSecondPlayer(
    gameId: number,
    userId: number,
    clientId: string,
  ): Promise<UpdateGameDto> {
    console.log('AddSecondPlayer for', gameId);
    return await this.db.game.update({
      where: { id: gameId },
      data: {
        state: 'READY_TO_START',
        GameUsers: {
          create: [
            {
              userId,
              clientId,
              player: 2,
            },
          ],
        },
      },
      include: { GameUsers: { include: { user: true } } },
    });
  }

  async findAll() {
    try {
      return await this.db.game.findMany();
    } catch (error) {
      console.log('Error finding all games:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.db.game.findUnique({
        where: { id },
        include: { GameUsers: { include: { user: true } } },
      });
    } catch (error) {
      console.log('Error finding game:', error);
      throw error;
    }
  }

  async findInviteGameId(inviteId: number): Promise<number> {
    try {
      const game = await this.db.game.findUnique({
        where: { inviteId },
        select: { id: true },
      });
      if (!game) {
        throw new NotFoundException(
          `Game with inviteId ${inviteId} does not exist.`,
        );
      }
      return game.id;
    } catch (error) {
      console.log('Error finding invite game:', error);
      throw error;
    }
  }

  async findRandomGame(
    userId: number,
    clientId: string,
  ): Promise<UpdateGameDto> {
    try {
      console.log('FindRandomGame for user: ', userId);
      const game = await this.db.game.findFirst({
        where: {
          state: 'WAITING',
          inviteId: null,
        },
        include: { GameUsers: { include: { user: true } } },
      });

      if (!game) return await this.createGameWithPlayer1(userId, clientId, 0);

      if (game.GameUsers.length === 1 && game.GameUsers[0].userId !== userId) {
        console.log('Found open game:', game);
        return await this.addSecondPlayer(game.id, userId, clientId);
      }

      return game;
    } catch (error) {
      console.log('Error finding random game:', error);
      throw error;
    }
  }

  async findInviteGame(
    inviteId: number,
    userId: number,
    clientId: string,
  ): Promise<UpdateGameDto> {
    console.log('FindInviteGame for invite: ', inviteId);
    if (!inviteId) {
      throw new BadRequestException('InviteId not provided');
    }
    try {
      const game: UpdateGameDto = await this.db.game.findFirst({
        where: { inviteId },
        include: { GameUsers: { include: { user: true } } },
      });
      if (!game)
        return await this.createGameWithPlayer1(userId, clientId, inviteId);
      console.log('Found invite game:', game);
      if (game.GameUsers.length === 1 && game.GameUsers[0].userId !== userId) {
        return await this.addSecondPlayer(game.id, userId, clientId);
      }
      return game;
    } catch (error) {
      console.log('Error finding invite game:', error);
      throw error;
    }
  }

  async disconnect(clientId: string): Promise<number[]> {
    console.log('Disconnect game service called for clientId:', clientId);
    const disconnectedGameRooms: number[] = [];
    try {
      const games: UpdateGameDto[] = await this.db.game.findMany({
        where: {
          GameUsers: {
            some: {
              clientId: clientId,
            },
          },
          state: {
            notIn: [GameState.FINISHED, GameState.ABORTED, GameState.REJECTED],
          },
        },
      });
      if (!games || games.length === 0) {
        console.log('No games found for clientId:', clientId);
        return [];
      }
      for (const game of games) {
        console.log('Disconnecting game:', game.id);
        await this.update({
          id: game.id,
          state: GameState.ABORTED,
        });
        disconnectedGameRooms.push(game.id);
      }
      return disconnectedGameRooms;
    } catch (error) {
      console.log('Error disconnecting game:', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.db.game.delete({ where: { id } });
    } catch (error) {
      console.log('Error deleting game:', error);
      throw error;
    }
  }

  async updateGameUser(
    updateGameUserDto: UpdateGameUserDto,
    player: number,
  ): Promise<UpdateGameUserDto> {
    return this.db.gameUser.update({
      where: { gameId_player: { gameId: updateGameUserDto.id, player } },
      data: { score: updateGameUserDto.score },
      select: { userId: true, id: true },
    });
  }

  async update(updateGameStateDto: UpdateGameStateDto): Promise<boolean> {
    console.log(`backend - game: updating game: `, updateGameStateDto);
    try {
      const newGameData: UpdateGameStateDto = {
        id: updateGameStateDto.id,
        state: updateGameStateDto.state,
        ...(updateGameStateDto.state === 'STARTED' && {
          gameStartedAt: new Date(),
        }),
        ...(updateGameStateDto.state === 'FINISHED' && {
          gameFinishedAt: new Date(),
        }),
      };
      console.log(`backend - game: Game: newGameData`, newGameData);

      // update gameUsers if game is finished
      let player1: UpdateGameUserDto | undefined;
      let player2: UpdateGameUserDto | undefined;
      if (updateGameStateDto.state === 'FINISHED') {
        [player1, player2] = await Promise.all([
          this.updateGameUser(
            {
              id: updateGameStateDto.id,
              score: updateGameStateDto.score1,
            },
            1,
          ),
          this.updateGameUser(
            {
              id: updateGameStateDto.id,
              score: updateGameStateDto.score2,
            },
            2,
          ),
        ]);
        if (!player1 || !player2)
          throw new NotFoundException('Error updating gameUsers');

        newGameData.winnerId =
          updateGameStateDto.score1 > updateGameStateDto.score2
            ? player1.userId
            : player2.userId;
        console.log('winnerId:', newGameData.winnerId);
      }

      // update game
      const game = await this.db.game.update({
        where: { id: newGameData.id },
        data: newGameData,
        include: { GameUsers: { select: { userId: true, player: true } } },
      });
      if (game) {
        if (game.state === GameState.FINISHED) {
          // update user stats
          await Promise.all([
            this.statsService.update(player1.userId, 1, game),
            this.statsService.update(player2.userId, 2, game),
          ]);
        }
        console.log(`backend - game: Game: game state updated`);
        return true;
      } else {
        console.log(`backend - game: Game: game state not updated`);
        return false;
      }
    } catch (error) {
      console.log(`backend - game: Game: error updating game state`, error);
      throw error;
    }
  }
}
