import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { PrismaService } from 'src/database/prisma.service';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [StatsController],
  providers: [StatsService, PrismaService],
  exports: [StatsService],
})
export class StatsModule {}
