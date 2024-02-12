import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './authentication/authentication.module';
// import { WebsiteModule } from './website/website.module';
// import { WebsocketTestGateway } from './websocket_test/websocket_test.gateway';
import { GameModule } from './game/game.module';
import { TestingModule } from '@nestjs/testing';
import { UsersModule } from './users/users.module';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthenticationModule, GameModule, TestingModule, UsersModule],
//   providers: [],

// @Module({
//   imports: [ConfigModule.forRoot({ isGlobal: true }), AuthenticationModule, TestingModule, UsersModule],
//   controllers: [AppController],
})
export class AppModule {}
