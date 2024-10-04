import { Test, TestingModule } from '@nestjs/testing';
import { StatsController } from '../stats.controller';
import { StatsService } from '../stats.service';

const mockStatsService = { 
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('StatsController', () => {
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
    statsService = module.get<StatsService>(StatsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll method of StatsService and return the result', async () => {
    const result = [{ id: 1, name: 'Test Stat' }];
    (mockStatsService.findAll as jest.Mock).mockResolvedValue(result);

    const response = await controller.findAll();
    expect(statsService.findAll).toHaveBeenCalled();
    expect(response).toEqual(result); 
  });

});
