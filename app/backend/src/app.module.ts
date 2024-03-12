import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatSocketModule } from './chat/chatsocket.module';
import { TestingModule } from './testing/testing.module';
import { UsersModule } from './users/users.module';
import { GamesocketModule } from './game/gamesocket.module';
import { ChatMessagesController } from './chat/chat.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ChatSocketModule, TestingModule, UsersModule, GamesocketModule],
})
export class AppModule {}
