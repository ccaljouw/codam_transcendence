import { ApiProperty } from '@nestjs/swagger';
import { GameState } from '@prisma/client';
import { IsInt, IsNotEmpty } from "class-validator";

export class updateGameStateDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsInt()
  roomId: number;

  @ApiProperty({ required: true })
  state: GameState;

  @ApiProperty({ required: false })
  winner?: number;
}
