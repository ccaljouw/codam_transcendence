import { Module } from '@nestjs/common';
import { AuthService } from './authentication.service';
import { AuthController } from './authentication.controller';
import { UsersService } from 'src/users/users.service';
import { DatabaseModule } from 'src/database/database.module';
import { StatsService } from 'src/stats/stats.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService, UsersService, StatsService],
})
export class AuthenticationModule {}
