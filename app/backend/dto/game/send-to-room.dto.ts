import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from "class-validator";

export class sendToRoomDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsInt()
  roomId: number;

  @ApiProperty({ required: false })
  msg?: string;
}
