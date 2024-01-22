import { Injectable } from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarksService {
  constructor(private db: PrismaService) {}

  create(createBookmarkDto: CreateBookmarkDto) {
    return this.db.bookmark.create({ data: createBookmarkDto });
  }

  findAll() {
    return this.db.bookmark.findMany({});
  }

  findOne(id: number) {
    return this.db.bookmark.findUnique({ where: { id } });
  }

  update(id: number, updateBookmarkDto: UpdateBookmarkDto) {
    return this.db.bookmark.update({
      where: { id },
      data: updateBookmarkDto,
    });
  }

  remove(id: number) {
    return this.db.bookmark.delete({ where: { id } });
  }
}
