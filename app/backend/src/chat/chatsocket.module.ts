import { Module } from '@nestjs/common';
import { ChatSocketService } from './chatsocket.service';
import { ChatSocketGateway } from './chatsocket.gateway';
import { PrismaService } from 'src/database/prisma.service';
import { SocketServerModule } from '../socket/socketserver.module';
import { ChatMessagesController } from './chat.controller';
import { ChatMessageService } from './chat-messages.service';
import { ChatService } from './chat.service';

@Module({
  imports: [SocketServerModule],
	providers: [ChatSocketGateway, ChatSocketService, ChatMessageService, ChatService, PrismaService],
	controllers: [ChatMessagesController],
})
export class ChatSocketModule {}
