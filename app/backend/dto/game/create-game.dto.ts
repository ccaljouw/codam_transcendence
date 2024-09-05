import { ApiProperty } from '@nestjs/swagger';
import { GameState } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class CreateGameDto {
  @ApiProperty({ required: true })
  @IsEnum(GameState)
  state: GameState;
}
