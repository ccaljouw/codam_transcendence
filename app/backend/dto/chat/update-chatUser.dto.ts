import { PartialType } from '@nestjs/mapped-types';
import { CreateChatUserDto } from './create-chatUser.dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ChatUserRole } from '@prisma/client';

export class UpdateChatUserDto extends PartialType(CreateChatUserDto) {
  
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: true, type: Number })
  id: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: false, type: Number })
  chatId?: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: false, type: Number })
  userId?: number;

  @IsDate()
  @ApiProperty({ required: false, type: Date })
  lastRead?: Date;

  @IsDate()
  @ApiProperty({ required: false, type: Date })
  mutedUntil?: Date;

  @IsBoolean()
  @ApiProperty({ required: false, type: Boolean })
  isInChatRoom?: boolean;

// cannot add this property due to circular dependency
//   @ApiProperty({ required: false, type: ChatUserRole })
  role?: ChatUserRole;
}
