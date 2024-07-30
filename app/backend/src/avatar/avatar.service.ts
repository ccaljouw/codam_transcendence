import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AvatarService {
  constructor(private configService: ConfigService) {}

  uploadFile(file: Express.Multer.File): { avatarUrl: string } {
    try {
      console.log(file);
      const filename = `${uuidv4()}${path.extname(file.originalname)}`;
      if (!filename) throw new Error('Error getting filename');
      const filePath = path.join(
        __dirname,
        '../../../../',
        'shared/avatars',
        filename,
      );
      if (!filePath) throw new Error('Error getting filePath');
      console.log(`Filename: ${filename}, filepath: ${filePath}`);
      fs.renameSync(file.path, filePath);
      return {
        avatarUrl: `${this.configService.get('BACKEND_URL')}/avatar/${filename}`,
      };
    } catch (error) {
      console.log('Error uploading file:', error.message);
      throw error;
    }
  }

  getFilePath(filename: string): string {
    return path.join(__dirname, '../../../../', 'shared/avatars', filename);
  }
}
