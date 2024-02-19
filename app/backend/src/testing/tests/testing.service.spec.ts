import { Test, TestingModule } from '@nestjs/testing';
import { TestingService } from '../services/testing.service';
import { SeedService } from '../services/seed.service';
import { MockSeedService } from './seed.service.spec';

export class MockTestingService {}

describe('TestingService', () => {
  let service: TestingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestingService,
        {
          provide: SeedService,
          useClass: MockSeedService,
        },
      ],
    }).compile();

    service = module.get<TestingService>(TestingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
