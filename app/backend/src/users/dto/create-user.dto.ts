import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {

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
  userName: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ required: false })
  email: string;
  
  @IsString()
  @MaxLength(30)                      //todo: define max legth   
  @IsOptional()
  @ApiProperty({ required: false, maxLength:30  })
  firstName: string;

  @IsString()
  @MaxLength(30)                      //todo: define max legth  
  @IsOptional()
  @ApiProperty({ required: false, maxLength:30  })
  lastName: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  avatarId: number;
}
