import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../database/prisma.service';
import { SocketServerModule } from '../socket/socketserver.module';
import { TokenService } from './token.service';
import { StatsService } from '../stats/stats.service';

@Module({
  imports: [SocketServerModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, TokenService, StatsService],
  exports: [UsersService],
})
export class UsersModule {}
