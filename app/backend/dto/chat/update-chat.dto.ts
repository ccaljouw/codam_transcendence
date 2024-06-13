import { PartialType } from '@nestjs/mapped-types';
import { CreateChatDto } from './create-chat.dto';
import { IsArray, IsDefined, IsInt, IsNotEmpty, IsString } from 'class-validator';
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
  ownerId?: number;

	@IsArray()
  @ApiProperty({ required: false, type: UpdateChatUserDto })
  users?:   ChatUsers[]

  @IsString()
  @ApiProperty({ required: false, type: String })
  name?: String;

}
