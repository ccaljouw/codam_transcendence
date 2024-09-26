import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GameResultDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  id: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  winnerId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  user1Name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  user2Name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  scoreUser1?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  scoreUser2?: number;
}
