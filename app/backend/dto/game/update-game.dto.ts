import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';
import { CreateGameDto } from 'dto/game/create-game.dto';
import { UpdateGameUserDto } from 'dto/game/update-gameUser.dto';

export class UpdateGameDto extends PartialType(CreateGameDto) {
  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsInt()
  id: number;

  @ApiProperty({ required: false })
  GameUsers?: UpdateGameUserDto[];
}
