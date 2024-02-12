import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  providers: [GameGateway, GameService, PrismaService],
})
export class GameModule {}
