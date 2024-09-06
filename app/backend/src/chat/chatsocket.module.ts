import { Module } from '@nestjs/common';
import { ChatSocketService } from './services/chatsocket.service';
import { ChatSocketGateway } from './chatsocket.gateway';
import { PrismaService } from 'src/database/prisma.service';
import { SocketServerModule } from '../socket/socketserver.module';
import { ChatMessagesController } from './controllers/chat.controller';
import { ChatMessageService } from './services/chat-messages.service';
import { ChatService } from './services/chat.service';
import { TokenService } from 'src/users/token.service';
import { InviteService } from './services/invite.service';
import { InviteController } from './controllers/invite.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/authentication/services/authentication.service';
import { TwoFAService } from 'src/authentication/services/2FA.service';
import { StatsService } from 'src/stats/stats.service';

@Module({
  imports: [SocketServerModule],
	providers: [ChatSocketGateway, ChatSocketService, ChatMessageService, ChatService, InviteService, PrismaService, TokenService, JwtService, AuthService, TwoFAService, StatsService],
	controllers: [ChatMessagesController, InviteController],
})
export class ChatSocketModule {}
