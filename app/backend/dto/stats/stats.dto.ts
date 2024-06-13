import { GameResultDto } from '@ft_dto/stats';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

// todo: Carien: create database table, API endpoint
export class StatsDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: true, type: Number })
  userId: number;
  
  @IsBoolean()
  @ApiProperty({ required: false, type: Boolean })
  wonLastGame?: boolean;

  @IsInt()
  @ApiProperty({ required: false, type: Number })
  wins?: number;

  @IsInt()
  @ApiProperty({ required: false, type: Number })
  losses?: number;
  
  @IsNumber()
  @ApiProperty({ required: false, type: Number })
  winLossRatio?: number;

  @IsInt()
  @ApiProperty({ required: false, type: Number })
  consecutiveWins?: number;

  @IsInt()
  @ApiProperty({ required: false, type: Number })
  maxConsecutiveWins?: number;

  @IsInt()
  @ApiProperty({ required: false, type: Number })
  rank?: number;

  @IsInt()
  @ApiProperty({ required: false, type: Number })
  friends?: number;
  
  @ApiProperty({ required: false, type: [Number] })
  achievements?: number[];

  @ApiProperty({ required: false, type: [GameResultDto] })
  last10Games?: GameResultDto[];
}
