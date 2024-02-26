import { Module } from '@nestjs/common';
import { ChatSocketService } from './chatsocket.service';
import { ChatSocketGateway } from './chatsocket.gateway';
import { PrismaService } from 'src/database/prisma.service';
import { SocketServerModule } from '../socket/socketserver.module';

@Module({
  imports: [SocketServerModule],
	providers: [ChatSocketGateway, ChatSocketService, PrismaService],
})
export class ChatSocketModule {}
