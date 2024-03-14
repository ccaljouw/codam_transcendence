import { ApiProperty } from "@nestjs/swagger";
import { Chat, ChatType } from "@prisma/client";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

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
}
