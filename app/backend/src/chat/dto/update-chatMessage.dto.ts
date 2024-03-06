import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";
import { CreateChatMessageDto } from "./create-chatMessage.dto";

export class UpdateChatMessageDto extends PartialType(CreateChatMessageDto) {

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: false, type: Number })
  id: number;

  @ApiProperty({ required: false, type: Date })
  createdAt!: Date;
}
