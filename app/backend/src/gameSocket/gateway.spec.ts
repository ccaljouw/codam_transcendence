import { Test, TestingModule } from '@nestjs/testing';
import { GameSocketGateway } from './gamesocket.gateway';
import { GameSocketService } from './gamesocket.service';

describe('GameGateway', () => {
  let gateway: GameSocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameSocketGateway, GameSocketService],
    }).compile();

    gateway = module.get<GameSocketGateway>(GameSocketGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
