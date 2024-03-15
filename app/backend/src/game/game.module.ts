import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GamesocketGateway } from './gamesocket.gateway';
import { PrismaService } from 'src/database/prisma.service';
import { SocketServerModule } from 'src/socket/socketserver.module';
import { GameController } from './game.controller';

@Module({

  imports: [SocketServerModule],
	providers: [GamesocketGateway, GameService, PrismaService],
	controllers: [GameController],
})
export class GameModule {}
