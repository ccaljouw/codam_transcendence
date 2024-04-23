import { UpdateGameDto, UpdateGameStateDto } from '@ft_dto/game';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGameDto } from 'dto/game/create-game.dto';
import { PrismaService } from 'src/database/prisma.service';
import { Socket } from 'socket.io';

@Injectable()
export class GameService {
  constructor(private db: PrismaService) {}

  async getGame(userId: number) {
    let game: UpdateGameDto;

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

  async Disconnect(client: Socket) {
    console.log('Backend Game: disconnect service called');
    console.log('My token is:', client.id);

    // set all games with token that are in sate waiting or in state started to abandoned in db
    // get the game id from the db with the token
    // emit to room (gameid) gameStateUpdate => finished
    //alternatively disconnect the usdes from the socket / room
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
    if (updateGameStateDto.state === undefined) {
      console.log(`backend - game: can't update because state not defined`);
      return;
    }
    console.log(
      `backend - game: updating game state to : ${updateGameStateDto.state} for game: ${updateGameStateDto.roomId}`,
    );
    try {
      const game = await this.db.game.update({
        where: { id: updateGameStateDto.roomId },
        data: { state: updateGameStateDto.state },
      });
      if (game) {
        console.log(`backend - game: Game: game state updated`);
        return true;
      } else {
        console.log(`backend - game: Game: game state not updated`);
        return false;
      }
    } catch (error) {
      throw new NotFoundException(
        `User with id ${updateGameStateDto.roomId} does not exist.`,
      );
    }
  }

  async handleDisconnect(client: Socket) {
    console.log(`I AM IN THE HANDLE DISCONNECT ${client.id}`);
  }
}
