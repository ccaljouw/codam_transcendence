import { Test, TestingModule } from '@nestjs/testing';
import { ChatSocketService } from './chatsocket.service';

describe('GameService', () => {
  let service: ChatSocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatSocketService],
    }).compile();

    service = module.get<ChatSocketService>(ChatSocketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
