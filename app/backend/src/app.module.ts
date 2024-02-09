import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebsiteModule } from './website/website.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), WebsiteModule, UsersModule],
})
export class AppModule {}
