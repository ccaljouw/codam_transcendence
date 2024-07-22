import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AvatarService {
  constructor(private configService: ConfigService) {}

  uploadFile(file: Express.Multer.File): string {
    try {
      console.log(file);
      const filename = `${uuidv4()}${path.extname(file.originalname)}`;
      const filePath = path.join(
        __dirname,
        '../../../../',
        'shared/avatars',
        filename,
      );
      console.log(`Filename: ${filename}, filepath: ${filePath}`);
      fs.renameSync(file.path, filePath);
      return `${this.configService.get('BASE_URL_BACKEND')}/avatar/${filename}`;
    } catch (error) {
      throw error;
    }
  }

  getFilePath(filename: string): string {
    return path.join(__dirname, '../../../../', 'shared/avatars', filename);
  }
}
