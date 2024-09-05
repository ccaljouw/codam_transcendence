import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTokenDto } from './create-token.dto';
import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTokenDto extends PartialType(CreateTokenDto) {
  @ApiProperty({ required: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id?: number;
}
