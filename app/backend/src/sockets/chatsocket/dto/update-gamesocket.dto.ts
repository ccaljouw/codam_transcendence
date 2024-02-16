import { PartialType } from '@nestjs/mapped-types';
import { CreateChatSocketDto } from './create-gamesocket.dto';

export class UpdateChatSocketDto extends PartialType(CreateChatSocketDto) {
  id: number;
}
