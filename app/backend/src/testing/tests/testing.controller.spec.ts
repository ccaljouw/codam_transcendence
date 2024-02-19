import { Test, TestingModule } from '@nestjs/testing';
import { TestingController } from '../testing.controller';
import { TestingService } from '../services/testing.service';
import { MockTestingService } from './testing.service.spec';
import { SeedService } from '../services/seed.service';
import { MockSeedService } from './seed.service.spec';

describe('TestingController', () => {
  let controller: TestingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestingController],
      providers: [
      {
        provide: TestingService,
        useClass: MockTestingService,
      },
      {
        provide: SeedService,
        useClass: MockSeedService,
      },
    ],
    }).compile();

    controller = module.get<TestingController>(TestingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
