import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from '../game.controller';
import { GameService } from '../game.service';

const mockGameService = {
  createGameWithPlayer1: jest.fn(),
  createAiGame: jest.fn(),
  addSecondPlayer: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findInviteGameId: jest.fn(),
  findRandomGame: jest.fn(),
  findInviteGame: jest.fn(),
  disconnect: jest.fn(),
  remove: jest.fn(),
  update: jest.fn(),
  updateGameUser: jest.fn(),
};

describe('GameController', () => {
  let controller: GameController;
  let gameService: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [
        { provide: GameService, useValue: mockGameService },
      ],
    }).compile();

    controller = module.get<GameController>(GameController);
    gameService = module.get<GameService>(GameService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
