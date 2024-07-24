import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateGameDto } from 'dto/game/create-game.dto';
import { UpdateGameUserDto } from 'dto/game/update-gameUser.dto';

export class UpdateGameDto extends PartialType(CreateGameDto) {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  GameUsers?: UpdateGameUserDto[];
}
