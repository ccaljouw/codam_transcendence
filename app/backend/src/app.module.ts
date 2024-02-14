import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './authentication/authentication.module';
// import { WebsiteModule } from './website/website.module';
// import { WebsocketTestGateway } from './websocket_test/websocket_test.gateway';
import { GameSocketModule } from './gameSocket/gamesocket.module';
import { TestingModule } from './testing/testing.module';
import { UsersModule } from './users/users.module';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthenticationModule, GameSocketModule, TestingModule, UsersModule],
//   providers: [],

// @Module({
//   imports: [ConfigModule.forRoot({ isGlobal: true }), AuthenticationModule, TestingModule, UsersModule],
//   controllers: [AppController]
})
export class AppModule {}
