import { PartialType } from '@nestjs/mapped-types';
import { CreateChatUserDto } from './create-chatUser.dto';
import { IsDate, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateChatUserDto extends PartialType(CreateChatUserDto) {
  
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: true, type: Number })
  id: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: true, type: Number })
  chatId: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: true, type: Number })
  userId: number;

  @IsDate()
  @ApiProperty({ required: false, type: Date })
  lastRead: Date;
}
