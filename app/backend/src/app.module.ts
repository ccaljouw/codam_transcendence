import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatSocketModule } from './chat/chatsocket.module';
import { TestingModule } from './testing/testing.module';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ChatSocketModule, TestingModule, UsersModule, GameModule, AuthenticationModule],
})
export class AppModule {}
