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

@Module({
  imports: [SocketServerModule],
	providers: [ChatSocketGateway, ChatSocketService, ChatMessageService, ChatService, InviteService, PrismaService, TokenService],
	controllers: [ChatMessagesController, InviteController],
})
export class ChatSocketModule {}
