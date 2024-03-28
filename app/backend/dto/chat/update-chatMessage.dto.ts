import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString, isString } from "class-validator";
import { CreateChatMessageDto } from "./create-chatMessage.dto";

export class UpdateChatMessageDto extends PartialType(CreateChatMessageDto) {

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: true, type: Number })
  id: number;


  // @isString
  // @ApiProperty({ required: false, type: Date })
  // createdAt: Date;
}
