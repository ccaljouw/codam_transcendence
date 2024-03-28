import { ApiProperty } from '@nestjs/swagger';
import { GameState } from '@prisma/client';

export class CreateGameDto {

  @ApiProperty({ required: true })
  state: GameState;
}
