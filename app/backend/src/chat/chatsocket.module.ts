import { Module } from '@nestjs/common';
import { ChatSocketService } from './chatsocket.service';
import { ChatSocketGateway } from './chatsocket.gateway';
import { PrismaService } from 'src/database/prisma.service';
import { SocketServerModule } from '../socket/socketserver.module';
import { ChatMessagesController } from './chat-messages.controller';

@Module({
  imports: [SocketServerModule],
	providers: [ChatSocketGateway, ChatSocketService, PrismaService],
	controllers: [ChatMessagesController],
})
export class ChatSocketModule {}
