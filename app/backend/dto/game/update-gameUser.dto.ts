import { ApiProperty, PartialType } from '@nestjs/swagger';
import { UpdateUserDto } from '../users/update-user.dto';
import { CreateGameUserDto } from './create-gameUser.dto';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateGameUserDto extends PartialType(CreateGameUserDto) {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  user?: UpdateUserDto;
}
