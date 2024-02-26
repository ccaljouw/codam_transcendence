import { PartialType } from '@nestjs/mapped-types';
import { CreateChatDto } from './create-chat.dto';
import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ChatUsers } from '@prisma/client';
import { UpdateChatUserDto } from './update-chatUser.dto';

export class UpdateChatDto extends PartialType(CreateChatDto) {

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: true, type: Number })
  id: number;

  @IsInt()
  @ApiProperty({ required: false, type: Number })
  ownerId: number;

  @ApiProperty({ required: false, type: UpdateChatUserDto })
  users:   ChatUsers[]
}
