import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    @MaxLength(20)                      //todo: define max legth  
    @IsOptional()
    @ApiProperty({ required: false, maxLength: 30 })
    pwd?: string;
	}
