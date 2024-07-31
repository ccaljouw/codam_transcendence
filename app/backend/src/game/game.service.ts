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
import { Socket } from 'socket.io';
import { GameState } from '@prisma/client';
import { StatsService } from 'src/stats/stats.service';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

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
  ) {
    console.log('CreateGame for', userId, clientId, invite);
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
  ) {
    console.log('AddSecondPlayer for', gameId, userId, clientId);
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

  async findRandomGame(
    userId: number,
    clientId: string,
  ): Promise<UpdateGameDto> {
    try {
      console.log('FindRandomGame for', userId, clientId);
      const game = await this.db.game.findFirst({
        where: {
          state: 'WAITING',
          inviteId: null,
        },
        include: { GameUsers: { include: { user: true } } },
      });
      if (!game) return await this.createGameWithPlayer1(userId, clientId, 0);
      else if (
        game.GameUsers.length === 1 &&
        game.GameUsers[0].userId !== userId
      ) {
        console.log('Found open game:', game);
        return await this.addSecondPlayer(game.id, userId, clientId);
      } else return game;
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
    console.log('FindInviteGame for ', inviteId, userId, clientId);
    if (!inviteId) {
      throw new BadRequestException('InviteId not provided');
    }
    try {
      const game: UpdateGameDto = await this.db.game.findFirst({
        where: { inviteId },
        include: { GameUsers: { include: { user: true } } },
      });
      console.log('Found invite game:', game);
      if (!game)
        return await this.createGameWithPlayer1(userId, clientId, inviteId);
      else if (
        game.GameUsers.length === 1 &&
        game.GameUsers[0].userId !== userId
      ) {
        return await this.addSecondPlayer(game.id, userId, clientId);
      }
    } catch (error) {
      console.log('Error finding invite game:', error);
      throw error;
    }
  }

  async disconnect(client: Socket) {
    console.log('Backend Game!!!: disconnect service called');
    console.log('My token is:', client.id);

    //todo:
    // set all games with token that are in sate waiting or in state started to abandoned in db
    // get the game id from the db with the token
  }

  async findAll() {
    try {
      const games = await this.db.game.findMany();
      return games;
    } catch (error) {
      throw new NotFoundException(`No games in the database`);
    }
  }

  async rejectInvite(id: number) {
    try {
      const game = await this.db.game.update({
        where: { inviteId: id },
        data: { state: 'REJECTED' },
        include: { GameUsers: { include: { user: true } } },
      });
      return game;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const game = await this.db.game.findUnique({
        where: { id },
        include: { GameUsers: { include: { user: true } } },
      });
      return game;
    } catch (error) {
      throw new NotFoundException(`Game with id ${id} does not exist.`);
    }
  }

  async setGameReady(id: number) {
    try {
      const game = await this.db.game.update({
        where: { id },
        data: { state: `READY_TO_START` },
        include: { GameUsers: { include: { user: true } } },
      });
      return game;
    } catch (error) {
      throw new NotFoundException(`Game with id ${id} does not exist.`);
    }
  }

  async isGameReady(id: number) {
    try {
      const game = await this.db.game.findUnique({
        where: { id },
        include: { GameUsers: { include: { user: true } } },
      });
      if (game.state === `READY_TO_START`) {
        return true;
      }
      return false;
    } catch (error) {
      throw new NotFoundException(`Game with id ${id} does not exist.`);
    }
  }

  async remove(id: number) {
    try {
      const game = await this.db.game.delete({ where: { id } });
      return game;
    } catch (error) {
      throw new NotFoundException(`Game with id ${id} does not exist.`);
    }
  }

  async getGameData(id: number) {
    try {
      const game = await this.db.game.findUnique({
        where: { id },
      });
      return game;
    } catch (error) {
      throw new NotFoundException(`Game with id ${id} does not exist.`);
    }
  }

  async update(updateGameStateDto: UpdateGameStateDto) {
    if (updateGameStateDto.state === undefined) {
      console.log(`backend - game: can't update because state not defined`);
      return;
    }
    console.log(
      `backend - game: updating game state to : ${updateGameStateDto.state} for game: ${updateGameStateDto.id}`,
    );
    console.log('update data', updateGameStateDto);
    try {
      const newGameData: UpdateGameStateDto = {
        id: updateGameStateDto.id,
        state: updateGameStateDto.state,
      };
      let player1: UpdateGameUserDto;
      let player2: UpdateGameUserDto;

      if (updateGameStateDto.state === 'STARTED') {
        newGameData.gameStartedAt = new Date();
      } else if (updateGameStateDto.state === 'FINISHED') {
        newGameData.gameFinishedAt = new Date();
        player1 = await this.db.gameUser.update({
          where: {
            gameId_player: {
              gameId: updateGameStateDto.id,
              player: 1,
            },
          },
          data: { score: updateGameStateDto.score1 },
          select: { userId: true, id: true },
        });
        player2 = await this.db.gameUser.update({
          where: {
            gameId_player: {
              gameId: updateGameStateDto.id,
              player: 2,
            },
          },
          data: { score: updateGameStateDto.score2 },
          select: { userId: true, id: true },
        });
        if (updateGameStateDto.winnerId === 0)
          newGameData.winnerId = player1.userId;
        else newGameData.winnerId = player2.userId;
      }

      const game = await this.db.game.update({
        where: { id: newGameData.id },
        data: newGameData,
        include: { GameUsers: { select: { userId: true, player: true } } },
      });
      if (game) {
        if (updateGameStateDto.state === 'FINISHED') {
          await this.statsService.update(player1.userId, 1, updateGameStateDto);
          await this.statsService.update(player2.userId, 2, updateGameStateDto);
        }
        console.log(`backend - game: Game: game state updated`);
        return true;
      } else {
        console.log(`backend - game: Game: game state not updated`);
        return false;
      }
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError ||
        PrismaClientValidationError ||
        PrismaClientUnknownRequestError
      ) {
        throw error;
      }
      throw new NotFoundException(
        `Error updating gamestate for game ${updateGameStateDto.id}.`,
      );
    }
  }

  async findGameForClientId(clientId: string): Promise<number | null> {
    console.log('getting game for clientId: ', clientId);
    try {
      // Check if there is a GameUser with the provided clientId
      const gameUser = await this.db.gameUser.findFirst({
        where: {
          clientId: clientId,
        },
      });
      if (gameUser) {
        console.log('GameUser found:', gameUser);
        // If a GameUser is found, access its associated Game
        const game = await this.db.game.findUnique({
          where: {
            id: gameUser.gameId,
            state: {
              not: GameState.FINISHED,
            },
          },
        });
        if (game) {
          // Game containing the GameUser with the provided clientId exists
          console.log('Game found:', game);
          return game.id;
        } else {
          // GameUser exists but np associated Game not found with relevant status to abort
          console.log('No game with relevant status found');
          return null;
        }
      } else {
        // No GameUser found with the provided clientId
        // throw new NotFoundException(
        //   `'No game found for clientId:' ${clientId}`,
        // );
        console.log(`No game found for clientId: ${clientId}`);
      }
    } catch (error) {
      console.error('Error checking game:', error);
    }
  }
}
