import { Module } from '@nestjs/common';
import { SocketServerProvider } from './socketserver.gateway';
import { SocketServerService } from './socketserver.service';
// import { UsersService } from 'src/users/users.service';
import { PrismaService } from '../database/prisma.service';
import { ChatSocketService } from '../chat/services/chatsocket.service';
import { TokenService } from '../users/token.service';
import { GameService } from '../game/game.service';
import { StatsService } from '../stats/stats.service';

@Module({
  providers: [
    SocketServerProvider,
    SocketServerService,
    PrismaService,
    ChatSocketService,
    TokenService,
    GameService,
    StatsService,
  ],
  exports: [SocketServerProvider],
})
export class SocketServerModule {}
