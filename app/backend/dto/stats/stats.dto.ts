import { GameResultDto } from '@ft_dto/stats';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class StatsDto {
  @ApiProperty({ required: true, type: Number })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  userId: number;

  @ApiProperty({ required: true, type: Boolean })
  @IsNotEmpty()
  @IsBoolean()
  wonLastGame: boolean;

  @ApiProperty({ required: true, type: Number })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  wins: number;

  @ApiProperty({ required: true, type: Number })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  losses: number;

  @ApiProperty({ required: true, type: Number })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  winLossRatio: number;

  @ApiProperty({ required: true, type: Number })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  consecutiveWins: number;

  @ApiProperty({ required: true, type: Number })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  maxConsecutiveWins: number;

  @ApiProperty({ required: true, type: [Number] })
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  achievements: number[];

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  rank?: number;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  friends?: number;

  @ApiProperty({ required: false, type: [GameResultDto] })
  @IsOptional()
  @IsArray()
  last10Games?: GameResultDto[];
}
