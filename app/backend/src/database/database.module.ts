import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UsersController } from '../users/users.controller';
import { PrismaService } from './prisma.service';

@Module({
  controllers: [UsersController],
  providers: [PrismaService, UsersService],
  exports: [PrismaService, UsersService],
})
export class DatabaseModule {}
