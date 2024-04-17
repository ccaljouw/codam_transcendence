import { Module } from '@nestjs/common';
import { SocketServerProvider } from './socketserver.gateway';
import { SocketServerService } from './socketserver.service';
// import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/database/prisma.service';
import { ChatSocketService } from 'src/chat/services/chatsocket.service';
import { TokenService } from 'src/users/token.service';
import { GameService } from 'src/game/game.service';

@Module({
  providers: [
    SocketServerProvider,
    SocketServerService,
    PrismaService,
    ChatSocketService,
    TokenService,
    GameService,
  ],
  exports: [SocketServerProvider],
})
export class SocketServerModule {}
