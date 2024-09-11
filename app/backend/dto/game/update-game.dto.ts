import { ApiProperty, PartialType } from '@nestjs/swagger';
import { GameState } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { CreateGameDto } from './create-game.dto';
import { UpdateGameUserDto } from './update-gameUser.dto';

export class UpdateGameDto extends PartialType(CreateGameDto) {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  id: number;

  @ApiProperty({ required: true })
  @IsEnum(GameState)
  state: GameState;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  GameUsers?: UpdateGameUserDto[];
}
