import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatSocketModule } from './chat/chatsocket.module';
import { TestingModule } from './testing/testing.module';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { GameModule } from './game/game.module';
import { LoggerMiddleware } from './logging.middleware';
import { StatsModule } from './stats/stats.module';
import { AvatarModule } from './avatar/avatar.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ChatSocketModule, TestingModule, UsersModule, GameModule, AuthenticationModule, StatsModule, AvatarModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
