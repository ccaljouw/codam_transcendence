import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CreateTokenDto } from '@ft_dto/socket';
import { UpdateTokenDto } from '@ft_dto/users/update-token.dto';
import { OnlineStatus } from '@prisma/client';
import { TokenService } from '../token.service';
import { PrismaService } from '../../database/prisma.service';
import { SocketServerProvider } from '../../socket/socketserver.gateway';

// Mock PrismaService
export class mockPrismaService {
  tokens = {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  user = {
    findUnique: jest.fn(),
    update: jest.fn(),
  };
};

const mockSocketServerProvider = {
  socketIO: {
    sockets: {
      sockets: new Map(),
    },
  },
};

describe('TokenService', () => {
  let service: TokenService;
  let prisma: mockPrismaService;

  beforeEach(async () => {
    prisma = new mockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        { provide: PrismaService, useValue: prisma },
        { provide: SocketServerProvider, useValue: mockSocketServerProvider },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findUserIdByToken', () => {
    it('should return userId if token is found', async () => {
      const token = 'valid_token';
      const userId = 1;
      prisma.tokens.findFirst.mockResolvedValue({ userId });

      const result = await service.findUserIdByToken(token);
      expect(result).toEqual(userId);
      expect(prisma.tokens.findFirst).toHaveBeenCalledWith({
        where: { token },
        select: { userId: true },
      });
    });

    it('should return null if token is not found', async () => {
      const token = 'invalid_token';
      prisma.tokens.findFirst.mockResolvedValue(null);

      const result = await service.findUserIdByToken(token);
      expect(result).toBeNull();
    });

    it('should throw an error if something goes wrong', async () => {
      prisma.tokens.findFirst.mockRejectedValue(new Error('Database error'));
      await expect(service.findUserIdByToken('token')).rejects.toThrow('Database error');
    });
  });

  describe('findUserByToken', () => {
    it('should return user if found by token', async () => {
      const token = 'valid_token';
      const userId = 1;
      const mockUser = { id: userId, userName: 'testUser' };
      prisma.tokens.findFirst.mockResolvedValue({ userId });
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findUserByToken(token);
      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
    });

    it('should return null if token is invalid', async () => {
      prisma.tokens.findFirst.mockResolvedValue(null);
      const result = await service.findUserByToken('invalid_token');
      expect(result).toBeNull();
    });

    it('should throw an error if something goes wrong', async () => {
      prisma.tokens.findFirst.mockRejectedValue(new Error('Database error'));
      await expect(service.findUserByToken('token')).rejects.toThrow('Database error');
    });
  });

  describe('addToken', () => {
    it('should create and return a token entry', async () => {
      const createTokenDto: CreateTokenDto = { token: 'new_token', userId: 1 };
      prisma.tokens.create.mockResolvedValue(createTokenDto);

      const result = await service.addToken(createTokenDto);
      expect(result).toEqual(createTokenDto);
      expect(prisma.tokens.create).toHaveBeenCalledWith({
        data: createTokenDto,
      });
    });

    it('should throw NotFoundException if token creation fails', async () => {
      const createTokenDto: CreateTokenDto = { token: 'new_token', userId: 1 };
      prisma.tokens.create.mockResolvedValue(null);

      await expect(service.addToken(createTokenDto)).rejects.toThrow(
        new NotFoundException(`User with token null not found.`),
      );
    });
  });

  describe('updateToken', () => {
    it('should update and return the updated token', async () => {
      const updateTokenDto: UpdateTokenDto = { token: 'token', userId: 1 };
      const mockUpdatedToken = { token: 'token', userId: 1 };
      prisma.tokens.update.mockResolvedValue(mockUpdatedToken);

      const result = await service.updateToken(updateTokenDto);
      expect(result).toEqual(mockUpdatedToken);
      expect(prisma.tokens.update).toHaveBeenCalledWith({
        where: { token: updateTokenDto.token },
        data: updateTokenDto,
      });
    });

    it('should throw NotFoundException if token update fails', async () => {
      const updateTokenDto: UpdateTokenDto = { token: 'token', userId: 1 };
      prisma.tokens.update.mockResolvedValue(null);

      await expect(service.updateToken(updateTokenDto)).rejects.toThrow(
        new NotFoundException(`User with token token not found.`),
      );
    });
  });

  describe('removeToken', () => {
    it('should remove a token and return true if all tokens are removed', async () => {
      const token = 'valid_token';
      const mockTokenUser = { id: 1, userId: 1 };
      prisma.tokens.findUnique.mockResolvedValue(mockTokenUser);
      prisma.tokens.delete.mockResolvedValue(null);
      prisma.tokens.findMany.mockResolvedValue([]);
      prisma.user.update.mockResolvedValue({});

      const result = await service.removeToken(token);
      expect(result).toBe(true);
      expect(prisma.tokens.delete).toHaveBeenCalledWith({
        where: { id: mockTokenUser.id },
      });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockTokenUser.userId },
        data: { online: OnlineStatus.OFFLINE },
      });
    });

    it('should return false if not all tokens are removed', async () => {
      const token = 'valid_token';
      const mockTokenUser = { id: 1, userId: 1 };
      prisma.tokens.findUnique.mockResolvedValue(mockTokenUser);
      prisma.tokens.delete.mockResolvedValue(null);
      prisma.tokens.findMany.mockResolvedValue([{ token: 'another_token' }]);

      const result = await service.removeToken(token);
      expect(result).toBe(false);
    });

    it('should throw an error if something goes wrong during token removal', async () => {
      prisma.tokens.findUnique.mockRejectedValue(new Error('Database error'));
      await expect(service.removeToken('token')).rejects.toThrow('Database error');
    });
  });
});
