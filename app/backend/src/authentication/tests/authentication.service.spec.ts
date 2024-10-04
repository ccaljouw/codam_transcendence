import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/authentication.service';
import { PrismaService } from '../../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TwoFAService } from '../services/2FA.service';
import { StatsService } from '../../stats/stats.service';
import { UserProfileDto, CreateUserDto } from '@ft_dto/users';
import { NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { OnlineStatus } from '@prisma/client';

const mockPrismaService = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
  auth: {
    create: jest.fn(),
    update: jest.fn(),
  },
  chat: {
    findUnique: jest.fn(),
  },
  chatAuth: {
    upsert: jest.fn(),
  },
};

const mockJwtService = {
  sign: jest.fn(),
};

const mockTwoFAService = {
  verify2FASecret: jest.fn(),
};

const mockStatsService = {
  create: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: TwoFAService, useValue: mockTwoFAService },
        { provide: StatsService, useValue: mockStatsService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user and return UserProfileDto', async () => {
      const createUserDto: CreateUserDto = {
        loginName: 'testUser',
        userName: 'Test User',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        avatarUrl: 'http://example.com/avatar.png',
        theme: 0,
        volume: 0.5,
      };

      const mockUserProfile: UserProfileDto = {
        id: 1,
        loginName: 'testUser',
        userName: 'Test User',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        avatarUrl: 'http://example.com/avatar.png',
        twoFactEnabled: false,
        theme: 0,
        volume: 0.5,
        online: OnlineStatus.OFFLINE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.create.mockResolvedValue(mockUserProfile);

      const result = await authService.createUser(createUserDto, 'password');

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: createUserDto,
      });
      expect(mockPrismaService.auth.create).toHaveBeenCalledWith({
        data: { userId: mockUserProfile.id, pwd: expect.any(String) },
      });
      expect(mockStatsService.create).toHaveBeenCalledWith(mockUserProfile.id);
      expect(result).toEqual(mockUserProfile);
    });

    it('should throw an error if user creation fails', async () => {
      const createUserDto: CreateUserDto = { loginName: 'testUser' };
      mockPrismaService.user.create.mockRejectedValue(new Error('Failed to create user'));

      await expect(authService.createUser(createUserDto, 'password')).rejects.toThrow(Error);
    });
  });

  // describe('validateUser', () => {
  //   it('should validate a user and return UserProfileDto', async () => {
  //     const mockUser: UserProfileDto = {
  //       id: 1,
  //       loginName: 'testUser',
  //       userName: 'Test User',
  //       email: 'test@example.com',
  //       firstName: 'Test',
  //       lastName: 'User',
  //       avatarUrl: 'http://example.com/avatar.png',
  //       twoFactEnabled: false,
  //       theme: 0,
  //       volume: 0.5,
  //       online: OnlineStatus.OFFLINE,
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     };
  //     mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
  //     const valid = await authService.validateUser('testUser', 'password', '');

  //     expect(valid).toEqual(mockUser);
  //   });

  //   it('should throw UnauthorizedException for invalid password', async () => {
  //     const mockUser: UserProfileDto = {
  //       id: 1,
  //       loginName: 'testUser',
  //       userName: 'Test User',
  //       email: 'test@example.com',
  //       firstName: 'Test',
  //       lastName: 'User',
  //       avatarUrl: 'http://example.com/avatar.png',
  //       twoFactEnabled: false,
  //       theme: 0,
  //       volume: 0.5,
  //       online: OnlineStatus.OFFLINE,
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     };
  //     mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

  //     await expect(authService.validateUser('testUser', 'password', '')).rejects.toThrow(UnauthorizedException);
  //   });

  //   it('should throw UnauthorizedException if user is not found', async () => {
  //     mockPrismaService.user.findUnique.mockResolvedValue(null);

  //     await expect(authService.validateUser('testUser', 'password', '')).rejects.toThrow(UnauthorizedException);
  //   });
  // });

  // describe('registerUser', () => {
  //   it('should register a user and return UserProfileDto', async () => {
  //     const createUserDto: CreateUserDto = { loginName: 'testUser' };
  //     const mockUserProfile: UserProfileDto = {
  //       id: 1,
  //       loginName: 'testUser',
  //       userName: 'Test User',
  //       email: 'test@example.com',
  //       firstName: 'Test',
  //       lastName: 'User',
  //       avatarUrl: 'http://example.com/avatar.png',
  //       twoFactEnabled: false,
  //       theme: 0,
  //       volume: 0.5,
  //       online: OnlineStatus.OFFLINE,
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     };
  //     mockPrismaService.user.create.mockResolvedValue(mockUserProfile);
  //     jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

  //     const result = await authService.registerUser(createUserDto, 'password');

  //     expect(result).toEqual(mockUserProfile);
  //     expect(bcrypt.hash).toHaveBeenCalled();
  //     expect(mockPrismaService.auth.create).toHaveBeenCalledWith({
  //       data: { userId: mockUserProfile.id, pwd: 'hashedPassword' },
  //     });
  //   });
  // });

  // describe('changePwd', () => {
  //   it('should change the password', async () => {
  //     const userId = 1;
  //     const oldPwd = 'oldPassword';
  //     const newPwd = 'newPassword';
  //     const mockUser = {
  //       id: userId,
  //       auth: { pwd: await bcrypt.hash(oldPwd, 10) },
  //     };
  //     mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      
  //     jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as unknown as boolean);
  //     jest.spyOn(bcrypt, 'hash').mockResolvedValue('newHashedPassword' as unknown as string);
  
  //     const result = await authService.changePwd(userId, oldPwd, newPwd);
  
  //     expect(result).toBe(true);
  //     expect(mockPrismaService.auth.update).toHaveBeenCalledWith({
  //       where: { userId },
  //       data: { pwd: 'newHashedPassword' },
  //     });
  //   });
  
  //   it('should throw NotFoundException if user is not found', async () => {
  //     const userId = 1;
  //     const oldPwd = 'oldPassword';
  //     const newPwd = 'newPassword';
  //     mockPrismaService.user.findUnique.mockResolvedValue(null);
  
  //     await expect(authService.changePwd(userId, oldPwd, newPwd)).rejects.toThrow(NotFoundException);
  //   });
  
  //   it('should throw UnauthorizedException for incorrect old password', async () => {
  //     const userId = 1;
  //     const oldPwd = 'wrongOldPassword';
  //     const newPwd = 'newPassword';
  //     const mockUser = {
  //       id: userId,
  //       auth: { pwd: await bcrypt.hash('oldPassword', 10) },
  //     };
  //     mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      
  //     jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as unknown as boolean);
  
  //     await expect(authService.changePwd(userId, oldPwd, newPwd)).rejects.toThrow(UnauthorizedException);
  //   });
  // });
});
