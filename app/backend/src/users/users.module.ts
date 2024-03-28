import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/database/prisma.service';
import { SocketServerModule } from 'src/socket/socketserver.module';
import { TokenService } from './token.service';

@Module({
	imports:	[SocketServerModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, TokenService],
  exports: [UsersService],
})
export class UsersModule {}
