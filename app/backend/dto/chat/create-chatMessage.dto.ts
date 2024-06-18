import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Chat, ChatType, Invite } from "@prisma/client";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString, Validate, ValidateNested } from "class-validator";

export class CreateChatMessageDto {

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true, type: String })
  content: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: true, type: Number })
  chatId: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: true, type: Number })
  userId: number;

  @IsInt()
  @ApiProperty({ required: false, type: Number })
  inviteId?: number;
}
