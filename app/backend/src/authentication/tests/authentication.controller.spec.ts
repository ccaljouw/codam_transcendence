import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../controllers/authentication.controller';
import { AuthService } from '../services/authentication.service';
import { ConfigService } from '@nestjs/config';
import { UserProfileDto } from '@ft_dto/users';
import { ChatAuthDto, UpdatePwdDto } from '@ft_dto/authentication';
import { Request, Response } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { OnlineStatus } from '@prisma/client';

const mockAuthService = {
  registerUser: jest.fn(),
  setJwtCookie: jest.fn(),
  deleteJwtCookie: jest.fn(),
  changePwd: jest.fn(),
  checkAuth: jest.fn(),
  validateChatLogin: jest.fn(),
  setChatCookie: jest.fn(),
  setChatPassword: jest.fn(),
};

const mockConfigService = {
  get: jest.fn(),
};

const mockRequest = () => ({
  user: {},
  body: {},
  cookies: {},
});

const mockResponse = (): Partial<Response> => ({
  redirect: jest.fn(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  clearCookie: jest.fn(),
  send: jest.fn(),
  sendStatus: jest.fn(),
});

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let configService: ConfigService;
  let req: Request;
  let res: Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
    req = mockRequest() as Request;
    res = mockResponse() as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('fortyTwoAuth', () => {
    it('should call the fortyTwoAuth function', async () => {
      await expect(authController.fortyTwoAuth()).resolves.toBeUndefined();
    });
  });

  describe('fortyTwoAuthRedirect', () => {
    it('should redirect to the frontend URL with user ID', async () => {
      const user: UserProfileDto = { id: 1, loginName: 'testUser', userName: 'Test User', email: 'test@example.com', firstName: 'Test', lastName: 'User', twoFactEnabled: false, avatarUrl: '', theme: 0, volume: 0, online: OnlineStatus.ONLINE , createdAt: new Date(), updatedAt: new Date() };
      req.user = user;
      mockConfigService.get.mockReturnValue('http://frontend.url');

      await authController.fortyTwoAuthRedirect(req, res);

      expect(mockAuthService.setJwtCookie).toHaveBeenCalledWith(user, req);
      expect(res.redirect).toHaveBeenCalledWith('http://frontend.url/auth?user=1');
    });

    it('should throw UnauthorizedException if no user is found', async () => {
      req.user = null;

      await expect(authController.fortyTwoAuthRedirect(req, res)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should register a user and set JWT cookie', async () => {
      const user: UserProfileDto = { id: 1, loginName: 'testUser', userName: 'Test User', email: 'test@example.com', firstName: 'Test', lastName: 'User', twoFactEnabled: false, avatarUrl: '', theme: 0, volume: 0, online: OnlineStatus.ONLINE, createdAt: new Date(), updatedAt: new Date() };
      req.body = { createUser: {}, pwd: 'password' };
      mockAuthService.registerUser.mockResolvedValue(user);

      const result = await authController.register(req);

      expect(mockAuthService.registerUser).toHaveBeenCalledWith(req.body.createUser, req.body.pwd);
      expect(mockAuthService.setJwtCookie).toHaveBeenCalledWith(user, req);
      expect(result).toEqual(user);
    });

    it('should throw UnauthorizedException if user registration fails', async () => {
      req.body = { createUser: {}, pwd: 'password' };
      mockAuthService.registerUser.mockResolvedValue(null);

      await expect(authController.register(req)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should log in the user and set JWT cookie', async () => {
      const user: UserProfileDto = { id: 1, loginName: 'testUser', userName: 'Test User', email: 'test@example.com', firstName: 'Test', lastName: 'User', twoFactEnabled: false, avatarUrl: '', theme: 0, volume: 0, online: OnlineStatus.ONLINE, createdAt: new Date(), updatedAt: new Date() };
      req.user = user;

      const result = await authController.login(req);

      expect(result).toEqual(user);
      expect(mockAuthService.setJwtCookie).toHaveBeenCalledWith(user, req);
    });

    it('should throw UnauthorizedException if no user is found', async () => {
      req.user = null;

      await expect(authController.login(req)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should call deleteJwtCookie', async () => {
      await authController.logout(req);
      expect(mockAuthService.deleteJwtCookie).toHaveBeenCalledWith(req);
    });
  });

  describe('changePwd', () => {
    it('should change the user password', async () => {
      const updatePwdDto: UpdatePwdDto = { userId: 1, oldPwd: 'oldPassword', newPwd: 'newPassword' };
      req.body = updatePwdDto;

      await authController.changePwd(updatePwdDto);

      expect(mockAuthService.changePwd).toHaveBeenCalledWith(updatePwdDto.userId, updatePwdDto.oldPwd, updatePwdDto.newPwd);
    });
  });

  describe('checkId', () => {
    it('should return user if ID is valid', async () => {
      const user: UserProfileDto = { id: 1, loginName: 'testUser', userName: 'Test User', email: 'test@example.com', firstName: 'Test', lastName: 'User', twoFactEnabled: false, avatarUrl: '', theme: 0, volume: 0, online: OnlineStatus.ONLINE, createdAt: new Date(), updatedAt: new Date() };
      req.user = user;
      req.params = { id: '1' };

      const result = await authController.checkId(req);

      expect(result).toEqual(user);
    });

    it('should throw UnauthorizedException if ID is invalid', async () => {
      const user: UserProfileDto = { id: 1, loginName: 'testUser', userName: 'Test User', email: 'test@example.com', firstName: 'Test', lastName: 'User', twoFactEnabled: false, avatarUrl: '', theme: 0, volume: 0, online: OnlineStatus.ONLINE, createdAt: new Date(), updatedAt: new Date() };
      req.user = user;
      req.params = { id: '2' };

      await expect(authController.checkId(req)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('checkAuth', () => {
    it('should call authService.checkAuth with the given ID', async () => {
      const id = 1;
      const expectedResponse = { isAuthorized: true };
      mockAuthService.checkAuth.mockResolvedValue(expectedResponse);

      const result = await authController.checkAuth(id);

      expect(mockAuthService.checkAuth).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('loginChat', () => {
    it('should log in the chat and set chat cookie', async () => {
      const chatAuthDto: ChatAuthDto = { chatId: 1, pwd: 'chatPassword' };
      req.body = chatAuthDto;
      const expectedChatResponse = { id: chatAuthDto.chatId };

      mockAuthService.validateChatLogin.mockResolvedValue(expectedChatResponse);

      const result = await authController.loginChat(req, chatAuthDto);

      expect(mockAuthService.validateChatLogin).toHaveBeenCalledWith(chatAuthDto.chatId, chatAuthDto.pwd);
      expect(mockAuthService.setChatCookie).toHaveBeenCalledWith(expectedChatResponse, req);
      expect(result).toEqual(expectedChatResponse);
    });
  });

  describe('setChatPassword', () => {
    it('should set chat password', async () => {
      const chatAuthDto: ChatAuthDto = { chatId: 1, pwd: 'newChatPassword' };
      req.body = chatAuthDto;

      await authController.setChatPassword(chatAuthDto);

      expect(mockAuthService.setChatPassword).toHaveBeenCalledWith(chatAuthDto.chatId, chatAuthDto.pwd);
    });
  });

  describe('resetAuthCookies', () => {
    it('should clear authentication-related cookies', async () => {
      req.cookies = { jwt: 'token1', chatToken: 'token2', otherCookie: 'value' };

      await authController.resetAuthCookies(req, res);

      expect(res.clearCookie).toHaveBeenCalledWith('jwt', expect.any(Object));
      expect(res.clearCookie).toHaveBeenCalledWith('chatToken', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Authentication-related cookies cleared' });
    });

    // it('should return a 500 status if an error occurs', async () => {
    //   req.cookies = {};
    //   jest.spyOn(console, 'log').mockImplementation(() => { }); // Suppress console log in tests
    //   const error = new Error('Clearing cookies failed');
    //   jest.spyOn(res, 'clearCookie').mockImplementation(() => { throw error; });

    //   await authController.resetAuthCookies(req, res);

    //   expect(res.status).toHaveBeenCalledWith(500);
    //   expect(res.json).toHaveBeenCalledWith({ message: 'Failed to clear cookies' });
    // });
  });
});
