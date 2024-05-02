import { PartialType } from '@nestjs/mapped-types';
import { CreateDMDto } from './create-dm.dto';

export class UpdateChatSocketDto extends PartialType(CreateDMDto) {
  id: number;
}
