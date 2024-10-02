import { Test, TestingModule } from '@nestjs/testing';
import { AvatarController } from '../avatar.controller';
import { AvatarService } from '../avatar.service';
import { ExecutionContext, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';

describe('AvatarController', () => {
  let controller: AvatarController;
  let avatarService: AvatarService;
  let mockResponse: Response;

  beforeEach(async () => {
    const mockAvatarService = {
      uploadFile: jest.fn(), 
      getFilePath: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvatarController],
      providers: [
        { provide: AvatarService, useValue: mockAvatarService },
      ],
    }).compile();

    controller = module.get<AvatarController>(AvatarController);
    avatarService = module.get<AvatarService>(AvatarService);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      sendFile: jest.fn(),
    } as unknown as Response;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadAvatar', () => {
    it('should call AvatarService.uploadFile and return avatar URL', async () => {
      const mockFile = {
        originalname: 'test.png',
        path: '/tmp/test.png', // Adding this to simulate uploaded file
      } as Express.Multer.File;

      const mockAvatarUrl = { avatarUrl: 'http://localhost/avatar/test-uuid.png' };

      (avatarService.uploadFile as jest.Mock).mockResolvedValue(mockAvatarUrl);

      const result = await controller.uploadAvatar(mockFile);
      expect(avatarService.uploadFile).toHaveBeenCalledWith(mockFile);
      expect(result).toEqual(mockAvatarUrl);
    });
  });

  describe('getAvatar', () => {
    it('should return avatar file if it exists', async () => {
      const mockFilePath = '/mock/path/avatar.png';
      jest.spyOn(avatarService, 'getFilePath').mockReturnValue(mockFilePath);
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);

      await controller.getAvatar('avatar.png', mockResponse);
      expect(avatarService.getFilePath).toHaveBeenCalledWith('avatar.png');
      expect(fs.existsSync).toHaveBeenCalledWith(mockFilePath);
      expect(mockResponse.sendFile).toHaveBeenCalledWith(mockFilePath);
    });

    it('should return 404 if file does not exist', async () => {
      const mockFilePath = '/mock/path/avatar.png';
      jest.spyOn(avatarService, 'getFilePath').mockReturnValue(mockFilePath);
      jest.spyOn(fs, 'existsSync').mockReturnValue(false);

      await controller.getAvatar('avatar.png', mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.send).toHaveBeenCalledWith('File not found');
    });
  });

  describe('deleteFile', () => {
    it('should delete file and return success message', () => {
      const mockFilePath = '/mock/path/avatar.png';
      jest.spyOn(fs, 'unlink').mockImplementation((filePath, callback) => {
        callback(null); // Simulate successful deletion
      });

      controller.deleteFile('avatar.png', mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'File deleted successfully',
      });
    });

    it('should return 404 if file is not found', () => {
      const mockError = {
        code: 'ENOENT',
        name: 'Error',
        message: 'File not found',
      } as NodeJS.ErrnoException;

      jest.spyOn(fs, 'unlink').mockImplementation((filePath, callback) => {
        callback(mockError); // Simulate file not found error
      });

      controller.deleteFile('avatar.png', mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'File not found',
      });
    });

    it('should return error if file deletion fails', () => {
      const mockError = new Error('Error deleting file');
      jest.spyOn(fs, 'unlink').mockImplementation((filePath, callback) => {
        callback(mockError); // Simulate internal error during deletion
      });

      controller.deleteFile('avatar.png', mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error deleting file',
      });
    });
  });
});
