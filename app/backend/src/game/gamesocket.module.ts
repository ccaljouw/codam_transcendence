import { Module } from '@nestjs/common';
import { GamesocketService } from './gamesocket.service';
import { GamesocketGateway } from './gamesocket.gateway';
import { PrismaService } from 'src/database/prisma.service';
import { SocketServerModule } from 'src/socket/socketserver.module';

@Module({

  	imports: [SocketServerModule],
	providers: [GamesocketGateway, GamesocketService, PrismaService],
})
export class GamesocketModule {}
