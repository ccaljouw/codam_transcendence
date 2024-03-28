import { ApiProperty, PartialType } from '@nestjs/swagger';
import { UpdateUserDto } from 'dto/users/update-user.dto';
import { CreateGameUserDto } from 'dto/game/create-gameUser.dto';

export class UpdateGameUserDto extends PartialType(CreateGameUserDto) {

  @ApiProperty({ required: true })
  id: number;

  @ApiProperty({ required: false })
  user?: UpdateUserDto;
}
