import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ uniqueItems: true, nullable: false })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ nullable: false })
  hash: string;

  @MaxLength(30)
  @IsOptional()
  @ApiProperty({ required: false })
  firstName: string;

  @MaxLength(30)
  @IsOptional()
  @ApiProperty({ required: false })
  lastName: string;
}
