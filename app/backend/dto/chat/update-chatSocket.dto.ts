import { PartialType } from '@nestjs/mapped-types';
import { CreateChatSocketDto } from './create-chatSocket.dto';

export class UpdateChatSocketDto extends PartialType(CreateChatSocketDto) {
  id: number;
}
