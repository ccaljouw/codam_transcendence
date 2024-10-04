import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service';
import { TokenService } from '../../users/token.service';
import { UpdateChatUserDto } from '@ft_dto/chat';
import { ChatSocketService } from '../services/chatsocket.service';

const mockPrismaService = {
  tokens: {
    findMany: jest.fn(),
  },
  chatUsers: {
    findUnique: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
  },
};

const mockTokenService = {
  findAllTokensForUser: jest.fn(),
  getTokenEntry: jest.fn(),
  updateToken: jest.fn(),
};

describe('ChatSocketService', () => {
  let chatSocketService: ChatSocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatSocketService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: TokenService, useValue: mockTokenService },
      ],
    }).compile();

    chatSocketService = module.get<ChatSocketService>(ChatSocketService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(chatSocketService).toBeDefined();
  });

  describe('getUserTokenArray', () => {
    it('should return an array of tokens', async () => {
      const userIds = [1, 2, 3];
      const mockTokens = [{ token: 'token1' }, { token: 'token2' }, { token: 'token3' }];
      mockPrismaService.tokens.findMany.mockResolvedValue(mockTokens);

      const result = await chatSocketService.getUserTokenArray(userIds);

      expect(mockPrismaService.tokens.findMany).toHaveBeenCalledWith({
        where: { userId: { in: userIds } },
        select: { token: true },
      });
      expect(result).toEqual(['token1', 'token2', 'token3']);
    });
  });

  describe('getChatUserById', () => {
    it('should return a chat user by chatId and userId', async () => {
      const id = 1;
      const chatId = 1;
      const userId = 2;
      const mockChatUser: UpdateChatUserDto = { id, chatId, userId, isInChatRoom: true };
      mockPrismaService.chatUsers.findUnique.mockResolvedValue(mockChatUser);

      const result = await chatSocketService.getChatUserById(chatId, userId);

      expect(mockPrismaService.chatUsers.findUnique).toHaveBeenCalledWith({
        where: { chatId_userId: { chatId, userId } },
      });
      expect(result).toEqual(mockChatUser);
    });

    it('should return null if chat user is not found', async () => {
      const chatId = 1;
      const userId = 2;
      mockPrismaService.chatUsers.findUnique.mockResolvedValue(null);

      const result = await chatSocketService.getChatUserById(chatId, userId);

      expect(result).toBeNull();
    });
  });

  describe('isUserInChatRoom', () => {
    it('should return true if the user is in the chat room', async () => {
      const chatId = 1;
      const userId = 2;
      const mockTokens = [{ chatId }];
      mockTokenService.findAllTokensForUser.mockResolvedValue(mockTokens);

      const result = await chatSocketService.isUserInChatRoom(chatId, userId);

      expect(result).toBe(true);
    });

    it('should return false if the user is not in the chat room', async () => {
      const chatId = 1;
      const userId = 2;
      const mockTokens = [{ chatId: 3 }];
      mockTokenService.findAllTokensForUser.mockResolvedValue(mockTokens);

      const result = await chatSocketService.isUserInChatRoom(chatId, userId);

      expect(result).toBe(false);
    });
  });

  describe('changeChatUserStatus', () => {
    it('should update chat user status and return updated user', async () => {
      const data = {
        token: 'token1',
        userId: 2,
        chatId: 1,
        isInChatRoom: true,
      };
      const mockCurrentToken = { chatId: 0 };
      const mockUpdatedChatUser: UpdateChatUserDto = {
        id: 1,
        chatId: data.chatId,
        userId: data.userId,
        isInChatRoom: true,
      };

      mockTokenService.getTokenEntry.mockResolvedValue(mockCurrentToken);
      mockTokenService.updateToken.mockResolvedValue(undefined);
      mockPrismaService.chatUsers.update.mockResolvedValue(mockUpdatedChatUser);
      mockTokenService.findAllTokensForUser.mockResolvedValue([{ chatId: 2 }]);

      const result = await chatSocketService.changeChatUserStatus(data);

      expect(mockPrismaService.chatUsers.update).toHaveBeenCalledWith({
        where: { chatId_userId: { chatId: data.chatId, userId: data.userId } },
        data: { isInChatRoom: data.isInChatRoom },
      });
      expect(result).toEqual(mockUpdatedChatUser);
    });

    it('should return null if the user is still in the chat room', async () => {
      const data = {
        token: 'token1',
        userId: 2,
        chatId: 1,
        isInChatRoom: false,
      };
      const mockCurrentToken = { chatId: 1 };
      mockTokenService.getTokenEntry.mockResolvedValue(mockCurrentToken);
      mockTokenService.updateToken.mockResolvedValue(undefined);
      mockTokenService.findAllTokensForUser.mockResolvedValue([{ chatId: 1 }]);

      const result = await chatSocketService.changeChatUserStatus(data);

      expect(result).toBeNull();
    });
  });

  describe('setChatUserOfflineInAllChats', () => {
    it('should set user offline in all chat rooms', async () => {
      const userId = 2;
      const mockChatUsers = [{ id: 1 }, { id: 2 }];
      mockPrismaService.chatUsers.findMany.mockResolvedValue(mockChatUsers);
      mockPrismaService.chatUsers.update.mockResolvedValue(undefined);

      await chatSocketService.setChatUserOfflineInAllChats(userId);

      expect(mockPrismaService.chatUsers.findMany).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(mockPrismaService.chatUsers.update).toHaveBeenCalledTimes(mockChatUsers.length);
    });
  });
});