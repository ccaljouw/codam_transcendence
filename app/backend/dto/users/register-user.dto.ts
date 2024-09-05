import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

//TODO: Carien, define min and max length for pwds
export class RegisterUserDto {
  @ApiProperty({ required: true, type: CreateUserDto })
  @IsNotEmpty()
  createUser: CreateUserDto;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  pwd: string;
}
