import { ApiProperty } from '@nestjs/swagger';
import { GameState, GameUser } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDate,
  IsArray,
} from 'class-validator';

export class UpdateGameStateDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  id: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEnum(GameState)
  state: GameState;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  winnerId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  score1?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  score2?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  gameStartedAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  gameFinishedAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  longestRally?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  gameUsers?: GameUser[];
}
