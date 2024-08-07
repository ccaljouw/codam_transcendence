import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

//TODO: define min and max length for pwd
export class CreateAuthDto {
  @ApiProperty({ required: true, type: Number })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  userId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  pwd?: string;
}
