import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsInt, IsNotEmpty } from "class-validator";

export class CreateChatUserDto {

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: true, type: Number })
  chatId: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: true, type: Number })
  userId: number;

  @IsDate()
  @ApiProperty({ required: false, type: Date })
  lastRead?: Date;
}
