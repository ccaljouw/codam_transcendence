import { Test, TestingModule } from '@nestjs/testing';
import { GamesocketGateway } from '../gamesocket.gateway';
import { GameService } from '../game.service';

describe('GamesocketGateway', () => {
  let gateway: GamesocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GamesocketGateway, GameService],
    }).compile();

    gateway = module.get<GamesocketGateway>(GamesocketGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
