import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './authentication/authentication.module';
import { WebsiteModule } from './website/website.module';
import { TestingModule } from './testing/testing.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthenticationModule, WebsiteModule, TestingModule],
})
export class AppModule {}
