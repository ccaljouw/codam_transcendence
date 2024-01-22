import {
  Controller,
  ParseIntPipe,
  Body,
  Param,
  Get,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BookmarkEntity } from './dto/bookmark.entity';

@Controller('bookmarks')
@ApiTags('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  @ApiCreatedResponse({ type: BookmarkEntity })
  create(@Body() createBookmarkDto: CreateBookmarkDto) {
    return this.bookmarksService.create(createBookmarkDto);
  }

  @Get()
  @ApiOkResponse({ type: BookmarkEntity, isArray: true })
  findAll() {
    return this.bookmarksService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: BookmarkEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookmarksService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: BookmarkEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
  ) {
    return this.bookmarksService.update(id, updateBookmarkDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: BookmarkEntity })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookmarksService.remove(id);
  }
}
