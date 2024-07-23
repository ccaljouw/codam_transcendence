import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ChatType, ChatUsers } from '@prisma/client';

export class FetchChatDto {

	@IsNotEmpty()
	@IsInt()
	ownerId: number;

	@IsNotEmpty()
	@IsInt()
	id: number;

	@IsArray()
	users: ChatUsers[]

	@IsString()
	name: string; 

	@IsEnum(ChatType)
	visibility: ChatType;

	@IsOptional()
	@IsString()
	action?: string;

}
