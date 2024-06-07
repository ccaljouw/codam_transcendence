import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/database/prisma.service';
import { SocketServerModule } from 'src/socket/socketserver.module';
import { TokenService } from './token.service';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';

@Module({
	imports:	[SocketServerModule],
  controllers: [UsersController, StatsController],
  providers: [UsersService, PrismaService, TokenService, StatsService],
  exports: [UsersService],
})
export class UsersModule {}
