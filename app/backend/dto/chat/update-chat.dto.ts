import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ChatType } from '@prisma/client';

export class UpdateChatDto {

	@IsString()
	@IsOptional()
	@ApiProperty({ required: false, type: String })
	name?: string; //todo: Albert: remove capital letter S from String. - Jorien

	@IsEnum(ChatType)
	@IsOptional()
	@ApiProperty({ required: false, enum: ChatType })
	visibility?: ChatType;
}
