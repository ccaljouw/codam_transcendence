import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateTokenDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ required: true })
	token: string;

	@IsNotEmpty()
	@IsNumber()
	@ApiProperty({ required: true })
	userId: number;

	@IsOptional()
	@IsNumber()
	@ApiProperty({ required: false })
	chatId?: number;
}