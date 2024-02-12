import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './authentication/authentication.module';
import { WebsiteModule } from './website/website.module';
// import { WebsocketTestGateway } from './websocket_test/websocket_test.gateway';
import { GameModule } from './game/game.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthenticationModule, WebsiteModule, GameModule],
//   providers: [],
})
export class AppModule {}
