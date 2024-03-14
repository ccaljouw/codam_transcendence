import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateGameUserDto } from './create-gameUser.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

export class UpdateGameUserDto extends PartialType(CreateGameUserDto) {

  @ApiProperty({ required: true })
  id: number;

  @ApiProperty({ required: false })
  user: UpdateUserDto;
}
