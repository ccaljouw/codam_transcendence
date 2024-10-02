import { Test, TestingModule } from '@nestjs/testing';
import { ChatMessagesController } from '../controllers/chat.controller';

describe('ChatController', () => {
  let controller: ChatMessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatMessagesController],
    }).compile();

    controller = module.get<ChatMessagesController>(ChatMessagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
