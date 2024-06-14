import { UpdateGameDto, UpdateGameStateDto } from '@ft_dto/game';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGameDto } from 'dto/game/create-game.dto';
import { PrismaService } from 'src/database/prisma.service';
import { Socket } from 'socket.io';
import { GameState } from '@prisma/client';
import { StatsService } from 'src/stats/stats.service';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';

@Injectable()
export class GameService {
  constructor(
    private db: PrismaService,
    private statsService: StatsService,
  ) {}

  async getGame(userId: number, clientId: string) {
    let game: UpdateGameDto;

    try {
      game = await this.db.game.findFirst({
        where: { state: `WAITING` },
        include: { GameUsers: { include: { user: true } } },
      });
      if (!game) {
        game = await this.create({ state: `WAITING` });
        await this.addUser(game.id, userId, clientId, 1);
        game = await this.db.game.findFirst({
          where: { id: game.id },
          include: { GameUsers: { include: { user: true } } },
        });
      } else {
        //check if user is already in the game
        const isUserInGame = game.GameUsers.some(
          (gameUser) => gameUser.userId === userId,
        );
        if (!isUserInGame) {
          console.log(`!!!user is not in game`);
          await this.addUser(game.id, userId, clientId, 2);
          game = await this.db.game.update({
            where: { id: game.id },
            data: { state: `READY_TO_START` },
            include: { GameUsers: { include: { user: true } } },
          });
        }
      }

      return game;
    } catch (error) {
      console.log(`error getting game`);
      return game;
    }
  }

  async create(createGameDto: CreateGameDto) {
    return await this.db.game.create({ data: createGameDto });
  }

  async Disconnect(client: Socket) {
    console.log('Backend Game: disconnect service called');
    console.log('My token is:', client.id);

    // set all games with token that are in sate waiting or in state started to abandoned in db
    // get the game id from the db with the token
    // emit to room (gameid) gameStateUpdate => finished
  }

  addUser(gameId: number, userId: number, clientId: string, player: number) {
    return this.db.gameUser.create({ data: { gameId, userId, clientId, player } });
  }

  async findAll() {
    try {
      const games = await this.db.game.findMany();
      return games;
    } catch (error) {
      throw new NotFoundException(`No games in the database`);
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
    console.log(
      `backend - game: updating game state to : ${updateGameStateDto.state} for game: ${updateGameStateDto.roomId}`,
    );
    try {
      const game = await this.db.game.update({
        where: { id: updateGameStateDto.roomId },
        data: { state: updateGameStateDto.state },
        include: { GameUsers: {select: { userId: true, player: true }} }
      });
      if (updateGameStateDto.state === 'FINISHED' ) {
        await this.db.game.update({
          where: { id: updateGameStateDto.roomId },
          data: { 
            winnerId: game.GameUsers[updateGameStateDto.winner].userId,
            GameUsers: {
              updateMany: [
                {
                  where: { gameId: updateGameStateDto.roomId, player: 1 },
                  data: { score: updateGameStateDto.score1 },
                },
                {
                  where: { gameId: updateGameStateDto.roomId, player: 2 },
                  data: { score: updateGameStateDto.score2 },
                },
              ],
            },
          }
        });
        await this.statsService.update(game.GameUsers[0].userId, game.GameUsers[0].player, updateGameStateDto);
        await this.statsService.update(game.GameUsers[1].userId, game.GameUsers[1].player, updateGameStateDto);
      }
      return true;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError || PrismaClientValidationError || PrismaClientUnknownRequestError) {
        throw error;
      }
			throw new NotFoundException(`Error updating gamestate for game ${updateGameStateDto.roomId}.`);
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
        // If a GameUser is found, access its associated Game
        const game = await this.db.game.findUnique({
          where: {
            id: gameUser.gameId,
            state: {
              in: [
                GameState.WAITING,
                GameState.READY_TO_START,
                GameState.STARTED,
              ],
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
        throw new NotFoundException(
          `'No game found for clientId:' ${clientId}`,
        );
      }
    } catch (error) {
      console.error('Error checking game:', error);
    }
  }
}
