import { Test, TestingModule } from '@nestjs/testing';
import { StatsController } from '../stats.controller';
import { StatsService } from '../stats.service';


const mockStatsService = { 
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}

describe('StatsController', () => {
  // let controller: StatsController;

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     controllers: [StatsController],
  //     providers: [StatsService],
  //   }).compile();

  //   controller = module.get<StatsController>(StatsController);
  // });
  let controller: StatsController;
  let statsService: StatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatsController],
      providers: [
        { provide: StatsService, useValue: mockStatsService },
      ],
    }).compile();

    controller = module.get<StatsController>(StatsController);
    statsService = module.get<StatsService>(statsService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset the mocks after each test
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
