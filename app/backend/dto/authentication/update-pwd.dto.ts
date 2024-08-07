import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

//TODO: define min and max length for pwds
export class UpdatePwdDto {
  @ApiProperty({ required: true, type: Number })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  userId: number;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  oldPwd: string;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  newPwd: string;
}
