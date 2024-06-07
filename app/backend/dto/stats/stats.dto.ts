import { GameResultDto } from '@ft_dto/game';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
} from 'class-validator';

// todo: Carien: create database table, API endpoint
export class StatsDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: true, type: Number })
  userId: number;
  
  @IsInt()
  @ApiProperty({ required: false, type: Number })
  rank: number;

  @ApiProperty({ required: false, type: Number })
  winLossRatio: number;

  @IsInt()
  @ApiProperty({ required: false, type: Number })
  friends: number;
  
  @ApiProperty({ required: false, type: [Number] })
  achievements: number[];

  @ApiProperty({ required: false, type: [GameResultDto] })
  last10Games: GameResultDto[];
}
