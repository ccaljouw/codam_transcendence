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

export class CreateAuthDto {
	@ApiProperty({ required: true, type: Number })
	@IsNotEmpty()
	@Type(() => Number)
	@IsInt()
	userId: number;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	@MinLength(10)
	@MaxLength(50)
	pwd?: string;
}
