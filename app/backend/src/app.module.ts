import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './authentication/authentication.module';
import { TestingModule } from './testing/testing.module';
import { AppController } from './app.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthenticationModule, TestingModule],
  controllers: [AppController],
})
export class AppModule {}
