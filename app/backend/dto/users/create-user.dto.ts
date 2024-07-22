import { ApiProperty } from '@nestjs/swagger';
import { OnlineStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {

  // using class-validator and validationPipe to validate input data
  // Everthing starting with @Api fills the api documetation. It does not enforce
  // the format specified or update automatically when validation rules are changed 
  @IsNotEmpty()
  @MinLength(3)                       //todo: define min length
  @MaxLength(30)                      //todo: define max legth  
  @ApiProperty({ uniqueItems: true, nullable: false, minLength: 3, maxLength:30 })
  loginName: string;
  
  @IsOptional()
  @ApiProperty({ required: false })
  userName?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ required: false, format: 'email' })
  email?: string;
  
  @IsString()
  @MaxLength(30)                      //todo: define max legth   
  @IsOptional()
  @ApiProperty({ required: false, maxLength: 30 })
  firstName?: string;

  @IsString()
  @MaxLength(30)                      //todo: define max legth  
  @IsOptional()
  @ApiProperty({ required: false, maxLength: 30 })
  lastName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  avatarId?: number;

  @IsOptional()
  @ApiProperty({ required: false })
  avatarUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  online?: OnlineStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  theme?: number;
}
