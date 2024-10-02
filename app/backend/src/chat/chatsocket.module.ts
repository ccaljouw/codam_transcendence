import { Module } from '@nestjs/common';
import { ChatSocketService } from './services/chatsocket.service';
import { ChatSocketGateway } from './chatsocket.gateway';
import { PrismaService } from '../database/prisma.service';
import { SocketServerModule } from '../socket/socketserver.module';
import { ChatMessagesController } from './controllers/chat.controller';
import { ChatMessageService } from './services/chat-messages.service';
import { ChatService } from './services/chat.service';
import { TokenService } from '../users/token.service';
import { InviteService } from './services/invite.service';
import { InviteController } from './controllers/invite.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from '../authentication/services/authentication.service';
import { TwoFAService } from '../authentication/services/2FA.service';
import { StatsService } from '../stats/stats.service';

@Module({
  imports: [
    SocketServerModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '180m' },
      }),
    }),
  ],
	providers: [ChatSocketGateway, ChatSocketService, ChatMessageService, ChatService, InviteService, PrismaService, TokenService, AuthService, TwoFAService, StatsService],
	controllers: [ChatMessagesController, InviteController],
  exports: [ChatSocketService],
})
export class ChatSocketModule {}
