import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './authentication/authentication.module';
import { ChatSocketModule } from './sockets/chatsocket/chatsocket.module';
import { TestingModule } from './testing/testing.module';
import { UsersModule } from './users/users.module';
import { GamesocketModule } from './sockets/gamesocket/gamesocket.module';



@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthenticationModule, ChatSocketModule, TestingModule, UsersModule, GamesocketModule],
//   providers: [SocketServerProvider],	
//   exports: [SocketServerProvider]

// @Module({
//   imports: [ConfigModule.forRoot({ isGlobal: true }), AuthenticationModule, TestingModule, UsersModule],
//   controllers: [AppController]
})
export class AppModule {}
