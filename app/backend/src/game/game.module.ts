import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GamesocketGateway } from './gamesocket.gateway';
import { PrismaService } from '../database/prisma.service';
import { SocketServerModule } from '../socket/socketserver.module';
import { GameController } from './game.controller';
import { StatsService } from '../stats/stats.service';
import { TokenService } from '../users/token.service';
import { UsersService } from '../users/users.service';

@Module({
  imports: [SocketServerModule],
  providers: [GamesocketGateway, GameService, PrismaService, StatsService, TokenService, UsersService],
  controllers: [GameController],
})
export class GameModule {}
