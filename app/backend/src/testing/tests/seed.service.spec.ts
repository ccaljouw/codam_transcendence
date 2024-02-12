import { Test, TestingModule } from '@nestjs/testing';
import { SeedService } from '../services/seed.service';
import { PrismaService } from '../../database/prisma.service';
import { MockPrismaService } from '../../database/tests/prisma.service.spec';

export class MockSeedService {}

describe('SeedService', () => {
  let service: SeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        {
          provide: PrismaService,
          useClass: MockPrismaService,
        }
      ],
    }).compile();

    service = module.get<SeedService>(SeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
