import { Module } from '@nestjs/common';
import { AuthService } from './authentication.service';
import { AuthController } from './authentication.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthenticationModule {}
