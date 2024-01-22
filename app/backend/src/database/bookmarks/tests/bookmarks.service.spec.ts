import { Test, TestingModule } from '@nestjs/testing';
import { BookmarksService } from '../bookmarks.service';
import { MockPrismaService } from '../../prisma/tests/prisma.service.spec';
import { PrismaService } from '../../prisma/prisma.service';

// create a mock of this service for use in other tests
export class MockBookmarksService {}

describe('BookmarksService', () => {
  let service: BookmarksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookmarksService,
        {
          provide: PrismaService,
          useClass: MockPrismaService,
        },
      ],
    }).compile();

    service = module.get<BookmarksService>(BookmarksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
