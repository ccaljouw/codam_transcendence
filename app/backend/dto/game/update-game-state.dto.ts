import { ApiProperty } from '@nestjs/swagger';
import { GameState, GameUser } from '@prisma/client';
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
  winnerId?: number;

  @ApiProperty({ required: false })
  score1?: number;

  @ApiProperty({ required: false })
  score2?: number;

  @ApiProperty({ required: false })
  gameStartedAt?: Date;

  @ApiProperty({ required: false })
  gameFinishedAt?: Date;

  @ApiProperty({ required: false })
  longestRally?: number;

  @ApiProperty({ required: false })
  gameUsers?: GameUser[];
}
