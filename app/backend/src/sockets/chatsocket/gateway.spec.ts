import { Test, TestingModule } from '@nestjs/testing';
import { ChatSocketGateway } from './chatsocket.gateway';
import { ChatSocketService } from './chatsocket.service';

describe('GameGateway', () => {
  let gateway: ChatSocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatSocketGateway, ChatSocketService],
    }).compile();

    gateway = module.get<ChatSocketGateway>(ChatSocketGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
