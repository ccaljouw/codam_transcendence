import { Test, TestingModule } from '@nestjs/testing';
import { StatsService } from '../stats.service';
import { PrismaService } from '../../database/prisma.service';

export class mockPrismaService {
  user = {
    update: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
  };
  invite = {
    findMany: jest.fn(),
    update: jest.fn(),
  };
}

describe('StatsService', () => {
  let service: StatsService;
  let prisma: mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatsService,
        {
          provide: PrismaService,
          useClass: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<StatsService>(StatsService);
    prisma = module.get<mockPrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset the mocks after each test
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
