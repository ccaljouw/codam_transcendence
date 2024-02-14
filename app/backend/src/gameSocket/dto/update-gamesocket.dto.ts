import { PartialType } from '@nestjs/mapped-types';
import { CreateGameSocketDto } from './create-gamesocket.dto';

export class UpdateGameSocketDto extends PartialType(CreateGameSocketDto) {
  id: number;
}
