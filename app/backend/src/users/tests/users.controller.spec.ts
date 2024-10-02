import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { TokenService } from '../token.service';
import { NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { OnlineStatus } from '@prisma/client';
import { ExecutionContext } from '@nestjs/common';
import { UserProfileDto, UpdateUserDto} from '@ft_dto/users';
import { CreateTokenDto } from '@ft_dto/socket';


const mockUserService = {
  findAll: jest.fn(),
  findUserName: jest.fn(),
  findAllButMe: jest.fn(),
  findFriendsFrom: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  blockUser: jest.fn(),
  unBlockUser: jest.fn(),
};

const mockTokenService = {
  addTokenWithStaleCheck: jest.fn(),
};

const mockJwtAuthGuard = jest.fn().mockImplementation(() => {
  return {
    canActivate: (context: ExecutionContext) => {
      return true; // Simulate an authenticated user
    },
  };
});


describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;
  let tokenService: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUserService },
        { provide: TokenService, useValue: mockTokenService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    tokenService = module.get<TokenService>(TokenService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset the mocks after each test
  });

  const mockUser: UserProfileDto = {
    id: 1,
    loginName: 'testLogin',
    userName: 'testUser',
    email: 'testuser@example.com',
    firstName: 'Test',
    lastName: 'User',
    twoFactEnabled: true,
    avatarUrl: 'http://avatar.url',
    theme: 1,
    volume: 0.5,
    online: OnlineStatus.ONLINE,
    createdAt: new Date(),
    updatedAt: new Date(),
    friends: [],
    blocked: [],
  };

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addToken', () => {
    it('should add a token and return true', async () => {
      const createTokenDto: CreateTokenDto = { token: '12345', userId: 1 };
      mockTokenService.addTokenWithStaleCheck.mockResolvedValue(true);

      const result = await controller.addToken(createTokenDto);
      expect(result).toBe(true);
      expect(tokenService.addTokenWithStaleCheck).toHaveBeenCalledWith(
        createTokenDto,
      );
    });

    it('should handle error when adding a token', async () => {
      const createTokenDto: CreateTokenDto = { token: '12345', userId: 1 };
      mockTokenService.addTokenWithStaleCheck.mockRejectedValue(new Error('Failed'));

      await expect(controller.addToken(createTokenDto)).rejects.toThrow('Failed');
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers: UserProfileDto[] = [mockUser];
      mockUserService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.findAll();
      expect(result).toEqual(mockUsers);
      expect(usersService.findAll).toHaveBeenCalled();
    });

    it('should handle when no users are found', async () => {
      mockUserService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();
      expect(result).toEqual([]);
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findUserName', () => {
    it('should return a user by username', async () => {
      mockUserService.findUserName.mockResolvedValue(mockUser);

      const result = await controller.findUserName('testUser');
      expect(result).toEqual(mockUser);
      expect(usersService.findUserName).toHaveBeenCalledWith('testUser');
    });

    it('should throw NotFoundException when the user is not found', async () => {
      mockUserService.findUserName.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(controller.findUserName('nonExistentUser')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const updateUserDto: UpdateUserDto = {
        userName: 'updatedUser',
        loginName: 'updatedLogin',
      };
      const updatedUser = { ...mockUser, userName: 'updatedUser' };
      mockUserService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(1, updateUserDto);
      expect(result).toEqual(updatedUser);
      expect(usersService.update).toHaveBeenCalledWith(1, updateUserDto);
    });

    it('should throw ConflictException when update violates constraints', async () => {
      const updateUserDto: UpdateUserDto = {
        userName: 'duplicateUser',
        loginName: 'duplicateLogin',
      };
      mockUserService.update.mockRejectedValue(
        new ConflictException('Unique constraint failed'),
      );

      await expect(controller.update(1, updateUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findFriendsFrom', () => {
    it('should return the friends of a user', async () => {
      const mockFriend: UserProfileDto = { ...mockUser, id: 2, userName: 'friendUser' };
      mockUserService.findFriendsFrom.mockResolvedValue([mockFriend]);

      const result = await controller.findFriendsFrom(1);
      expect(result).toEqual([mockFriend]);
      expect(usersService.findFriendsFrom).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if no friends are found', async () => {
      mockUserService.findFriendsFrom.mockRejectedValue(
        new NotFoundException('No friends found'),
      );

      await expect(controller.findFriendsFrom(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('blockUser', () => {
    it('should block a user successfully', async () => {
      const blockedUser: UserProfileDto = {
        ...mockUser,
        blocked: [{ id: 2, userName: 'blockedUser' } as UserProfileDto],
      };
      mockUserService.blockUser.mockResolvedValue(blockedUser);

      const result = await controller.blockUser(1, 2);
      expect(result).toEqual(blockedUser);
      expect(usersService.blockUser).toHaveBeenCalledWith(1, 2);
    });

    it('should handle blocking an already blocked user', async () => {
      mockUserService.blockUser.mockRejectedValue(
        new ConflictException('User is already blocked'),
      );

      await expect(controller.blockUser(1, 2)).rejects.toThrow(ConflictException);
    });
  });

  describe('unblockUser', () => {
    it('should unblock a user successfully', async () => {
      const unblockedUser: UserProfileDto = { ...mockUser, blocked: [] };
      mockUserService.unBlockUser.mockResolvedValue(unblockedUser);

      const result = await controller.unblockUser(1, 2);
      expect(result).toEqual(unblockedUser);
      expect(usersService.unBlockUser).toHaveBeenCalledWith(1, 2);
    });

    it('should throw NotFoundException if user is not blocked', async () => {
      mockUserService.unBlockUser.mockRejectedValue(
        new NotFoundException('User is not blocked'),
      );

      await expect(controller.unblockUser(1, 2)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll with JwtAuthGuard', () => {
    it('should return all users if authenticated', async () => {
      const mockUsers: UserProfileDto[] = [mockUser];
      mockUserService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.findAll();
      expect(result).toEqual(mockUsers);
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });

  // Test for un-authenticated behavior
  describe('Unauthenticated cases', () => {
    beforeEach(() => {
      // Override to simulate unauthenticated access
      mockJwtAuthGuard.mockImplementationOnce(() => ({
        canActivate: () => false, // Simulate failed authentication
      }));
    });

    it('should deny access when authentication fails', async () => {
      await expect(controller.findAll()).rejects.toThrow(ForbiddenException);
    });
  });
});
