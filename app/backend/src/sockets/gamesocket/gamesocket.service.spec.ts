import { Test, TestingModule } from '@nestjs/testing';
import { GamesocketService } from './gamesocket.service';

describe('GamesocketService', () => {
  let service: GamesocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GamesocketService],
    }).compile();

    service = module.get<GamesocketService>(GamesocketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
