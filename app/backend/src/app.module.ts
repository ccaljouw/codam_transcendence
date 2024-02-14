import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TestingModule } from './testing/testing.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TestingModule, UsersModule],
})
export class AppModule {}
