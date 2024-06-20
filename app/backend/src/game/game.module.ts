import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GamesocketGateway } from './gamesocket.gateway';
import { PrismaService } from 'src/database/prisma.service';
import { SocketServerModule } from 'src/socket/socketserver.module';
import { GameController } from './game.controller';
import { StatsService } from 'src/stats/stats.service';

@Module({

  imports: [SocketServerModule],
	providers: [GamesocketGateway, GameService, PrismaService, StatsService],
	controllers: [GameController],
})
export class GameModule {}
