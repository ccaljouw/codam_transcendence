import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateInviteDto } from './create-invite.dto';

export class UpdateInviteDto extends PartialType(CreateInviteDto) {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: true, type: Number })
  id: number;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  recipientClientId?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  senderClientId?: string;
}
