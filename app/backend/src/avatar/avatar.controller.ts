import { Controller, Get, Post, Param, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Res, HttpStatus, Delete } from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';
import { Response } from 'express';
import * as path from 'path';


@Controller('avatar')
@ApiTags('avatar')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @Post('new')
  @ApiOperation({ summary: 'Adds avatar to the filesystem and returns the endpoint for this file' })
  @ApiCreatedResponse({ description: 'Avatar successfully created', type: String })
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@UploadedFile(
    //TODO: file filter
    // new ParseFilePipe({
    //   validators: [
    //     new MaxFileSizeValidator({ maxSize: 500000 }),
    //     new FileTypeValidator({ fileType: 'image/png' }),
    //   ],
    // }),
  ) file: Express.Multer.File) {
    console.log("In avatar controler: ");
    console.log(file);
    return this.avatarService.uploadFile(file);
  }


  @Get('list')
  listFiles(@Res() res: Response) {
    const directoryPath = path.join(__dirname, '../../../../', 'shared/avatars'); 
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Unable to scan files',
        });
      }
      return res.status(HttpStatus.OK).json(files);
    });
  }
  
  @Get(':filename')
  async getAvatar(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = this.avatarService.getFilePath(filename);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(HttpStatus.NOT_FOUND).send('File not found');
    }
  }

  @Delete('delete/:filename')
  deleteFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(__dirname, '../../../../', 'shared/avatars', filename);

    fs.unlink(filePath, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          return res.status(HttpStatus.NOT_FOUND).json({
            message: 'File not found',
          });
        }
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Error deleting file',
        });
      }
      return res.status(HttpStatus.OK).json({
        message: 'File deleted successfully',
      });
    });
  }
}