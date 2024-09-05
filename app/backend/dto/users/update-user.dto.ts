import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ required: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id?: number;
}
