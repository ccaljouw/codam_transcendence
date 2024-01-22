import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsersService } from './users/users.service';
import { BookmarksService } from './bookmarks/bookmarks.service';
import { UsersController } from './users/users.controller';
import { BookmarksController } from './bookmarks/bookmarks.controller';

@Module({
  controllers: [UsersController, BookmarksController],
  providers: [PrismaService, UsersService, BookmarksService],
  exports: [PrismaService, UsersService, BookmarksService],
})
export class DatabaseModule {}
