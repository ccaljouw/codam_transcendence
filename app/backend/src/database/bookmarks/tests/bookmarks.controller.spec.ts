import { Test, TestingModule } from '@nestjs/testing';
import { BookmarksController } from '../bookmarks.controller';
import { BookmarksService } from '../bookmarks.service';
import { MockBookmarksService } from './bookmarks.service.spec';

// create a mock of this service for use in other tests
export class MockBookmarksController {}

describe('BookmarksController', () => {
  let controller: BookmarksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookmarksController],
      providers: [
        {
          provide: BookmarksService,
          useClass: MockBookmarksService,
        },
      ],
    }).compile();

    controller = module.get<BookmarksController>(BookmarksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
