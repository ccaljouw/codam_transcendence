import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';

// create a mock of this service for use in other tests
export class MockPrismaService {}

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
