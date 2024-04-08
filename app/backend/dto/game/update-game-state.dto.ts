import { ApiProperty } from '@nestjs/swagger';
import { GameState } from '@prisma/client';
import { IsInt, IsNotEmpty, IsEnum } from 'class-validator';

export class UpdateGameStateDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsInt()
  roomId: number;

  @ApiProperty({ required: true })
  @IsEnum(GameState)
  state: GameState;

  @ApiProperty({ required: false })
  winner?: number;

  @ApiProperty({ required: false })
  score1?: number;

  @ApiProperty({ required: false })
  score2?: number;
}
