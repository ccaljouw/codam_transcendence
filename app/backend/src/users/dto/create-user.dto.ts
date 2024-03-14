import { UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { OnlineStatus } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
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

  @IsNotEmpty()
  @MinLength(3)                       //todo: define min length
  @MaxLength(30)                      //todo: define max legth  
  @ApiProperty({ nullable: false, minLength: 3, maxLength:30  })
  hash: string;
  
  @IsOptional()
  @ApiProperty({ required: true })
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

  @ApiProperty({ required: false })
  @IsOptional()
  online?: OnlineStatus;

  //   @ApiProperty
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  token?: string;
}
