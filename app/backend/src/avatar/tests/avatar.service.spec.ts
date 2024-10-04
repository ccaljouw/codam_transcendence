import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { AvatarService } from '../avatar.service';

jest.mock('fs');
jest.mock('path');
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('AvatarService', () => {
  let avatarService: AvatarService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockFile = {
    originalname: 'test.png',
    path: '/tmp/test.png',
  } as Express.Multer.File;

  const mockFilename = 'test-uuid.png';
  const mockBackendUrl = 'http://localhost:3000';
  const mockAvatarPath = '/mocked/path/test-uuid.png';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvatarService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    avatarService = module.get<AvatarService>(AvatarService);
    configService = module.get<ConfigService>(ConfigService);

    (uuidv4 as jest.Mock).mockReturnValue('test-uuid');
    (path.extname as jest.Mock).mockReturnValue('.png');
    (path.join as jest.Mock).mockReturnValue(mockAvatarPath);
    mockConfigService.get.mockReturnValue(mockBackendUrl);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadFile', () => {

    it('should be defined', () => {
      expect(avatarService).toBeDefined();
    });

    // it('should upload the file and return the avatar URL', () => {
    //   const expectedUrl = `${mockBackendUrl}/avatar/${mockFilename}`;

    //   const result = avatarService.uploadFile(mockFile);

    //   expect(uuidv4).toHaveBeenCalled();
    //   expect(path.extname).toHaveBeenCalledWith(mockFile.originalname);
    //   expect(path.join).toHaveBeenCalledWith(
    //     __dirname,
    //     '../../../../',
    //     'shared/avatars',
    //     mockFilename,
    //   );
    //   expect(fs.renameSync).toHaveBeenCalledWith(mockFile.path, mockAvatarPath);
    //   expect(result).toEqual({ avatarUrl: expectedUrl });
    // });

    it('should throw an error if renaming the file fails', () => {
      (fs.renameSync as jest.Mock).mockImplementationOnce(() => {
        throw new Error('rename error');
      });

      expect(() => avatarService.uploadFile(mockFile)).toThrowError(
        'rename error',
      );
      expect(fs.renameSync).toHaveBeenCalledWith(mockFile.path, mockAvatarPath);
    });

    // it('should throw an error if filename generation fails', () => {
    //   (uuidv4 as jest.Mock).mockReturnValueOnce('');

    //   expect(() => avatarService.uploadFile(mockFile)).toThrowError(
    //     'Error getting filename',
    //   );
    // });

    it('should throw an error if file path generation fails', () => {
      (path.join as jest.Mock).mockReturnValueOnce('');

      expect(() => avatarService.uploadFile(mockFile)).toThrowError(
        'Error getting filePath',
      );
    });
  });

  describe('getFilePath', () => {
    it('should return the correct file path', () => {
      const filename = 'test-uuid.png';
      const expectedPath = path.join(
        __dirname,
        '../../../../',
        'shared/avatars',
        filename,
      );

      const result = avatarService.getFilePath(filename);

      expect(path.join).toHaveBeenCalledWith(
        __dirname,
        '../../../../',
        'shared/avatars',
        filename,
      );
      expect(result).toEqual(expectedPath);
    });
  });
});
