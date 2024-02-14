import { Module } from '@nestjs/common';
import { GameSocketService } from './gamesocket.service';
import { GameSocketGateway } from './gamesocket.gateway';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  providers: [GameSocketGateway, GameSocketService, PrismaService],
})
export class GameSocketModule {}
