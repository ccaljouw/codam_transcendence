import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateInviteDto } from './create-invite.dto';

export class UpdateInviteDto extends PartialType(CreateInviteDto) {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: true, type: Number })
  id: number;
}
