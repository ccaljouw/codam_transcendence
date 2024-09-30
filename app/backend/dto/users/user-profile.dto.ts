import { ApiProperty } from '@nestjs/swagger';
import { OnlineStatus, User } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UserProfileDto implements User {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  id: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(15)
  loginName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(15)
  userName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(15)
  firstName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(15)
  lastName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsBoolean()
  twoFactEnabled: boolean;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  avatarUrl: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(2)
  theme: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  volume: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEnum(OnlineStatus)
  online: OnlineStatus;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsDate()
  createdAt: Date;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsDate()
  updatedAt: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  friends?: UserProfileDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  blocked?: UserProfileDto[];
}
