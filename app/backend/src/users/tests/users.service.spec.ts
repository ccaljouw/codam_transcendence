import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { PrismaService } from '../../database/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { InviteStatus } from '@prisma/client';

// Mock PrismaService for testing
export class MockPrismaService {
  user = {
    update: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
  };
  invite = {
    findMany: jest.fn(),
    update: jest.fn(),
  };
}

const mockUser = {
  id: 1,
  userName: 'testUser',
  friends: [],
  blocked: [],
};

const mockFriend = {
  id: 2,
  userName: 'friendUser',
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: MockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useClass: MockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<MockPrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset the mocks after each test
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('update', () => {
    it('should update a user and return the updated user profile', async () => {
      const userId = 1;
      const updateUserDto = { userName: 'newUserName' };
      const mockUpdatedUser = { ...mockUser, userName: 'newUserName' };

      prisma.user.update.mockResolvedValue(mockUpdatedUser);

      const result = await service.update(userId, updateUserDto);
      expect(result).toEqual(mockUpdatedUser);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateUserDto,
        include: {
          friends: { orderBy: [{ online: 'desc' }, { userName: 'asc' }] },
          blocked: true,
        },
      });
      expect(prisma.user.update).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if update fails', async () => {
      const userId = 1;
      const updateUserDto = { userName: 'newUserName' };

      prisma.user.update.mockRejectedValue(new Error('Error updating user'));

      await expect(service.update(userId, updateUserDto)).rejects.toThrow('Error updating user');
      expect(prisma.user.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllButMe', () => {
    it('should return all users except the one with the given ID', async () => {
      const userId = 1;
      const mockUsers = [{ id: 2, userName: 'user2' }, { id: 3, userName: 'user3' }];

      prisma.user.findMany.mockResolvedValue(mockUsers);

      const result = await service.findAllButMe(userId);
      expect(result).toEqual(mockUsers);
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: { id: { not: userId }, loginName: { not: 'AI' } },
        orderBy: [{ online: 'desc' }, { userName: 'asc' }],
      });
      expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if it fails to retrieve users', async () => {
      const userId = 1;
      prisma.user.findMany.mockRejectedValue(new Error('Error retrieving users'));

      await expect(service.findAllButMe(userId)).rejects.toThrow('Error retrieving users');
      expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findFriendsFrom', () => {
    it('should return friends of a user by ID', async () => {
      const userId = 1;
      const mockFriends = [{ id: 2, name: 'Friend1' }, { id: 3, name: 'Friend2' }];
      prisma.user.findUnique.mockResolvedValue({ friends: mockFriends });
    
      const result = await service.findFriendsFrom(userId);
      expect(result).toEqual(mockFriends);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        include: { friends: true },
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = 1;

      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.findFriendsFrom(userId)).rejects.toThrow(
        new NotFoundException(`User with id ${userId} not found.`),
      );
    });
  });

  describe('blockUser', () => {
    it('should block a user and expire/reject invites', async () => {
      const userId = 1;
      const blockId = 2;
      const mockUser = {
        id: userId,
        friends: [{ id: 3 }],
        blocked: [{ id: blockId }],
      };

      prisma.user.update.mockResolvedValue(mockUser);
      prisma.invite.findMany.mockResolvedValue([{ id: 1, state: InviteStatus.SENT }]);
      prisma.invite.update.mockResolvedValue({ id: 1, state: InviteStatus.EXPIRED });

      const result = await service.blockUser(userId, blockId);
      expect(result).toEqual(mockUser);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          blocked: {
            connect: { id: blockId },
          },
        },
        include: {
          friends: true,
          blocked: true,
        },
      });
      expect(prisma.invite.update).toHaveBeenCalledTimes(1);
      expect(prisma.user.update).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if user is not found during block', async () => {
      const userId = 1;
      const blockId = 2;

      prisma.user.update.mockResolvedValue(null);

      await expect(service.blockUser(userId, blockId)).rejects.toThrow(
        new NotFoundException(`User ${userId} not found.`),
      );
      expect(prisma.user.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('unFriend', () => {
    it('should unfriend a user', async () => {
      const userId = 1;
      const friendId = 2;
      const mockUser = { id: userId, friends: [], blocked: [] };

      prisma.user.update.mockResolvedValue(mockUser);

      const result = await service.unFriend(userId, friendId);
      expect(result).toEqual(mockUser);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          friends: {
            disconnect: { id: friendId },
          },
        },
        include: {
          friends: true,
          blocked: true,
        },
      });
      expect(prisma.user.update).toHaveBeenCalledTimes(2); // Two updates for unfriend operation
    });
  });

  describe('unBlockUser', () => {
    it('should unblock a user and return the updated user', async () => {
      const userId = 1;
      const unblockId = 2;
      const mockUser = { id: userId, blocked: [], friends: [] };

      prisma.user.update.mockResolvedValue(mockUser);

      const result = await service.unBlockUser(userId, unblockId);
      expect(result).toEqual(mockUser);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          blocked: { disconnect: { id: unblockId } },
        },
        include: { friends: true, blocked: true },
      });
    });
  });
});
