import { IsInt, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ChatAuthDto {

	@ApiProperty({ required: true, type: Number })
	@Type(() => Number)
	@IsInt()
	chatId: number;

	@ApiProperty({ required: false, type: String })
	@IsString()
	@MinLength(3)
	@MaxLength(20)
	pwd: string;
}