import { ChatUsers } from "@prisma/client";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreateChatUserDto } from "./create-chatUser.dto";
import { ApiProperty } from "@nestjs/swagger";

export class CreateChatDto {

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: true, type: Number })
  ownerId: number;

  @ApiProperty({ required: false, type: CreateChatUserDto })
  users:   ChatUsers[]

}
