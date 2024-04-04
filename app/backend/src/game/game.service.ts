import { UpdateGameStateDto } from '@ft_dto/game';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGameDto } from 'dto/game/create-game.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class GameService {
  constructor(private db: PrismaService) {}

  async getGame(userId: number) {
    let game;

    try {
      game = await this.db.game.findFirst({
        where: { state: `WAITING` },
        include: { GameUsers: { include: { user: true } } },
      });
      if (!game) {
        game = await this.create({ state: `WAITING` });
        await this.addUser(game.id, userId);
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
          await this.addUser(game.id, userId);
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

  addUser(gameId: number, userId: number) {
    return this.db.gameUser.create({ data: { gameId, userId } });
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
    try {
      const game = await this.db.game.update({
        where: { id: updateGameStateDto.roomId },
        data: { state: updateGameStateDto.state },
      });
      if (game) {
        return 0;
      } else {
        return 1;
      }
    } catch (error) {
      throw new NotFoundException(`User with id ${updateGameStateDto.roomId} does not exist.`);
    }
  }
}
