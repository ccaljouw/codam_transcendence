import { ApiProperty } from '@nestjs/swagger';
import { OnlineStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

// using class-validator and validationPipe to validate input data
// Everthing starting with @Api fills the api documetation. It does not enforce
// the format specified or update automatically when validation rules are changed

//TODO: define min and max lenth for all strings
export class CreateUserDto {
  @ApiProperty({ required: true, uniqueItems: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(15)
  loginName: string;

  @ApiProperty({ required: true, uniqueItems: true })
  @IsOptional()
  @MinLength(4)
  @MaxLength(15)
  userName?: string;

  @ApiProperty({ required: true, uniqueItems: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @MinLength(1)
  @MaxLength(15)
  @IsOptional()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @MinLength(1)
  @MaxLength(15)
  @IsOptional()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  avatarUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(OnlineStatus)
  online?: OnlineStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  theme?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  volume?: number;
}
