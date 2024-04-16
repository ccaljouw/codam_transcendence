import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'
import { AuthService } from './authentication.service';
import { AuthController } from './authentication.controller';
import { UsersService } from 'src/users/users.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [AuthController],
  providers: [AuthService, UsersService],
})
export class AuthenticationModule {}
