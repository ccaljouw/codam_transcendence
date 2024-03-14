import { ApiProperty } from '@nestjs/swagger';
import { Prisma, User } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';

export class CreateGameUserDto {

  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  score?: number;

  @ApiProperty({ required: false })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  win?: boolean;

  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsInt()
  gameId: number;

  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsInt()
  userId: number;
}
