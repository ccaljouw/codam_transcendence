import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateGameDto } from './create-game.dto';
import { UpdateGameUserDto } from './update-gameUser.dto';

export class UpdateGameDto extends PartialType(CreateGameDto) {
  @ApiProperty({ required: true })
  id: number;

  @ApiProperty({ required: false })
  GameUsers?: UpdateGameUserDto[];
}
